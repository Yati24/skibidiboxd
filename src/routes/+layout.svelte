<script lang="ts">
	// styles globauz
	import '../app.css'
	// client navigateur supabase
	import { createClient } from '$lib/supabase/client'
	// invalide pour recharger les donnés du layout
	import { invalidate } from '$app/navigation'
	// types pour les donness du layout
	import type { LayoutData } from './$types'

	let { children, data }: { children: import('svelte').Snippet; data: LayoutData } = $props()

	// cree une instance du client supbase
	let supabase = $state(createClient())
	let user = $derived(data.user)
	let session = $derived(data.session)

	// deconnexion et rechargement de l'etat authh
	async function handleLogout() {
		// deconnexion de supabse
		await supabase.auth.signOut()
		// invalide les donnees authh dans toutes les routes
		await invalidate('app:auth')
	}
</script>

<div class="min-h-screen bg-slate-950 text-white">
	<header class="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
		<div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
			<a href="/" class="flex items-center gap-2 text-2xl font-bold">
				<span class="inline-block animate-bounce text-3xl filter drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" style="font-family: 'Comic Sans MS', 'Chalkboard SE', cursive;">🚽</span>
				<span class="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
					SkibidiBoxd
				</span>
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
						class="px-4 py-2 text-sm bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-semibold rounded-lg transition-all"
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
