import type { Lang } from './languages';

// TYPES
// ##############
export interface UiMessages {
    ranking: string;
    civilizations: string;
    heroTitle: string;
    filters: string;
    search: string;
    categories: string;
    all: string;
    results: string;
    byTier: string;
    alphabetical: string;
    noResults: string;
    reset: string;
    details: string;
    previous: string;
    next: string;
    close: string;
    bonus: string;
    leader: string;
    uniqueUnits: string;
    uniqueBuildings: string;
    history: string;
    loading: string;
    loadError: string;
    retry: string;
    /** Subtitle of the brand in the header. */
    tagline: string;
    /** Accessible name of the language selector. */
    language: string;
    /** Accessible name of the tier filter group. */
    tiers: string;
    /** Accessible name of a civilization card; `{name}` is replaced by the civilization. */
    openDetails: string;
    /** Accessible name of the game navigation in the header. */
    games: string;
    /** Tooltip of the disabled game tabs. */
    comingSoon: string;
    /** Label of the button that opens the filter panel. */
    filtersButton: string;
    /** Heading of the category group in the filter panel. */
    category: string;
    /** Hint explaining the include / exclude buttons of the category tiles. */
    categoryHint: string;
    /** Heading of the tier group and kind of a tier pill. */
    tier: string;
    /** Hint explaining that several tiers can be picked. */
    tierHint: string;
    /** Short reset button of the filter panel. */
    resetShort: string;
    /** Closing button of the filter panel; `{count}` is replaced by the result count. */
    showResults: string;
    /** Include button of a category tile and kind of an included pill. */
    include: string;
    /** Exclude button of a category tile and kind of an excluded pill. */
    exclude: string;
    /** Removes every active filter pill. */
    clearAll: string;
    /** Singular of `results`. */
    result: string;
    /** Visible label of the alphabetical toggle; `alphabetical` stays its accessible name. */
    alphabeticalShort: string;
    /** Accessible name of the × of a filter pill; `{name}` is replaced by the filter. */
    removeFilter: string;
    /** Eyebrow of the home page. */
    homeEyebrow: string;
    /** First line of the home title, followed by `homeTitleAccent`. */
    homeTitle: string;
    /** Second line of the home title, the one carrying the gradient. */
    homeTitleAccent: string;
    /** Paragraph under the home title. */
    homeLede: string;
    /** Heading of the game cards. */
    homeChooseGame: string;
    /** Badge of a game whose tier list is out. */
    homeAvailable: string;
    /** Badge of a game whose tier list is not out yet. */
    homeSoon: string;
    /** Call to action of a game whose tier list is out. */
    homeCtaAvailable: string;
    /** Call to action of a game whose tier list is not out yet. */
    homeCtaSoon: string;
    /** Footer notice of the home page. */
    homeDisclaimer: string;
    /** Decorative caption of the Civilization VII card. */
    homeEraFlow: string;
    /** Eyebrow of the 404 page. */
    notFoundEyebrow: string;
    /** Title of the 404 page. */
    notFoundTitle: string;
    /** Body of the 404 page. */
    notFoundText: string;
    /** Title of the 403 page. */
    forbiddenTitle: string;
    /** Body of the 403 page. */
    forbiddenText: string;
    /** Eyebrow of the pages of the games that are not ranked yet. */
    wipEyebrow: string;
    /** Title of the pages of the games that are not ranked yet. */
    wipTitle: string;
    /** Intro of the Civilization VI page. */
    wipIntroCiv6: string;
    /** Intro of the Civilization VII page. */
    wipIntroCiv7: string;
    /** Eyebrow of the research card. */
    wipResearch: string;
    /** Name of the research; `{game}` is replaced by the game. */
    wipTierList: string;
    /** Unit of the remaining turns, shown in Roman numerals. */
    wipTurnsLeft: string;
    /** State of a finished research stage. */
    wipDone: string;
    /** State of the running research stage. */
    wipInProgress: string;
    /** Title of the blurred tier list preview. */
    wipPreviewLocked: string;
    /** Subtitle of the preview; `{turns}` is replaced by the remaining turns. */
    wipPreviewSub: string;
    /** Link back to the ranked game; `{game}` is replaced by its name. */
    wipBackToDefault: string;
    /** Link back to the default tier list, shown on the status pages. */
    backHome: string;
    /** Link back to the page the visitor came from, shown on the 404 page. */
    backPrevious: string;
    /** Heading of the unique units / buildings / improvements section. */
    uniqueElements: string;
    /** Tab listing the unique units. */
    tabUnits: string;
    /** Tab listing the unique buildings. */
    tabBuildings: string;
    /** Tab listing the unique tile improvements. */
    tabImprovements: string;
    /** Subtitle of a unique unit card. */
    uniqueUnit: string;
    /** Subtitle of a unique building card. */
    uniqueBuilding: string;
    /** Subtitle of a unique tile improvement card. */
    tileImprovement: string;
    /** Production cost of a unit. */
    statProduction: string;
    /** Movement points of a unit. */
    statMovement: string;
    /** Technology that unlocks the item. */
    statTechnology: string;
    /** Production cost of a building or an improvement. */
    statCost: string;
    /** Gold maintenance of a building. */
    statUpkeep: string;
    /** Unit of the gold maintenance. */
    goldPerTurn: string;
    /** Label of the yield chips of a building or an improvement. */
    yieldsLabel: string;
    /** Label of the terrain chips of an improvement. */
    terrainsLabel: string;
    /** Label of the collapsible strategy row of an item. */
    strategyTips: string;
    /** Food yield; culture, faith, science and production reuse the names of `tags`. */
    yieldFood: string;
    /** Gold yield. */
    yieldGold: string;
    /** Happiness yield. */
    yieldHappiness: string;
}

export interface HomeGameMessages {
    /** Era the card's styling quotes ("Antiquity"). */
    era: string;
    /** One-line pitch of the game. */
    line: string;
}

export interface StageMessages {
    /** Stage name, replaced by its state once the stage is running or done. */
    key: string;
    /** One-line description of the stage. */
    label: string;
}

export interface TierMessages {
    /** Short tier name shown in headings ("Tier S"). */
    label: string;
    /** Rank title shown next to the badge ("Légende"). */
    rank: string;
    /** One-line description of the tier. */
    sub: string;
}

export interface Messages {
    ui: UiMessages;
    /** Category names indexed by tag id (see data/taxonomy.ts). */
    tags: readonly string[];
    /** Tier copy indexed by tier id (see data/taxonomy.ts). */
    tiers: readonly TierMessages[];
    /** The four research stages of a game that is not ranked yet, in order. */
    wipStages: readonly StageMessages[];
    /** Home card copy, in the order of data/games.ts. */
    homeGames: readonly HomeGameMessages[];
}

// CONSTANTS
// ##############
/** Single source for every translated string of the interface. */
export const MESSAGES: Record<Lang, Messages> = {
    en: {
        ui: {
            ranking: 'Ranking',
            civilizations: 'civilizations',
            heroTitle: 'Which civilization should you play?',
            filters: 'Civilization filters',
            search: 'Search for a civilization',
            categories: 'Categories',
            all: 'All',
            results: 'results',
            byTier: 'By tier',
            alphabetical: 'Alphabetical',
            noResults: 'No civilization matches these filters.',
            reset: 'Reset filters',
            details: 'Civilization details',
            previous: 'Previous',
            next: 'Next',
            close: 'Close',
            bonus: 'Civilization bonus',
            leader: 'Leader',
            uniqueUnits: 'Unique units',
            uniqueBuildings: 'Unique buildings',
            history: 'History',
            loading: 'Loading civilizations…',
            loadError: 'Could not load civilizations.',
            retry: 'Retry',
            tagline: 'Tier list · Current meta',
            language: 'Language',
            tiers: 'Tiers',
            openDetails: 'Open details for {name}',
            games: 'Games',
            comingSoon: 'Coming soon',
            filtersButton: 'Filters',
            category: 'Category',
            categoryHint: '+ include (at least one) · − exclude',
            tier: 'Tier',
            tierHint: 'Multiple selection',
            resetShort: 'Reset',
            showResults: 'Show {count}',
            include: 'Include',
            exclude: 'Exclude',
            clearAll: 'Clear all',
            result: 'result',
            alphabeticalShort: 'A → Z',
            removeFilter: 'Remove {name}',
            homeEyebrow: 'Three games · One question',
            homeTitle: 'Which era',
            homeTitleAccent: 'will you dominate?',
            homeLede:
                'Civilization rankings kept up to date with the meta. Pick your game, find your people, start the match.',
            homeChooseGame: 'Choose a game',
            homeAvailable: 'Available',
            homeSoon: 'Soon',
            homeCtaAvailable: 'See the tier list',
            homeCtaSoon: 'In the works',
            homeDisclaimer: 'Fan site, not affiliated with Firaxis or 2K.',
            homeEraFlow: 'Atomic era → information',
            notFoundEyebrow: 'Error 404',
            notFoundTitle: 'Uncharted land',
            notFoundText:
                'This page stayed under the fog of war. The link may be broken, or this tile never existed on the map.',
            forbiddenTitle: 'Access denied',
            forbiddenText: 'You are not allowed to see this page.',
            wipEyebrow: 'Research under way',
            wipTitle: 'This tier list is still being researched',
            wipIntroCiv6:
                'Every civilization is played out, across several maps and difficulty levels, before it gets ranked. The bulk of the work is done - the tiers still have to be settled.',
            wipIntroCiv7:
                'Civilization VII swaps civilization at every age, so the ranking will be made age by age. We are still gathering game data before the test games start.',
            wipResearch: 'Research',
            wipTierList: '{game} tier list',
            wipTurnsLeft: 'turns left',
            wipDone: 'Done',
            wipInProgress: 'Under way',
            wipPreviewLocked: 'Preview locked',
            wipPreviewSub: 'Unlocked on release · {turns} turns',
            wipBackToDefault: 'In the meantime, see the {game} tier list',
            backHome: 'Back to the tier list',
            backPrevious: 'Previous page',
            uniqueElements: 'Unique elements',
            tabUnits: 'Units',
            tabBuildings: 'Buildings',
            tabImprovements: 'Improvements',
            uniqueUnit: 'Unique unit',
            uniqueBuilding: 'Unique building',
            tileImprovement: 'Tile improvement',
            statProduction: 'Production',
            statMovement: 'Movement',
            statTechnology: 'Technology',
            statCost: 'Cost',
            statUpkeep: 'Upkeep',
            goldPerTurn: 'gold / turn',
            yieldsLabel: 'Yields',
            terrainsLabel: 'Terrains · resources',
            strategyTips: 'Strategy and tips',
            yieldFood: 'Food',
            yieldGold: 'Gold',
            yieldHappiness: 'Happiness',
        },
        tags: ['Versatile', 'Culture', 'Faith', 'Science', 'Military', 'Trade', 'Production'],
        wipStages: [
            { key: 'Gathering', label: 'Game data' },
            { key: 'Testing', label: 'Test games' },
            { key: 'Ranking', label: 'Tier assignment' },
            { key: 'Release', label: 'Tier list online' },
        ],
        homeGames: [
            {
                era: 'Antiquity',
                line: 'One tile, one unit. The competitive classic, Brave New World included.',
            },
            {
                era: 'Middle Ages',
                line: 'Districts, governors and cities that spill over the map.',
            },
            {
                era: 'Modern era',
                line: 'Three ages, free leaders and civilizations that follow one another.',
            },
        ],
        tiers: [
            { label: 'Tier S', rank: 'Legend', sub: 'Dominant — viable in every situation' },
            { label: 'Tier A', rank: 'Empire', sub: 'Very strong — excellent in their niche' },
            { label: 'Tier B', rank: 'Kingdom', sub: 'Solid — require a little more mastery' },
            { label: 'Tier C', rank: 'City', sub: 'Situational — depend on the map' },
            {
                label: 'Tier D',
                rank: 'Tribe',
                sub: 'Behind the curve — best reserved for challenges',
            },
        ],
    },
    de: {
        ui: {
            ranking: 'Rangliste',
            civilizations: 'Zivilisationen',
            heroTitle: 'Welche Zivilisation spielen?',
            filters: 'Zivilisationsfilter',
            search: 'Zivilisation suchen',
            categories: 'Kategorien',
            all: 'Alle',
            results: 'Ergebnisse',
            byTier: 'Nach Tier',
            alphabetical: 'Alphabetisch',
            noResults: 'Keine Zivilisation entspricht diesen Filtern.',
            reset: 'Filter zurücksetzen',
            details: 'Zivilisationsdetails',
            previous: 'Zurück',
            next: 'Weiter',
            close: 'Schließen',
            bonus: 'Zivilisationsbonus',
            leader: 'Anführer',
            uniqueUnits: 'Einzigartige Einheiten',
            uniqueBuildings: 'Einzigartige Gebäude',
            history: 'Geschichte',
            loading: 'Zivilisationen werden geladen…',
            loadError: 'Zivilisationen konnten nicht geladen werden.',
            retry: 'Erneut versuchen',
            tagline: 'Tier-Liste · Aktuelle Meta',
            language: 'Sprache',
            tiers: 'Stufen',
            openDetails: 'Details zu {name} öffnen',
            games: 'Spiele',
            comingSoon: 'Demnächst verfügbar',
            filtersButton: 'Filter',
            category: 'Kategorie',
            categoryHint: '+ einschließen (mindestens eine) · − ausschließen',
            tier: 'Tier',
            tierHint: 'Mehrfachauswahl',
            resetShort: 'Zurücksetzen',
            showResults: '{count} anzeigen',
            include: 'Einschließen',
            exclude: 'Ausschließen',
            clearAll: 'Alle entfernen',
            result: 'Ergebnis',
            alphabeticalShort: 'A → Z',
            removeFilter: '{name} entfernen',
            homeEyebrow: 'Drei Spiele · Eine Frage',
            homeTitle: 'Welche Ära',
            homeTitleAccent: 'wirst du beherrschen?',
            homeLede:
                'Zivilisations-Rankings, laufend an die Meta angepasst. Wähle dein Spiel, finde dein Volk, starte die Partie.',
            homeChooseGame: 'Spiel wählen',
            homeAvailable: 'Verfügbar',
            homeSoon: 'Bald',
            homeCtaAvailable: 'Tier-Liste ansehen',
            homeCtaSoon: 'In Arbeit',
            homeDisclaimer: 'Fanseite, nicht mit Firaxis oder 2K verbunden.',
            homeEraFlow: 'Atomzeitalter → Information',
            notFoundEyebrow: 'Fehler 404',
            notFoundTitle: 'Unerforschtes Land',
            notFoundText:
                'Diese Seite blieb im Nebel des Krieges. Der Link ist vielleicht defekt, oder dieses Feld hat auf der Karte nie existiert.',
            forbiddenTitle: 'Zugriff verweigert',
            forbiddenText: 'Du darfst diese Seite nicht sehen.',
            wipEyebrow: 'Recherche läuft',
            wipTitle: 'Diese Tier-Liste wird noch erforscht',
            wipIntroCiv6:
                'Jede Zivilisation wird auf mehreren Karten und Schwierigkeitsgraden gespielt, bevor sie eingeordnet wird. Der Großteil ist erledigt — die Tiers müssen noch entschieden werden.',
            wipIntroCiv7:
                'Civilization VII wechselt die Zivilisation in jedem Zeitalter, die Einordnung erfolgt also zeitalterweise. Wir sammeln noch Partiedaten, bevor die Testspiele beginnen.',
            wipResearch: 'Recherche',
            wipTierList: 'Tier-Liste {game}',
            wipTurnsLeft: 'Runden übrig',
            wipDone: 'Fertig',
            wipInProgress: 'Läuft',
            wipPreviewLocked: 'Vorschau gesperrt',
            wipPreviewSub: 'Frei zur Veröffentlichung · {turns} Runden',
            wipBackToDefault: 'Schau dir in der Zwischenzeit die Tier-Liste {game} an',
            backHome: 'Zurück zur Tier-Liste',
            backPrevious: 'Vorherige Seite',
            uniqueElements: 'Einzigartige Elemente',
            tabUnits: 'Einheiten',
            tabBuildings: 'Gebäude',
            tabImprovements: 'Verbesserungen',
            uniqueUnit: 'Einzigartige Einheit',
            uniqueBuilding: 'Einzigartiges Gebäude',
            tileImprovement: 'Geländeverbesserung',
            statProduction: 'Produktion',
            statMovement: 'Bewegung',
            statTechnology: 'Technologie',
            statCost: 'Kosten',
            statUpkeep: 'Unterhalt',
            goldPerTurn: 'Gold / Runde',
            yieldsLabel: 'Erträge',
            terrainsLabel: 'Gelände · Ressourcen',
            strategyTips: 'Strategie und Tipps',
            yieldFood: 'Nahrung',
            yieldGold: 'Gold',
            yieldHappiness: 'Zufriedenheit',
        },
        tags: ['Vielseitig', 'Kultur', 'Glaube', 'Wissenschaft', 'Militär', 'Handel', 'Produktion'],
        wipStages: [
            { key: 'Erhebung', label: 'Partiedaten' },
            { key: 'Tests', label: 'Testpartien' },
            { key: 'Einordnung', label: 'Tier-Zuweisung' },
            { key: 'Veröffentlichung', label: 'Tier-Liste online' },
        ],
        homeGames: [
            {
                era: 'Antike',
                line: 'Ein Feld, eine Einheit. Der kompetitive Klassiker, inklusive Brave New World.',
            },
            {
                era: 'Mittelalter',
                line: 'Bezirke, Gouverneure und Städte, die über die Karte wachsen.',
            },
            {
                era: 'Moderne',
                line: 'Drei Zeitalter, freie Anführer und Zivilisationen, die einander folgen.',
            },
        ],
        tiers: [
            { label: 'Tier S', rank: 'Legende', sub: 'Dominant — in jeder Situation spielbar' },
            { label: 'Tier A', rank: 'Imperium', sub: 'Sehr stark — in ihrer Nische hervorragend' },
            { label: 'Tier B', rank: 'Königreich', sub: 'Solide — erfordern etwas mehr Erfahrung' },
            { label: 'Tier C', rank: 'Stadt', sub: 'Situativ — von der Karte abhängig' },
            { label: 'Tier D', rank: 'Stamm', sub: 'Schwächer — besser für Herausforderungen' },
        ],
    },
    es: {
        ui: {
            ranking: 'Clasificación',
            civilizations: 'civilizaciones',
            heroTitle: '¿Qué civilización jugar?',
            filters: 'Filtros de civilización',
            search: 'Buscar una civilización',
            categories: 'Categorías',
            all: 'Todas',
            results: 'resultados',
            byTier: 'Por tier',
            alphabetical: 'Alfabético',
            noResults: 'Ninguna civilización coincide con estos filtros.',
            reset: 'Restablecer filtros',
            details: 'Detalles de la civilización',
            previous: 'Anterior',
            next: 'Siguiente',
            close: 'Cerrar',
            bonus: 'Bonificación de civilización',
            leader: 'Líder',
            uniqueUnits: 'Unidades únicas',
            uniqueBuildings: 'Edificios únicos',
            history: 'Historia',
            loading: 'Cargando civilizaciones…',
            loadError: 'No se pudieron cargar las civilizaciones.',
            retry: 'Reintentar',
            tagline: 'Tier list · Meta actual',
            language: 'Idioma',
            tiers: 'Niveles',
            openDetails: 'Abrir los detalles de {name}',
            games: 'Juegos',
            comingSoon: 'Próximamente',
            filtersButton: 'Filtros',
            category: 'Categoría',
            categoryHint: '+ incluir (al menos una) · − excluir',
            tier: 'Tier',
            tierHint: 'Selección múltiple',
            resetShort: 'Restablecer',
            showResults: 'Ver {count}',
            include: 'Incluir',
            exclude: 'Excluir',
            clearAll: 'Borrar todo',
            result: 'resultado',
            alphabeticalShort: 'A → Z',
            removeFilter: 'Quitar {name}',
            homeEyebrow: 'Tres juegos · Una pregunta',
            homeTitle: '¿Qué era',
            homeTitleAccent: 'vas a dominar?',
            homeLede:
                'Clasificaciones de civilizaciones al día con la meta. Elige tu juego, encuentra tu pueblo, empieza la partida.',
            homeChooseGame: 'Elegir un juego',
            homeAvailable: 'Disponible',
            homeSoon: 'Pronto',
            homeCtaAvailable: 'Ver la tier list',
            homeCtaSoon: 'En preparación',
            homeDisclaimer: 'Sitio de fans, sin afiliación con Firaxis ni 2K.',
            homeEraFlow: 'Era atómica → información',
            notFoundEyebrow: 'Error 404',
            notFoundTitle: 'Tierra inexplorada',
            notFoundText:
                'Esta página se quedó bajo la niebla de guerra. Puede que el enlace esté roto, o que esta casilla nunca existiera en el mapa.',
            forbiddenTitle: 'Acceso denegado',
            forbiddenText: 'No tienes permiso para ver esta página.',
            wipEyebrow: 'Investigación en curso',
            wipTitle: 'Esta tier list todavía se está investigando',
            wipIntroCiv6:
                'Cada civilización se juega en varios mapas y niveles de dificultad antes de clasificarla. El grueso del trabajo está hecho — faltan por decidir los tiers.',
            wipIntroCiv7:
                'Civilization VII cambia de civilización en cada era, así que la clasificación se hará era por era. Aún estamos reuniendo datos de partidas antes de las pruebas.',
            wipResearch: 'Investigación',
            wipTierList: 'Tier list {game}',
            wipTurnsLeft: 'turnos restantes',
            wipDone: 'Hecho',
            wipInProgress: 'En curso',
            wipPreviewLocked: 'Vista previa bloqueada',
            wipPreviewSub: 'Disponible al publicarse · {turns} turnos',
            wipBackToDefault: 'Mientras tanto, mira la tier list {game}',
            backHome: 'Volver a la tier list',
            backPrevious: 'Página anterior',
            uniqueElements: 'Elementos únicos',
            tabUnits: 'Unidades',
            tabBuildings: 'Edificios',
            tabImprovements: 'Mejoras',
            uniqueUnit: 'Unidad única',
            uniqueBuilding: 'Edificio único',
            tileImprovement: 'Mejora de casilla',
            statProduction: 'Producción',
            statMovement: 'Movimiento',
            statTechnology: 'Tecnología',
            statCost: 'Coste',
            statUpkeep: 'Mantenimiento',
            goldPerTurn: 'oro / turno',
            yieldsLabel: 'Rendimientos',
            terrainsLabel: 'Terrenos · recursos',
            strategyTips: 'Estrategia y consejos',
            yieldFood: 'Comida',
            yieldGold: 'Oro',
            yieldHappiness: 'Felicidad',
        },
        tags: ['Versátil', 'Cultura', 'Fe', 'Ciencia', 'Militar', 'Comercio', 'Producción'],
        wipStages: [
            { key: 'Recogida', label: 'Datos de partidas' },
            { key: 'Pruebas', label: 'Partidas de prueba' },
            { key: 'Clasificación', label: 'Asignación de tiers' },
            { key: 'Publicación', label: 'Tier list en línea' },
        ],
        homeGames: [
            {
                era: 'Antigüedad',
                line: 'Una casilla, una unidad. El clásico competitivo, con Brave New World.',
            },
            {
                era: 'Edad Media',
                line: 'Distritos, gobernadores y ciudades que se desbordan por el mapa.',
            },
            {
                era: 'Era moderna',
                line: 'Tres edades, líderes libres y civilizaciones que se suceden.',
            },
        ],
        tiers: [
            {
                label: 'Tier S',
                rank: 'Leyenda',
                sub: 'Dominantes — viables en cualquier situación',
            },
            {
                label: 'Tier A',
                rank: 'Imperio',
                sub: 'Muy fuertes — excelentes en su especialidad',
            },
            { label: 'Tier B', rank: 'Reino', sub: 'Sólidos — requieren algo más de dominio' },
            { label: 'Tier C', rank: 'Ciudad', sub: 'Situacionales — dependen del mapa' },
            { label: 'Tier D', rank: 'Tribu', sub: 'Rezagadas — mejor para desafíos' },
        ],
    },
    fr: {
        ui: {
            ranking: 'Classement',
            civilizations: 'civilisations',
            heroTitle: 'Quelle civilisation jouer ?',
            filters: 'Filtres des civilisations',
            search: 'Rechercher une civilisation',
            categories: 'Catégories',
            all: 'Toutes',
            results: 'résultats',
            byTier: 'Par tier',
            alphabetical: 'Alphabétique',
            noResults: 'Aucune civilisation ne correspond à ces filtres.',
            reset: 'Réinitialiser les filtres',
            details: 'Détails de la civilisation',
            previous: 'Précédente',
            next: 'Suivante',
            close: 'Fermer',
            bonus: 'Bonus de civilisation',
            leader: 'Dirigeant',
            uniqueUnits: 'Unités uniques',
            uniqueBuildings: 'Bâtiments uniques',
            history: 'Histoire',
            loading: 'Chargement des civilisations…',
            loadError: 'Impossible de charger les civilisations.',
            retry: 'Réessayer',
            tagline: 'Tier list · Méta actuelle',
            language: 'Langue',
            tiers: 'Tiers',
            openDetails: 'Ouvrir les détails de {name}',
            games: 'Jeux',
            comingSoon: 'Bientôt disponible',
            filtersButton: 'Filtres',
            category: 'Catégorie',
            categoryHint: '+ inclure (au moins une) · − exclure',
            tier: 'Tier',
            tierHint: 'Sélection multiple',
            resetShort: 'Réinitialiser',
            showResults: 'Voir {count}',
            include: 'Inclure',
            exclude: 'Exclure',
            clearAll: 'Tout effacer',
            result: 'résultat',
            alphabeticalShort: 'A → Z',
            removeFilter: 'Retirer {name}',
            homeEyebrow: 'Trois jeux · Une seule question',
            homeTitle: 'Quelle ère',
            homeTitleAccent: 'allez-vous dominer ?',
            homeLede:
                'Des classements de civilisations tenus à jour selon la méta. Choisissez votre jeu, trouvez votre peuple, lancez la partie.',
            homeChooseGame: 'Choisir un jeu',
            homeAvailable: 'Disponible',
            homeSoon: 'Bientôt',
            homeCtaAvailable: 'Voir la tier list',
            homeCtaSoon: 'En préparation',
            homeDisclaimer: 'Site de fans, non affilié à Firaxis ou 2K.',
            homeEraFlow: 'Ère atomique → information',
            notFoundEyebrow: 'Erreur 404',
            notFoundTitle: 'Terre inexplorée',
            notFoundText:
                "Cette page est restée sous le brouillard de guerre. Le lien est peut-être rompu, ou cette case n'a jamais existé sur la carte.",
            forbiddenTitle: 'Accès refusé',
            forbiddenText: "Vous n'avez pas le droit de voir cette page.",
            wipEyebrow: 'Recherche en cours',
            wipTitle: 'La tier list est encore en cours de recherche',
            wipIntroCiv6:
                "Chaque civilisation est testée en partie, sur plusieurs cartes et niveaux de difficulté, avant d'être classée. Le gros du travail est fait — reste à trancher les tiers.",
            wipIntroCiv7:
                "Civilization VII change de civilisation à chaque âge : le classement se fera âge par âge. On rassemble encore les données de parties avant d'attaquer les tests.",
            wipResearch: 'Recherche',
            wipTierList: 'Tier list {game}',
            wipTurnsLeft: 'tours restants',
            wipDone: 'Terminé',
            wipInProgress: 'En cours',
            wipPreviewLocked: 'Aperçu verrouillé',
            wipPreviewSub: 'Disponible à la publication · {turns} tours',
            wipBackToDefault: 'En attendant, voir la tier list {game}',
            backHome: 'Retour à la tier list',
            backPrevious: 'Page précédente',
            uniqueElements: 'Éléments uniques',
            tabUnits: 'Unités',
            tabBuildings: 'Bâtiments',
            tabImprovements: 'Améliorations',
            uniqueUnit: 'Unité unique',
            uniqueBuilding: 'Bâtiment unique',
            tileImprovement: 'Amélioration de case',
            statProduction: 'Production',
            statMovement: 'Mouvement',
            statTechnology: 'Technologie',
            statCost: 'Coût',
            statUpkeep: 'Entretien',
            goldPerTurn: 'or / tour',
            yieldsLabel: 'Rendements',
            terrainsLabel: 'Terrains · ressources',
            strategyTips: 'Stratégie et conseils',
            yieldFood: 'Nourriture',
            yieldGold: 'Or',
            yieldHappiness: 'Bonheur',
        },
        tags: ['Polyvalent', 'Culture', 'Foi', 'Science', 'Militaire', 'Commerce', 'Production'],
        wipStages: [
            { key: 'Collecte', label: 'Données de parties' },
            { key: 'Tests', label: 'Parties de test' },
            { key: 'Classement', label: 'Attribution des tiers' },
            { key: 'Publication', label: 'Tier list en ligne' },
        ],
        homeGames: [
            {
                era: 'Antiquité',
                line: 'Une case, une unité. Le classique compétitif, Brave New World inclus.',
            },
            {
                era: 'Moyen Âge',
                line: 'Districts, gouverneurs et cités qui débordent sur la carte.',
            },
            {
                era: 'Ère moderne',
                line: 'Trois âges, des dirigeants libres et des civilisations qui se succèdent.',
            },
        ],
        tiers: [
            {
                label: 'Tier S',
                rank: 'Légende',
                sub: 'Dominantes — viables dans toutes les situations',
            },
            { label: 'Tier A', rank: 'Empire', sub: 'Très fortes — excellentes dans leur créneau' },
            {
                label: 'Tier B',
                rank: 'Royaume',
                sub: 'Solides — demandent un peu plus de maîtrise',
            },
            { label: 'Tier C', rank: 'Cité', sub: 'Situationnelles — dépendent de la carte' },
            { label: 'Tier D', rank: 'Tribu', sub: 'En retrait — à réserver aux défis' },
        ],
    },
    it: {
        ui: {
            ranking: 'Classifica',
            civilizations: 'civiltà',
            heroTitle: 'Quale civiltà giocare?',
            filters: 'Filtri delle civiltà',
            search: 'Cerca una civiltà',
            categories: 'Categorie',
            all: 'Tutte',
            results: 'risultati',
            byTier: 'Per tier',
            alphabetical: 'Alfabetico',
            noResults: 'Nessuna civiltà corrisponde a questi filtri.',
            reset: 'Reimposta filtri',
            details: 'Dettagli della civiltà',
            previous: 'Precedente',
            next: 'Successiva',
            close: 'Chiudi',
            bonus: 'Bonus della civiltà',
            leader: 'Leader',
            uniqueUnits: 'Unità uniche',
            uniqueBuildings: 'Edifici unici',
            history: 'Storia',
            loading: 'Caricamento delle civiltà…',
            loadError: 'Impossibile caricare le civiltà.',
            retry: 'Riprova',
            tagline: 'Tier list · Meta attuale',
            language: 'Lingua',
            tiers: 'Livelli',
            openDetails: 'Apri i dettagli di {name}',
            games: 'Giochi',
            comingSoon: 'Prossimamente',
            filtersButton: 'Filtri',
            category: 'Categoria',
            categoryHint: '+ includi (almeno una) · − escludi',
            tier: 'Tier',
            tierHint: 'Selezione multipla',
            resetShort: 'Reimposta',
            showResults: 'Mostra {count}',
            include: 'Includi',
            exclude: 'Escludi',
            clearAll: 'Cancella tutto',
            result: 'risultato',
            alphabeticalShort: 'A → Z',
            removeFilter: 'Rimuovi {name}',
            homeEyebrow: 'Tre giochi · Una sola domanda',
            homeTitle: 'Quale era',
            homeTitleAccent: 'dominerai?',
            homeLede:
                'Classifiche di civiltà aggiornate secondo il meta. Scegli il gioco, trova il tuo popolo, inizia la partita.',
            homeChooseGame: 'Scegli un gioco',
            homeAvailable: 'Disponibile',
            homeSoon: 'Presto',
            homeCtaAvailable: 'Vedi la tier list',
            homeCtaSoon: 'In preparazione',
            homeDisclaimer: 'Sito di fan, non affiliato a Firaxis o 2K.',
            homeEraFlow: 'Era atomica → informazione',
            notFoundEyebrow: 'Errore 404',
            notFoundTitle: 'Terra inesplorata',
            notFoundText:
                'Questa pagina è rimasta sotto la nebbia di guerra. Il link potrebbe essere rotto, o questa casella non è mai esistita sulla mappa.',
            forbiddenTitle: 'Accesso negato',
            forbiddenText: 'Non hai il permesso di vedere questa pagina.',
            wipEyebrow: 'Ricerca in corso',
            wipTitle: 'Questa tier list è ancora in fase di ricerca',
            wipIntroCiv6:
                'Ogni civiltà viene giocata su più mappe e livelli di difficoltà prima di essere classificata. Il grosso del lavoro è fatto — restano da decidere i tier.',
            wipIntroCiv7:
                'Civilization VII cambia civiltà a ogni era, quindi la classifica sarà fatta era per era. Stiamo ancora raccogliendo dati di partita prima dei test.',
            wipResearch: 'Ricerca',
            wipTierList: 'Tier list {game}',
            wipTurnsLeft: 'turni rimasti',
            wipDone: 'Completato',
            wipInProgress: 'In corso',
            wipPreviewLocked: 'Anteprima bloccata',
            wipPreviewSub: 'Disponibile alla pubblicazione · {turns} turni',
            wipBackToDefault: 'Nell’attesa, guarda la tier list {game}',
            backHome: 'Torna alla tier list',
            backPrevious: 'Pagina precedente',
            uniqueElements: 'Elementi unici',
            tabUnits: 'Unità',
            tabBuildings: 'Edifici',
            tabImprovements: 'Miglioramenti',
            uniqueUnit: 'Unità unica',
            uniqueBuilding: 'Edificio unico',
            tileImprovement: 'Miglioramento della casella',
            statProduction: 'Produzione',
            statMovement: 'Movimento',
            statTechnology: 'Tecnologia',
            statCost: 'Costo',
            statUpkeep: 'Manutenzione',
            goldPerTurn: 'oro / turno',
            yieldsLabel: 'Rendimenti',
            terrainsLabel: 'Terreni · risorse',
            strategyTips: 'Strategia e consigli',
            yieldFood: 'Cibo',
            yieldGold: 'Oro',
            yieldHappiness: 'Felicità',
        },
        tags: ['Versatile', 'Cultura', 'Fede', 'Scienza', 'Militare', 'Commercio', 'Produzione'],
        wipStages: [
            { key: 'Raccolta', label: 'Dati di partita' },
            { key: 'Test', label: 'Partite di prova' },
            { key: 'Classifica', label: 'Assegnazione dei tier' },
            { key: 'Pubblicazione', label: 'Tier list online' },
        ],
        homeGames: [
            {
                era: 'Antichità',
                line: 'Una casella, una unità. Il classico competitivo, Brave New World incluso.',
            },
            {
                era: 'Medioevo',
                line: 'Distretti, governatori e città che si allargano sulla mappa.',
            },
            { era: 'Era moderna', line: 'Tre ere, leader liberi e civiltà che si susseguono.' },
        ],
        tiers: [
            { label: 'Tier S', rank: 'Leggenda', sub: 'Dominanti — valide in ogni situazione' },
            { label: 'Tier A', rank: 'Impero', sub: 'Molto forti — eccellenti nella loro nicchia' },
            { label: 'Tier B', rank: 'Regno', sub: 'Solide — richiedono un po’ più di padronanza' },
            { label: 'Tier C', rank: 'Città', sub: 'Situazionali — dipendono dalla mappa' },
            { label: 'Tier D', rank: 'Tribù', sub: 'Meno efficaci — adatte alle sfide' },
        ],
    },
    jp: {
        ui: {
            ranking: 'ランキング',
            civilizations: '文明',
            heroTitle: 'どの文明でプレイしますか？',
            filters: '文明フィルター',
            search: '文明を検索',
            categories: 'カテゴリー',
            all: 'すべて',
            results: '件',
            byTier: 'ティア別',
            alphabetical: 'アルファベット順',
            noResults: 'このフィルターに一致する文明はありません。',
            reset: 'フィルターをリセット',
            details: '文明の詳細',
            previous: '前へ',
            next: '次へ',
            close: '閉じる',
            bonus: '文明ボーナス',
            leader: '指導者',
            uniqueUnits: '固有ユニット',
            uniqueBuildings: '固有建造物',
            history: '歴史',
            loading: '文明を読み込み中…',
            loadError: '文明を読み込めませんでした。',
            retry: '再試行',
            tagline: 'ティアリスト · 現在のメタ',
            language: '言語',
            tiers: 'ティア',
            openDetails: '{name}の詳細を開く',
            games: 'ゲーム',
            comingSoon: '近日公開',
            filtersButton: 'フィルター',
            category: 'カテゴリー',
            categoryHint: '+ 含める（いずれか） · − 除外',
            tier: 'ティア',
            tierHint: '複数選択可',
            resetShort: 'リセット',
            showResults: '{count}を表示',
            include: '含める',
            exclude: '除外',
            clearAll: 'すべてクリア',
            result: '件',
            alphabeticalShort: 'A → Z',
            removeFilter: '{name}を解除',
            homeEyebrow: '3つのゲーム · ただ一つの問い',
            homeTitle: 'どの時代を',
            homeTitleAccent: '歯する？',
            homeLede:
                'メタに合わせて更新される文明ランク。ゲームを選んで、民を見つけて、対局を始めましょう。',
            homeChooseGame: 'ゲームを選ぶ',
            homeAvailable: '公開中',
            homeSoon: '準備中',
            homeCtaAvailable: 'ティアリストを見る',
            homeCtaSoon: '制作中',
            homeDisclaimer: 'ファンサイトです。Firaxis および 2K との関係はありません。',
            homeEraFlow: '原子力時代 → 情報',
            notFoundEyebrow: 'エラー 404',
            notFoundTitle: '未探索の大地',
            notFoundText:
                'このページは戦争の霧の下に残っています。リンクが切れているか、このタイルは地図上に存在しなかったのかもしれません。',
            forbiddenTitle: 'アクセスが拒否されました',
            forbiddenText: 'このページを閲覧する権限がありません。',
            wipEyebrow: 'リサーチ進行中',
            wipTitle: 'このティアリストはまだリサーチ中です',
            wipIntroCiv6:
                '各文明は複数のマップと隣易度で実際にプレイしてから格付けしています。大部分は終わり、あとはティアを決めるだけです。',
            wipIntroCiv7:
                'Civilization VII は時代ごとに文明が変わるため、格付けも時代ごとに行います。テストプレイの前に、まだ対戦データを集めています。',
            wipResearch: 'リサーチ',
            wipTierList: '{game} ティアリスト',
            wipTurnsLeft: 'ターン残り',
            wipDone: '完了',
            wipInProgress: '進行中',
            wipPreviewLocked: 'プレビューはロック中',
            wipPreviewSub: '公開時に解除 · {turns} ターン',
            wipBackToDefault: 'それまでは {game} のティアリストをどうぞ',
            backHome: 'ティアリストに戻る',
            backPrevious: '前のページ',
            uniqueElements: '固有の要素',
            tabUnits: 'ユニット',
            tabBuildings: '建造物',
            tabImprovements: '改善',
            uniqueUnit: '固有ユニット',
            uniqueBuilding: '固有建造物',
            tileImprovement: 'タイル改善',
            statProduction: '生産',
            statMovement: '移動',
            statTechnology: 'テクノロジー',
            statCost: 'コスト',
            statUpkeep: '維持費',
            goldPerTurn: 'ゴールド / ターン',
            yieldsLabel: '産出',
            terrainsLabel: '地形 · 資源',
            strategyTips: '戦略とヒント',
            yieldFood: '食料',
            yieldGold: 'ゴールド',
            yieldHappiness: '幸福',
        },
        tags: ['多用途', '文化', '信仰', '科学', '軍事', '貿易', '生産'],
        wipStages: [
            { key: '収集', label: '対戦データ' },
            { key: 'テスト', label: 'テストプレイ' },
            { key: '格付け', label: 'ティアの割り当て' },
            { key: '公開', label: 'ティアリスト公開' },
        ],
        homeGames: [
            { era: '古代', line: '1タイル1ユニット。Brave New World を含む競技的な定番。' },
            { era: '中世', line: '区画、総督、そしてマップに広がる都市。' },
            { era: '近代', line: '3つの時代、自由な指導者、そして入れ替わる文明。' },
        ],
        tiers: [
            { label: 'ティアS', rank: '伝説', sub: '支配的 — あらゆる状況で活躍' },
            { label: 'ティアA', rank: '帝国', sub: '非常に強力 — 得意分野で優秀' },
            { label: 'ティアB', rank: '王国', sub: '堅実 — 少し高い習熟が必要' },
            { label: 'ティアC', rank: '都市', sub: '状況次第 — マップに依存' },
            { label: 'ティアD', rank: '部族', sub: '控えめ — 挑戦向け' },
        ],
    },
    kr: {
        ui: {
            ranking: '순위',
            civilizations: '문명',
            heroTitle: '어떤 문명을 플레이할까요?',
            filters: '문명 필터',
            search: '문명 검색',
            categories: '카테고리',
            all: '전체',
            results: '개 결과',
            byTier: '티어별',
            alphabetical: '가나다순',
            noResults: '이 필터와 일치하는 문명이 없습니다.',
            reset: '필터 초기화',
            details: '문명 상세',
            previous: '이전',
            next: '다음',
            close: '닫기',
            bonus: '문명 보너스',
            leader: '지도자',
            uniqueUnits: '고유 유닛',
            uniqueBuildings: '고유 건물',
            history: '역사',
            loading: '문명을 불러오는 중…',
            loadError: '문명을 불러올 수 없습니다.',
            retry: '다시 시도',
            tagline: '티어 리스트 · 현재 메타',
            language: '언어',
            tiers: '티어',
            openDetails: '{name} 상세 정보 열기',
            games: '게임',
            comingSoon: '출시 예정',
            filtersButton: '필터',
            category: '카테고리',
            categoryHint: '+ 포함 (하나 이상) · − 제외',
            tier: '티어',
            tierHint: '복수 선택',
            resetShort: '초기화',
            showResults: '{count} 보기',
            include: '포함',
            exclude: '제외',
            clearAll: '모두 지우기',
            result: '개 결과',
            alphabeticalShort: '가나다순',
            removeFilter: '{name} 제거',
            homeEyebrow: '세 게임 · 하나의 질문',
            homeTitle: '어떤 시대를',
            homeTitleAccent: '지배하시것에요?',
            homeLede:
                '메타에 맞춰 갱습되는 문업 순위. 게임을 고르고, 문업을 짝고, 대전을 시작하세요.',
            homeChooseGame: '게임 선택',
            homeAvailable: '제공 중',
            homeSoon: '준버 중',
            homeCtaAvailable: '티어 리스트 보기',
            homeCtaSoon: '제작 중',
            homeDisclaimer: '팬 사이트이며 Firaxis 또는 2K와 관련이 없습니다.',
            homeEraFlow: '원자력 시대 → 정보',
            notFoundEyebrow: '에러 404',
            notFoundTitle: '미개추 지역',
            notFoundText:
                '이 페이지는 전쟁의 안개 속에 남아 있습니다. 링크가 끊여진 거나, 이 타일은 지도에 없었을 수도 있습니다.',
            forbiddenTitle: '접근이 거부되었습니다',
            forbiddenText: '이 페이지를 볼 권한이 없습니다.',
            wipEyebrow: '조사 진행 중',
            wipTitle: '이 티어 리스트는 아직 조사 중입니다',
            wipIntroCiv6:
                '모든 문을 여러 맵과 난이도에서 직접 플레이한 뒤에 등급을 매깁니다. 대부분의 작업은 끝났고, 티어만 확정하면 됩니다.',
            wipIntroCiv7:
                'Civilization VII은 시대마다 문이 바뀝및로 등급도 시대별로 매깁니다. 테스트 플레이에 앞서 아직 대전 데이테를 모으는 중입니다.',
            wipResearch: '조사',
            wipTierList: '{game} 티어 리스트',
            wipTurnsLeft: '턴 남음',
            wipDone: '완료',
            wipInProgress: '진행 중',
            wipPreviewLocked: '미리보기 잠김',
            wipPreviewSub: '공개 시 해제 · {turns}턴',
            wipBackToDefault: '그동안 {game} 티어 리스트를 보세요',
            backHome: '티어 리스트로 돌아가기',
            backPrevious: '이전 페이지',
            uniqueElements: '고유 요소',
            tabUnits: '유닛',
            tabBuildings: '건물',
            tabImprovements: '시설',
            uniqueUnit: '고유 유닛',
            uniqueBuilding: '고유 건물',
            tileImprovement: '타일 시설',
            statProduction: '생산',
            statMovement: '이동',
            statTechnology: '기술',
            statCost: '비용',
            statUpkeep: '유지비',
            goldPerTurn: '골드 / 턴',
            yieldsLabel: '산출량',
            terrainsLabel: '지형 · 자원',
            strategyTips: '전략과 조언',
            yieldFood: '식량',
            yieldGold: '골드',
            yieldHappiness: '행복',
        },
        tags: ['변하기 쉬운', '문화', '신앙', '과학', '군사', '무역', '생산'],
        wipStages: [
            { key: '수집', label: '대전 데이테' },
            { key: '테스트', label: '테스트 플레이' },
            { key: '등급', label: '티어 배정' },
            { key: '공개', label: '티어 리스트 공개' },
        ],
        homeGames: [
            { era: '고대', line: '한 칸에 한 유니읏. Brave New World를 포함한 경쟁의 정석.' },
            { era: '중세', line: '구역과 총독, 그리고 지도로 펼지는 도시.' },
            { era: '근대', line: '세 시대, 자유로운 지도자, 그리고 이어지는 문업.' },
        ],
        tiers: [
            { label: '티어 S', rank: '전설', sub: '압도적 — 어떤 상황에서도 강력합니다' },
            { label: '티어 A', rank: '제국', sub: '매우 강력함 — 특화 분야에서 뛰어납니다' },
            { label: '티어 B', rank: '왕국', sub: '탄탄함 — 약간의 숙련이 필요합니다' },
            { label: '티어 C', rank: '도시', sub: '상황 의존적 — 지도에 따라 달라집니다' },
            { label: '티어 D', rank: '부족', sub: '다소 약함 — 도전용으로 적합합니다' },
        ],
    },
    pl: {
        ui: {
            ranking: 'Ranking',
            civilizations: 'cywilizacje',
            heroTitle: 'Którą cywilizacją zagrać?',
            filters: 'Filtry cywilizacji',
            search: 'Szukaj cywilizacji',
            categories: 'Kategorie',
            all: 'Wszystkie',
            results: 'wyniki',
            byTier: 'Według tieru',
            alphabetical: 'Alfabetycznie',
            noResults: 'Żadna cywilizacja nie pasuje do filtrów.',
            reset: 'Wyczyść filtry',
            details: 'Szczegóły cywilizacji',
            previous: 'Poprzednia',
            next: 'Następna',
            close: 'Zamknij',
            bonus: 'Bonus cywilizacji',
            leader: 'Przywódca',
            uniqueUnits: 'Unikalne jednostki',
            uniqueBuildings: 'Unikalne budynki',
            history: 'Historia',
            loading: 'Wczytywanie cywilizacji…',
            loadError: 'Nie udało się wczytać cywilizacji.',
            retry: 'Spróbuj ponownie',
            tagline: 'Tier lista · Aktualna meta',
            language: 'Język',
            tiers: 'Poziomy',
            openDetails: 'Otwórz szczegóły: {name}',
            games: 'Gry',
            comingSoon: 'Wkrótce dostępne',
            filtersButton: 'Filtry',
            category: 'Kategoria',
            categoryHint: '+ uwzględnij (co najmniej jedną) · − wyklucz',
            tier: 'Tier',
            tierHint: 'Wielokrotny wybór',
            resetShort: 'Wyczyść',
            showResults: 'Pokaż {count}',
            include: 'Uwzględnij',
            exclude: 'Wyklucz',
            clearAll: 'Wyczyść wszystko',
            result: 'wynik',
            alphabeticalShort: 'A → Z',
            removeFilter: 'Usuń: {name}',
            homeEyebrow: 'Trzy gry · Jedno pytanie',
            homeTitle: 'Którą erę',
            homeTitleAccent: 'zdominujesz?',
            homeLede:
                'Rankingi cywilizacji aktualizowane wraz z metą. Wybierz grę, znajdź swój lud, rozpocznij rozgrywkę.',
            homeChooseGame: 'Wybierz grę',
            homeAvailable: 'Dostępne',
            homeSoon: 'Wkrótce',
            homeCtaAvailable: 'Zobacz tier listę',
            homeCtaSoon: 'W przygotowaniu',
            homeDisclaimer: 'Strona fanów, niezwiązana z Firaxis ani 2K.',
            homeEraFlow: 'Era atomowa → informacja',
            notFoundEyebrow: 'Błąd 404',
            notFoundTitle: 'Niezbadana ziemia',
            notFoundText:
                'Ta strona pozostała we mgle wojny. Link może być zepsuty albo to pole nigdy nie istniało na mapie.',
            forbiddenTitle: 'Brak dostępu',
            forbiddenText: 'Nie masz uprawnień, aby zobaczyć tę stronę.',
            wipEyebrow: 'Badania w toku',
            wipTitle: 'Ta tier lista jest jeszcze badana',
            wipIntroCiv6:
                'Każda cywilizacja jest rozgrywana na kilku mapach i poziomach trudności, zanim trafi do rankingu. Większość pracy jest za nami — zostaje ustalić tiery.',
            wipIntroCiv7:
                'Civilization VII zmienia cywilizację w każdej epoce, więc ranking powstanie epoka po epoce. Wciąż zbieramy dane z rozgrywek przed testami.',
            wipResearch: 'Badania',
            wipTierList: 'Tier lista {game}',
            wipTurnsLeft: 'tur pozostało',
            wipDone: 'Gotowe',
            wipInProgress: 'W toku',
            wipPreviewLocked: 'Podgląd zablokowany',
            wipPreviewSub: 'Dostępne po publikacji · {turns} tur',
            wipBackToDefault: 'W międzyczasie zobacz tier listę {game}',
            backHome: 'Powrót do tier listy',
            backPrevious: 'Poprzednia strona',
            uniqueElements: 'Unikalne elementy',
            tabUnits: 'Jednostki',
            tabBuildings: 'Budynki',
            tabImprovements: 'Ulepszenia',
            uniqueUnit: 'Unikalna jednostka',
            uniqueBuilding: 'Unikalny budynek',
            tileImprovement: 'Ulepszenie pola',
            statProduction: 'Produkcja',
            statMovement: 'Ruch',
            statTechnology: 'Technologia',
            statCost: 'Koszt',
            statUpkeep: 'Utrzymanie',
            goldPerTurn: 'złota / turę',
            yieldsLabel: 'Plony',
            terrainsLabel: 'Tereny · surowce',
            strategyTips: 'Strategia i porady',
            yieldFood: 'Żywność',
            yieldGold: 'Złoto',
            yieldHappiness: 'Zadowolenie',
        },
        tags: ['Wszechstronny', 'Kultura', 'Wiara', 'Nauka', 'Wojskowy', 'Handel', 'Produkcja'],
        wipStages: [
            { key: 'Zbieranie', label: 'Dane z rozgrywek' },
            { key: 'Testy', label: 'Rozgrywki testowe' },
            { key: 'Ranking', label: 'Przypisanie tierów' },
            { key: 'Publikacja', label: 'Tier lista online' },
        ],
        homeGames: [
            {
                era: 'Starożytność',
                line: 'Jedno pole, jedna jednostka. Klasyk rozgrywki, z Brave New World.',
            },
            {
                era: 'Średniowiecze',
                line: 'Dzielnice, gubernatorzy i miasta rozlewające się po mapie.',
            },
            {
                era: 'Era nowoczesna',
                line: 'Trzy epoki, wolni przywódcy i cywilizacje następujące po sobie.',
            },
        ],
        tiers: [
            {
                label: 'Tier S',
                rank: 'Legenda',
                sub: 'Dominujące — sprawdzają się w każdej sytuacji',
            },
            { label: 'Tier A', rank: 'Imperium', sub: 'Bardzo silne — świetne w swojej niszy' },
            { label: 'Tier B', rank: 'Królestwo', sub: 'Solidne — wymagają nieco więcej wprawy' },
            { label: 'Tier C', rank: 'Miasto', sub: 'Sytuacyjne — zależne od mapy' },
            { label: 'Tier D', rank: 'Plemię', sub: 'Słabsze — dobre na wyzwania' },
        ],
    },
    ru: {
        ui: {
            ranking: 'Рейтинг',
            civilizations: 'цивилизации',
            heroTitle: 'За какую цивилизацию сыграть?',
            filters: 'Фильтры цивилизаций',
            search: 'Найти цивилизацию',
            categories: 'Категории',
            all: 'Все',
            results: 'результатов',
            byTier: 'По tier',
            alphabetical: 'По алфавиту',
            noResults: 'Нет цивилизаций, соответствующих фильтрам.',
            reset: 'Сбросить фильтры',
            details: 'Сведения о цивилизации',
            previous: 'Предыдущая',
            next: 'Следующая',
            close: 'Закрыть',
            bonus: 'Бонус цивилизации',
            leader: 'Лидер',
            uniqueUnits: 'Уникальные юниты',
            uniqueBuildings: 'Уникальные здания',
            history: 'История',
            loading: 'Загрузка цивилизаций…',
            loadError: 'Не удалось загрузить цивилизации.',
            retry: 'Повторить',
            tagline: 'Тир-лист · Текущая мета',
            language: 'Язык',
            tiers: 'Уровни',
            openDetails: 'Открыть сведения: {name}',
            games: 'Игры',
            comingSoon: 'Скоро',
            filtersButton: 'Фильтры',
            category: 'Категория',
            categoryHint: '+ включить (хотя бы одну) · − исключить',
            tier: 'Уровень',
            tierHint: 'Множественный выбор',
            resetShort: 'Сбросить',
            showResults: 'Показать: {count}',
            include: 'Включить',
            exclude: 'Исключить',
            clearAll: 'Очистить всё',
            result: 'результат',
            alphabeticalShort: 'А → Я',
            removeFilter: 'Убрать: {name}',
            homeEyebrow: 'Три игры · Один вопрос',
            homeTitle: 'Какую эпоху',
            homeTitleAccent: 'вы покорите?',
            homeLede:
                'Рейтинги цивилизаций, которые обновляются вслед за метой. Выберите игру, найдите свой народ, начните партию.',
            homeChooseGame: 'Выбрать игру',
            homeAvailable: 'Доступно',
            homeSoon: 'Скоро',
            homeCtaAvailable: 'Смотреть тир-лист',
            homeCtaSoon: 'В работе',
            homeDisclaimer: 'Фанатский сайт, не связан с Firaxis или 2K.',
            homeEraFlow: 'Атомная эра → информация',
            notFoundEyebrow: 'Ошибка 404',
            notFoundTitle: 'Неисследованная земля',
            notFoundText:
                'Эта страница осталась под туманом войны. Возможно, ссылка сломана, или этой клетки никогда не было на карте.',
            forbiddenTitle: 'Доступ запрещён',
            forbiddenText: 'У вас нет прав на просмотр этой страницы.',
            wipEyebrow: 'Идёт исследование',
            wipTitle: 'Этот тир-лист ещё исследуется',
            wipIntroCiv6:
                'Каждую цивилизацию отыгрывают на нескольких картах и уровнях сложности, прежде чем занести в рейтинг. Основная работа сделана — осталось определить тиры.',
            wipIntroCiv7:
                'В Civilization VII цивилизация меняется с каждой эпохой, поэтому рейтинг будет составлен по эпохам. Пока мы собираем данные партий перед тестами.',
            wipResearch: 'Исследование',
            wipTierList: 'Тир-лист {game}',
            wipTurnsLeft: 'ходов осталось',
            wipDone: 'Готово',
            wipInProgress: 'В работе',
            wipPreviewLocked: 'Предпросмотр закрыт',
            wipPreviewSub: 'Откроется с публикацией · {turns} ходов',
            wipBackToDefault: 'А пока посмотрите тир-лист {game}',
            backHome: 'Вернуться к тир-листу',
            backPrevious: 'Предыдущая страница',
            uniqueElements: 'Уникальные элементы',
            tabUnits: 'Юниты',
            tabBuildings: 'Здания',
            tabImprovements: 'Улучшения',
            uniqueUnit: 'Уникальный юнит',
            uniqueBuilding: 'Уникальное здание',
            tileImprovement: 'Улучшение клетки',
            statProduction: 'Производство',
            statMovement: 'Движение',
            statTechnology: 'Технология',
            statCost: 'Стоимость',
            statUpkeep: 'Содержание',
            goldPerTurn: 'золота / ход',
            yieldsLabel: 'Доход',
            terrainsLabel: 'Рельеф · ресурсы',
            strategyTips: 'Стратегия и советы',
            yieldFood: 'Еда',
            yieldGold: 'Золото',
            yieldHappiness: 'Довольство',
        },
        tags: ['Универсальный', 'Культура', 'Вера', 'Наука', 'Военный', 'Торговля', 'Производство'],
        wipStages: [
            { key: 'Сбор', label: 'Данные партий' },
            { key: 'Тесты', label: 'Тестовые партии' },
            { key: 'Рейтинг', label: 'Распределение тиров' },
            { key: 'Публикация', label: 'Тир-лист опубликован' },
        ],
        homeGames: [
            {
                era: 'Античность',
                line: 'Одна клетка — один юнит. Конкурентная классика с Brave New World.',
            },
            { era: 'Средние века', line: 'Районы, губернаторы и города, растекающиеся по карте.' },
            {
                era: 'Новое время',
                line: 'Три эпохи, свободные лидеры и цивилизации, сменяющие друг друга.',
            },
        ],
        tiers: [
            { label: 'Уровень S', rank: 'Легенда', sub: 'Доминируют — сильны в любой ситуации' },
            {
                label: 'Уровень A',
                rank: 'Империя',
                sub: 'Очень сильные — превосходны в своей нише',
            },
            {
                label: 'Уровень B',
                rank: 'Королевство',
                sub: 'Надёжные — требуют чуть больше мастерства',
            },
            { label: 'Уровень C', rank: 'Город', sub: 'Ситуативные — зависят от карты' },
            { label: 'Уровень D', rank: 'Племя', sub: 'Слабее — лучше оставить для испытаний' },
        ],
    },
    zh: {
        ui: {
            ranking: '排名',
            civilizations: '文明',
            heroTitle: '该选择哪个文明？',
            filters: '文明筛选',
            search: '搜索文明',
            categories: '类别',
            all: '全部',
            results: '个结果',
            byTier: '按等级',
            alphabetical: '按字母顺序',
            noResults: '没有文明符合这些筛选条件。',
            reset: '重置筛选',
            details: '文明详情',
            previous: '上一个',
            next: '下一个',
            close: '关闭',
            bonus: '文明加成',
            leader: '领袖',
            uniqueUnits: '特色单位',
            uniqueBuildings: '特色建筑',
            history: '历史',
            loading: '正在加载文明…',
            loadError: '无法加载文明。',
            retry: '重试',
            tagline: '强度榜 · 当前版本',
            language: '语言',
            tiers: '等级',
            openDetails: '打开{name}的详情',
            games: '游戏',
            comingSoon: '即将推出',
            filtersButton: '筛选',
            category: '类别',
            categoryHint: '+ 包含（至少一个） · − 排除',
            tier: '等级',
            tierHint: '可多选',
            resetShort: '重置',
            showResults: '查看{count}',
            include: '包含',
            exclude: '排除',
            clearAll: '全部清除',
            result: '个结果',
            alphabeticalShort: 'A → Z',
            removeFilter: '移除{name}',
            homeEyebrow: '三款游戏 · 一个问题',
            homeTitle: '你要统治',
            homeTitleAccent: '哪一个时代？',
            homeLede: '随版本环境更新的文明强度榜。选好游戏，找到你的民族，开局。',
            homeChooseGame: '选择游戏',
            homeAvailable: '已上线',
            homeSoon: '敬请期待',
            homeCtaAvailable: '查看强度榜',
            homeCtaSoon: '正在制作',
            homeDisclaimer: '粉丝网站，与 Firaxis 和 2K 无关。',
            homeEraFlow: '原子时代 → 信息',
            notFoundEyebrow: '错误 404',
            notFoundTitle: '未探索的土地',
            notFoundText: '这一页仍在战争迷难之下。可能是链接已失效，或这个格子从未存在于地图上。',
            forbiddenTitle: '访问被拒绝',
            forbiddenText: '你没有权限查看该页面。',
            wipEyebrow: '研究进行中',
            wipTitle: '该强度榜仍在研究中',
            wipIntroCiv6:
                '每个文明都会在多张地图和多个难度下实战之后才会评级。大部分工作已完成，只剩确定等级。',
            wipIntroCiv7:
                'Civilization VII 每个时代都会更换文明，因此评级将按时代进行。我们仍在收集对局数据，之后才开始测试。',
            wipResearch: '研究',
            wipTierList: '{game} 强度榜',
            wipTurnsLeft: '回合剩余',
            wipDone: '已完成',
            wipInProgress: '进行中',
            wipPreviewLocked: '预览已锁定',
            wipPreviewSub: '发布时解锁 · {turns} 回合',
            wipBackToDefault: '在此期间，先看看 {game} 强度榜',
            backHome: '返回强度榜',
            backPrevious: '上一页',
            uniqueElements: '专属元素',
            tabUnits: '单位',
            tabBuildings: '建筑',
            tabImprovements: '改良设施',
            uniqueUnit: '专属单位',
            uniqueBuilding: '专属建筑',
            tileImprovement: '地块改良',
            statProduction: '生产力',
            statMovement: '移动力',
            statTechnology: '科技',
            statCost: '花费',
            statUpkeep: '维护费',
            goldPerTurn: '金币 / 回合',
            yieldsLabel: '产出',
            terrainsLabel: '地形 · 资源',
            strategyTips: '策略与提示',
            yieldFood: '食物',
            yieldGold: '金币',
            yieldHappiness: '幸福度',
        },
        tags: ['多才多艺的', '文化', '信仰', '科学', '军事', '贸易', '生产'],
        wipStages: [
            { key: '收集', label: '对局数据' },
            { key: '测试', label: '测试对局' },
            { key: '评级', label: '分配等级' },
            { key: '发布', label: '强度榜上线' },
        ],
        homeGames: [
            { era: '远古', line: '一格一单位。含《丽丽新世界》的竞技经典。' },
            { era: '中世纪', line: '区域、总督，以及在地图上铺开的城市。' },
            { era: '近代', line: '三个时代、自由搭配的领袖，以及更替的文明。' },
        ],
        tiers: [
            { label: 'S级', rank: '传奇', sub: '统治级 — 适用于任何局面' },
            { label: 'A级', rank: '帝国', sub: '非常强大 — 在专长领域表现卓越' },
            { label: 'B级', rank: '王国', sub: '扎实 — 需要更多熟练度' },
            { label: 'C级', rank: '城邦', sub: '看情况 — 取决于地图' },
            { label: 'D级', rank: '部落', sub: '较弱 — 更适合挑战玩法' },
        ],
    },
};

// FUNCTIONS
// ##############
export function messages(lang: Lang): Messages {
    return MESSAGES[lang];
}
