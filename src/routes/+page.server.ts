// chargeur serveur de l'accueil: recupere les films populaires et les apercus de colletions
import type { PageServerLoad } from './$types'
// types de reponse tmdb et de colletion
import type { TMDBResponse, CollectionWithPreview } from '$lib/types/tmdb'
// definitions de colletions et slugs en vedette
import { ALL_COLLECTIONS, FEATURED_SLUGS } from '$lib/collections'
// variables d'env cote serveurr
import { env } from '$env/dynamic/private'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

// recupere les films populaires depuis tmdbb
async function fetchPopularMovies(page: number = 1): Promise<TMDBResponse> {
	const apiKey = env.VITE_TMDB_API_KEY
	if (!apiKey) throw new Error('TMDB API key not configured')

	// appelle l'endpoint tmdb des films populaires
	const response = await fetch(`${TMDB_BASE_URL}/movie/popular?language=fr-FR&page=${page}`, {
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json;charset=utf-8'
		}
	})

	if (!response.ok) throw new Error(`TMDB API error: ${response.status}`)
	return response.json()
}

// recupere un apercu des films via l'endpoint discover de tmdbb
async function discoverPreview(params: Record<string, string>): Promise<{ ids: number[]; posters: (string | null)[]; total: number }> {
	const apiKey = env.VITE_TMDB_API_KEY
	if (!apiKey) return { ids: [], posters: [], total: 0 }

	const qs = new URLSearchParams({ ...params, page: '1' }).toString()
	// appelle l'endpoitn discover de tmdb
	const res = await fetch(`${TMDB_BASE_URL}/discover/movie?${qs}`, {
		headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json;charset=utf-8' }
	})
	if (!res.ok) return { ids: [], posters: [], total: 0 }

	const data = await res.json()
	return {
		ids: data.results?.map((m: { id: number }) => m.id) ?? [],
		posters: data.results?.slice(0, 4).map((m: { poster_path: string | null }) => m.poster_path) ?? [],
		total: Math.min(data.total_results ?? 0, 100)
	}
}

// recupere un apercu des films via la recherche tmdbb
async function searchPreview(queries: string[], limit: number): Promise<{ ids: number[]; posters: (string | null)[]; total: number }> {
	const apiKey = env.VITE_TMDB_API_KEY
	if (!apiKey) return { ids: [], posters: [], total: 0 }

	// recherche toutes les requetes en paralelle
	const allResults = await Promise.all(
		queries.map((q) =>
			// appelle l'endpoint search de tmdb pour chaque requete
			fetch(`${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(q)}&language=fr-FR&page=1`, {
				headers: { Authorization: `Bearer ${apiKey}` }
			}).then((r) => (r.ok ? r.json() : null))
		)
	)

	const seen = new Set<number>()
	const movies: { id: number; poster_path: string | null; vote_average: number; vote_count: number }[] = []

	for (const data of allResults) {
		if (!data?.results) continue
		for (const m of data.results) {
			if (!seen.has(m.id) && (m.vote_count ?? 0) >= 50) {
				seen.add(m.id)
				movies.push(m)
			}
		}
	}

	// tri par note decroissante
	movies.sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0))
	const sliced = movies.slice(0, limit)

	return {
		ids: sliced.map((m) => m.id),
		posters: sliced.slice(0, 4).map((m) => m.poster_path),
		total: sliced.length
	}
}

// charge les donnees de l'accueil
export const load: PageServerLoad = async ({ locals }) => {
	try {
		// recupere les films populaires et la session en parallele
		const [popularData, session] = await Promise.all([
			fetchPopularMovies(1),
			locals.getSession()
		])

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

		// charger les collections "featured" (uniquement celles qui existent)
		const featuredDefs = FEATURED_SLUGS
			.map((slug) => ALL_COLLECTIONS.find((c) => c.slug === slug))
			.filter((d): d is NonNullable<typeof d> => d !== undefined)
			.slice(0, 6)

		// recupere les apercus pour chaque collection en vedette
		const previews = await Promise.all(
			featuredDefs.map((def) =>
				def.searchQueries
					? searchPreview(def.searchQueries, 20)
					: discoverPreview(def.discoverParams!)
			)
		)

		// construit les objets collection avec les apercus
		const featuredCollections: CollectionWithPreview[] = featuredDefs.map((def, i) => {
			const movieIds = previews[i].ids
			const watchedCount = movieIds.filter((id) => watchedIds.includes(id)).length
			const movieCount = previews[i].total

			return {
				...def,
				movieCount,
				watchedCount,
				percentage: movieCount > 0 ? Math.round((watchedCount / movieCount) * 100) : 0,
				movieIds,
				posters: previews[i].posters
			}
		})

		const startedCollections = featuredCollections.filter((c) => c.watchedCount > 0)
		const suggestedCollections = featuredCollections.filter((c) => c.watchedCount === 0)

		return {
			movies: popularData.results,
			startedCollections,
			suggestedCollections,
			watchedIds,
			currentPage: popularData.page,
			totalPages: popularData.total_pages,
			error: null
		}
	} catch (error) {
		console.error('Error loading homepage:', error)
		return {
			movies: [],
			startedCollections: [],
			suggestedCollections: [],
			currentPage: 1,
			totalPages: 0,
			error: 'Impossible de charger la page d\'accueil. Réessayez plus tard.'
		}
	}
}
