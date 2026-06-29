import type { TMDBResponse } from '$lib/types/tmdb';

// url de base pour l'api tmdb v3
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// recupere les films tendances depuis l'api cote serveur
export async function fetchTrendingMovies(page: number = 1): Promise<TMDBResponse> {
	// recupere les films tendances
	const response = await fetch(`/api/tmdb/trending?page=${page}`);
	if (!response.ok) throw new Error('Failed to fetch trending movies');
	return response.json();
}

// cherche des films par recherche textuelle
export async function searchMovies(query: string, page: number = 1): Promise<TMDBResponse> {
	// recupere les resultats de recherche
	const response = await fetch(
		`/api/tmdb/search?query=${encodeURIComponent(query)}&page=${page}`
	);
	if (!response.ok) throw new Error('Failed to search movies');
	return response.json();
}

// construit une url d'affiche tmdbb
export function getPosterUrl(posterPath: string | null, width: number = 342): string {
	if (!posterPath) return 'https://via.placeholder.com/342x513?text=No+Image';
	return `https://image.tmdb.org/t/p/w${width}${posterPath}`;
}

// construit une url d'image de fond tmdbb
export function getBackdropUrl(backdropPath: string | null, width: number = 1280): string {
	if (!backdropPath) return 'https://via.placeholder.com/1280x720?text=No+Image';
	return `https://image.tmdb.org/t/p/w${width}${backdropPath}`;
}
