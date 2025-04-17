import { defineConfig } from 'vite'
import path from 'path';
import fs from 'fs'

export default defineConfig({
	root: path.resolve(__dirname, 'src'),
	plugins: [],
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
			'Content-Security-Policy': "default-src 'self'; font-src 'self' data:; img-src 'self' data:; script-src 'self' 'unsafe-inline' https://cdn.matomo.cloud https://accounts.google.com https://apis.google.com; frame-src https://accounts.google.com; connect-src 'self' https://accounts.google.com https://www.googleapis.com; object-src 'none'; style-src 'self' 'unsafe-inline';"
		},
		https: {
			key: fs.readFileSync('/certs/localhost-key.pem'),
			cert: fs.readFileSync('/certs/localhost.pem'),
		},
		proxy: {
			'/api': {
				target: 'http://node-app:3000', // Backend server
				changeOrigin: true,
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
