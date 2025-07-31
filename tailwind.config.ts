import { type Config } from 'tailwindcss';

const config: Config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#4f46e5',
                secondary: '#ec4899',
                neutral: {
                    100: '#f5f5f5',
                    900: '#111111'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['var(--font-serif)', 'serif'],
                custom: ['var(--font-custom)', 'sans-serif'],
            },
            screens: {
                '2xl': '1600px'
            }
        }
    },
    plugins: []
};

export default config;