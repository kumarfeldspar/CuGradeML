import React from "react";
import CSVDataTable from "./CSVDataTable"; // Import the CSVDataTable component for displaying tabular data
import { useSelector } from "react-redux"; // Import the useSelector hook from react-redux for accessing the Redux store
import NavBar from "./NavBar"; // Import the NavBar component for navigation
import TestingForm from "./testingForm"; // Import the TestingForm component for testing-related inputs
import TrainingForm from "./trainingForm"; // Import the TrainingForm component for training-related inputs
import EstimationResult from "./estimationResult"; // Import the EstimationResult component to display results

// The Home component is the main container component that combines various other components to form the homepage
const Home = () => {
  // Use the useSelector hook to extract the parsedData from the Redux store's estimationData slice.
  // This parsedData will be passed to the CSVDataTable component for display.
  const { parsedData } = useSelector((store) => store.estimationData);

  return (
    <div>
      {/* Render the NavBar component at the top of the page for site navigation */}
      <NavBar />

      {/* The form-container div wraps the TrainingForm and TestingForm components */}
      <div className="form-container">
        <TrainingForm />{" "}
        {/* Renders the TrainingForm component for inputting training data */}
        <TestingForm />{" "}
        {/* Renders the TestingForm component for inputting testing data */}
      </div>

      {/* Render the EstimationResult component to display the estimation results */}
      <EstimationResult />

      {/* Render the CSVDataTable component and pass the parsedData from the Redux store to it.
          This will display the parsed data in a tabular format. */}
      <CSVDataTable data={parsedData} />
    </div>
  );
};

export default Home; // Export the Home component as the default export
