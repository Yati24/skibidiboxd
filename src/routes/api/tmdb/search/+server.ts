import type { RequestHandler } from './$types';
import type { TMDBResponse } from '$lib/types/tmdb';
import { env } from '$env/dynamic/private';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function fetchFromTMDB(url: string): Promise<TMDBResponse> {
	const apiKey = env.VITE_TMDB_API_KEY;
	if (!apiKey) {
		throw new Error('TMDB API key not configured');
	}

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

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('query');
	const page = url.searchParams.get('page') || '1';

	if (!query || query.trim().length === 0) {
		return new Response(
			JSON.stringify({ error: 'Query parameter is required' }),
			{ status: 400, headers: { 'Content-Type': 'application/json' } }
		);
	}

	try {
		const data = await fetchFromTMDB(
			`/search/movie?query=${encodeURIComponent(query)}&page=${page}`
		);
		return new Response(JSON.stringify(data), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('[TMDB SEARCH ERROR]', error);
		return new Response(
			JSON.stringify({ error: 'Failed to search movies', details: String(error) }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
};