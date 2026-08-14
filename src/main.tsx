import ReactDOM from 'react-dom/client';

import { App } from './App';
import { applyTheme } from '@lego/helpers/applyTheme';

import '@assets/styles/index.scss';

applyTheme();

const bootstrap = () => {
  ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
};

const parseSprite = (markup: string): SVGElement | null => {
  const doc = new DOMParser().parseFromString(markup, 'image/svg+xml');
  if (!doc.querySelector('parsererror')) {
    return doc.documentElement as unknown as SVGElement;
  }

  const holder = document.createElement('div');
  holder.innerHTML = markup;
  return holder.querySelector('svg');
};

fetch('/sprite.svg')
  .then(response => response.text())
  .then(markup => {
    const svg = parseSprite(markup);
    if (!svg) return;

    svg.removeAttribute('style');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    svg.style.overflow = 'hidden';
    document.body.prepend(svg);
  })
  .catch(() => {

  })
  .finally(bootstrap);
