// chargeur serveur du layout: fournit session et utilisateurr a toutes les pages
import type { LayoutServerLoad } from './$types'

// recupere session et utilisateur authentifé pour le layout
export const load: LayoutServerLoad = async ({ locals }) => {
	// recupere la session actuelle depuis supabse
	const session = await locals.getSession()

	// on appelle getUser() uniquement si une session existe,
	// car getUser() contacte le serveur supabase pour vérifier l'authenticité.
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
