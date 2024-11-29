import { LitElement, html, css } from "lit";
import { connect } from "pwa-helpers/connect-mixin.js";
import { store } from "../store/store.js";
import { msg } from "@lit/localize";
import { DEPARTMENTS, POSITIONS } from "../constants/departments.js";
import {
  validateEmail,
  validatePhone,
  validateDateOfBirth,
  validateEmploymentDate,
} from "../utils/validators.js";
import "../components/ui/form-field.js";
import "../components/ui/modal-dialog.js";

export class EmployeeForm extends connect(store)(LitElement) {
  static get properties() {
    return {
      employee: { type: Object },
      isEdit: { type: Boolean },
      errors: { type: Object },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 1rem;
        max-width: 600px;
        margin: 0 auto;
      }
      form {
        display: grid;
        gap: 1rem;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1rem;
      }
      button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      button[type="submit"] {
        background: #646cff;
        color: white;
      }
      button[type="button"] {
        background: #ccc;
      }
    `;
  }

  constructor() {
    super();
    this.employee = {
      firstName: "",
      lastName: "",
      dateOfEmployment: "",
      dateOfBirth: "",
      phoneNumber: "",
      email: "",
      department: "",
      position: "",
    };
    this.isEdit = false;
    this.errors = {};
  }

  render() {
    return html`
      <h2>${this.isEdit ? msg("Update Employee") : msg("Add Employee")}</h2>
      <form @submit=${this._handleSubmit}>
        <form-field
          label=${msg("First Name")}
          type="text"
          name="firstName"
          .value=${this.employee.firstName}
          required
          .error=${this.errors.firstName}
          @field-change=${this._handleFieldChange}
        ></form-field>

        <form-field
          label=${msg("Last Name")}
          type="text"
          name="lastName"
          .value=${this.employee.lastName}
          required
          .error=${this.errors.lastName}
          @field-change=${this._handleFieldChange}
        ></form-field>

        <form-field
          label=${msg("Date of Employment")}
          type="date"
          name="dateOfEmployment"
          .value=${this.employee.dateOfEmployment}
          required
          .error=${this.errors.dateOfEmployment}
          @field-change=${this._handleFieldChange}
        ></form-field>

        <form-field
          label=${msg("Date of Birth")}
          type="date"
          name="dateOfBirth"
          .value=${this.employee.dateOfBirth}
          required
          .error=${this.errors.dateOfBirth}
          @field-change=${this._handleFieldChange}
        ></form-field>

        <form-field
          label=${msg("Phone Number")}
          type="tel"
          name="phoneNumber"
          .value=${this.employee.phoneNumber}
          required
          .error=${this.errors.phoneNumber}
          @field-change=${this._handleFieldChange}
        ></form-field>

        <form-field
          label=${msg("Email Address")}
          type="email"
          name="email"
          .value=${this.employee.email}
          required
          .error=${this.errors.email}
          @field-change=${this._handleFieldChange}
        ></form-field>

        <form-field
          label=${msg("Department")}
          type="select"
          name="department"
          .value=${this.employee.department}
          .options=${Object.values(DEPARTMENTS).map((dept) => ({
            value: dept,
            label: msg(dept),
          }))}
          required
          .error=${this.errors.department}
          @field-change=${this._handleFieldChange}
        ></form-field>

        <form-field
          label=${msg("Position")}
          type="select"
          name="position"
          .value=${this.employee.position}
          .options=${Object.values(POSITIONS).map((pos) => ({
            value: pos,
            label: msg(pos),
          }))}
          required
          .error=${this.errors.position}
          @field-change=${this._handleFieldChange}
        ></form-field>

        <div class="actions">
          <button type="button" @click=${this._handleCancel}>
            ${msg("Cancel")}
          </button>
          <button type="submit">
            ${this.isEdit ? msg("Update") : msg("Add")}
          </button>
        </div>
      </form>

      <modal-dialog
        @modal-confirm=${this._confirmSubmit}
        @modal-cancel=${this._cancelSubmit}
      ></modal-dialog>
    `;
  }

  _handleFieldChange(e) {
    const { name, value } = e.detail;
    this.employee = {
      ...this.employee,
      [name]: value,
    };
    this.errors = {
      ...this.errors,
      [name]: "",
    };
  }

  _validate() {
    const errors = {};

    if (!validateEmail(this.employee.email)) {
      errors.email = msg("Please enter a valid email address");
    }

    if (!validatePhone(this.employee.phoneNumber)) {
      errors.phoneNumber = msg("Please enter a valid 10-digit phone number");
    }

    if (!validateDateOfBirth(this.employee.dateOfBirth)) {
      errors.dateOfBirth = msg("Employee must be between 18 and 70 years old");
    }

    if (!validateEmploymentDate(this.employee.dateOfEmployment)) {
      errors.dateOfEmployment = msg("Employment date cannot be in the future");
    }

    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  _handleSubmit(e) {
    e.preventDefault();

    if (!this._validate()) return;

    const modal = this.shadowRoot.querySelector("modal-dialog");
    modal.show(
      this.isEdit ? msg("Update Employee") : msg("Add Employee"),
      this.isEdit
        ? msg("Are you sure you want to update this employee?")
        : msg("Are you sure you want to add this employee?"),
    );
  }

  _confirmSubmit() {
    store.dispatch({
      type: this.isEdit ? "UPDATE_EMPLOYEE" : "ADD_EMPLOYEE",
      payload: this.employee,
    });
    window.location.href = "/";
  }

  _cancelSubmit() {
    // Do nothing, just close the modal
  }

  _handleCancel() {
    window.location.href = "/";
  }
}

customElements.define("employee-form", EmployeeForm);
