import { createOptimizedPicture } from '../../scripts/aem.js';

const COLUMN_VARIANTS = {
  '1-up': 'one-up',
  '2-up': 'two-up',
  '3-up': 'three-up',
  '4-up': 'four-up',
  'one-up': 'one-up',
  'two-up': 'two-up',
  'three-up': 'three-up',
  'four-up': 'four-up',
};

/**
 * Adds useful hooks to common teaser content without requiring every field.
 * @param {HTMLElement} body Teaser body
 */
function decorateBody(body) {
  const heading = body.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) heading.classList.add('teaser-title');

  const children = [...body.children];
  const headingIndex = children.indexOf(heading);
  if (headingIndex > 0) children[headingIndex - 1].classList.add('teaser-eyebrow');

  const lastChild = children.at(-1);
  if (lastChild && lastChild !== heading) lastChild.classList.add('teaser-footer');
}

/**
 * Converts one authored table row into a teaser card.
 * @param {HTMLElement} row Authored block row
 * @returns {HTMLLIElement} Decorated teaser
 */
function buildTeaser(row) {
  const item = document.createElement('li');
  item.className = 'teaser-item';

  [...row.children].forEach((cell) => {
    const isMedia = cell.querySelector('picture, img');
    cell.className = isMedia ? 'teaser-media' : 'teaser-body';
    if (!isMedia) decorateBody(cell);
    item.append(cell);
  });

  return item;
}

/**
 * Decorates the teaser block.
 * @param {HTMLElement} block Teaser block
 */
export default function decorate(block) {
  if (!block.classList.contains('horizontal') && !block.classList.contains('vertical')) {
    block.classList.add('vertical');
  }
  const authoredColumns = Object.keys(COLUMN_VARIANTS)
    .find((variant) => block.classList.contains(variant));
  block.classList.add(COLUMN_VARIANTS[authoredColumns] || 'one-up');

  const list = document.createElement('ul');
  list.className = 'teaser-list';
  [...block.children].forEach((row) => list.append(buildTeaser(row)));

  list.querySelectorAll('picture > img').forEach((img) => {
    const picture = createOptimizedPicture(
      img.src,
      img.alt,
      false,
      [{ media: '(min-width: 600px)', width: '1200' }, { width: '750' }],
    );
    img.closest('picture').replaceWith(picture);
  });

  block.replaceChildren(list);
}
