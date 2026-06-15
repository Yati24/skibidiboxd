<script lang="ts">
	import { enhance } from '$app/forms'
	import type { SubmitFunction } from '@sveltejs/kit'

	let mode: 'login' | 'signup' = $state('login')
	let email: string = $state('')
	let password: string = $state('')
	let formError: string | null = $state(null)
	let formSuccess: string | null = $state(null)

	const handleResult: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'failure') {
				formError = String(result.data?.error ?? 'Une erreur est survenue')
				formSuccess = null
			} else if (result.type === 'success' && result.data?.success) {
				formSuccess = String(result.data.success)
				formError = null
			}
		}
	}

	function toggleMode() {
		mode = mode === 'login' ? 'signup' : 'login'
		formError = null
		formSuccess = null
	}
</script>

<div class="flex min-h-[70vh] items-center justify-center">
	<div class="w-full max-w-md">
		<div class="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
			<div class="text-center mb-8">
				<h1 class="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
					{mode === 'login' ? 'Bon retour' : 'Créer un compte'}
				</h1>
				<p class="text-slate-400 mt-2">
					{mode === 'login' ? 'Connectez-vous à votre compte' : 'Inscrivez-vous gratuitement'}
				</p>
			</div>

			{#if formSuccess}
				<div class="mb-6 p-4 bg-emerald-900/30 border border-emerald-700 rounded-lg text-emerald-300 text-sm">
					{formSuccess}
				</div>
			{/if}

			{#if formError}
				<div class="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
					{formError}
				</div>
			{/if}

			<form
				method="POST"
				action={mode === 'login' ? '?/login' : '?/signup'}
				use:enhance={handleResult}
				class="space-y-5"
			>
				<div>
					<label for="email" class="block text-sm font-medium text-slate-300 mb-2">Email</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						bind:value={email}
						placeholder="vous@exemple.fr"
						class="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-slate-300 mb-2">Mot de passe</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						minlength={6}
						bind:value={password}
						placeholder="••••••••"
						class="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
					/>
				</div>

				<button
					type="submit"
					class="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all"
				>
					{mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
				</button>
			</form>

			<div class="mt-6 text-center">
				<button
					type="button"
					onclick={toggleMode}
					class="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
				>
					{mode === 'login'
						? "Pas encore de compte ? S'inscrire"
						: 'Déjà un compte ? Se connecter'}
				</button>
			</div>
		</div>
	</div>
</div>
