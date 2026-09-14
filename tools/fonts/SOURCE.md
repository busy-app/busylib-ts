# Vendored firmware fonts

The `.font` files here are LVGL binfonts copied verbatim from [busybar-firmware](https://github.com/busy-app/busybar-firmware), `assets/shared/fonts/`.
They are the input to `pnpm fonts:build`, which regenerates `src/Utils/font/maps/`.

## Updating

```sh
cp <firmware>/assets/shared/fonts/*.font tools/fonts/
pnpm fonts:build
```

Commit the regenerated maps alongside the fonts — `pnpm fonts:check` fails when a map no longer matches its `.font`.

Only the fonts DisplayDraw can reach are kept; `busy_regular_14` is left out because the API does not expose it.
