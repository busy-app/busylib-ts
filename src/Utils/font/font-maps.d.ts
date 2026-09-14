/**
 * The font maps the app draws with.
 *
 * In a `@busy-app/cli` build the font-maps plugin serves this specifier with only the fonts the app names, since all nine are 48 KB of metrics. Anywhere else Node resolves it through the package's `imports` map to font-maps-stub.js, which is empty, and maps are registered by hand:
 *
 *     import { registerFontMaps } from '@busy-app/busy-lib'
 *     import { bold } from '@busy-app/busy-lib/fonts'
 *     registerFontMaps(bold)
 */
declare module '#font-maps' {
  /** One entry per bundled font, in the shape the JSON maps have. */
  export const MAPS: { fonts: Record<string, unknown> }[];
}
