import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import './pagination.js';

describe('Pagination', () => {
  it('renders correct number of page buttons', async () => {
    const el = await fixture(html`
      <app-pagination
        .currentPage=${1}
        .totalPages=${5}
        .maxVisiblePages=${5}
      ></app-pagination>
    `);

    const buttons = el.shadowRoot.querySelectorAll('button');
    // +2 for prev/next buttons
    expect(buttons.length).to.equal(7);
  });

  it('disables previous button on first page', async () => {
    const el = await fixture(html`
      <app-pagination
        .currentPage=${1}
        .totalPages=${5}
      ></app-pagination>
    `);

    const prevButton = el.shadowRoot.querySelector('button');
    expect(prevButton.disabled).to.be.true;
  });

  it('disables next button on last page', async () => {
    const el = await fixture(html`
      <app-pagination
        .currentPage=${5}
        .totalPages=${5}
      ></app-pagination>
    `);

    const buttons = el.shadowRoot.querySelectorAll('button');
    const nextButton = buttons[buttons.length - 1];
    expect(nextButton.disabled).to.be.true;
  });

  it('emits page-change event when clicking page button', async () => {
    const el = await fixture(html`
      <app-pagination
        .currentPage=${1}
        .totalPages=${5}
      ></app-pagination>
    `);

    const pageButton = el.shadowRoot.querySelectorAll('button')[2]; // Second page button
    setTimeout(() => pageButton.click());

    const { detail } = await oneEvent(el, 'page-change');
    expect(detail.page).to.equal(2);
  });

  it('shows ellipsis for large page ranges', async () => {
    const el = await fixture(html`
      <app-pagination
        .currentPage=${5}
        .totalPages=${10}
        .maxVisiblePages=${5}
      ></app-pagination>
    `);

    const ellipsis = el.shadowRoot.querySelectorAll('.ellipsis');
    expect(ellipsis.length).to.be.greaterThan(0);
  });
});