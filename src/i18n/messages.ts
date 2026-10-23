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
            notFoundTitle: 'Page not found',
            notFoundText: 'This page does not exist or has moved.',
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
        },
        tags: ['Versatile', 'Culture', 'Faith', 'Science', 'Military', 'Trade', 'Production'],
        wipStages: [
            { key: 'Gathering', label: 'Game data' },
            { key: 'Testing', label: 'Test games' },
            { key: 'Ranking', label: 'Tier assignment' },
            { key: 'Release', label: 'Tier list online' },
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
            notFoundTitle: 'Seite nicht gefunden',
            notFoundText: 'Diese Seite existiert nicht oder wurde verschoben.',
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
        },
        tags: ['Vielseitig', 'Kultur', 'Glaube', 'Wissenschaft', 'Militär', 'Handel', 'Produktion'],
        wipStages: [
            { key: 'Erhebung', label: 'Partiedaten' },
            { key: 'Tests', label: 'Testpartien' },
            { key: 'Einordnung', label: 'Tier-Zuweisung' },
            { key: 'Veröffentlichung', label: 'Tier-Liste online' },
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
            notFoundTitle: 'Página no encontrada',
            notFoundText: 'Esta página no existe o se ha movido.',
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
        },
        tags: ['Versátil', 'Cultura', 'Fe', 'Ciencia', 'Militar', 'Comercio', 'Producción'],
        wipStages: [
            { key: 'Recogida', label: 'Datos de partidas' },
            { key: 'Pruebas', label: 'Partidas de prueba' },
            { key: 'Clasificación', label: 'Asignación de tiers' },
            { key: 'Publicación', label: 'Tier list en línea' },
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
            notFoundTitle: 'Page introuvable',
            notFoundText: "Cette page n'existe pas ou a été déplacée.",
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
        },
        tags: ['Polyvalent', 'Culture', 'Foi', 'Science', 'Militaire', 'Commerce', 'Production'],
        wipStages: [
            { key: 'Collecte', label: 'Données de parties' },
            { key: 'Tests', label: 'Parties de test' },
            { key: 'Classement', label: 'Attribution des tiers' },
            { key: 'Publication', label: 'Tier list en ligne' },
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
            notFoundTitle: 'Pagina non trovata',
            notFoundText: 'Questa pagina non esiste o è stata spostata.',
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
        },
        tags: ['Versatile', 'Cultura', 'Fede', 'Scienza', 'Militare', 'Commercio', 'Produzione'],
        wipStages: [
            { key: 'Raccolta', label: 'Dati di partita' },
            { key: 'Test', label: 'Partite di prova' },
            { key: 'Classifica', label: 'Assegnazione dei tier' },
            { key: 'Pubblicazione', label: 'Tier list online' },
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
            notFoundTitle: 'ページが見つかりません',
            notFoundText: 'このページは存在しないか、移動されました。',
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
        },
        tags: ['多用途', '文化', '信仰', '科学', '軍事', '貿易', '生産'],
        wipStages: [
            { key: '収集', label: '対戦データ' },
            { key: 'テスト', label: 'テストプレイ' },
            { key: '格付け', label: 'ティアの割り当て' },
            { key: '公開', label: 'ティアリスト公開' },
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
            notFoundTitle: '페이지를 찾을 수 없습니다',
            notFoundText: '이 페이지는 존재하지 않거나 이동되었습니다.',
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
        },
        tags: ['변하기 쉬운', '문화', '신앙', '과학', '군사', '무역', '생산'],
        wipStages: [
            { key: '수집', label: '대전 데이테' },
            { key: '테스트', label: '테스트 플레이' },
            { key: '등급', label: '티어 배정' },
            { key: '공개', label: '티어 리스트 공개' },
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
            notFoundTitle: 'Strony nie znaleziono',
            notFoundText: 'Ta strona nie istnieje lub została przeniesiona.',
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
        },
        tags: ['Wszechstronny', 'Kultura', 'Wiara', 'Nauka', 'Wojskowy', 'Handel', 'Produkcja'],
        wipStages: [
            { key: 'Zbieranie', label: 'Dane z rozgrywek' },
            { key: 'Testy', label: 'Rozgrywki testowe' },
            { key: 'Ranking', label: 'Przypisanie tierów' },
            { key: 'Publikacja', label: 'Tier lista online' },
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
            notFoundTitle: 'Страница не найдена',
            notFoundText: 'Эта страница не существует или была перемещена.',
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
        },
        tags: ['Универсальный', 'Культура', 'Вера', 'Наука', 'Военный', 'Торговля', 'Производство'],
        wipStages: [
            { key: 'Сбор', label: 'Данные партий' },
            { key: 'Тесты', label: 'Тестовые партии' },
            { key: 'Рейтинг', label: 'Распределение тиров' },
            { key: 'Публикация', label: 'Тир-лист опубликован' },
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
            notFoundTitle: '页面未找到',
            notFoundText: '该页面不存在或已移动。',
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
        },
        tags: ['多才多艺的', '文化', '信仰', '科学', '军事', '贸易', '生产'],
        wipStages: [
            { key: '收集', label: '对局数据' },
            { key: '测试', label: '测试对局' },
            { key: '评级', label: '分配等级' },
            { key: '发布', label: '强度榜上线' },
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
