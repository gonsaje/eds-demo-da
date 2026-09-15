import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');
const projectHostPattern = /(?:^|--)eds-demo-da--gonsaje\.aem\.(?:page|live)$/;

/**
 * Keeps links to this project on the visitor's current environment.
 * @param {HTMLAnchorElement} link Authored link
 */
function normalizeProjectLink(link) {
  try {
    const url = new URL(link.href);
    if (projectHostPattern.test(url.hostname)) {
      link.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
    }
  } catch (e) {
    // Leave malformed or non-URL authored values unchanged.
  }
}

/**
 * Builds the home link from the first section in the nav document.
 * @param {HTMLElement} section Authored brand section
 * @returns {HTMLAnchorElement} Brand link
 */
function buildBrand(section) {
  const authoredLink = section?.querySelector('a[href]');
  const brand = document.createElement('a');
  brand.className = 'nav-brand';
  brand.href = authoredLink?.getAttribute('href') || '/';

  ['target', 'rel', 'title'].forEach((attribute) => {
    if (authoredLink?.hasAttribute(attribute)) {
      brand.setAttribute(attribute, authoredLink.getAttribute(attribute));
    }
  });

  const picture = section?.querySelector('picture');
  const image = picture ? null : section?.querySelector('img');
  if (picture) brand.append(picture.cloneNode(true));
  if (image) brand.append(image.cloneNode(true));

  const authoredLabel = authoredLink?.textContent.trim();
  const logo = brand.querySelector('img');
  const label = authoredLabel || logo?.alt.trim() || 'EDS Demo';
  if (authoredLabel || !logo) {
    const name = document.createElement('span');
    name.className = 'nav-brand-name';
    name.textContent = label;
    brand.append(name);
  }

  if (logo) logo.classList.add('nav-logo');
  brand.setAttribute('aria-label', `${label} home`);
  normalizeProjectLink(brand);
  return brand;
}

/**
 * Builds a flat list from every authored link except the brand link.
 * @param {HTMLElement[]} sections Authored navigation sections
 * @param {HTMLAnchorElement} brandLink Link used for the brand
 * @returns {HTMLDivElement|null} Navigation menu
 */
function buildMenu(sections, brandLink) {
  const links = sections
    .flatMap((section) => [...section.querySelectorAll('a[href]')])
    .filter((link) => link !== brandLink);
  if (!links.length) return null;

  const menu = document.createElement('div');
  menu.className = 'nav-menu';
  menu.id = 'nav-menu';

  const list = document.createElement('ul');
  list.className = 'nav-list';
  links.forEach((authoredLink) => {
    const item = document.createElement('li');
    const link = authoredLink.cloneNode(true);
    link.className = 'nav-link';
    normalizeProjectLink(link);
    item.append(link);
    list.append(item);
  });

  menu.append(list);
  return menu;
}

/**
 * Creates the mobile menu control and its interactions.
 * @param {HTMLElement} nav Navigation element
 * @param {HTMLElement} menu Navigation menu
 * @returns {HTMLButtonElement} Menu button
 */
function buildMenuToggle(nav, menu) {
  const button = document.createElement('button');
  button.className = 'nav-toggle';
  button.type = 'button';
  button.setAttribute('aria-controls', menu.id);
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-label', 'Open navigation');
  button.innerHTML = '<span class="nav-toggle-icon"></span>';

  const setExpanded = (expanded) => {
    nav.classList.toggle('is-open', expanded);
    button.setAttribute('aria-expanded', String(expanded));
    button.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
  };

  button.addEventListener('click', () => {
    setExpanded(button.getAttribute('aria-expanded') !== 'true');
  });
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setExpanded(false));
  });
  nav.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setExpanded(false);
      button.focus();
    }
  });
  isDesktop.addEventListener('change', () => setExpanded(false));

  return button;
}

/**
 * Loads and decorates the global navigation document.
 * @param {HTMLElement} block Header block
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  const sections = fragment ? [...fragment.children] : [];

  const nav = document.createElement('nav');
  nav.className = 'nav';
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Primary navigation');
  const brandSection = sections[0];
  const brandLink = brandSection?.querySelector('a[href]');
  nav.append(buildBrand(brandSection));

  const menu = buildMenu(sections, brandLink);
  if (menu) {
    nav.append(buildMenuToggle(nav, menu), menu);
  }

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.replaceChildren(navWrapper);
}
