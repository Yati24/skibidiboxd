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
	const page = url.searchParams.get('page') || '1';

	try {
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