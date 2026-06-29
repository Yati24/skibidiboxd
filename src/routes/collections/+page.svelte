<script lang="ts">
	// composant de carte de colletion reutilisable
	import CollectionCard from '$lib/components/CollectionCard.svelte'
	// etat partage de la watchlist
	import { watchlist } from '$lib/watchlist.svelte'
	// types pour les donnees de la page
	import type { PageData } from './$types'
	// type d'apercu de collection
	import type { CollectionWithPreview } from '$lib/types/tmdb'

	let { data }: { data: PageData } = $props()

	const PER_PAGE = 25
	let page = $state(1)

	// filtre de categorie actuellement selectioné
	let selectedCategory: string | null = $state(null)

	// initialise la watchlist depuis les donnees serveurr
	$effect(() => {
		if (data.watchedIds) {
			watchlist.init(data.watchedIds)
		}
	})

	// remet a la page 1 quand le filtre de catégorie change
	$effect(() => {
		selectedCategory
		page = 1
	})

	// filtre les colletions par categorie selectionnee
	let filteredCollections: CollectionWithPreview[] = $derived(
		selectedCategory
			? data.collections.filter((c) => c.category === selectedCategory)
			: data.collections
	)

	// collections de la page actuelle
	let pagedCollections = $derived(
		filteredCollections.slice((page - 1) * PER_PAGE, page * PER_PAGE)
	)
	// nombre total de pages
	let totalPages = $derived(Math.ceil(filteredCollections.length / PER_PAGE))

	// va a une page avec defilement fluide
	function goTo(p: number) {
		page = p
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}
</script>

<section class="relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 p-8 md:p-12 mb-8">
	<div class="relative z-10">
		<h2 class="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
			Collections
		</h2>
		<p class="text-slate-300 text-lg">Explorez tous les thèmes et genres de films</p>
	</div>
</section>

<!-- Filtres par catégorie -->
<div class="flex flex-wrap gap-2 mb-8">
	<button
		type="button"
		onclick={() => selectedCategory = null}
		class="px-3 py-1.5 text-sm rounded-lg transition-colors {selectedCategory === null ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}"
	>
		Toutes
	</button>
	{#each data.categories as category}
		<button
			type="button"
			onclick={() => selectedCategory = category}
			class="px-3 py-1.5 text-sm rounded-lg transition-colors {selectedCategory === category ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}"
		>
			{category}
		</button>
	{/each}
</div>

<p class="text-sm text-slate-500 mb-6">{filteredCollections.length} collection{filteredCollections.length > 1 ? 's' : ''}</p>

{#if filteredCollections.length > 0}
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each pagedCollections as collection (collection.slug)}
			<CollectionCard collection={collection} />
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
{:else}
	<div class="text-center py-16">
		<p class="text-slate-400 text-lg">Aucune collection trouvée</p>
	</div>
{/if}
