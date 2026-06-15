import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.getSession()

	// On appelle getUser() uniquement si une session existe,
	// car getUser() contacte le serveur Supabase pour vérifier l'authenticité.
	const user = session ? await locals.getUser() : null

	return {
		session,
		user: user
			? {
					id: user.id,
					email: user.email,
					user_metadata: user.user_metadata
				}
			: null
	}
}
