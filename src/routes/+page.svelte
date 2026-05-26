<script lang="ts">
	import { favoritesStore } from '$lib/stores/favorites.svelte.ts';
	import { getPosterUrl } from '$lib/api/tmdb';
	import type { PageData } from './$types';
	import type { Movie } from '$lib/types/tmdb';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();

	let movies: Movie[] = $state(data.movies || []);
	let searchQuery: string = $state('');
	let isLoading: boolean = $state(false);
	let error: string | null = $state(data.error || null);

	async function handleSearch(e: Event) {
		e.preventDefault();
		if (!searchQuery.trim()) {
			movies = data.movies;
			error = null;
			return;
		}

		isLoading = true;
		error = null;

		try {
			const response = await fetch(`/api/tmdb/search?query=${encodeURIComponent(searchQuery)}`);
			const result = await response.json();
			if (result.error) {
				error = result.error;
				movies = [];
			} else {
				movies = result.results || [];
			}
		} catch (err) {
			error = 'Failed to search movies';
		} finally {
			isLoading = false;
		}
	}

	function toggleFavorite(movieId: number) {
		favoritesStore.toggleFavorite(movieId);
	}
</script>

<div class="space-y-8">
	<!-- Hero Section -->
	<section class="relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 p-8 md:p-12">
		<div class="relative z-10">
			<h2 class="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
				Discover Movies
			</h2>
			<p class="text-slate-300 text-lg">Explore trending films and add them to your collection</p>
		</div>
	</section>

	<!-- Search Bar -->
	<form onsubmit={handleSearch} class="flex gap-2">
		<input
			type="text"
			placeholder="Search movies..."
			bind:value={searchQuery}
			class="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
		/>
		<button
			type="submit"
			disabled={isLoading}
			class="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all"
		>
			{isLoading ? 'Searching...' : 'Search'}
		</button>
	</form>

	<!-- Error Message -->
	{#if error}
		<div class="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
			{error}
		</div>
	{/if}

	<!-- Movies Grid -->
	{#if movies.length > 0}
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
			{#each movies as movie (movie.id)}
				<a href="/movie/{movie.id}" class="group cursor-pointer">
					<div class="relative overflow-hidden rounded-xl aspect-[2/3] bg-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
						<img
							src={getPosterUrl(movie.poster_path)}
							alt={movie.title}
							class="w-full h-full object-cover"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
							<h3 class="text-white font-bold text-sm line-clamp-2 mb-2">{movie.title}</h3>
							<div class="flex items-center justify-between mb-3">
								<span class="text-yellow-400 text-xs font-semibold flex items-center gap-1">
									★ {movie.vote_average.toFixed(1)}
								</span>
								<span class="text-slate-300 text-xs">{movie.release_date?.substring(0, 4) || 'N/A'}</span>
							</div>
							<button
								type="button"
								onclick={() => toggleFavorite(movie.id)}
								class="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
							>
								{favoritesStore.isFavorite(movie.id) ? '♥ Added' : '+ Add to Favorites'}
							</button>
						</div>
					</div>
				</a>
			{/each}
		</div>
	{:else if !isLoading}
		<div class="text-center py-12">
			<p class="text-slate-400 text-lg">No movies found</p>
		</div>
	{/if}

	<!-- Loading State -->
	{#if isLoading}
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
			{#each Array(10) as _}
				<div class="aspect-[2/3] bg-slate-800 rounded-xl animate-pulse"></div>
			{/each}
		</div>
	{/if}
</div>
