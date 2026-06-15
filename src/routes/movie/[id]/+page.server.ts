import { error, fail, redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import type { MovieDetail } from '$lib/types/tmdb'
import { env } from '$env/dynamic/private'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

/**
 * Récupère les détails complets d'un film depuis l'API TMDB.
 * Lance une erreur 404 si le film n'existe pas.
 */
async function fetchMovieDetail(movieId: number): Promise<MovieDetail> {
	const apiKey = env.VITE_TMDB_API_KEY
	if (!apiKey) {
		throw new Error('TMDB API key not configured')
	}

	const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}?language=fr-FR`, {
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json;charset=utf-8'
		}
	})

	if (response.status === 404) {
		error(404, 'Film introuvable')
	}

	if (!response.ok) {
		throw new Error(`TMDB API error: ${response.status}`)
	}

	return response.json()
}

export const load: PageServerLoad = async ({ params, locals }) => {
	const movieId = parseInt(params.id, 10)

	if (isNaN(movieId)) {
		error(400, 'ID de film invalide')
	}

	try {
		const [movie, session] = await Promise.all([
			fetchMovieDetail(movieId),
			locals.getSession()
		])

		// Vérifie si le film est déjà dans les favoris de l'utilisateur connecté
		let isFavorite = false
		if (session) {
			const user = await locals.getUser()
			if (user) {
				const { data } = await locals.supabase
					.from('watched_movies')
					.select('id')
					.eq('user_id', user.id)
					.eq('tmdb_id', movieId)
					.maybeSingle()

				isFavorite = data !== null
			}
		}

		return { movie, isFavorite, session: !!session, error: null }
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err
		}

		console.error('Error loading movie details:', err)
		return {
			movie: null,
			isFavorite: false,
			session: false,
			error: 'Impossible de charger les détails du film. Réessayez plus tard.'
		}
	}
}

export const actions: Actions = {
	toggleFavorite: async ({ request, locals, params }) => {
		// 1. Vérifier l'authentification via getUser() (appel serveur sécurisé)
		const user = await locals.getUser()
		if (!user) {
			return fail(401, { error: 'Vous devez être connecté' })
		}

		const tmdbId = parseInt(params.id, 10)
		if (isNaN(tmdbId)) {
			return fail(400, { error: 'ID de film invalide' })
		}

		// 2. Vérifier si le film est déjà dans la watchlist
		const { data: existing } = await locals.supabase
			.from('watched_movies')
			.select('id')
			.eq('user_id', user.id)
			.eq('tmdb_id', tmdbId)
			.maybeSingle()

		const formData = await request.formData()
		const fromParam = formData.get('from')
		const redirectUrl = typeof fromParam === 'string' && fromParam
			? `/movie/${tmdbId}?from=${encodeURIComponent(fromParam)}`
			: `/movie/${tmdbId}`

		if (existing) {
			const { error: deleteError } = await locals.supabase
				.from('watched_movies')
				.delete()
				.eq('id', existing.id)

			if (deleteError) {
				console.error('Error removing favorite:', deleteError)
				return fail(500, { error: 'Erreur lors du retrait de la watchlist' })
			}

			redirect(302, redirectUrl)
		} else {
			const { error: insertError } = await locals.supabase
				.from('watched_movies')
				.insert({ user_id: user.id, tmdb_id: tmdbId })

			if (insertError) {
				console.error('Error adding favorite:', insertError)
				return fail(500, { error: "Erreur lors de l'ajout à la watchlist" })
			}

			redirect(302, redirectUrl)
		}
	}
}
