<script lang="ts">
	// helpers pour les urls des affiches et images de fond
	import { getPosterUrl, getBackdropUrl } from '$lib/api/tmdb'
	// etat partage de la watchlist
	import { watchlist } from '$lib/watchlist.svelte'
	// store de la page courante pour lire les params url
	import { page } from '$app/stores'
	// types pour les donnees de la page
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()

	// recupere le param url 'from' pour la navigation retour
	let fromUrl = $derived($page.url.searchParams.get('from'))

	// synchronise l'etat de la watchlist avec les donnees serveur au chargement
	$effect(() => {
		if (data.isFavorite !== undefined && data.movie && data.session) {
			if (data.isFavorite) {
				watchlist.add(data.movie.id)
			} else {
				watchlist.remove(data.movie.id)
			}
		}
	})
</script>

{#if data.error}
	<div class="flex flex-col items-center justify-center min-h-[60vh]">
		<div class="p-6 bg-red-900/30 border border-red-700 rounded-lg text-red-300 max-w-md text-center">
			{data.error}
		</div>
		<a href="/" class="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm transition-colors">
			Retour à l'accueil
		</a>
	</div>
{:else if data.movie}
	{#if fromUrl}
		<a
			href={fromUrl}
			class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-xl text-sm text-slate-300 hover:text-white hover:border-yellow-500 transition-all shadow-lg"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
			</svg>
			Retour à la collection
		</a>
	{/if}
	<div class="relative h-[50vh] md:h-[60vh] rounded-xl overflow-hidden mb-8">
		<img
			src={getBackdropUrl(data.movie.backdrop_path, 1280)}
			alt={data.movie.title}
			class="w-full h-full object-cover"
		/>
		<div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

		<div class="absolute bottom-0 left-0 right-0 p-6 md:p-10">
			<h1 class="text-3xl md:text-5xl font-bold mb-2">{data.movie.title}</h1>
			{#if data.movie.tagline}
				<p class="text-lg text-slate-300 italic mb-3">{data.movie.tagline}</p>
			{/if}
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
		<div class="flex flex-col gap-4">
			<img
				src={getPosterUrl(data.movie.poster_path, 500)}
				alt={data.movie.title}
				class="w-full rounded-xl shadow-lg"
			/>

			{#if data.session}
				<form method="POST" action="?/toggleFavorite">
					{#if fromUrl}
						<input type="hidden" name="from" value={fromUrl} />
					{/if}
					<button
						type="submit"
						class="w-full py-3 font-semibold rounded-lg transition-all {watchlist.has(data.movie.id) ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300'}"
					>
						{watchlist.has(data.movie.id) ? '♥ Retirer des films vus' : '♡ Ajouter aux films vus'}
					</button>
				</form>
			{:else}
				<a
					href="/login"
					class="block w-full py-3 text-center bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-semibold rounded-lg transition-all"
				>
					Connectez-vous pour ajouter aux films vus
				</a>
			{/if}
		</div>

		<div class="space-y-6">
			<div class="flex flex-wrap gap-2">
				{#each data.movie.genres as genre (genre.id)}
					<span class="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-300">
						{genre.name}
					</span>
				{/each}
			</div>

			<div class="flex flex-wrap gap-6 text-sm text-slate-400">
				<span class="flex items-center gap-1">
					<span class="text-yellow-400">★</span>
					{data.movie.vote_average.toFixed(1)}
					<span class="text-slate-500">({data.movie.vote_count} votes)</span>
				</span>
				<span>{data.movie.release_date?.substring(0, 4) || 'N/A'}</span>
				{#if data.movie.runtime}
					<span>{data.movie.runtime} min</span>
				{/if}
				<span class="capitalize">{data.movie.status === 'Released' ? 'Sorti' : data.movie.status}</span>
			</div>

			<div>
				<h2 class="text-xl font-semibold mb-3">Synopsis</h2>
				<p class="text-slate-300 leading-relaxed">
					{data.movie.overview || 'Aucun synopsis disponible.'}
				</p>
			</div>

			<div class="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
				{#if data.movie.budget > 0}
					<div>
						<span class="text-sm text-slate-500">Budget</span>
						<p class="text-slate-300">{data.movie.budget.toLocaleString()} $</p>
					</div>
				{/if}
				{#if data.movie.revenue > 0}
					<div>
						<span class="text-sm text-slate-500">Revenu</span>
						<p class="text-slate-300">{data.movie.revenue.toLocaleString()} $</p>
					</div>
				{/if}
				{#if data.movie.homepage}
					<div class="col-span-full">
						<span class="text-sm text-slate-500">Site web</span>
						<a
							href={data.movie.homepage}
							target="_blank"
							rel="noopener noreferrer"
							class="block text-yellow-400 hover:text-yellow-300 truncate transition-colors"
						>
							{data.movie.homepage}
						</a>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
