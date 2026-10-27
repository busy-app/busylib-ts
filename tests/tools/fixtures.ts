import { Display } from 'Global/types';
import { getDisplayDimensions } from 'Global/utils/frameData';
import { defaultHandler, json, pathOf, text, type Handler } from './fetch';

function bytes(length: number): Uint8Array {
  return Uint8Array.from({ length }, (_, i) => i % 256);
}

// The device sends frames as base64 text: BGR888 for the front display, L4 (two pixels per byte) for the back one.
function screenFrame(display: Display): string {
  const { width, height } = getDisplayDimensions(display);
  const length = display === Display.BACK ? (width * height) / 2 : width * height * 3;
  return Buffer.from(bytes(length)).toString('base64');
}

/**
 * Answers every endpoint the way the device does: `/version` with the API version, `/screen` with a base64 frame, `/storage/read` with raw bytes, everything else with JSON.
 * @param {Request} request - The intercepted request.
 * @returns {Response} The fixture response.
 */
export function fixtureHandler(request: Request): Response {
  switch (pathOf(request)) {
    case '/screen':
      return text(screenFrame(Number(new URL(request.url).searchParams.get('display')) as Display));
    case '/storage/read':
      return new Response(bytes(16), { headers: { 'Content-Type': 'application/octet-stream' } });
    default:
      return defaultHandler(request);
  }
}

/**
 * Answers `/version` normally and every other endpoint with the given response.
 * @param {() => Response} response - Builds the response for non-version endpoints.
 * @returns {Handler} The handler.
 */
export function failingHandler(response: () => Response): Handler {
  return (request) => (pathOf(request) === '/version' ? defaultHandler(request) : response());
}

/**
 * Rejects the first non-version request with 405 and bumps the API version, as the device does after a firmware update; later requests get fixtures.
 * @param {Handler} [handler] - Answers requests after the rejection.
 * @returns {Handler} The handler.
 */
export function versionMismatchOnce(handler: Handler = fixtureHandler): Handler {
  let semver = '1.0.0';
  let rejected = false;

  return (request) => {
    if (pathOf(request) === '/version') {
      return json({ api_semver: semver });
    }
    if (!rejected) {
      rejected = true;
      semver = '2.0.0';
      return json({ error: 'version mismatch' }, { status: 405, statusText: 'Method Not Allowed' });
    }
    return handler(request);
  };
}
