import { Display } from 'Global/types';
import { LedRenderer } from 'ScreenRenderer/LedRenderer';
import type { RenderParams, LedRenderOptions, OledRenderOptions } from 'ScreenRenderer/types';

/**
 * ScreenRenderer - Facade for rendering device screens.
 * Routes by {@link Display}. Currently the front (LED) screen is supported;
 * the back (OLED) screen will be added later.
 */
class ScreenRenderer {
  private front = new LedRenderer();
  private backWarned = false;

  /** Renders a frame to the front LED screen. */
  public renderFrame(display: Display.FRONT, params: RenderParams, options?: LedRenderOptions): void;
  /** Renders a frame to the back OLED screen. */
  public renderFrame(display: Display.BACK, params: RenderParams, options?: OledRenderOptions): void;
  public renderFrame(display: Display, params: RenderParams, options?: LedRenderOptions | OledRenderOptions): void {
    if (display === Display.BACK && !this.backWarned) {
      this.backWarned = true;
      console.warn('ScreenRenderer: back (OLED) screen rendering is not implemented yet; falling back to the front (LED) renderer.');
    }
    this.front.renderFrame(params, options as LedRenderOptions);
  }
}

export const ScreenRendererInstance = /*#__PURE__*/ new ScreenRenderer();
