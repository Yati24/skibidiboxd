/**
 * Store global réactif (Universal Reactivity — Svelte 5 Runes).
 * Synchronise l'état des films favoris entre tous les composants
 * sans passer par des props ou des events.
 *
 * Utilisation :
 *   import { watchlist } from '$lib/watchlist.svelte'
 *   watchlist.init([...])      // initialisation côté client
 *   watchlist.add(123)         // ajout instantané dans l'UI
 *   watchlist.remove(123)      // retrait instantané
 *   watchlist.has(123)         // test booléen — réactif
 */
class WatchlistStore {
	/** Tableau des tmdb_id favoris de l'utilisateur connecté */
	items = $state<number[]>([])

	/** Initialise la liste (appelé après le chargement des données serveur) */
	init(ids: number[]): void {
		this.items = ids
	}

	/** Ajoute un tmdb_id instantanément dans l'UI */
	add(tmdbId: number): void {
		if (!this.has(tmdbId)) {
			this.items = [...this.items, tmdbId]
		}
	}

	/** Retire un tmdb_id instantanément dans l'UI */
	remove(tmdbId: number): void {
		this.items = this.items.filter((id) => id !== tmdbId)
	}

	/** Vérifie si un film est dans la watchlist (réactif) */
	has(tmdbId: number): boolean {
		return this.items.includes(tmdbId)
	}
}

export const watchlist = new WatchlistStore()
