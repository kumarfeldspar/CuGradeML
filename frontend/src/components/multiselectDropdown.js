import React, { useState } from "react";

// MultiSelectDropdown is a reusable component that allows users to select multiple options from a list.
// Props:
// - name: The name for the dropdown, used for labeling.
// - options: An array of options to display as checkboxes.
// - targetList: A key or identifier passed to the onChange function to identify which dropdown changed.
// - onChange: A callback function to notify the parent component of changes to the selected options.

const MultiSelectDropdown = ({ name, options, targetList, onChange }) => {
  // State to manage the currently selected options.
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Function to handle the selection or deselection of an option.
  const handleOptionToggle = (option) => {
    // Find the index of the option in the selectedOptions array.
    const selectedIndex = selectedOptions.indexOf(option);

    // Create a new array to hold the updated selection.
    let newSelectedOptions = [...selectedOptions];

    // If the option is not already selected, add it to the array.
    if (selectedIndex === -1) {
      newSelectedOptions.push(option);
    } else {
      // If the option is already selected, remove it from the array.
      newSelectedOptions.splice(selectedIndex, 1);
    }

    // Update the selected options state.
    setSelectedOptions(newSelectedOptions);

    // Notify the parent component of the change, passing the updated selected options.
    onChange(targetList, newSelectedOptions);
  };

  return (
    <div className="form-row">
      {/* Label for the group of checkboxes */}
      <label htmlFor={name} className="form-label">
        {name}
      </label>

      {/* Map over the options array to create a checkbox for each option */}
      {options.map((option) => (
        <div key={option}>
          {/* Checkbox input for the option */}
          <input
            type="checkbox"
            id={option}
            value={option}
            // The checkbox is checked if the option is in the selectedOptions array
            checked={selectedOptions.includes(option)}
            // Call handleOptionToggle with the option when the checkbox is changed
            onChange={() => handleOptionToggle(option)}
          />
          {/* Label for the checkbox, tied to the checkbox via the htmlFor attribute */}
          <label htmlFor={option}>{option}</label>
        </div>
      ))}
    </div>
  );
};

// Export the MultiSelectDropdown component as the default export.
export default MultiSelectDropdown;
