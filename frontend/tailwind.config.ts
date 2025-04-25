import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animated'

/** @type {import('tailwindcss').Config} */

export default {
	content: [
		"./src/**/*.{html,ts,tsx,js,jsx}",
	],
	// safelist: [
	// 	"bg-blue-500",
	// 	"hover:bg-blue-400",
	// 	"text-white",
	// 	"font-bold",
	// 	"py-2",
	// 	"px-4",
	// 	"border-b-4",
	// 	"border-blue-700",
	// 	"hover:border-blue-500",
	// 	"rounded",
	// ],
	theme: {
		extend: {
			colors: {
				debug: '#FF0000',
			}
		}
	},
	plugins: [
		animate,
	],
} satisfies Config