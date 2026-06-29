// hooks serveur: initialise le client supabase et les heplers d'auth pour chaque requete
import { createServerClient } from '@supabase/ssr'
// type handle de sveltekit
import type { Handle } from '@sveltejs/kit'
// varialbes d'env publiques supabase
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

// gere chaque requete entrante
export const handle: Handle = async ({ event, resolve }) => {
	// cree un client serveur supabase avec geston des cookies
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) =>
					event.cookies.set(name, value, { ...options, path: '/' })
				)
			}
		}
	})

	// helepr pour obtenir la session actuelle
	event.locals.getSession = async () => {
		// recupere la session depuis supabase authh
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession()
		return session
	}

	// helper pour obtenir l'utilisateurr authentifie
	event.locals.getUser = async () => {
		// recupere l'utilisateur depuis supabase auth (verrif serveur)
		const { data } = await event.locals.supabase.auth.getUser()
		return data.user ?? null
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version'
		}
	})
}
