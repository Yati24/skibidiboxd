// page de connexion: redirige les utilisateurs authentifies, gere les actions login/inscription
import { error, fail, redirect } from '@sveltejs/kit'
// types pour le chargement serveur et les actions
import type { Actions, PageServerLoad } from './$types'

// redirige vers l'accueil si deja connecte
export const load: PageServerLoad = async ({ locals }) => {
	// verifie si l'utilisateur a une session active
	const session = await locals.getSession()
	if (session) {
		redirect(303, '/')
	}
}

export const actions: Actions = {
	// gere la soumission du formulaire d'inscription
	signup: async ({ request, locals }) => {
		// parse les donnees du formulaire
		const formData = await request.formData()
		const email = String(formData.get('email') ?? '')
		const password = String(formData.get('password') ?? '')

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required', email })
		}

		if (password.length < 6) {
			return fail(400, { error: 'Password must be at least 6 characters', email })
		}

		// cree un compte via supabase authh
		const { error: signupError } = await locals.supabase.auth.signUp({
			email,
			password
		})

		if (signupError) {
			return fail(400, { error: signupError.message, email })
		}

		return { success: 'Check your email for the confirmation link', email }
	},

	// gere la soumission du formulaire de connexion
	login: async ({ request, locals }) => {
		// parse les donnees du formulaire
		const formData = await request.formData()
		const email = String(formData.get('email') ?? '')
		const password = String(formData.get('password') ?? '')

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required', email })
		}

		// connexion avec supabase auth
		const { error: loginError } = await locals.supabase.auth.signInWithPassword({
			email,
			password
		})

		if (loginError) {
			return fail(400, { error: loginError.message, email })
		}

		redirect(303, '/')
	}
}
