import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';

// Read the JSON directly rather than going through src/data/site-config.ts. That
// module uses `import.meta.glob` to resolve images, which Vite only transforms
// for files in the site's module graph — not for the config, which is loaded
// before Vite runs.
const siteConfig = JSON.parse(readFileSync(new URL('./src/data/site-config.json', import.meta.url), 'utf8'));

// https://astro.build/config
export default defineConfig({
    site: siteConfig.website,
    vite: {
        plugins: [tailwindcss()]
    },
    integrations: [mdx(), sitemap()]
});
