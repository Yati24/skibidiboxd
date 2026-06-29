// definitions de colletions et fonctions de generation
// type de colletion depuis les types tmdb
import type { CollectionDef } from '$lib/types/tmdb'

// liste des genres avec ids tmdbb et noms francais
const GENRES: { id: number; name: string }[] = [
	{ id: 28, name: 'Action' },
	{ id: 12, name: 'Aventure' },
	{ id: 16, name: 'Animation' },
	{ id: 35, name: 'Comédie' },
	{ id: 80, name: 'Crime' },
	{ id: 99, name: 'Documentaire' },
	{ id: 18, name: 'Drame' },
	{ id: 10751, name: 'Familial' },
	{ id: 14, name: 'Fantastique' },
	{ id: 36, name: 'Histoire' },
	{ id: 27, name: 'Horreur' },
	{ id: 10402, name: 'Musique' },
	{ id: 9648, name: 'Mystère' },
	{ id: 10749, name: 'Romance' },
	{ id: 878, name: 'Science-Fiction' },
	{ id: 10770, name: 'Téléfilm' },
	{ id: 53, name: 'Thriller' },
	{ id: 10752, name: 'Guerre' },
	{ id: 37, name: 'Western' }
]

// liste des langues avec codes et noms francais
const LANGUAGES: { code: string; name: string }[] = [
	{ code: 'fr', name: 'Français' },
	{ code: 'en', name: 'Anglais' },
	{ code: 'ja', name: 'Japonais' },
	{ code: 'ko', name: 'Coréen' },
	{ code: 'es', name: 'Espagnol' },
	{ code: 'de', name: 'Allemand' },
	{ code: 'it', name: 'Italien' },
	{ code: 'zh', name: 'Chinois' },
	{ code: 'hi', name: 'Hindi' },
	{ code: 'pt', name: 'Portugais' }
]

// liste des realisateurs avec ids tmdb et noms
const DIRECTORS: { id: number; name: string }[] = [
	{ id: 138, name: 'Quentin Tarantino' },
	{ id: 525, name: 'Christopher Nolan' },
	{ id: 488, name: 'Steven Spielberg' },
	{ id: 34248, name: 'Denis Villeneuve' },
	{ id: 1032, name: 'Martin Scorsese' },
	{ id: 223, name: 'Clint Eastwood' },
	{ id: 10707, name: 'David Fincher' },
	{ id: 1776, name: 'Ridley Scott' },
	{ id: 11544, name: 'James Cameron' },
	{ id: 227, name: 'Tim Burton' },
	{ id: 58728, name: 'Wes Anderson' },
	{ id: 2710, name: 'Spike Lee' },
	{ id: 5655, name: 'Paul Thomas Anderson' },
	{ id: 7461, name: 'Michael Mann' },
	{ id: 6317, name: 'David Lynch' },
	{ id: 507, name: 'George Lucas' },
	{ id: 378, name: 'Francis Ford Coppola' },
	{ id: 10411, name: 'John Carpenter' },
	{ id: 1054465, name: 'Jordan Peele' },
	{ id: 6109, name: 'Greta Gerwig' },
	{ id: 12083, name: 'Bong Joon-ho' },
	{ id: 93221, name: 'Ari Aster' },
	{ id: 20580, name: 'David O. Russell' },
	{ id: 137427, name: 'Damien Chazelle' },
	{ id: 95697, name: 'Taika Waititi' },
	{ id: 21229, name: 'Jean-Pierre Jeunet' },
	{ id: 19696, name: 'Luc Besson' },
	{ id: 11205, name: 'François Truffaut' },
	{ id: 95473, name: 'Jacques Audiard' },
	{ id: 5919, name: 'Hayao Miyazaki' }
]

// classifications avec labels francais
const CERTIFICATIONS: { code: string; label: string }[] = [
	{ code: 'G', label: 'Tout public' },
	{ code: 'PG', label: 'Accompagnement souhaité' },
	{ code: 'PG-13', label: '-13 ans' },
	{ code: 'R', label: '-17 ans' },
	{ code: 'NC-17', label: 'Interdit -17 ans' }
]

// combinaisons de genres pour les collections mixtes
const GENRE_COMBOS: { slug: string; name: string; genre1: number; genre2: number }[] = [
	{ slug: 'action-sf', name: 'Action & Science-Fiction', genre1: 28, genre2: 878 },
	{ slug: 'comedie-romance', name: 'Comédies romantiques', genre1: 35, genre2: 10749 },
	{ slug: 'horreur-thriller', name: 'Horreur & Thriller', genre1: 27, genre2: 53 },
	{ slug: 'aventure-fantastique', name: 'Aventures fantastiques', genre1: 12, genre2: 14 },
	{ slug: 'crime-drame', name: 'Films noirs', genre1: 80, genre2: 18 },
	{ slug: 'animation-familial', name: 'Animation en famille', genre1: 16, genre2: 10751 },
	{ slug: 'guerre-histoire', name: 'Films de guerre historiques', genre1: 10752, genre2: 36 },
	{ slug: 'comedie-drame', name: 'Comédies dramatiques', genre1: 35, genre2: 18 },
	{ slug: 'action-aventure', name: 'Films d\'action & d\'aventure', genre1: 28, genre2: 12 },
	{ slug: 'sf-horreur', name: 'Science-Fiction horrifique', genre1: 878, genre2: 27 }
]

// definitions de collections basees sur des mots-cles
const KEYWORD_SLUGS: { slug: string; name: string; keywordId: number }[] = [
	{ slug: 'oscars-best-picture', name: 'Oscars du meilleur film', keywordId: 189952 },
	{ slug: 'superhero', name: 'Super-héros', keywordId: 9715 },
	{ slug: 'time-travel', name: 'Voyage dans le temps', keywordId: 9725 },
	{ slug: 'space', name: 'Espace et cosmos', keywordId: 9687 },
	{ slug: 'dystopia', name: 'Dystopies', keywordId: 180739 },
	{ slug: 'zombie', name: 'Zombies', keywordId: 9952 },
	{ slug: 'vampire', name: 'Vampires', keywordId: 9887 },
	{ slug: 'ninja', name: 'Ninjas', keywordId: 158367 },
	{ slug: 'detective', name: 'Détectives', keywordId: 9951 },
	{ slug: 'high-school', name: 'Lycée et adolescence', keywordId: 9723 },
	{ slug: 'musical', name: 'Comédies musicales', keywordId: 170077 },
	{ slug: 'based-on-novel', name: 'Adaptés de romans', keywordId: 818 },
	{ slug: 'based-on-true-story', name: 'Inspirés d\'histoires vraies', keywordId: 256920 },
	{ slug: 'sequel', name: 'Suites et franchises', keywordId: 9882 },
	{ slug: 'post-apocalypse', name: 'Post-apocalyptiques', keywordId: 10076 },
	{ slug: 'martial-arts', name: 'Arts martiaux', keywordId: 9716 },
	{ slug: 'spy', name: 'Espionnage', keywordId: 9709 },
	{ slug: 'survival', name: 'Survie', keywordId: 10003 }
]

// cree un slug url-safe a partir d'une chaine
function makeSlug(label: string): string {
	return label
		.toLowerCase()
		.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
}


function generateCollections(): CollectionDef[] {
	const collections: CollectionDef[] = []
	let idCounter = 0


	for (const genre of GENRES) {
		collections.push({
			slug: `genre-${genre.id}-popular`,
			name: `${genre.name} populaires`,
			description: `Les films ${genre.name.toLowerCase()} les plus populaires du moment`,
			category: 'Par genre',
			discoverParams: { with_genres: String(genre.id), sort_by: 'popularity.desc', language: 'fr-FR' }
		})
		collections.push({
			slug: `genre-${genre.id}-top`,
			name: `Meilleurs ${genre.name.toLowerCase()}`,
			description: `Les films ${genre.name.toLowerCase()} les mieux notés`,
			category: 'Par genre',
			discoverParams: { with_genres: String(genre.id), sort_by: 'vote_average.desc', 'vote_count.gte': '300', language: 'fr-FR' }
		})
		collections.push({
			slug: `genre-${genre.id}-recent`,
			name: `${genre.name} récents`,
			description: `Les films ${genre.name.toLowerCase()} récents et populaires`,
			category: 'Par genre',
			discoverParams: { with_genres: String(genre.id), sort_by: 'primary_release_date.desc', 'primary_release_date.lte': '2026-12-31', 'primary_release_date.gte': '2024-01-01', language: 'fr-FR' }
		})
	}

	// collections par decennie avec tri populaire et top
	// 2. par decennie (12 x 2 tris = ~24 collections)
	for (let decade = 1910; decade <= 2020; decade += 10) {
		const end = decade + 9
		collections.push({
			slug: `decade-${decade}-popular`,
			name: `Films des années ${decade}`,
			description: `Les films populaires des années ${decade}`,
			category: 'Par décennie',
			discoverParams: {
				'primary_release_date.gte': `${decade}-01-01`,
				'primary_release_date.lte': `${end}-12-31`,
				sort_by: 'popularity.desc',
				language: 'fr-FR'
			}
		})
		collections.push({
			slug: `decade-${decade}-top`,
			name: `Meilleurs films des années ${decade}`,
			description: `Les films des années ${decade} les mieux notés`,
			category: 'Par décennie',
			discoverParams: {
				'primary_release_date.gte': `${decade}-01-01`,
				'primary_release_date.lte': `${end}-12-31`,
				sort_by: 'vote_average.desc',
				'vote_count.gte': '100',
				language: 'fr-FR'
			}
		})
	}


	for (const lang of LANGUAGES) {
		collections.push({
			slug: `lang-${lang.code}-popular`,
			name: `Cinéma ${lang.name}`,
			description: `Les films ${lang.name.toLowerCase()} les plus populaires`,
			category: 'Par langue',
			discoverParams: { with_original_language: lang.code, sort_by: 'popularity.desc', language: 'fr-FR' }
		})
		collections.push({
			slug: `lang-${lang.code}-top`,
			name: `Meilleurs films ${lang.name.toLowerCase()}`,
			description: `Les films ${lang.name.toLowerCase()} les mieux notés`,
			category: 'Par langue',
			discoverParams: { with_original_language: lang.code, sort_by: 'vote_average.desc', 'vote_count.gte': '100', language: 'fr-FR' }
		})
	}


	for (const cert of CERTIFICATIONS) {
		collections.push({
			slug: `cert-${cert.code.toLowerCase()}-popular`,
			name: `${cert.label} populaires`,
			description: `Les films ${cert.label.toLowerCase()} les plus populaires`,
			category: 'Par classification',
			discoverParams: { certification_country: 'US', certification: cert.code, sort_by: 'popularity.desc', language: 'fr-FR' }
		})
		collections.push({
			slug: `cert-${cert.code.toLowerCase()}-top`,
			name: `Meilleurs films ${cert.label.toLowerCase()}`,
			description: `Les films ${cert.label.toLowerCase()} les mieux notés`,
			category: 'Par classification',
			discoverParams: { certification_country: 'US', certification: cert.code, sort_by: 'vote_average.desc', 'vote_count.gte': '200', language: 'fr-FR' }
		})
	}


	const topListDefs: CollectionDef[] = [
		{ slug: 'top-rated-all', name: 'Mieux notés de tous les temps', description: 'Les films avec les meilleures notes sur TMDB', category: 'Top listes', discoverParams: { sort_by: 'vote_average.desc', 'vote_count.gte': '2000', language: 'fr-FR' } },
		{ slug: 'most-popular', name: 'Les plus populaires', description: 'Les films les plus populaires du moment', category: 'Top listes', discoverParams: { sort_by: 'popularity.desc', language: 'fr-FR' } },
		{ slug: 'trending-week', name: 'Tendance de la semaine', description: 'Les films qui font parler cette semaine', category: 'Top listes', discoverParams: { sort_by: 'popularity.desc', 'primary_release_date.gte': '2025-01-01', language: 'fr-FR' } },
		{ slug: 'blockbusters', name: 'Gros budgets', description: 'Les films avec le plus gros budget de production', category: 'Top listes', discoverParams: { sort_by: 'budget.desc', 'budget.gte': '100000000', language: 'fr-FR' } },
		{ slug: 'animated', name: "Films d'animation", description: "Les meilleurs films d'animation", category: 'Top listes', discoverParams: { with_genres: '16', sort_by: 'vote_average.desc', 'vote_count.gte': '500', language: 'fr-FR' } },
		{ slug: 'indie', name: 'Cinéma indépendant', description: 'Les pépites du cinéma indépendant', category: 'Top listes', discoverParams: { with_genres: '18', sort_by: 'vote_average.desc', 'vote_count.gte': '100', 'vote_count.lte': '2000', language: 'fr-FR' } },
		{ slug: 'documentaries', name: 'Documentaires', description: 'Les meilleurs documentaires', category: 'Top listes', discoverParams: { with_genres: '99', sort_by: 'vote_average.desc', 'vote_count.gte': '100', language: 'fr-FR' } },
		{ slug: 'cult-classics', name: 'Films cultes', description: 'Les films devenus cultes avec le temps', category: 'Top listes', discoverParams: { sort_by: 'vote_average.desc', 'vote_count.gte': '500', 'vote_count.lte': '5000', language: 'fr-FR' } },
		{ slug: 'short-movies', name: 'Films courts (-90 min)', description: 'Les films de moins de 90 minutes', category: 'Top listes', discoverParams: { 'with_runtime.lte': '90', sort_by: 'vote_average.desc', 'vote_count.gte': '200', language: 'fr-FR' } },
		{ slug: 'epic-long', name: 'Films longs (+3h)', description: 'Les épopées de plus de 3 heures', category: 'Top listes', discoverParams: { 'with_runtime.gte': '180', sort_by: 'vote_average.desc', 'vote_count.gte': '200', language: 'fr-FR' } }
	]
	collections.push(...topListDefs)


	for (const dir of DIRECTORS) {
		collections.push({
			slug: `director-${dir.id}`,
			name: `${dir.name}`,
			description: `Les films réalisés par ${dir.name}`,
			category: 'Par réalisateur',
			discoverParams: { with_crew: String(dir.id), sort_by: 'primary_release_date.desc', language: 'fr-FR' }
		})
	}


	for (const combo of GENRE_COMBOS) {
		collections.push({
			slug: combo.slug,
			name: combo.name,
			description: `Les meilleurs films mêlant ${combo.name.toLowerCase()}`,
			category: 'Genres combinés',
			discoverParams: { with_genres: `${combo.genre1},${combo.genre2}`, sort_by: 'vote_average.desc', 'vote_count.gte': '200', language: 'fr-FR' }
		})
	}


	for (const kw of KEYWORD_SLUGS) {
		collections.push({
			slug: `keyword-${kw.slug}`,
			name: kw.name,
			description: `Les films sur le thème ${kw.name.toLowerCase()}`,
			category: 'Par thème',
			discoverParams: { with_keywords: String(kw.keywordId), sort_by: 'popularity.desc', language: 'fr-FR' }
		})
	}


	for (let year = 2021; year <= 2026; year++) {
		collections.push({
			slug: `year-${year}-popular`,
			name: `Films de ${year}`,
			description: `Les films populaires sortis en ${year}`,
			category: 'Par année',
			discoverParams: { 'primary_release_date.gte': `${year}-01-01`, 'primary_release_date.lte': `${year}-12-31`, sort_by: 'popularity.desc', language: 'fr-FR' }
		})
		collections.push({
			slug: `year-${year}-top`,
			name: `Meilleurs films de ${year}`,
			description: `Les films de ${year} les mieux notés`,
			category: 'Par année',
			discoverParams: { 'primary_release_date.gte': `${year}-01-01`, 'primary_release_date.lte': `${year}-12-31`, sort_by: 'vote_average.desc', 'vote_count.gte': '50', language: 'fr-FR' }
		})
	}


	const FUN_COLLECTIONS: { slug: string; name: string; description: string; queries: string[]; max?: number }[] = [
		{ slug: 'six-seven-67', name: 'SIX SEVEN 67', description: 'Le top 67 des films contenant "6", "7", "Six", "Seven" ou "67" dans leur titre', queries: ['six', 'seven', '6', '7', '67', 'sixty seven'], max: 67 },
		{ slug: 'skibidi-toilet', name: 'Skibidi Toilet', description: 'Les films les plus skibidi de tous les temps — toilet humour, absurdité et nonsense', queries: ['skibidi', 'toilet', 'goofy', 'nonsense', 'absurd'], max: 67 },
		{ slug: 'brainrot', name: 'Brainrot', description: 'Pure folie sur pellicule — le cinéma brainrot entre chaos, cringe et démence', queries: ['brainrot', 'insanity', 'chaos', 'cringe'], max: 67 },
		{ slug: 'sigma', name: 'Sigma Grindset', description: 'Des films de vrais loups solitaires — pas un mot, que du charisme', queries: ['sigma', 'lone wolf', 'wolf man'], max: 67 },
		{ slug: 'rizz', name: 'Rizz Mètré', description: 'Le charisme à l\'écran — des films qui ont du rizz, du swag et du style', queries: ['rizz', 'charisma', 'player', 'ladies'], max: 67 },
		{ slug: 'ohio', name: 'Ohio Final Boss', description: 'Seulement dans l\'Ohio — le cinéma le plus bizarre, absurde et wtf', queries: ['ohio', 'weird', 'bizarre', 'absurd', 'nonsense'], max: 67 },
		{ slug: 'tung-sahur', name: 'Tung Tung Tung Sahur', description: 'Tung tung tung sahur 🎵 la mélodie la plus catchy du cinéma', queries: ['tung', 'sahur'], max: 67 },
		{ slug: 'capuccino-assasino', name: 'Capuccino Assasino', description: 'Capuccino assasino ☕🔪 mafia, espresso et assassin — la dolce vita qui tue', queries: ['capuccino', 'espresso', 'assassin', 'mafia', 'italian'], max: 67 },
		{ slug: 'tralala-lirili', name: 'Tralala Lirili Larila', description: 'Tralalelo tralala lirili larila 🎶 la playlist brainrot en films', queries: ['tralala', 'lirili', 'larila'], max: 67 },
		{ slug: 'hawk-tuah', name: 'Hawk Tuah', description: 'Hawk tuah 🗣️ spit on that thang — le cinéma le plus légendaire', queries: ['hawk tuah', 'hawk', 'spit'], max: 67 },
		{ slug: 'gigachad', name: 'Gigachad', description: 'Le physique parfait — bodybuilding, muscles et gym pour vrais mâles alpha', queries: ['gigachad', 'bodybuilder', 'muscle', 'gym', 'strong'], max: 67 },
		{ slug: 'looksmaxxing', name: 'Looksmaxxing', description: 'Améliore ton allure — mewing, makeover, glow up et transformation', queries: ['looksmaxxing', 'mewing', 'makeover', 'transformation', 'glow'], max: 67 },
		{ slug: 'fanum-tax', name: 'Fanum Tax', description: 'Fanum tax 💰 braquages, heists et vols — tout est à prendre', queries: ['fanum', 'tax', 'heist', 'robbery'], max: 67 },
		{ slug: 'alpha', name: 'Alpha Mode', description: 'Mode alpha activé — les films des vrais boss', queries: ['alpha'], max: 67 },
		{ slug: 'delulu', name: 'Delulu', description: 'Delulu is the solulu — rêveurs, imagination et douce folie', queries: ['delulu', 'delusion', 'imagination', 'fantasy'], max: 67 },
		{ slug: 'grimace-shake', name: 'Grimace Shake', description: 'Le milk-shake mauve qui rend fou — des films violets et déjantés', queries: ['grimace', 'milkshake', 'purple'], max: 67 },
		{ slug: 'diddle', name: 'Diddle Diddle', description: 'Diddle diddle 🕯️ soirées, clubs et nuits endiablées', queries: ['diddy', 'nightclub', 'party'], max: 67 },
		{ slug: 'gyatt', name: 'GYATT', description: 'GYATT 🫢 quand le cinéma en met plein la vue', queries: ['gyatt', 'thick'], max: 67 },
		{ slug: 'ohio-sigma-rizz', name: 'Ohio Sigma Rizzler', description: 'Le bundle ultime — bizarre × loup solitaire × charisme en un seul écran', queries: ['ohio', 'sigma', 'rizz', 'weird', 'lone wolf'], max: 67 },
	]

	for (const f of FUN_COLLECTIONS) {
		collections.push({
			slug: f.slug,
			name: f.name,
			description: f.description,
			category: 'Fun',
			maxMovies: f.max,
			searchQueries: f.queries
		})
	}


	const seen = new Set<string>()
	return collections.filter((c) => {
		if (seen.has(c.slug)) return false
		seen.add(c.slug)
		return true
	})
}


export const ALL_COLLECTIONS = generateCollections()


export const FEATURED_SLUGS = [
	'top-rated-all',
	'trending-week',
	'most-popular',
	'blockbusters',
	'genre-28-popular',
	'genre-878-popular',
	'genre-27-popular',
	'genre-35-popular',
	'director-525',
	'director-138',
	'animated',
	'cult-classics',
	'six-seven-67'
]


export const CATEGORIES = [
	'Par genre',
	'Par décennie',
	'Par langue',
	'Par classification',
	'Par réalisateur',
	'Genres combinés',
	'Par thème',
	'Par année',
	'Top listes',
	'Fun'
] as const
