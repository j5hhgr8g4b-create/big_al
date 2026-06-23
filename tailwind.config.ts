import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif']
      },
      colors: {
        butter: '#F8E7B4',
        gravy: '#4B3428',
        tomato: '#B84A39',
        sage: '#72816A',
        cream: '#FFF8EA'
      }
    }
  },
  plugins: []
};

export default config;
