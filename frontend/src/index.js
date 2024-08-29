import React from "react"; // Import React library for building UI components
import ReactDOM from "react-dom/client"; // Import ReactDOM for rendering components to the DOM
import "./index.css"; // Import global CSS styles
import App from "./App"; // Import the main App component

// Create a root element for React to render into
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the App component inside the root element
root.render(
  <React.StrictMode>
    {/* React.StrictMode helps identify potential problems in an application by intentionally invoking certain lifecycle methods twice */}
    <App />
  </React.StrictMode>
);
