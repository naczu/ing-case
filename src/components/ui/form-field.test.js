import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "./form-field.js";

describe("FormField", () => {
  it("renders input field correctly", async () => {
    const el = await fixture(html`
      <form-field
        label="Test Field"
        type="text"
        name="test"
        value="test value"
      ></form-field>
    `);
    const input = el.shadowRoot.querySelector("input");
    expect(input).to.exist;
    expect(input.value).to.equal("test value");
  });

  it("renders select field correctly", async () => {
    const options = [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2" },
    ];

    const el = await fixture(html`
      <form-field
        label="Test Select"
        type="select"
        name="test"
        .options=${options}
      ></form-field>
    `);

    const select = el.shadowRoot.querySelector("select");
    expect(select).to.exist;
    expect(select.options.length).to.equal(options.length + 1); // +1 for placeholder
  });

  it("emits field-change event on input", async () => {
    const el = await fixture(html`
      <form-field label="Test Field" type="text" name="test"></form-field>
    `);

    const input = el.shadowRoot.querySelector("input");
    setTimeout(() => {
      input.value = "new value";
      input.dispatchEvent(new Event("input"));
    });

    const { detail } = await oneEvent(el, "field-change");
    expect(detail).to.deep.equal({
      name: "test",
      value: "new value",
    });
  });

  it("displays error message when provided", async () => {
    const el = await fixture(html`
      <form-field
        label="Test Field"
        type="text"
        name="test"
        error="Error message"
      ></form-field>
    `);

    const error = el.shadowRoot.querySelector(".error");
    expect(error).to.exist;
    expect(error.textContent).to.equal("Error message");
  });
});
