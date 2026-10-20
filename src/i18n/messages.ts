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
        },
        tags: ['Versatile', 'Culture', 'Faith', 'Science', 'Military', 'Trade', 'Production'],
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
        },
        tags: ['Vielseitig', 'Kultur', 'Glaube', 'Wissenschaft', 'Militär', 'Handel', 'Produktion'],
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
        },
        tags: ['Versátil', 'Cultura', 'Fe', 'Ciencia', 'Militar', 'Comercio', 'Producción'],
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
        },
        tags: ['Polyvalent', 'Culture', 'Foi', 'Science', 'Militaire', 'Commerce', 'Production'],
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
        },
        tags: ['Versatile', 'Cultura', 'Fede', 'Scienza', 'Militare', 'Commercio', 'Produzione'],
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
        },
        tags: ['多用途', '文化', '信仰', '科学', '軍事', '貿易', '生産'],
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
        },
        tags: ['변하기 쉬운', '문화', '신앙', '과학', '군사', '무역', '생산'],
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
        },
        tags: ['Wszechstronny', 'Kultura', 'Wiara', 'Nauka', 'Wojskowy', 'Handel', 'Produkcja'],
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
        },
        tags: ['Универсальный', 'Культура', 'Вера', 'Наука', 'Военный', 'Торговля', 'Производство'],
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
        },
        tags: ['多才多艺的', '文化', '信仰', '科学', '军事', '贸易', '生产'],
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
