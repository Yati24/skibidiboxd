export interface Movie {
	id: number;
	title: string;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	release_date: string;
	vote_average: number;
	genre_ids: number[];
	popularity: number;
}

export interface TMDBResponse {
	results: Movie[];
	total_pages: number;
	total_results: number;
	page: number;
}
