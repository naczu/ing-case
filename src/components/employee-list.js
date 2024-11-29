import { LitElement, html, css } from "lit";
import { connect } from "pwa-helpers/connect-mixin.js";
import { store } from "../store/store.js";
import { msg } from "@lit/localize";
import "../components/ui/pagination.js";
import "../components/ui/modal-dialog.js";

export class EmployeeList extends connect(store)(LitElement) {
  static get properties() {
    return {
      employees: { type: Array },
      displayMode: { type: String },
      currentPage: { type: Number },
      searchQuery: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 1rem;
        margin-top: 4rem;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .controls {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: space-between;
        margin-bottom: 1rem;
        background: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .search {
        flex: 1;
        min-width: 200px;
        padding: 0.5rem;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        font-size: 1rem;
      }

      .view-toggle {
        display: flex;
        gap: 0.5rem;
      }

      .table-container {
        position: relative;
        overflow-x: auto;
        background: white;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        -webkit-overflow-scrolling: touch;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        white-space: nowrap;
      }

      th,
      td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
        min-width: 120px;
      }

      th {
        background: #f8fafc;
        font-weight: 600;
        color: #475569;
        position: sticky;
        top: 0;
        z-index: 1;
      }

      tr:hover {
        background: #f8fafc;
      }

      .list-view {
        display: grid;
        gap: 1rem;
      }

      .list-item {
        background: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .actions {
        display: flex;
        gap: 0.5rem;
        min-width: 160px;
      }

      button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.2s;
        white-space: nowrap;
      }

      .edit {
        background: #ff6200;
        color: white;
      }

      .edit:hover {
        background: #e65800;
      }

      .delete {
        background: #ef4444;
        color: white;
      }

      .delete:hover {
        background: #dc2626;
      }

      .view-toggle button {
        background: #f1f5f9;
        color: #475569;
      }

      .view-toggle button:hover {
        background: #e2e8f0;
      }

      .view-toggle button[disabled] {
        background: #ff6200;
        color: white;
        cursor: default;
      }

      @media (max-width: 768px) {
        :host {
          padding: 0;
        }

        .container {
          padding: 0.5rem;
        }

        .controls {
          flex-direction: column;
          padding: 0.75rem;
          border-radius: 0;
        }

        .view-toggle {
          width: 100%;
        }

        .view-toggle button {
          flex: 1;
        }

        .table-container {
          border-radius: 0;
          box-shadow: none;
        }

        table {
          font-size: 0.875rem;
        }

        th,
        td {
          padding: 0.75rem;
        }

        .actions {
          flex-direction: row;
          min-width: 120px;
        }

        button {
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
        }

        .list-item {
          border-radius: 0;
          padding: 0.75rem;
        }
      }

      @media (max-width: 480px) {
        .actions {
          flex-direction: column;
          min-width: 90px;
        }

        button {
          width: 100%;
          text-align: center;
        }
      }
    `;
  }

  constructor() {
    super();
    this.employees = [];
    this.displayMode = "table";
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.searchQuery = "";
  }

  stateChanged(state) {
    this.employees = state.employees;
    this.displayMode = state.displayMode;
    this.currentPage = state.currentPage;
    this.searchQuery = state.searchQuery;
  }

  render() {
    const filteredEmployees = this._getFilteredEmployees();
    const totalPages = Math.ceil(filteredEmployees.length / this.itemsPerPage);
    const paginatedEmployees = this._getPaginatedEmployees(filteredEmployees);

    return html`
      <div class="container">
        <div class="controls">
          <input
            type="search"
            class="search"
            .value=${this.searchQuery}
            @input=${this._handleSearch}
            placeholder=${msg("Search employees...")}
          />
          <div class="view-toggle">
            <button
              @click=${() => this._setDisplayMode("table")}
              ?disabled=${this.displayMode === "table"}
            >
              ${msg("Table View")}
            </button>
            <button
              @click=${() => this._setDisplayMode("list")}
              ?disabled=${this.displayMode === "list"}
            >
              ${msg("List View")}
            </button>
          </div>
        </div>

        ${this.displayMode === "table"
          ? this._renderTable(paginatedEmployees)
          : this._renderList(paginatedEmployees)}

        <app-pagination
          .currentPage=${this.currentPage}
          .totalPages=${totalPages}
          @page-change=${this._handlePageChange}
        ></app-pagination>

        <modal-dialog
          @modal-confirm=${this._confirmDelete}
          @modal-cancel=${this._cancelDelete}
        ></modal-dialog>
      </div>
    `;
  }

  _renderTable(employees) {
    return html`
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>${msg("First Name")}</th>
              <th>${msg("Last Name")}</th>
              <th>${msg("Department")}</th>
              <th>${msg("Position")}</th>
              <th>${msg("Actions")}</th>
            </tr>
          </thead>
          <tbody>
            ${employees.map(
              (employee) => html`
                <tr>
                  <td>${employee.firstName}</td>
                  <td>${employee.lastName}</td>
                  <td>${msg(employee.department)}</td>
                  <td>${msg(employee.position)}</td>
                  <td>
                    <div class="actions">
                      <button
                        class="edit"
                        @click=${() => this._handleEdit(employee.id)}
                      >
                        ${msg("Edit")}
                      </button>
                      <button
                        class="delete"
                        @click=${() => this._handleDelete(employee.id)}
                      >
                        ${msg("Delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              `,
            )}
          </tbody>
        </table>
      </div>
    `;
  }

  _renderList(employees) {
    return html`
      <div class="list-view">
        ${employees.map(
          (employee) => html`
            <div class="list-item">
              <h3>${employee.firstName} ${employee.lastName}</h3>
              <p>${employee.department} - ${employee.position}</p>
              <div class="actions">
                <button
                  class="edit"
                  @click=${() => this._handleEdit(employee.id)}
                >
                  ${msg("Edit")}
                </button>
                <button
                  class="delete"
                  @click=${() => this._handleDelete(employee.id)}
                >
                  ${msg("Delete")}
                </button>
              </div>
            </div>
          `,
        )}
      </div>
    `;
  }

  _getFilteredEmployees() {
    if (!this.searchQuery) return this.employees;
    const query = this.searchQuery.toLowerCase();
    return this.employees.filter(
      (emp) =>
        emp.firstName.toLowerCase().includes(query) ||
        emp.lastName.toLowerCase().includes(query) ||
        emp.department.toLowerCase().includes(query) ||
        emp.position.toLowerCase().includes(query),
    );
  }

  _getPaginatedEmployees(employees) {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return employees.slice(start, start + this.itemsPerPage);
  }

  _handleSearch(e) {
    store.dispatch({
      type: "SET_SEARCH_QUERY",
      payload: e.target.value,
    });
  }

  _setDisplayMode(mode) {
    store.dispatch({
      type: "SET_DISPLAY_MODE",
      payload: mode,
    });
  }

  _handlePageChange(e) {
    store.dispatch({
      type: "SET_CURRENT_PAGE",
      payload: e.detail.page,
    });
  }

  _handleEdit(id) {
    window.location.href = `/employee/edit/${id}`;
  }

  _handleDelete(id) {
    this.employeeToDelete = id;
    const modal = this.shadowRoot.querySelector("modal-dialog");
    modal.show(
      msg("Delete"),
      msg("Are you sure you want to delete this employee?"),
    );
    // if (confirm(msg("Are you sure you want to delete this employee?"))) {
    //   store.dispatch({
    //     type: "DELETE_EMPLOYEE",
    //     payload: id,
    //   });
    // }
  }

  _confirmDelete() {
    if (this.employeeToDelete) {
      store.dispatch({
        type: "DELETE_EMPLOYEE",
        payload: this.employeeToDelete,
      });
      this.employeeToDelete = null;
    }
  }

  _cancelDelete() {
    this.employeeToDelete = null;
  }
}

customElements.define("employee-list", EmployeeList);
