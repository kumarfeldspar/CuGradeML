import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormRow from "./FormRow"; // Import the FormRow component for form input fields
import Wrapper from "../Wrappers/ParametersForm"; // Import the Wrapper component for styling
import {
  handleChange,
  testData,
} from "../features/estimationData/estimationDataSlice"; // Import Redux actions
import { toast } from "react-toastify"; // Import toast for displaying notifications

// The TestingForm component handles the testing process, including uploading a CSV file,
// parsing the file, and submitting the data for testing.
const TestingForm = () => {
  // Extract necessary state variables from the Redux store's estimationData slice
  const {
    t1,
    t2,
    t3,
    t4,
    t5,
    t6,
    isTesting,
    selectedInputHeaders,
    selectedOutputHeaders,
  } = useSelector((store) => store.estimationData);
  const dispatch = useDispatch(); // Get the dispatch function to send actions to the Redux store

  const [csvFile, setCSVFile] = useState(null); // State to hold the uploaded CSV file
  const [csvData, setCSVData] = useState([]); // State to hold the parsed CSV data

  // Handle changes to input fields, updating the Redux store
  const handleInput = (e) => {
    const name = e.target.name; // Get the name of the input field
    const value = e.target.value; // Get the value entered by the user
    dispatch(handleChange({ name, value })); // Dispatch the handleChange action to update the store
  };

  // Handle changes to the file input field when a CSV file is selected
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the first selected file
    setCSVFile(file); // Update the local state with the selected file
    console.log(file); // Log the file object for debugging

    if (file) {
      const reader = new FileReader(); // Create a new FileReader to read the file content
      reader.onload = (e) => {
        const csvText = e.target.result; // Get the file content as text
        setCSVData(csvText); // Update the local state with the CSV content
      };
      reader.readAsText(file); // Read the file as text
    }
  };

  // Parse the CSV data into an array of objects based on the type (Head or Tail)
  const parseCSV = (csvText, type) => {
    if (csvText.length === 0) {
      return; // Exit if the CSV text is empty
    }

    const lines = csvText.split("\n"); // Split the CSV text into lines
    const headers = lines[0].split(","); // Extract headers from the first line
    const parsedData = [];

    // Determine the start and end index based on whether 'Head' or 'Tail' is selected
    const startIndex = type === "Head" ? 1 : Math.max(1, lines.length - 11);
    const endIndex =
      type === "Head" ? Math.min(11, lines.length) : lines.length;

    for (let i = startIndex; i < endIndex; i++) {
      const currentLine = lines[i].split(","); // Split each line into values
      if (currentLine.length === headers.length) {
        const row = {};
        for (let j = 0; j < headers.length; j++) {
          row[headers[j].trim()] = currentLine[j].trim(); // Create an object with header-value pairs
        }
        parsedData.push(row); // Add the row object to the parsedData array
      }
    }
    dispatch(handleChange({ name: "parsedData", value: parsedData })); // Dispatch an action to update parsedData in the Redux store
  };

  // Handle form submission, validating the input fields before dispatching the testData action
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Check if all required inputs and the CSV file are provided
    if (!t1 || !t2 || !t3 || !t4 || !t5 || !t6 || !csvFile) {
      toast.error("Please enter all parameters"); // Show an error message if any input is missing
      return;
    }

    // Create a FormData object to hold the form inputs and CSV file
    const formData = new FormData();
    formData.append("t1", t1);
    formData.append("t2", t2);
    formData.append("t3", t3);
    formData.append("t4", t4);
    formData.append("t5", t5);
    formData.append("t6", t6);
    formData.append("selectedInputHeaders", selectedInputHeaders);
    formData.append("selectedOutputHeaders", selectedOutputHeaders);
    formData.append("csvData", csvFile);

    // Dispatch the testData action to submit the formData for testing
    dispatch(testData(formData));
  };

  return (
    <Wrapper>
      <form className="form form-row">
        <h3>Testing Data</h3> {/* Section header for the form */}
        {/* File input for uploading the CSV file */}
        <FormRow
          name="CSV File"
          type="file"
          handleChange={handleFileChange}
          acceptFormat=".csv"
        />
        {/* Buttons to parse the CSV data and view the first or last 10 rows */}
        <div className="btn-container">
          <button
            type="button"
            className="btn"
            onClick={() => parseCSV(csvData, "Head")}
          >
            Head
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => parseCSV(csvData, "Tail")}
          >
            Tail
          </button>
        </div>
        <div className="form-center">
          {/* Additional form inputs or elements can be added here */}
        </div>
        {/* Submit button for the form */}
        <button type="submit" className="btn btn-block" onClick={handleSubmit}>
          {isTesting ? "Testing..." : "Test"}{" "}
          {/* Button text changes based on the isTesting state */}
        </button>
      </form>
    </Wrapper>
  );
};

export default TestingForm; // Export the TestingForm component as the default export
