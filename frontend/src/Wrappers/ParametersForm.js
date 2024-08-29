import styled from "styled-components";

// Styled component named 'Wrapper' for styling a section of a form
const Wrapper = styled.section`
  /* General form styling */
  .form {
    width: 100%; /* Form takes full width */
    max-width: 100%; /* Prevents the form from exceeding 100% width */
  }

  /* Common styles for form inputs, selects, and block buttons */
  .form-input,
  .form-select,
  .btn-block {
    height: 35px; /* Uniform height for inputs, selects, and buttons */
  }

  /* Style for individual form rows */
  .form-row {
    margin-bottom: 0; /* Remove margin at the bottom of form rows */
  }

  /* Form layout using CSS grid */
  .form-center {
    display: grid; /* Use CSS grid for layout */
    grid-template-columns: 1fr; /* One column layout by default */
    column-gap: 2rem; /* Gap between columns */
    row-gap: 0.5rem; /* Gap between rows */
  }

  /* Style for block buttons */
  .btn-block {
    align-self: end; /* Align button to the end of its container */
    margin-top: 1rem; /* Add space above the button */
  }

  /* Responsive design for screens wider than 768px */
  @media (min-width: 768px) {
    .form-center {
      grid-template-columns: 1fr 1fr; /* Two-column layout for larger screens */
    }
  }

  /* Responsive design for screens wider than 992px */
  @media (min-width: 992px) {
    .form-center {
      grid-template-columns: 1fr 1fr; /* Maintain two-column layout for even larger screens */
    }
  }
`;

export default Wrapper;
