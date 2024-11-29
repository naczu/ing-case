import { LitElement, html, css } from "lit";
import { msg } from "@lit/localize";
import logoSrc from "../assets/ing-logo.svg";

export class NavMenu extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
      }

      nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0.75rem 1rem;
      }

      .logo-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .logo {
        height: 40px;
        width: auto;
      }

      .add-employee-btn {
        background: #ff6200;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        text-decoration: none;
        font-weight: 500;
        transition: background-color 0.2s;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .add-employee-btn:hover {
        background: #e65800;
      }

      .add-icon {
        font-size: 1.2em;
      }

      @media (max-width: 768px) {
        nav {
          padding: 0.5rem;
        }

        .add-employee-btn span {
          display: none;
        }

        .add-employee-btn {
          padding: 0.5rem;
          aspect-ratio: 1;
        }

        .logo {
          height: 32px;
        }
      }
    `;
  }

  render() {
    return html`
      <nav>
        <a href="/" class="logo-container">
          <img src="${logoSrc}" alt="ING Logo" class="logo" />
        </a>
        <a href="/employee/new" class="add-employee-btn">
          <span class="add-icon">+</span>
        </a>
      </nav>
    `;
  }
}

customElements.define("nav-menu", NavMenu);
