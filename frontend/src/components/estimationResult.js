// Purpose: Display the Training plot image in a React component.

// Import the useSelector hook from the React-Redux library. This hook allows
// you to extract data from the Redux store's state.
import { useSelector } from "react-redux";

// Import the Wrapper component, which is likely a styled container for the component's layout.
import Wrapper from "../Wrappers/ParametersForm";

// Define the EstimationResult functional component.
const EstimationResult = () => {
  // Use the useSelector hook to retrieve the trainingPlot data from the Redux store.
  // The trainingPlot is expected to be part of the estimationData slice of the store's state.
  const { trainingPlot } = useSelector((store) => store.estimationData);

  // If trainingPlot is not available (i.e., it's undefined or null), return null.
  // This prevents rendering the component until the data is available.
  if (!trainingPlot) {
    return null; // Image data not available yet
  }

  // If trainingPlot is available, render the component with the following structure.
  return (
    <Wrapper>
      {/* Main container for the form and the plot */}
      <div className="form form-row form-container">
        <h3>Training Plot</h3>
        {/* Center the image within the form */}
        <div className="form-center">
          {/* Display the training plot image using the src attribute to bind the trainingPlot data */}
          <img
            src={trainingPlot}
            alt="Training Plot"
            className="resized-image"
          />
        </div>
      </div>
    </Wrapper>
  );
};

// Export the EstimationResult component as the default export of the module.
export default EstimationResult;
