import React from "react";

// The FormRowSelect component is a reusable form element that renders a label and a select dropdown.
// Props:
// - labelText: The text to display as the label. If not provided, the 'name' prop will be used.
// - name: The name and id for the select element, used for form data handling.
// - value: The currently selected value in the dropdown.
// - handleChange: The function to call when the selected value changes.
// - list: An array of options to display in the dropdown.

const FormRowSelect = ({ labelText, name, value, handleChange, list }) => {
  return (
    // Container for the label and select elements.
    <div className="form-row">
      {/* Label for the select dropdown. 
          The 'htmlFor' attribute associates the label with the select element by its 'id'. */}
      <label htmlFor={name} className="form-label">
        {/* Display labelText if provided; otherwise, fallback to the 'name' prop. */}
        {labelText || name}
      </label>

      {/* The select dropdown element. 
          The 'name' and 'id' attributes are set for form data and accessibility.
          The 'value' prop controls the currently selected option.
          The 'onChange' prop triggers the handleChange function when a new option is selected. */}
      <select
        name={name}
        value={value}
        id={name}
        onChange={handleChange}
        className="form-select"
      >
        {/* Iterate over the list array to create an <option> element for each item.
            Each option's key is its index in the array to ensure uniqueness.
            The option's value and display text are both set to the itemValue. */}
        {list.map((itemValue, index) => {
          return (
            <option key={index} value={itemValue}>
              {itemValue}
            </option>
          );
        })}
      </select>
    </div>
  );
};

// Export the FormRowSelect component as the default export.
export default FormRowSelect;
