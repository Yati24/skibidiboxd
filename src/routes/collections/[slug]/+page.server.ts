// page d'une collection: charge les films pour un slug de collection specifique
import { error } from '@sveltejs/kit'
// types pour le chargement serveur
import type { PageServerLoad } from './$types'
// type de film
import type { Movie } from '$lib/types/tmdb'
// toutes les definitions de collections
import { ALL_COLLECTIONS } from '$lib/collections'
// variables d'env cote serveur
import { env } from '$env/dynamic/private'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const MAX_MOVIES = 100
const PAGE_SIZE = 20

// gère le chargement des films selon les collections

// recupere une page de films depuis tmdb discover
async function discoverPage(params: Record<string, string>, page: number = 1): Promise<{ results: Movie[]; total_results: number; total_pages: number } | null> {
	const apiKey = env.VITE_TMDB_API_KEY
	if (!apiKey) return null

	const qs = new URLSearchParams({ ...params, page: String(page) }).toString()
	// appelle l'endpoint discover de tmdb
	const res = await fetch(`${TMDB_BASE_URL}/discover/movie?${qs}`, {
		headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json;charset=utf-8' }
	})
	if (!res.ok) return null
	return res.json()
}

// recupere une page de films depuis la recherche tmdb
async function searchPage(query: string, page: number): Promise<{ results: Movie[]; total_results: number } | null> {
	const apiKey = env.VITE_TMDB_API_KEY
	if (!apiKey) return null

	// appelle l'endpoint search de tmdb
	const res = await fetch(`${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=fr-FR&page=${page}`, {
		headers: { Authorization: `Bearer ${apiKey}` }
	})
	if (!res.ok) return null
	return res.json()
}

// charge les films de la collection et les ids vus de l'utilisateur
export const load: PageServerLoad = async ({ params, locals }) => {
	const def = ALL_COLLECTIONS.find((c) => c.slug === params.slug)
	if (!def) {
		error(404, 'Collection introuvable')
	}

	// recupere la session actuelle
	const session = await locals.getSession()

	let watchedIds: number[] = []
	if (session) {
		const user = await locals.getUser()
		if (user) {
			// recupere les ids des films vus pour cet utilisateur
			const { data: watchedRows } = await locals.supabase
				.from('watched_movies')
				.select('tmdb_id')
				.eq('user_id', user.id)
			watchedIds = (watchedRows ?? []).map((r: { tmdb_id: number }) => r.tmdb_id)
		}
	}

	const maxMovies = def.maxMovies ?? MAX_MOVIES

	// gere les collections basees sur la recherche
	if (def.searchQueries) {
		// recupere toutes les pages pour toutes les requetes en parallele
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

		// tri par note decroissante
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

	// gere les parametres discover manquants
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

	// recupere la premiere page discover
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

	// recupere les pages restantes en parallele
	const extraPages = maxPages > 1
		? await Promise.all(
			Array.from({ length: maxPages - 1 }, (_, i) =>
				discoverPage(def.discoverParams, i + 2)
			)
		)
		: []

	// combine toutes les pages et limite au max de films
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
