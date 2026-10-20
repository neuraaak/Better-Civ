import tailwindcss from '@tailwindcss/postcss';

// Tailwind 4 handles vendor prefixes (Lightning CSS) and Vite minifies the CSS bundle
export default {
    plugins: [tailwindcss],
};
