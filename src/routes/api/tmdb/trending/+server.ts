// endpoint api pour les films tendances de tmdb
import type { RequestHandler } from './$types';
// type de reponse tmdb
import type { TMDBResponse } from '$lib/types/tmdb';
// variables d'env cote serveur
import { env } from '$env/dynamic/private';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// recupere les donnees depuis l'api tmdb
async function fetchFromTMDB(url: string): Promise<TMDBResponse> {
	const apiKey = env.VITE_TMDB_API_KEY;
	if (!apiKey) {
		throw new Error('TMDB API key not configured');
	}

	// appelle l'endpoint tmdb
	const response = await fetch(`${TMDB_BASE_URL}${url}`, {
		headers: {
			'Authorization': `Bearer ${apiKey}`,
			'Content-Type': 'application/json;charset=utf-8'
		}
	});
	if (!response.ok) {
		const text = await response.text();
		throw new Error(`TMDB API error: ${response.status} ${text}`);
	}
	return response.json();
}

// gere la requete get pour les films tendances
export const GET: RequestHandler = async ({ url }) => {
	const page = url.searchParams.get('page') || '1';

	try {
		// recupere les films tendances de la semaine depuis tmdb
		const data = await fetchFromTMDB(`/trending/movie/week?language=fr-FR&page=${page}`);
		return new Response(JSON.stringify(data), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('[TMDB TRENDING ERROR]', error);
		return new Response(
			JSON.stringify({ error: 'Failed to fetch trending movies', details: String(error) }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
};