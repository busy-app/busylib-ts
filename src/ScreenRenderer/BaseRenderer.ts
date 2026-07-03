import type { RenderParams } from 'ScreenRenderer/types';

/**
 * BaseRenderer - Shared WebGL2 machinery for rendering device screens
 * Subclasses provide their own vertex/fragment shaders, default options, and draw pass
 */
export abstract class BaseRenderer<O> {
  protected gl: WebGL2RenderingContext | null = null;
  protected program: WebGLProgram | null = null;
  protected texture: WebGLTexture | null = null;

  /** Vertex shader source. Provided by subclass */
  protected abstract readonly vs: string;
  /** Fragment shader source. Provided by subclass */
  protected abstract readonly fs: string;
  /** Default render options. Provided by subclass */
  protected abstract readonly defaultOptions: Required<O>;

  /**
   * Lazily initializes the WebGL context and resources
   * Only executes in a browser environment
   * @throws {Error} If WebGL 2.0 is not supported by the browser
   */
  protected init() {
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
   * Internal WebGL rendering pass
   * 
   * Subclasses manage their own viewports, uniforms, and draw calls
   */
  protected abstract render(data: Uint8Array | Uint8ClampedArray, width: number, height: number, options: Required<O>): void;

  /**
   * Public API: Renders a frame onto the provided canvas
   */
  public renderFrame(params: RenderParams, options: O | undefined = {} as O) {
    const { canvas, data, width, height } = params;

    this.init();

    if (typeof window === 'undefined' || !this.gl) {
      return;
    }

    if (this.gl.canvas.width !== canvas.width || this.gl.canvas.height !== canvas.height) {
      this.gl.canvas.width = canvas.width;
      this.gl.canvas.height = canvas.height;
    }

    this.render(data, width, height, { ...this.defaultOptions, ...options });
    const targetCtx = canvas.getContext('2d');
    if (targetCtx) {
      targetCtx.clearRect(0, 0, canvas.width, canvas.height);
      targetCtx.drawImage(this.gl.canvas, 0, 0);
    }
  }

  protected createProgram(vsSource: string, fsSource: string): WebGLProgram {
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
