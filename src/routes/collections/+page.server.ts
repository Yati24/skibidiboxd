import type { PageServerLoad } from './$types'
import type { CollectionWithPreview } from '$lib/types/tmdb'
import { ALL_COLLECTIONS, CATEGORIES } from '$lib/collections'
import { env } from '$env/dynamic/private'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const MAX_MOVIES = 100
const PAGE_SIZE = 20

async function discoverPage(params: Record<string, string>, page: number): Promise<{ results: { id: number; poster_path: string | null }[]; total_results: number; total_pages: number } | null> {
	const apiKey = env.VITE_TMDB_API_KEY
	if (!apiKey) return null

	const qs = new URLSearchParams({ ...params, page: String(page) }).toString()
	const res = await fetch(`${TMDB_BASE_URL}/discover/movie?${qs}`, {
		headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json;charset=utf-8' }
	})
	if (!res.ok) return null
	return res.json()
}

async function searchPage(query: string, page: number): Promise<{ results: { id: number; poster_path: string | null; vote_average: number; vote_count: number; popularity: number }[] } | null> {
	const apiKey = env.VITE_TMDB_API_KEY
	if (!apiKey) return null

	const res = await fetch(`${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=fr-FR&page=${page}`, {
		headers: { Authorization: `Bearer ${apiKey}` }
	})
	if (!res.ok) return null
	return res.json()
}

function buildPreview(def: typeof ALL_COLLECTIONS[number], movieIds: number[], posters: (string | null)[], movieCount: number, watchedIds: number[]): CollectionWithPreview {
	const watchedCount = movieIds.filter((id) => watchedIds.includes(id)).length
	return {
		...def,
		movieCount,
		watchedCount,
		percentage: movieCount > 0 ? Math.round((watchedCount / movieCount) * 100) : 0,
		movieIds,
		posters
	}
}

export const load: PageServerLoad = async ({ locals }) => {
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

	const allCollections: CollectionWithPreview[] = []

	for (let i = 0; i < ALL_COLLECTIONS.length; i += 10) {
		const batch = ALL_COLLECTIONS.slice(i, i + 10)

		// Séparer les collections discover et search
		const discoverDefs = batch.filter((d) => !d.searchQueries)
		const searchDefs = batch.filter((d) => d.searchQueries)

		// Traiter les discover collections
		const firstPages = await Promise.allSettled(
			discoverDefs.map((def) => discoverPage(def.discoverParams!, 1))
		)

		const extraFetches: Promise<{ index: number; pageData: { results: { id: number; poster_path: string | null }[] } | null }>[] = []

		for (let j = 0; j < discoverDefs.length; j++) {
			const def = discoverDefs[j]
			const first = firstPages[j]
			if (first.status !== 'fulfilled' || !first.value) continue

			const maxMovies = def.maxMovies ?? MAX_MOVIES
			const maxPages = Math.min(first.value.total_pages, Math.ceil(maxMovies / PAGE_SIZE))

			for (let p = 2; p <= maxPages; p++) {
				extraFetches.push(
					discoverPage(def.discoverParams!, p).then((data) => ({
						index: j,
						pageData: data
					}))
				)
			}
		}

		const extraResults = await Promise.allSettled(extraFetches)

		const extraMap = new Map<number, { results: { id: number; poster_path: string | null }[] }[]>()
		for (const r of extraResults) {
			if (r.status === 'fulfilled' && r.value.pageData) {
				const list = extraMap.get(r.value.index) ?? []
				list.push(r.value.pageData)
				extraMap.set(r.value.index, list)
			}
		}

		for (let j = 0; j < discoverDefs.length; j++) {
			const def = discoverDefs[j]
			const first = firstPages[j]
			if (first.status !== 'fulfilled' || !first.value) {
				allCollections.push(buildPreview(def, [], [], 0, watchedIds))
				continue
			}

			const maxMovies = def.maxMovies ?? MAX_MOVIES
			const extraPages = extraMap.get(j) ?? []
			const allMovies = [first.value, ...extraPages].flatMap((p) => p.results).slice(0, maxMovies)
			const movieIds = allMovies.map((m) => m.id)
			const movieCount = Math.min(first.value.total_results, maxMovies)

			allCollections.push(buildPreview(def, movieIds, allMovies.slice(0, 4).map((m) => m.poster_path), movieCount, watchedIds))
		}

		// Traiter les search collections
		for (const def of searchDefs) {
			const maxMovies = def.maxMovies ?? MAX_MOVIES
			const allResults = await Promise.all(
				def.searchQueries!.map((q) =>
					Promise.all(
						Array.from({ length: Math.ceil(maxMovies / PAGE_SIZE) }, (_, i) =>
							searchPage(q, i + 1)
						)
					)
				)
			)

			const seen = new Set<number>()
			const movies: { id: number; poster_path: string | null; popularity?: number }[] = []

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

			movies.sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0))
			const sliced = movies.slice(0, maxMovies)
			const movieIds = sliced.map((m) => m.id)

			allCollections.push(buildPreview(def, movieIds, sliced.slice(0, 4).map((m) => m.poster_path), sliced.length, watchedIds))
		}
	}

	return {
		collections: allCollections,
		watchedIds,
		categories: CATEGORIES as unknown as string[],
		error: null
	}
}
