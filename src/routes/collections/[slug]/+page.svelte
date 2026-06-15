<script lang="ts">
	import { getPosterUrl } from '$lib/api/tmdb'
	import { watchlist } from '$lib/watchlist.svelte'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()

	$effect(() => {
		if (data.watchedIds) {
			watchlist.init(data.watchedIds)
		}
	})

	let watchedCount = $derived(
		data.movieIds.filter((id) => watchlist.has(id)).length
	)

	let percentage = $derived(
		data.totalResults > 0
			? Math.round((watchedCount / data.totalResults) * 100)
			: 0
	)
</script>

{#if data.error}
	<div class="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300 mb-8">{data.error}</div>
{/if}

<nav class="text-sm text-slate-400 mb-6">
	<a href="/collections" class="hover:text-white transition-colors">Collections</a>
	<span class="mx-2">›</span>
	<span class="text-white">{data.collection.name}</span>
</nav>

<section class="relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 p-8 md:p-12 mb-8">
	<div class="relative z-10">
		<h2 class="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
			{data.collection.name}
		</h2>
		<p class="text-slate-300 text-lg mb-4">{data.collection.description}</p>

		<!-- Barre de progression globale -->
		<div class="max-w-md">
			<div class="flex justify-between text-sm text-slate-400 mb-1">
				<span>Progression</span>
				<span>{watchedCount}/{data.totalResults} ({percentage}%)</span>
			</div>
			<div class="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
				<div
					class="h-full rounded-full transition-all duration-500 ease-out {percentage === 100 ? 'bg-emerald-500' : 'bg-blue-600'}"
					style="width: {percentage}%"
				></div>
			</div>
		</div>
	</div>
</section>

{#if data.movies.length > 0}
	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
		{#each data.movies as movie (movie.id)}
			<a
				href="/movie/{movie.id}?from=/collections/{data.collection.slug}"
				class="group block rounded-xl overflow-hidden bg-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.03]"
			>
				<div class="aspect-[2/3] relative overflow-hidden">
					<img
						src={getPosterUrl(movie.poster_path)}
						alt={movie.title}
						class="w-full h-full object-cover"
						loading="lazy"
					/>
					<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
						<h3 class="text-white font-bold text-sm line-clamp-2 mb-2">{movie.title}</h3>
						<div class="flex items-center justify-between">
							<span class="text-yellow-400 text-xs font-semibold flex items-center gap-1">
								★ {movie.vote_average.toFixed(1)}
							</span>
							<span class="text-slate-300 text-xs">{movie.release_date?.substring(0, 4) || 'N/A'}</span>
						</div>
						{#if data.watchedIds.includes(movie.id)}
							<span class="text-xs text-emerald-400 mt-1">✓ Vu</span>
						{/if}
					</div>
				</div>
			</a>
		{/each}
	</div>
{:else}
	<div class="text-center py-16">
		<p class="text-slate-400 text-lg">Aucun film dans cette collection</p>
	</div>
{/if}
