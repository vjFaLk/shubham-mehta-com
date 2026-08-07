import type { ImageInput, SiteConfig } from '../types';
import rawSiteConfig from './site-config.json';

/**
 * The site-wide values live in `site-config.json` so they can be edited through
 * Sveltia CMS at /admin/ — a CMS cannot write TypeScript. This module is the
 * bridge: it reads that data and hands the rest of the theme the same shape it
 * always got, so nothing that imports `site-config` had to change.
 *
 * Images are the one value that needs work. JSON can only hold a path, while
 * Astro needs an `ImageMetadata` object to optimize an image, so the assets
 * folder is imported eagerly and paths are looked up in it. Anything not found
 * there — a `public/` path like `/favicon.svg`, or a remote URL — is
 * passed through as a string and rendered as a plain `<img>` by `CustomImage`.
 *
 * Paths are written relative to this directory (`../assets/images/shubham.png`),
 * which is exactly the key `import.meta.glob` produces and exactly what the CMS
 * writes for the media folder configured in public/admin/config.yml.
 */
const assets = import.meta.glob<{ default: ImageMetadata }>('../assets/images/*.{jpeg,jpg,png,gif,webp,avif,svg}', { eager: true });

type RawImageInput = { src: string; alt?: string; caption?: string };

const resolveImage = (image?: RawImageInput): ImageInput | undefined => (image?.src ? { ...image, src: assets[image.src]?.default ?? image.src } : undefined);

const siteConfig: SiteConfig = {
    ...rawSiteConfig,
    avatar: resolveImage(rawSiteConfig.avatar),
    image: resolveImage(rawSiteConfig.image),
    hero: {
        ...rawSiteConfig.hero,
        image: resolveImage(rawSiteConfig.hero?.image)
    }
};

export default siteConfig;
