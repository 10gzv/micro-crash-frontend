/**
 * Asset URLs for Pusulabet Crash.
 *
 * Assets live under `game_assets/pusulabet-crash/` (CDN or local `public/`).
 * Optional `?game_slug=` is still read for launcher compatibility; default is pusulabet-crash.
 */

const ASSET_HOST = 'https://assets.abcdabra.com';

export const DEFAULT_GAME_SLUG = 'pusulabet-crash';

function readGameSlug(): string {
  if (typeof window === 'undefined') return DEFAULT_GAME_SLUG;
  const slug = new URLSearchParams(window.location.search).get('game_slug');
  return slug || DEFAULT_GAME_SLUG;
}

export const GAME_SLUG = readGameSlug();

const ENCODED_GAME_SLUG = encodeURIComponent(GAME_SLUG);

const assetsParam =
  typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('assets')
    : null;

const USE_LOCAL_ASSETS =
  assetsParam === 'local' || (import.meta.env.DEV && assetsParam !== 'cdn');

export const ASSET_BASE_URL: string = USE_LOCAL_ASSETS
  ? `${import.meta.env.BASE_URL}game_assets/${ENCODED_GAME_SLUG}/`
  : `${ASSET_HOST}/game_assets/${ENCODED_GAME_SLUG}/`;

export function assetUrl(path: string): string {
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return ASSET_BASE_URL + clean;
}
