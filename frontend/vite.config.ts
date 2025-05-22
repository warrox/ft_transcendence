import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';
import fs from 'fs'

export default defineConfig({
	root: path.resolve(__dirname, 'src'),
	plugins: [
		tailwindcss(),
	],
	build: {
		outDir: "build",
	},
	server: {
		host: "0.0.0.0", // Allows access from Docker
		port: 3020,
		strictPort: true,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': '*',
			'Access-Control-Allow-Headers': '*',
		},
		https: {
			key: fs.readFileSync('/certs/localhost-key.pem'),
			cert: fs.readFileSync('/certs/localhost.pem'),
		},
		proxy: {
			'/api': {
				target: 'http://node-app:3000', // Backend server
				changeOrigin: true,
				ws: true,
				rewrite: path => path.replace(/^\/api/, ''),
			},
		},
		cors: {
			origin: true,
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
})
