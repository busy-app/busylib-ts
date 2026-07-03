import { BaseRenderer } from 'ScreenRenderer/BaseRenderer';
import type { LedRenderOptions } from 'ScreenRenderer/types';

/**
 * LedRenderer - Renders the front LED screen: round pixels on a grid (LED-matrix look).
 *
 * This class implements a Singleton pattern: subsequent calls to `new LedRenderer()`
 * return the initially created instance.
 */
export class LedRenderer extends BaseRenderer<LedRenderOptions> {
  private static instance: LedRenderer | null = null;

  protected readonly vs = `#version 300 es
    in vec2 position;
    out vec2 v_uv;
    void main() {
      v_uv = position * 0.5 + 0.5;
      v_uv.y = 1.0 - v_uv.y;
      gl_Position = vec4(position, 0, 1);
    }
  `;

  protected readonly fs = `#version 300 es
    precision highp float;
    in vec2 v_uv;
    out vec4 outColor;
    uniform sampler2D u_texture;
    uniform vec2 u_dataRes;
    uniform vec2 u_canvasRes;
    uniform float u_pixelSize;
    uniform float u_radius;
    uniform float u_darkThreshold;
    void main() {
      vec2 gridPos = v_uv * u_dataRes;
      vec2 localUv = fract(gridPos);
      vec2 cellCoords = (floor(gridPos) + 0.5) / u_dataRes;
      vec4 color = texture(u_texture, cellCoords);
      if (dot(color.rgb, vec3(1.0)) < u_darkThreshold) discard;
      float halfSize = u_pixelSize * 0.5;
      float visualRadius = sqrt(clamp(u_radius, 0.0, 1.0));
      float r = visualRadius * halfSize;
      vec2 q = abs(localUv - 0.5) - (halfSize - r);
      float dist = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
      float unitsPerPixel = (u_dataRes.y / u_canvasRes.y);
      float delta = unitsPerPixel * 1.5;
      float effectRes = (1.0 - u_pixelSize) + u_radius;
      float effectStrength = smoothstep(0.0, 0.02, effectRes);
      float edgeOffset = mix(0.0, -delta, effectStrength);
      float mask = 1.0 - smoothstep(edgeOffset, edgeOffset + delta * 2.0, dist);
      float vignette = smoothstep(0.7, 0.3, length(localUv - 0.5));
      vec3 finalColor = color.rgb * (1.0 - (0.15 * effectStrength * (1.0 - vignette)));
      if (mask < 0.001) discard;
      outColor = vec4(finalColor, color.a * mask);
    }
  `;

  protected readonly defaultOptions: Required<LedRenderOptions> = {
    pixelSize: 0.85,
    radius: 0.5,
    darkThreshold: 0.04
  };

  constructor() {
    super();
    if (LedRenderer.instance) {
      return LedRenderer.instance;
    }
    LedRenderer.instance = this;
  }

  /**
   * Binds data texture, updates resolution/LED uniforms, and executes the WebGL draw call.
   */
  protected render(data: Uint8Array | Uint8ClampedArray, width: number, height: number, options: Required<LedRenderOptions>) {
    const { pixelSize, radius, darkThreshold } = options;

    const gl = this.gl!;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.useProgram(this.program!);
    gl.bindTexture(gl.TEXTURE_2D, this.texture!);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.uniform2f(gl.getUniformLocation(this.program!, 'u_dataRes'), width, height);
    gl.uniform2f(gl.getUniformLocation(this.program!, 'u_canvasRes'), gl.canvas.width, gl.canvas.height);
    gl.uniform1f(gl.getUniformLocation(this.program!, 'u_pixelSize'), pixelSize);
    gl.uniform1f(gl.getUniformLocation(this.program!, 'u_radius'), radius);
    gl.uniform1f(gl.getUniformLocation(this.program!, 'u_darkThreshold'), darkThreshold);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
