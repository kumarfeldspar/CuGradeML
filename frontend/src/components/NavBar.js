import React from "react";
import Wrapper from "../Wrappers/NavBar"; // Import the Wrapper component from a Wrappers directory, likely used for styling

// The NavBar component renders a navigation bar for the application.
const NavBar = () => {
  return (
    // The Wrapper component is used here to encapsulate the styling or layout logic for the NavBar.
    <Wrapper>
      {/* The nav-center div contains the content of the navigation bar, centered within the Wrapper. */}
      <div className="nav-center nav-image">
        {/* This div contains the application title. */}
        <div>
          <h4 className="logo-text" style={{ textAlign: "center" }}>
            Development of AI Based integrated system for exploration targeting
            of copper deposits
          </h4>
          {/* Display the title or logo text */}
        </div>
      </div>
    </Wrapper>
  );
};

export default NavBar; // Export the NavBar component as the default export
