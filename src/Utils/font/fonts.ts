// Glyph maps for builds that do not go through @busy-app/cli, where nothing serves `#font-maps`. Import only the fonts in use and pass them to registerFontMaps: each map is a separate module, so a bundler drops the rest.

export { default as bold } from 'Utils/font/maps/bold.json';
export { default as condensed } from 'Utils/font/maps/condensed.json';
export { default as extra_large } from 'Utils/font/maps/extra_large.json';
export { default as global } from 'Utils/font/maps/global.json';
export { default as large } from 'Utils/font/maps/large.json';
export { default as normal } from 'Utils/font/maps/normal.json';
export { default as small } from 'Utils/font/maps/small.json';
export { default as superscript } from 'Utils/font/maps/superscript.json';
export { default as tiny } from 'Utils/font/maps/tiny.json';
