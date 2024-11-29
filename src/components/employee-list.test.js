import { html, fixture, expect } from "@open-wc/testing";
import { stub } from "sinon";
import "./employee-list.js";

describe("EmployeeList", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<employee-list></employee-list>`);
  });

  it("renders in table mode by default", () => {
    const table = element.shadowRoot.querySelector("table");
    expect(table).to.exist;
  });

  it("filters employees based on search query", async () => {
    element.employees = [
      {
        firstName: "John",
        lastName: "Doe",
        department: "HR",
        position: "Manager",
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        department: "Marketing",
        position: "Director",
      },
    ];
    element.searchQuery = "John";
    await element.updateComplete;

    const filteredEmployees = element._getFilteredEmployees();
    expect(filteredEmployees.length).to.equal(1);
    expect(filteredEmployees[0].firstName).to.equal("John");
  });

  // it("confirms before deleting an employee", () => {
  //   const confirmStub = stub(window, "confirm").returns(true);

  //   element._handleDelete(1);

  //   expect(confirmStub.called).to.be.true;

  //   confirmStub.restore();
  // });
});
