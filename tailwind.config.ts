import type { Config } from 'tailwindcss'

export default {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./nuxt.config.{js,ts}",
        "./app.vue"
    ],
    theme: {
        extend: {
            backgroundColor: {
                'dark-background': '#121212',
                'dark-surface': '#1E1E1E',
            },
            textColor: {
                'dark-primary': '#E0E0E0',
                'dark-secondary': '#A0A0A0'
            }
        },
    },
    plugins: [],
    darkMode: 'class'
} satisfies Config