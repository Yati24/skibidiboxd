// chargeur serveur de la page de recherche: interroge l'endpoint search de tmdbb
import type { PageServerLoad } from './$types'
// type de reponse tmdb
import type { TMDBResponse } from '$lib/types/tmdb'
// variables d'env cote serveur
import { env } from '$env/dynamic/private'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

/**
 * Interroge l'api tmdb /search/movie avec le terme fourni.
 */
// cherche les films par requete sur tmdbb
async function searchMovies(query: string): Promise<TMDBResponse> {
	const apiKey = env.VITE_TMDB_API_KEY
	if (!apiKey) {
		throw new Error('TMDB API key not configured')
	}

	// appelle l'endpoint search de tmdbb
	const response = await fetch(
		`${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=fr-FR`,
		{
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json;charset=utf-8'
			}
		}
	)

	if (!response.ok) {
		throw new Error(`TMDB API error: ${response.status}`)
	}

	return response.json()
}

// charge les resultats de recherche depuis le param query
export const load: PageServerLoad = async ({ url }) => {
	const query = url.searchParams.get('q') ?? ''

	if (!query.trim()) {
		return { query: '', movies: [], error: null }
	}

	try {
		// recupere les films correspondant au terme de recherch
		const data = await searchMovies(query.trim())
		return {
			query: query.trim(),
			movies: data.results,
			error: null
		}
	} catch (error) {
		console.error('Error searching movies:', error)
		return {
			query: query.trim(),
			movies: [],
			error: 'Failed to search movies. Please try again later.'
		}
	}
}
