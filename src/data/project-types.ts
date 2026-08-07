/**
 * The project types, their URLs, and the copy used for navigation and headings.
 *
 * This is the single source of truth for the three of them:
 * - `src/content.config.ts` builds the `type` enum from `name`
 * - `src/pages/[type]/[...page].astro` generates one listing page per `slug`
 * - the `type` select field in `public/admin/config.yml` mirrors the names
 *
 * Adding a type means adding an entry here and the matching option in the CMS
 * config; nothing else needs to change.
 */
export const projectTypes = [
    {
        name: 'Game',
        slug: 'games',
        label: 'Games',
        description: 'Narrative design, game writing and worldbuilding projects.'
    },
    {
        name: 'Screenwriting',
        slug: 'screenwriting',
        label: 'Screenwriting',
        description: 'Scripts and screenwriting projects.'
    },
    {
        name: 'Fiction',
        slug: 'fiction',
        label: 'Fiction',
        description: 'Fiction and prose projects.'
    }
] as const;

export type ProjectTypeName = (typeof projectTypes)[number]['name'];

/** `z.enum()` needs a non-empty tuple, which `map()` can't express on its own. */
export const projectTypeNames = projectTypes.map(({ name }) => name) as [ProjectTypeName, ...ProjectTypeName[]];
