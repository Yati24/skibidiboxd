interface FavoritesStore {
	favorites: Set<number>;
	toggleFavorite: (movieId: number) => void;
	isFavorite: (movieId: number) => boolean;
}

function createFavoritesStore(): FavoritesStore {
	let stored: Set<number> = new Set();

	if (typeof window !== 'undefined') {
		const item = localStorage.getItem('favorites');
		if (item) {
			try {
				stored = new Set(JSON.parse(item));
			} catch {
				stored = new Set();
			}
		}
	}

	return {
		favorites: stored,
		toggleFavorite(movieId: number) {
			if (this.favorites.has(movieId)) {
				this.favorites.delete(movieId);
			} else {
				this.favorites.add(movieId);
			}
			if (typeof window !== 'undefined') {
				localStorage.setItem('favorites', JSON.stringify(Array.from(this.favorites)));
			}
		},
		isFavorite(movieId: number) {
			return this.favorites.has(movieId);
		}
	};
}

export const favoritesStore = createFavoritesStore();
