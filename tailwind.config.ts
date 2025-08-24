import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
    darkMode: ["class"],
    content: ["./src/**/*.tsx"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ["'Geologica'", ...fontFamily.sans],
				disco: ["'Spectral'", ...fontFamily.serif],
  		},
			aspectRatio: {
				portrait: '18 / 25',
			},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
				intellect: '#5CC1D7',
				psyche: '#7556CF',
				physique: '#CB476A',
				motorics: '#E3B734',
				speech: '#CFD5BF',
			},
			backgroundImage: {
				frame: "url('/layout/frame.png')",
			},
  	},
  },
	safelist: [
		'text-intellect',
		'text-psyche',
		'text-physique',
		'text-motorics',
	],
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
