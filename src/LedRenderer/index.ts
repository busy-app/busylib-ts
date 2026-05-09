/**
 * LEDRenderer - A singleton WebGL2-based engine for rendering pixel grids.
 */
class LEDRenderer {
  private static instance: LEDRenderer | null = null;

  private gl: WebGL2RenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private texture: WebGLTexture | null = null;

  private vs = `#version 300 es
    in vec2 position;
    out vec2 v_uv;
    void main() {
      v_uv = position * 0.5 + 0.5;
      v_uv.y = 1.0 - v_uv.y;
      gl_Position = vec4(position, 0, 1);
    }
  `;
  private fs = `#version 300 es
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

  constructor() {
    if (LEDRenderer.instance) {
      return LEDRenderer.instance;
    }
    LEDRenderer.instance = this;
  }

  /**
   * Lazily initializes the WebGL context and resources.
   * Only executes in a browser environment.
   */
  private init() {
    if (this.gl || typeof window === 'undefined') {
      return;
    }

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2', {
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    }) as WebGL2RenderingContext;

    if (!gl) {
      throw new Error('WebGL 2.0 not supported');
    }
    this.gl = gl;
    this.program = this.createProgram(this.vs, this.fs);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(this.program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    this.texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  /**
   * Internal WebGL rendering pass.
   */
  private render(
    data: Uint8Array | Uint8ClampedArray,
    width: number,
    height: number,
    options: { pixelSize?: number; radius?: number; darkThreshold?: number }
  ) {
    const { pixelSize = 0.85, radius = 0.5, darkThreshold = 0.04 } = options;

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

  /**
   * Public API: Renders the LED frame to a target 2D canvas.
   */
  public renderFrame(
    targetCanvas: HTMLCanvasElement,
    data: Uint8Array | Uint8ClampedArray,
    width: number,
    height: number,
    options: { pixelSize?: number; radius?: number; darkThreshold?: number } | undefined = {}
  ) {
    // Attempt lazy initialization
    this.init();

    if (typeof window === 'undefined' || !this.gl) {
      return;
    }

    // Sync internal resolution
    if (this.gl.canvas.width !== targetCanvas.width || this.gl.canvas.height !== targetCanvas.height) {
      this.gl.canvas.width = targetCanvas.width;
      this.gl.canvas.height = targetCanvas.height;
    }

    this.render(data, width, height, options);
    const targetCtx = targetCanvas.getContext('2d');
    if (targetCtx) {
      targetCtx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
      targetCtx.drawImage(this.gl.canvas, 0, 0);
    }
  }

  private createProgram(vsSource: string, fsSource: string): WebGLProgram {
    const gl = this.gl!;
    const loadShader = (type: number, source: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'Shader Error');
      return s;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, loadShader(gl.VERTEX_SHADER, vsSource));
    gl.attachShader(program, loadShader(gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(program);
    return program;
  }
}

export const LEDRendererInstance = /*#__PURE__*/ new LEDRenderer();
