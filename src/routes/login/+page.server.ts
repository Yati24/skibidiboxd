import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession()
	if (session) {
		redirect(303, '/')
	}
}

export const actions: Actions = {
	signup: async ({ request, locals }) => {
		const formData = await request.formData()
		const email = String(formData.get('email') ?? '')
		const password = String(formData.get('password') ?? '')

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required', email })
		}

		if (password.length < 6) {
			return fail(400, { error: 'Password must be at least 6 characters', email })
		}

		const { error: signupError } = await locals.supabase.auth.signUp({
			email,
			password
		})

		if (signupError) {
			return fail(400, { error: signupError.message, email })
		}

		return { success: 'Check your email for the confirmation link', email }
	},

	login: async ({ request, locals }) => {
		const formData = await request.formData()
		const email = String(formData.get('email') ?? '')
		const password = String(formData.get('password') ?? '')

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required', email })
		}

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
