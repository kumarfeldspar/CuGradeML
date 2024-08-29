import styled from "styled-components";

// Styled component named 'Wrapper' for styling a navigation bar
const Wrapper = styled.nav`
  /* Set the height of the nav bar using a CSS variable */
  height: var(--nav-height);

  /* Use flexbox for layout and center align items */
  display: flex;
  align-items: center;
  justify-content: center;

  /* Add a subtle box-shadow to the bottom of the nav bar */
  box-shadow: 0 1px 0px 0px rgba(0, 0, 0, 0.1);

  /* Style the logo container */
  .logo {
    display: flex;
    align-items: center;
    width: 100px; /* Set a fixed width for the logo */
  }

  /* Style the center section of the nav bar */
  .nav-center {
    display: flex;
    width: 90vw; /* Set width to 90% of the viewport width */
    align-items: center;
    justify-content: space-between; /* Space elements evenly across the nav bar */
  }

  /* Style for the button used to toggle a menu (e.g., in mobile view) */
  .toggle-btn {
    background: transparent; /* Make the button background transparent */
    border-color: transparent; /* Remove border */
    font-size: 1.75rem; /* Set large font size for visibility */
    color: var(--primary-500); /* Use primary color defined in CSS variables */
    cursor: pointer; /* Show pointer cursor on hover */
    display: flex;
    align-items: center;
  }

  /* Set the background color of the nav bar using a CSS variable */
  background: var(--white);

  /* Container for buttons, relative positioning allows dropdowns to be positioned correctly */
  .btn-container {
    position: relative;
  }

  /* Style for buttons in the nav bar */
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0 0.5rem; /* Add space between button content (e.g., icon and text) */
    position: relative;
    box-shadow: var(--shadow-2); /* Apply a shadow effect to the button */
  }

  /* Style for the dropdown menu */
  .dropdown {
    position: absolute; /* Position the dropdown absolutely relative to its container */
    top: 40px; /* Position it below the button */
    left: 0;
    width: 100%;
    background: var(
      --primary-100
    ); /* Set background color using a CSS variable */
    box-shadow: var(--shadow-2); /* Apply shadow to the dropdown */
    padding: 0.5rem; /* Add padding inside the dropdown */
    text-align: center;
    visibility: hidden; /* Initially hide the dropdown */
    border-radius: var(
      --borderRadius
    ); /* Apply border-radius for rounded corners */
  }

  /* Modifier class to show the dropdown */
  .show-dropdown {
    visibility: visible; /* Make the dropdown visible */
  }

  /* Style for buttons inside the dropdown menu */
  .dropdown-btn {
    background: transparent; /* Transparent background */
    border-color: transparent; /* No border */
    color: var(--primary-500); /* Set text color using a CSS variable */
    letter-spacing: var(
      --letterSpacing
    ); /* Adjust letter spacing using a variable */
    text-transform: capitalize; /* Capitalize text */
    cursor: pointer; /* Pointer cursor on hover */
  }

  /* Style for the logo text (hidden by default) */
  .logo-text {
    display: none; /* Hide the logo text by default */
    margin: 0; /* Remove margin */
  }

  /* Media query for larger screens (minimum width of 992px) */
  @media (min-width: 992px) {
    position: sticky; /* Make the nav bar sticky (it will stick to the top of the page) */
    top: 0; /* Stick to the top of the viewport */

    .nav-center {
      width: 90%; /* Adjust width of nav bar for larger screens */
    }

    .logo {
      display: none; /* Hide the logo image on larger screens */
    }

    .logo-text {
      display: block; /* Show the logo text on larger screens */
    }
  }
`;

export default Wrapper;
