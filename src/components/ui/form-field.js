import { LitElement, html, css } from 'lit';

export class FormField extends LitElement {
  static get properties() {
    return {
      label: { type: String },
      type: { type: String },
      value: { type: String },
      name: { type: String },
      required: { type: Boolean },
      pattern: { type: String },
      error: { type: String },
      options: { type: Array }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }
      input, select {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
      }
      .error {
        color: #ff4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }
    `;
  }

  render() {
    return html`
      <div>
        <label for=${this.name}>${this.label}</label>
        ${this.type === 'select'
          ? this._renderSelect()
          : this._renderInput()}
        ${this.error
          ? html`<div class="error">${this.error}</div>`
          : null}
      </div>
    `;
  }

  _renderInput() {
    return html`
      <input
        type=${this.type}
        id=${this.name}
        name=${this.name}
        .value=${this.value || ''}
        ?required=${this.required}
        pattern=${this.pattern || ''}
        @input=${this._handleChange}
      >
    `;
  }

  _renderSelect() {
    return html`
      <select
        id=${this.name}
        name=${this.name}
        ?required=${this.required}
        @change=${this._handleChange}
      >
        <option value="">${this.label}...</option>
        ${this.options?.map(option => html`
          <option
            value=${option.value}
            ?selected=${this.value === option.value}
          >${option.label}</option>
        `)}
      </select>
    `;
  }

  _handleChange(e) {
    this.dispatchEvent(new CustomEvent('field-change', {
      detail: {
        name: this.name,
        value: e.target.value
      },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('form-field', FormField);