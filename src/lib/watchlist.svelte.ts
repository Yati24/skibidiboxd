// store reactif pour la watchlist de l'utilisateur (svelte 5 runes)
/**
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
// classe de watchlist reactive basee sur les runes svelte 5
class WatchlistStore {
	// tableau des tmdb_id regardes
	// tableau des tmdb_id favoris de l'utilisateur connecte
	items = $state<number[]>([])

	// initialise la watchlist avec un tableau d'ids
	/** Initialise la liste (appele apres le chargement des donnees serveur) */
	init(ids: number[]): void {
		this.items = ids
	}

	// ajoute un id de film a la watchlist
	/** Ajoute un tmdb_id instantanement dans l'interface */
	add(tmdbId: number): void {
		if (!this.has(tmdbId)) {
			this.items = [...this.items, tmdbId]
		}
	}

	// retire un id de film de la watchlist
	/** Retire un tmdb_id instantanement dans l'interface */
	remove(tmdbId: number): void {
		this.items = this.items.filter((id) => id !== tmdbId)
	}

	// verifie si un id de film est dans la watchlist
	/** Verifie si un film est dans la watchlist (reactif) */
	has(tmdbId: number): boolean {
		return this.items.includes(tmdbId)
	}
}

// instance singleton de la watchlist
export const watchlist = new WatchlistStore()
