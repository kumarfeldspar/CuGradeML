import React from "react"; // Import React to create components
import Home from "./components/Home"; // Import the Home component
import { Provider } from "react-redux"; // Import Provider to connect Redux with React
import { store } from "./store"; // Import the Redux store
import { ToastContainer } from "react-toastify"; // Import the ToastContainer for toast notifications
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for the ToastContainer

// The main App component
function App() {
  return (
    // The Provider component makes the Redux store available to all components in the app
    <Provider store={store}>
      {/* ToastContainer displays toast notifications at the top-center of the screen */}
      <ToastContainer position="top-center" />

      {/* The Home component is the main content of the app */}
      <Home />
    </Provider>
  );
}

export default App; // Export the App component as the default export
