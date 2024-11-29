import { msg } from "@lit/localize";
import { LitElement, html, css } from "lit";

export class ModalDialog extends LitElement {
  static get properties() {
    return {
      open: { type: Boolean },
      title: { type: String },
      message: { type: String },
    };
  }

  static get styles() {
    return css`
      .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition:
          opacity 0.2s,
          visibility 0.2s;
      }

      .modal-backdrop[open] {
        opacity: 1;
        visibility: visible;
      }

      .modal {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transform: translateY(-20px);
        transition: transform 0.2s;
      }

      .modal-backdrop[open] .modal {
        transform: translateY(0);
      }

      .modal-header {
        margin-bottom: 1rem;
      }

      .modal-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1a1a1a;
        margin: 0;
      }

      .modal-body {
        margin-bottom: 1.5rem;
        color: #4a5568;
      }

      .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
      }

      button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.2s;
      }

      .confirm {
        background: #ff6200;
        color: white;
      }

      .confirm:hover {
        background: #e65800;
      }

      .cancel {
        background: #e2e8f0;
        color: #4a5568;
      }

      .cancel:hover {
        background: #cbd5e1;
      }

      @media (max-width: 480px) {
        .modal {
          padding: 1rem;
        }

        .modal-footer {
          flex-direction: column-reverse;
        }

        button {
          width: 100%;
        }
      }
    `;
  }

  constructor() {
    super();
    this.open = false;
    this.title = "";
    this.message = "";
  }

  render() {
    return html`
      <div
        class="modal-backdrop"
        ?open=${this.open}
        @click=${this._handleBackdropClick}
      >
        <div class="modal" @click=${this._stopPropagation}>
          <div class="modal-header">
            <h2 class="modal-title">${this.title}</h2>
          </div>
          <div class="modal-body">${this.message}</div>
          <div class="modal-footer">
            <button class="cancel" @click=${this._handleCancel}>
              ${msg("Cancel")}
            </button>
            <button class="confirm" @click=${this._handleConfirm}>
              ${msg("Confirm")}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  _handleBackdropClick() {
    this._handleCancel();
  }

  _stopPropagation(e) {
    e.stopPropagation();
  }

  _handleCancel() {
    this.open = false;
    this.dispatchEvent(new CustomEvent("modal-cancel"));
  }

  _handleConfirm() {
    this.open = false;
    this.dispatchEvent(new CustomEvent("modal-confirm"));
  }

  show(title, message) {
    this.title = title;
    this.message = message;
    this.open = true;
  }
}

customElements.define("modal-dialog", ModalDialog);
