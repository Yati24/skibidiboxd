import type { PageServerLoad } from './$types'
import type { TMDBResponse } from '$lib/types/tmdb'
import { env } from '$env/dynamic/private'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

/**
 * Interroge l'API TMDB /search/movie avec le terme fourni.
 */
async function searchMovies(query: string): Promise<TMDBResponse> {
	const apiKey = env.VITE_TMDB_API_KEY
	if (!apiKey) {
		throw new Error('TMDB API key not configured')
	}

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

export const load: PageServerLoad = async ({ url }) => {
	const query = url.searchParams.get('q') ?? ''

	if (!query.trim()) {
		return { query: '', movies: [], error: null }
	}

	try {
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
