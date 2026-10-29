import { readFileSync } from "node:fs";

import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, type Plugin } from "vite";

import { app } from "./src/config/app.ts";

/**
 * The PWA manifest is generated from `app.name` instead of being committed as
 * a static file, so renaming the product stays a one-file change. Colors are
 * intentionally omitted: `<meta name="theme-color">` already follows the
 * `--background` token, and duplicating the palette here would drift.
 */
function webManifest(): Plugin {
	const manifest = `${JSON.stringify(
		{
			name: app.name,
			short_name: app.name,
			lang: app.defaultLocale,
			start_url: "/",
			scope: "/",
			display: "standalone",
			icons: [
				{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
				{ src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
				{
					src: "/icons/icon-maskable-512.png",
					sizes: "512x512",
					type: "image/png",
					purpose: "maskable",
				},
			],
		},
		null,
		2,
	)}\n`;

	return {
		name: "app-web-manifest",
		configureServer(server) {
			server.middlewares.use("/manifest.webmanifest", (_request, response) => {
				response.setHeader("Content-Type", "application/manifest+json");
				response.end(manifest);
			});
		},
		generateBundle() {
			this.emitFile({
				type: "asset",
				fileName: "manifest.webmanifest",
				source: manifest,
			});
		},
	};
}

const { version } = JSON.parse(
	readFileSync(new URL("./package.json", import.meta.url), "utf8"),
) as { version: string };

const config = defineConfig({
	define: { __APP_VERSION__: JSON.stringify(version) },
	resolve: { tsconfigPaths: true },
	plugins: [
		devtools(),
		nitro({ rollupConfig: { external: [/^@sentry\//] } }),
		tailwindcss(),
		tanstackStart(),
		webManifest(),
		viteReact(),
	],
});

export default config;
