/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./src/**/*.{html,ts,tsx,js,jsx}",
	],
	safelist: [
		"bg-blue-500",
		"hover:bg-blue-400",
		"text-white",
		"font-bold",
		"py-2",
		"px-4",
		"border-b-4",
		"border-blue-700",
		"hover:border-blue-500",
		"rounded",
	],
	theme: {
		extend: {
			keyframes: {
				span1: {
					"0%": { left: "-100%" },
					"100%": { left: "100%" }
				},
				span2: {
					"0%": { top: "-100%" },
					"100%": { top: "100%" }
				},
				span3: {
					"0%": { right: "-100%" },
					"100%": { right: "100%" }
				},
				span4: {
					"0%": { bottom: "-100%" },
					"100%": { bottom: "100%" }
				}
			},
			animation: {
				span1: "span1 2s linear infinite 1s",
				span2: "span2 2s linear infinite 2s",
				span3: "span3 2s linear infinite 3s",
				span4: "span4 2s linear infinite 4s"
			}
		}
	},
	plugins: [],
}
