<script lang="ts">
	import '../app.css'
	import { createClient } from '$lib/supabase/client'
	import { invalidate } from '$app/navigation'
	import type { LayoutData } from './$types'

	let { children, data }: { children: import('svelte').Snippet; data: LayoutData } = $props()

	let supabase = $state(createClient())
	let user = $derived(data.user)
	let session = $derived(data.session)

	async function handleLogout() {
		await supabase.auth.signOut()
		await invalidate('app:auth')
	}
</script>

<div class="min-h-screen bg-slate-950 text-white">
	<header class="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
		<div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
			<a href="/" class="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
				SkibidiBoxd
			</a>
			<nav class="flex items-center gap-4">
				<a href="/collections" class="text-sm text-slate-300 hover:text-white transition-colors">
					Collections
				</a>
				<a href="/search" class="text-sm text-slate-300 hover:text-white transition-colors">
					Rechercher
				</a>
				{#if user}
					<span class="text-sm text-slate-300">{user.email}</span>
					<button
						onclick={handleLogout}
						class="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
					>
						Déconnexion
					</button>
				{:else}
					<a
						href="/login"
						class="px-4 py-2 text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all"
					>
						Connexion
					</a>
				{/if}
			</nav>
		</div>
	</header>

	<main class="max-w-7xl mx-auto px-4 py-8">
		{@render children()}
	</main>
</div>
