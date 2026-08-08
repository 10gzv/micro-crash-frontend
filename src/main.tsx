import ReactDOM from 'react-dom/client';

import { App } from './App';
import { applyTheme } from '@lego/helpers/applyTheme';

import '@assets/styles/index.scss';

applyTheme();

const bootstrap = () => {
  ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
};

// The icon set used to be inlined in index.html (~536kB, uncached on every
// load). It now lives in a separate file; inject it once at startup so the
// existing same-document `<use href="#id">` references keep resolving.
//
// Three details matter:
//  - Prefer DOMParser as `image/svg+xml` over div.innerHTML: the HTML parser
//    mangles camelCase SVG (e.g. `<linearGradient>`, `gradientTransform`) and
//    can break gradient-heavy icons like the score badge. But if the sprite is
//    malformed XML, DOMParser yields a <parsererror> doc — inject THAT and you
//    get a full-page error banner; skip it and every icon disappears. So on a
//    parse error we fall back to the lenient HTML parser: icons still render
//    (a gradient may be slightly off, far better than a blank icon set).
//  - Inject BEFORE rendering React, so every `<use>` resolves on first paint
//    (a `<use>` created before its symbol exists doesn't reliably re-resolve).
//  - Hide it with zero size, NOT `display:none`. Gradients (paint servers)
//    inside a `display:none` subtree don't paint as fills in some engines, which
//    turned the gradient-filled score badge transparent. This matches how the
//    sprite was hidden while inline (`<svg width="0" height="0">`).
const parseSprite = (markup: string): SVGElement | null => {
  const doc = new DOMParser().parseFromString(markup, 'image/svg+xml');
  if (!doc.querySelector('parsererror')) {
    return doc.documentElement as unknown as SVGElement;
  }
  // Malformed XML — recover with the HTML parser so icons still render.
  const holder = document.createElement('div');
  holder.innerHTML = markup;
  return holder.querySelector('svg');
};

fetch('/sprite.svg')
  .then(response => response.text())
  .then(markup => {
    const svg = parseSprite(markup);
    if (!svg) return;
    // Drop any baked-in style and hide via zero size instead, so gradient paint
    // servers still render.
    svg.removeAttribute('style');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    svg.style.overflow = 'hidden';
    document.body.prepend(svg);
  })
  .catch(() => {
    /* fall through — render the app even if the sprite fails to load */
  })
  .finally(bootstrap);
