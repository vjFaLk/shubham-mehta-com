# shubhammehta.com

Personal site of Shubham Mehta — narrative designer, screenwriter and worldbuilder. Built with Astro and Tailwind CSS on the [Dante theme](https://github.com/JustGoodUI/dante-astro-theme), deployed on Netlify, with content edited through Sveltia CMS at `/admin/`.

## Template Integrations

- Tailwind CSS (via `@tailwindcss/vite`) - https://docs.astro.build/en/guides/styling/#tailwind
- @astrojs/sitemap - https://docs.astro.build/en/guides/integrations-guide/sitemap/
- @astrojs/mdx - https://docs.astro.build/en/guides/markdown-content/
- @astrojs/rss - https://docs.astro.build/en/guides/rss/

## ⚙️ Configuration Notes

### `site-config.json`

All site-wide data and theme options are stored in `src/data/site-config.json`, which is editable from the CMS under **Site settings**. `src/data/site-config.ts` reads that file and exports the single configuration object used throughout the theme for navigation, branding, hero content, social links, and more — that's the module everything imports, so editing either the JSON or the CMS is the same thing.

You can update this file to customize:

- Site identity — title, description, avatar, subtitle, and default social share image
- Navigation — header and footer navigation links
- Social links — URLs for supported platforms
- Hero section — title, text, image, and action buttons
- Newsletter subscription — form settings suitable for Mailchimp, Formspree, ConvertKit, or other form-based providers. The form supports a custom action URL, configurable email and hidden fields, and an optional honeypot field for spam protection.
- Pagination — posts per page for blog and projects listings

Images are referenced by path. A path into the assets folder, written relative to `src/data/` (`../assets/images/hero.jpg`), is resolved to a real Astro asset and optimized — this is what the CMS writes when you upload something. Any other string, such as a `public/` path like `/dante-preview.jpg` or a remote URL, is passed through and rendered as a plain `<img>`. `site-config.ts` does that lookup with an eager `import.meta.glob`, which is why the paths have to be relative to `src/data/` rather than the project root.

Two notes if you edit `site-config.ts` itself:

- `astro.config.mjs` reads `site-config.json` directly rather than importing this module, because Astro loads its config before Vite exists to transform `import.meta.glob`.
- The hero text is a plain textarea in the CMS, not the Markdown editor. It's still rendered as Markdown, but the rich text editor rewrites line breaks on save and the default text relies on single newlines staying within one paragraph.

### Images

The theme uses a `CustomImage` component that automatically displays images using Astro’s optimized `<Image />` or a standard `<img>` tag depending on the source.

- Content collection images (used in posts or pages) must be stored in `src/assets/` since they use Astro’s `image()` schema.
- Site-config images (like the avatar, hero image, or social preview) can either be imported from `src/assets/` for optimization or referenced directly from `public/` if you prefer not to optimize them.

### Content editing with Sveltia CMS

[Sveltia CMS](https://sveltiacms.app/) is wired up at **`/admin/`** on the deployed site. It's a Git-based CMS: every save is a commit to this repository, which triggers a normal Netlify build. There is no database and no extra hosting.

Two files make it up, both in `public/admin/` so Astro copies them to the build untouched:

- `index.html` — loads the CMS from unpkg, pinned to an exact version.
- `config.yml` — collections and fields, kept in sync with `src/content.config.ts`.

It manages the three content collections (blog posts, projects, pages) plus **Site settings**, which edits `src/data/site-config.json` — navigation, hero, avatar, newsletter form, pagination and the rest of the values described above.

Uploads are written to `src/assets/images/` and referenced with entry-relative paths such as `../../assets/images/photo.jpg`, so they go through Astro's image optimization exactly like the existing content does.

#### One-time Netlify setup

Logging in goes through Netlify's GitHub OAuth provider, which has to be installed once:

1. On GitHub, go to **Settings → Developer settings → OAuth Apps → New OAuth App** and create an app with the site URL as the homepage and `https://api.netlify.com/auth/done` as the **Authorization callback URL**.
2. In Netlify, open **Site configuration → Access & security → OAuth → Authentication providers**, choose **Install provider → GitHub**, and paste the client ID and secret from step 1.

Anyone with push access to the repository can then sign in at `/admin/`.

#### Editing locally

`npm run dev` serves the CMS at `http://localhost:4321/admin/` too. In a Chromium-based browser you can pick the local repository option on the login screen and edit the files in your working copy directly — no GitHub sign-in, no commits, just normal file changes you review and commit yourself.

#### Keeping the config in sync

`config.yml` describes the same data as `src/content.config.ts` (for the collections) and `src/types.ts` (for the site settings), so a change to one needs the matching change in the other. Two things worth knowing:

- Optional fields are omitted from the frontmatter when empty (`output.omit_empty_optional_fields`) instead of being written as empty strings, which the collection schemas would reject.
- The SEO title and description fields carry length limits in `content.config.ts`. The CMS enforces the maximums; the minimums are only shown as hints, because a minimum-length rule would also fire on an empty optional field and block saving.

#### Updating the CMS

Bump the version in the `<script>` tag in `public/admin/index.html`, then open `/admin/` once to confirm the editor still loads. See the [releases](https://github.com/sveltia/sveltia-cms/releases). The `yaml-language-server` comment at the top of `config.yml` intentionally points at an unversioned schema URL — that exact string is what Sveltia and the editor YAML extension look for.

## Project Structure

Inside of Dante Astro theme, you'll see the following folders and files:

```text
├── public/
│   └── admin/          # Sveltia CMS (index.html + config.yml)
├── src/
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   ├── components/
│   ├── content/
│   ├── data/
│   ├── layouts/
│   ├── pages/
│   ├── styles/
│   ├── utils/
│   ├── content.config.ts
│   └── types.ts
├── astro.config.mjs
├── package.json
├── README.md
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro (`.astro`) components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## Astro.js Commands

Requires Node.js `22.12.0` or newer. All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run check`           | Type-check the project with `astro check`        |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Credits

Based on the [Dante Astro theme](https://github.com/JustGoodUI/dante-astro-theme) by [Just Good UI](https://justgoodui.com/).

## License

Licensed under the [GPL-3.0](LICENSE) license.
