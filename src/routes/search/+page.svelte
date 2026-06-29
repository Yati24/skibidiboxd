<script lang="ts">
	// helper pour construire les urls des affiches
	import { getPosterUrl } from '$lib/api/tmdb'
	// types pour les donnees de la page
	import type { PageData } from './$types'
	// definition de type pour les films
	import type { Movie } from '$lib/types/tmdb'

	let { data }: { data: PageData } = $props()

	const PER_PAGE = 25
	let page = $state(1)
	let sortOption: string = $state('popularity_desc')

	// trie les films selon l'option de tri selectionnee
	let sortedMovies: Movie[] = $derived.by(() => {
		const movies = data.movies
		if (!movies.length) return []

		const sorted = [...movies]

		switch (sortOption) {
			case 'popularity_desc':
				sorted.sort((a, b) => b.popularity - a.popularity)
				break
			case 'rating_desc':
				sorted.sort((a, b) => b.vote_average - a.vote_average)
				break
			case 'rating_asc':
				sorted.sort((a, b) => a.vote_average - b.vote_average)
				break
			case 'release_desc':
				sorted.sort((a, b) => {
					if (!a.release_date) return 1
					if (!b.release_date) return -1
					return b.release_date.localeCompare(a.release_date)
				})
				break
		}

		return sorted
	})

	// decoupe les films tries pour la page actuelle
	let pagedMovies = $derived(
		sortedMovies.slice((page - 1) * PER_PAGE, page * PER_PAGE)
	)
	// nombre total de pages de pagination
	let totalPages = $derived(Math.ceil(sortedMovies.length / PER_PAGE))

	// va a une page specifique et scroll en haut
	function goTo(p: number) {
		page = p
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}
</script>

<section class="relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 p-8 md:p-12 mb-8">
	<div class="relative z-10">
		<h2 class="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
			Rechercher un film
		</h2>
		<p class="text-slate-300 text-lg">Trouvez n'importe quel film et ajoutez-le à votre watchlist</p>
	</div>
</section>

<form method="GET" action="/search" class="flex gap-2 mb-6">
	<input
		type="text"
		name="q"
		value={data.query}
		placeholder="Rechercher un film..."
		class="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500 transition-colors"
	/>
	<button
		type="submit"
		class="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all"
	>
		Rechercher
	</button>
</form>

{#if data.error}
	<div class="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300 mb-8">
		{data.error}
	</div>
{/if}

{#if data.movies.length > 0}
	<div class="flex items-center justify-between mb-6">
		<p class="text-sm text-slate-400">
			{data.movies.length} résultat{data.movies.length > 1 ? 's' : ''} pour "<span class="text-white">{data.query}</span>"
		</p>

		<label class="flex items-center gap-2 text-sm text-slate-400">
			Trier par
			<select
				bind:value={sortOption}
				class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500 transition-colors"
			>
				<option value="popularity_desc">Popularité</option>
				<option value="rating_desc">Note (meilleures d'abord)</option>
				<option value="rating_asc">Note (pires d'abord)</option>
				<option value="release_desc">Date de sortie</option>
			</select>
		</label>
	</div>

	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
		{#each pagedMovies as movie (movie.id)}
			<a
				href="/movie/{movie.id}"
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
					</div>
				</div>
			</a>
		{/each}
	</div>

	{#if totalPages > 1}
		<div class="flex items-center justify-center gap-2 mt-8">
			<button
				onclick={() => goTo(page - 1)}
				disabled={page <= 1}
				class="px-3 py-1.5 text-sm rounded-lg transition-colors disabled:opacity-30 {page <= 1 ? 'bg-slate-800 text-slate-500' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}"
			>‹</button>
			{#each Array.from({ length: totalPages }, (_, i) => i + 1) as p}
				<button
					onclick={() => goTo(p)}
					class="px-3 py-1.5 text-sm rounded-lg transition-colors {p === page ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}"
				>{p}</button>
			{/each}
			<button
				onclick={() => goTo(page + 1)}
				disabled={page >= totalPages}
				class="px-3 py-1.5 text-sm rounded-lg transition-colors disabled:opacity-30 {page >= totalPages ? 'bg-slate-800 text-slate-500' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}"
			>›</button>
		</div>
	{/if}
{:else if data.query && !data.error}
	<div class="text-center py-16">
		<p class="text-slate-400 text-lg">Aucun résultat pour "<span class="text-white">{data.query}</span>"</p>
		<p class="text-slate-500 text-sm mt-2">Essayez un autre terme de recherche</p>
	</div>
{:else if !data.query}
	<div class="text-center py-16">
		<p class="text-slate-500 text-lg">Entrez un titre ci-dessus pour commencer la recherche</p>
	</div>
{/if}
