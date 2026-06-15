<script lang="ts">
	import type { CollectionWithPreview } from '$lib/types/tmdb'
	import { watchlist } from '$lib/watchlist.svelte'
	import { getPosterUrl } from '$lib/api/tmdb'

	interface Props {
		collection: CollectionWithPreview
	}

	let { collection }: Props = $props()

	let watchedCount = $derived(
		collection.movieIds?.filter((id) => watchlist.has(id)).length ?? 0
	)

	let percentage = $derived(
		collection.movieCount > 0
			? Math.round((watchedCount / collection.movieCount) * 100)
			: 0
	)

	let previewPosters = $derived(
		collection.posters?.slice(0, 4) ?? []
	)
</script>

<a
	href="/collections/{collection.slug}"
	class="block bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg hover:border-cyan-700 transition-all hover:shadow-xl group"
>
	<!-- Mini-affiches en haut -->
	{#if previewPosters.length > 0}
		<div class="grid grid-cols-4 gap-1 mb-4 rounded-lg overflow-hidden h-24">
			{#each previewPosters as poster}
				<img
					src={getPosterUrl(poster, 185)}
					alt=""
					class="w-full h-full object-cover"
					loading="lazy"
				/>
			{/each}
		</div>
	{/if}

	<div class="flex items-center justify-between mb-3">
		<h3 class="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{collection.name}</h3>
		<span class="text-sm text-slate-400 shrink-0 ml-2">
			{collection.movieCount} film{collection.movieCount > 1 ? 's' : ''}
		</span>
	</div>

	<p class="text-xs text-slate-500 mb-3 line-clamp-1">{collection.description}</p>

	<div class="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
		<div
			class="h-full rounded-full transition-all duration-500 ease-out {percentage === 100 ? 'bg-emerald-500' : 'bg-blue-600'}"
			style="width: {percentage}%"
		></div>
	</div>

	<p class="text-xs text-slate-500 mt-2">
		{watchedCount}/{collection.movieCount} vu{watchedCount > 1 ? 's' : ''}
		({percentage}%)
	</p>
</a>
