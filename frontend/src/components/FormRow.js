import React from "react";

// FormRow is a reusable component that renders a label and an input field for forms.
// It accepts various props to customize the behavior and appearance of the input.
const FormRow = ({
  name,
  type,
  value,
  handleChange,
  labelText,
  acceptFormat,
}) => {
  return (
    <div className="form-row">
      {/* The label element is associated with the input field by the htmlFor attribute, 
          which should match the input's name attribute. The label text defaults to the 
          name if labelText is not provided. */}
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>

      {/* The input field's type, name, value, and onChange handler are determined by the 
          props passed to the FormRow component. If the input type is a file, the accept 
          attribute specifies the allowed file types. */}
      <input
        type={type}
        name={name}
        value={value}
        accept={acceptFormat}
        onChange={handleChange}
        className="form-input"
      />
    </div>
  );
};

export default FormRow;
