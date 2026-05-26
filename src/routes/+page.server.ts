import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function fetchTrendingMovies(page: number = 1) {
	const apiKey = env.VITE_TMDB_API_KEY;
	if (!apiKey) {
		throw new Error('TMDB API key not configured');
	}

	const response = await fetch(`${TMDB_BASE_URL}/trending/movie/week?page=${page}`, {
		headers: {
			'Authorization': `Bearer ${apiKey}`,
			'Content-Type': 'application/json;charset=utf-8'
		}
	});
	if (!response.ok) throw new Error('Failed to fetch trending movies');
	return response.json();
}

export const load: PageServerLoad = async () => {
	try {
		const data = await fetchTrendingMovies(1);
		return {
			movies: data.results,
			totalPages: data.total_pages
		};
	} catch (error) {
		console.error('Error loading movies:', error);
		return {
			movies: [],
			totalPages: 0,
			error: 'Failed to load movies'
		};
	}
};
