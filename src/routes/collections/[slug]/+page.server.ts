import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { Movie } from '$lib/types/tmdb'
import { ALL_COLLECTIONS } from '$lib/collections'
import { env } from '$env/dynamic/private'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const MAX_MOVIES = 100
const PAGE_SIZE = 20

async function discoverPage(params: Record<string, string>, page: number = 1): Promise<{ results: Movie[]; total_results: number; total_pages: number } | null> {
	const apiKey = env.VITE_TMDB_API_KEY
	if (!apiKey) return null

	const qs = new URLSearchParams({ ...params, page: String(page) }).toString()
	const res = await fetch(`${TMDB_BASE_URL}/discover/movie?${qs}`, {
		headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json;charset=utf-8' }
	})
	if (!res.ok) return null
	return res.json()
}

async function searchPage(query: string, page: number): Promise<{ results: Movie[]; total_results: number } | null> {
	const apiKey = env.VITE_TMDB_API_KEY
	if (!apiKey) return null

	const res = await fetch(`${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=fr-FR&page=${page}`, {
		headers: { Authorization: `Bearer ${apiKey}` }
	})
	if (!res.ok) return null
	return res.json()
}

export const load: PageServerLoad = async ({ params, locals }) => {
	const def = ALL_COLLECTIONS.find((c) => c.slug === params.slug)
	if (!def) {
		error(404, 'Collection introuvable')
	}

	const session = await locals.getSession()

	let watchedIds: number[] = []
	if (session) {
		const user = await locals.getUser()
		if (user) {
			const { data: watchedRows } = await locals.supabase
				.from('watched_movies')
				.select('tmdb_id')
				.eq('user_id', user.id)
			watchedIds = (watchedRows ?? []).map((r: { tmdb_id: number }) => r.tmdb_id)
		}
	}

	const maxMovies = def.maxMovies ?? MAX_MOVIES

	if (def.searchQueries) {
		const allResults = await Promise.all(
			def.searchQueries.map((q) =>
				Promise.all(
					Array.from({ length: Math.ceil(maxMovies / PAGE_SIZE) }, (_, i) =>
						searchPage(q, i + 1)
					)
				)
			)
		)

		const seen = new Set<number>()
		const movies: Movie[] = []
		for (const pages of allResults) {
			for (const page of pages) {
				if (!page) continue
				for (const m of page.results) {
					if (!seen.has(m.id) && (m.vote_count ?? 0) >= 50) {
						seen.add(m.id)
						movies.push(m)
					}
				}
			}
		}

		const byRating = (a: Movie, b: Movie) => (b.vote_average ?? 0) - (a.vote_average ?? 0)
		movies.sort(byRating)
		const sliced = movies.slice(0, maxMovies)
		const movieIds = sliced.map((m) => m.id)

		return {
			collection: def,
			movies: sliced,
			movieIds,
			watchedIds,
			currentPage: 1,
			totalPages: 1,
			totalResults: sliced.length,
			error: null
		}
	}

	if (!def.discoverParams) {
		return {
			collection: def,
			movies: [],
			movieIds: [],
			watchedIds,
			currentPage: 1,
			totalPages: 1,
			totalResults: 0,
			error: 'Collection non configurée'
		}
	}

	const firstPage = await discoverPage(def.discoverParams, 1)

	if (!firstPage) {
		return {
			collection: def,
			movies: [],
			movieIds: [],
			watchedIds,
			currentPage: 1,
			totalPages: 1,
			totalResults: 0,
			error: 'Impossible de charger les films'
		}
	}

	const cappedTotal = Math.min(firstPage.total_results, maxMovies)
	const maxPages = Math.min(firstPage.total_pages, Math.ceil(maxMovies / PAGE_SIZE))

	const extraPages = maxPages > 1
		? await Promise.all(
			Array.from({ length: maxPages - 1 }, (_, i) =>
				discoverPage(def.discoverParams, i + 2)
			)
		)
		: []

	const allPages = [firstPage, ...extraPages.filter((p): p is NonNullable<typeof p> => p !== null)]
	const movies = allPages.flatMap((p) => p.results).slice(0, maxMovies)
	const movieIds = movies.map((m) => m.id)

	return {
		collection: def,
		movies,
		movieIds,
		watchedIds,
		currentPage: 1,
		totalPages: 1,
		totalResults: cappedTotal,
		error: null
	}
}
