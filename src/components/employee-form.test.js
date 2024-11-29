import { html, fixture, expect } from "@open-wc/testing";
import { stub } from "sinon";
import "./employee-form.js";

describe("EmployeeForm", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<employee-form></employee-form>`);
  });

  it("prevents form submission with invalid data", async () => {
    const event = new Event("submit");
    event.preventDefault = stub();

    element.employee = {
      email: "invalid",
      phoneNumber: "123",
    };

    element._handleSubmit(event);
    expect(event.preventDefault.called).to.be.true;
  });
});
