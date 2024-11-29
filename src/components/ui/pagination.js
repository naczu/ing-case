import { LitElement, html, css } from 'lit';

class Pagination extends LitElement {
  static properties = {
    currentPage: { type: Number },
    totalPages: { type: Number },
    maxVisiblePages: { type: Number }
  };

  static styles = css`
    :host {
      display: block;
      margin: 1rem 0;
    }
    .pagination {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      align-items: center;
    }
    button {
      padding: 0.5rem 1rem;
      border: 1px solid #ccc;
      background: white;
      cursor: pointer;
      border-radius: 4px;
    }
    button:disabled {
      background: #f3f4f6;
      cursor: not-allowed;
    }
    button.active {
      background: #646cff;
      color: white;
      border-color: #646cff;
    }
    .ellipsis {
      padding: 0 0.5rem;
    }
  `;

  constructor() {
    super();
    this.maxVisiblePages = 5;
  }

  render() {
    const pages = this._getVisiblePages();

    return html`
      <div class="pagination">
        <button
          ?disabled=${this.currentPage === 1}
          @click=${() => this._handlePageChange(this.currentPage - 1)}
        >
          ←
        </button>

        ${pages.map(page => 
          page === '...' 
            ? html`<span class="ellipsis">...</span>`
            : html`
                <button
                  class=${this.currentPage === page ? 'active' : ''}
                  @click=${() => this._handlePageChange(page)}
                >
                  ${page}
                </button>
              `
        )}

        <button
          ?disabled=${this.currentPage === this.totalPages}
          @click=${() => this._handlePageChange(this.currentPage + 1)}
        >
          →
        </button>
      </div>
    `;
  }

  _getVisiblePages() {
    const pages = [];
    const halfVisible = Math.floor(this.maxVisiblePages / 2);
    let start = Math.max(1, this.currentPage - halfVisible);
    let end = Math.min(this.totalPages, start + this.maxVisiblePages - 1);

    if (end - start + 1 < this.maxVisiblePages) {
      start = Math.max(1, end - this.maxVisiblePages + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < this.totalPages) {
      if (end < this.totalPages - 1) pages.push('...');
      pages.push(this.totalPages);
    }

    return pages;
  }

  _handlePageChange(page) {
    this.dispatchEvent(new CustomEvent('page-change', {
      detail: { page },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('app-pagination', Pagination);