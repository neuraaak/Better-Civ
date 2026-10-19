<template>
    <span
        class="tier-badge"
        :class="`tier-${badge.key}`"
        :aria-label="badge.label"
        :title="badge.label"
    >
        <span class="tier-rim"></span>
        <span class="tier-face"></span>
        <span class="tier-letter">{{ badge.letter }}</span>
    </span>
</template>

<script setup>
    import { computed } from 'vue';

    const props = defineProps({
        tier_id: Number,
    });

    const badges = [
        { key: 's', letter: 'S', label: 'Tier S · Légende' },
        { key: 'a', letter: 'A', label: 'Tier A · Empire' },
        { key: 'b', letter: 'B', label: 'Tier B · Royaume' },
        { key: 'c', letter: 'C', label: 'Tier C · Cité' },
        { key: 'd', letter: 'D', label: 'Tier D · Tribu' },
    ];

    const badge = computed(() => badges[props.tier_id] || badges[4]);
</script>

<style scoped>
    .tier-badge {
        --tier-badge-size: 2.5rem;
        position: relative;
        display: inline-grid;
        width: var(--tier-badge-size);
        height: var(--tier-badge-size);
        place-items: center;
        vertical-align: middle;
        filter: var(--tier-glow, none);
    }

    .tier-rim,
    .tier-face {
        position: absolute;
        inset: 0;
        clip-path: var(--tier-shape);
    }

    .tier-rim {
        background: var(--tier-rim);
        animation: var(--tier-animation, none);
    }
    .tier-face {
        inset: var(--tier-inset);
        clip-path: var(--tier-face-shape, var(--tier-shape));
        background: var(--tier-face);
    }
    .tier-letter {
        position: relative;
        z-index: 1;
        padding-bottom: var(--tier-nudge, 0);
        color: var(--tier-foreground);
        font:
            700 calc(var(--tier-badge-size) * 0.47)/1 Inter,
            system-ui,
            sans-serif;
        text-shadow: 0 1px 2px rgb(0 0 0 / 60%);
    }

    .tier-d {
        --tier-shape: circle(50%);
        --tier-inset: 11%;
        --tier-rim: linear-gradient(
            150deg,
            oklch(0.76 0.08 62),
            oklch(0.5 0.08 45) 60%,
            oklch(0.4 0.06 40)
        );
        --tier-face: radial-gradient(circle at 35% 28%, oklch(0.54 0.08 52), oklch(0.3 0.05 40));
        --tier-foreground: oklch(0.93 0.04 70);
    }
    .tier-c {
        --tier-shape: polygon(50% 0, 100% 13%, 100% 58%, 50% 100%, 0 58%, 0 13%);
        --tier-inset: 10%;
        --tier-nudge: 10%;
        --tier-rim: linear-gradient(
            160deg,
            oklch(0.95 0.01 260),
            oklch(0.7 0.015 260) 50%,
            oklch(0.48 0.015 260)
        );
        --tier-face: linear-gradient(165deg, oklch(0.5 0.015 260), oklch(0.28 0.015 260));
        --tier-foreground: oklch(0.97 0.005 260);
        --tier-glow: drop-shadow(0 0 4px oklch(0.85 0.01 260 / 0.25));
    }
    .tier-b {
        --tier-shape: polygon(25% 4%, 75% 4%, 100% 50%, 75% 96%, 25% 96%, 0 50%);
        --tier-inset: 11%;
        --tier-rim: linear-gradient(
            150deg,
            oklch(0.95 0.09 95),
            oklch(0.78 0.13 82) 45%,
            oklch(0.52 0.1 65)
        );
        --tier-face: radial-gradient(circle at 40% 28%, oklch(0.5 0.09 75), oklch(0.27 0.05 60));
        --tier-foreground: oklch(0.96 0.06 95);
        --tier-glow: drop-shadow(0 0 6px oklch(0.8 0.13 85 / 0.4));
    }
    .tier-a {
        --tier-shape: polygon(
            50% 0,
            65% 14%,
            85% 8%,
            90% 29%,
            100% 50%,
            90% 71%,
            85% 92%,
            65% 86%,
            50% 100%,
            35% 86%,
            15% 92%,
            10% 71%,
            0 50%,
            10% 29%,
            15% 8%,
            35% 14%
        );
        --tier-face-shape: circle(50%);
        --tier-inset: 17%;
        --tier-rim: linear-gradient(150deg, #e7e5fe, #968ae0 50%, #423a6a);
        --tier-face: radial-gradient(circle at 40% 28%, #796cbf, #2b2741);
        --tier-foreground: #f5f4ff;
        --tier-glow: drop-shadow(0 0 8px rgb(145 132 217 / 0.6));
    }
    .tier-s {
        --tier-shape: polygon(
            50% 0,
            58% 9%,
            68% 3%,
            73% 14%,
            84% 9%,
            87% 21%,
            98% 20%,
            94% 31%,
            100% 39%,
            90% 47%,
            98% 56%,
            87% 60%,
            91% 72%,
            79% 72%,
            78% 85%,
            67% 80%,
            59% 92%,
            50% 83%,
            41% 92%,
            33% 80%,
            22% 85%,
            21% 72%,
            9% 72%,
            13% 60%,
            2% 56%,
            10% 47%,
            0 39%,
            6% 31%,
            2% 20%,
            13% 21%,
            16% 9%,
            27% 14%,
            32% 3%,
            42% 9%
        );
        --tier-face-shape: circle(50%);
        --tier-inset: 16%;
        --tier-rim: conic-gradient(
            from 0deg,
            oklch(0.8 0.14 20),
            oklch(0.84 0.13 85),
            oklch(0.8 0.14 155),
            oklch(0.78 0.13 230),
            oklch(0.74 0.15 300),
            oklch(0.8 0.14 20)
        );
        --tier-face:
            radial-gradient(circle at 50% 30%, oklch(1 0 0 / 0.22), transparent 55%),
            conic-gradient(
                from 200deg,
                oklch(0.4 0.1 20),
                oklch(0.4 0.1 140),
                oklch(0.36 0.11 270),
                oklch(0.4 0.1 20)
            );
        --tier-foreground: oklch(0.98 0.01 90);
        --tier-glow: drop-shadow(0 0 6px oklch(0.78 0.14 300 / 0.55))
            drop-shadow(0 0 12px oklch(0.82 0.13 85 / 0.3));
        --tier-animation: tier-prism-spin 14s linear infinite;
    }

    @keyframes tier-prism-spin {
        to {
            transform: rotate(360deg);
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .tier-rim {
            animation: none;
        }
    }
</style>
