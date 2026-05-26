import type { TMDBResponse } from '$lib/types/tmdb';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchTrendingMovies(page: number = 1): Promise<TMDBResponse> {
	// In browser, we need to call an API endpoint that has access to the API key
	// This prevents exposing the key to the client
	const response = await fetch(`/api/tmdb/trending?page=${page}`);
	if (!response.ok) throw new Error('Failed to fetch trending movies');
	return response.json();
}

export async function searchMovies(query: string, page: number = 1): Promise<TMDBResponse> {
	const response = await fetch(
		`/api/tmdb/search?query=${encodeURIComponent(query)}&page=${page}`
	);
	if (!response.ok) throw new Error('Failed to search movies');
	return response.json();
}

export function getPosterUrl(posterPath: string | null, width: number = 342): string {
	if (!posterPath) return 'https://via.placeholder.com/342x513?text=No+Image';
	return `https://image.tmdb.org/t/p/w${width}${posterPath}`;
}

export function getBackdropUrl(backdropPath: string | null, width: number = 1280): string {
	if (!backdropPath) return 'https://via.placeholder.com/1280x720?text=No+Image';
	return `https://image.tmdb.org/t/p/w${width}${backdropPath}`;
}
