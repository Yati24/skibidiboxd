import { createServerClient } from '@supabase/ssr'
import type { RequestEvent } from '@sveltejs/kit'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

export const createClient = (event: { cookies: RequestEvent['cookies'] }) =>
	createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) =>
					event.cookies.set(name, value, { ...options, path: '/' })
				)
			}
		}
	})
