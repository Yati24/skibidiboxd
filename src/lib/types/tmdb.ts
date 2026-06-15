export interface Genre {
	id: number
	name: string
}

export interface Movie {
	id: number
	title: string
	overview: string
	poster_path: string | null
	backdrop_path: string | null
	release_date: string
	vote_average: number
	genre_ids: number[]
	popularity: number
}

export interface MovieDetail extends Omit<Movie, 'genre_ids'> {
	tagline: string | null
	runtime: number | null
	genres: Genre[]
	budget: number
	revenue: number
	homepage: string | null
	status: string
	vote_count: number
}

export interface TMDBResponse {
	results: Movie[]
	total_pages: number
	total_results: number
	page: number
}

export interface CollectionDef {
	slug: string
	name: string
	description: string
	category: string
	discoverParams?: Record<string, string>
	searchQueries?: string[]
	maxMovies?: number
}

export interface CollectionWithPreview extends CollectionDef {
	movieCount: number
	watchedCount: number
	percentage: number
	movieIds: number[]
	posters: (string | null)[]
}
