import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Wrapper from "../Wrappers/ParametersForm";
import {
  handleChange,
  trainData,
} from "../features/estimationData/estimationDataSlice";
import FormRow from "./FormRow";
import MultiSelectDropdown from "./multiselectDropdown";
import { toast } from "react-toastify";

const TrainingForm = () => {
  // Extract relevant state values from the Redux store using the useSelector hook.
  const {
    n_estimators,
    max_depth,
    loss,
    learning_rate,
    criterion,
    selectedInputHeaders,
    selectedOutputHeaders,
    isTraining,
  } = useSelector((store) => store.estimationData);

  // Initialize the useDispatch hook for dispatching actions.
  const dispatch = useDispatch();

  // Local state for managing the selected CSV file, parsed CSV data, and headers.
  const [csvFile, setCSVFile] = useState(null);
  const [csvData, setCSVData] = useState([]);
  const [headersList, setHeadersList] = useState([]);

  // Handle changes in the MultiSelectDropdown components (for input and output headers).
  const handleDropdownChange = (targetList, headers) => {
    // Dispatch an action to update the relevant selected headers in the Redux store.
    dispatch(handleChange({ name: targetList, value: headers }));
  };

  // Handle changes when a file is selected.
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setCSVFile(file);
    console.log(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvText = e.target.result;
        setCSVData(csvText);

        // Split the CSV data into lines and extract headers.
        const lines = csvText.split("\n");
        const headers = lines[0].split(",");
        setHeadersList(headers);
      };

      // Read the file content as text.
      reader.readAsText(file);
    }
  };

  // Parse CSV data to extract rows either from the start ('Head') or end ('Tail').
  const parseCSV = (csvText, type) => {
    if (csvText.length === 0) {
      return;
    }

    const lines = csvText.split("\n");
    const headers = lines[0].split(",");
    const parsedData = [];

    // Determine the range of lines to parse based on the type ('Head' or 'Tail').
    const startIndex = type === "Head" ? 1 : Math.max(1, lines.length - 11);
    const endIndex =
      type === "Head" ? Math.min(11, lines.length) : lines.length;

    for (let i = startIndex; i < endIndex; i++) {
      const currentLine = lines[i].split(",");

      // Only add rows where the number of values matches the number of headers.
      if (currentLine.length === headers.length) {
        const row = {};
        for (let j = 0; j < headers.length; j++) {
          row[headers[j].trim()] = currentLine[j].trim();
        }
        parsedData.push(row);
      }
    }

    // Dispatch an action to update the parsed data in the Redux store.
    dispatch(handleChange({ name: "parsedData", value: parsedData }));
  };

  // Handle form submission to start the training process.
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate that all required fields and data are provided.
    if (
      !selectedInputHeaders.length ||
      !selectedOutputHeaders.length ||
      !csvFile ||
      !n_estimators ||
      !max_depth ||
      !loss ||
      !learning_rate ||
      !criterion
    ) {
      toast.error("Please enter all parameters");
      return;
    }

    // Create a FormData object to send the form data to the backend.
    const formData = new FormData();
    formData.append("n_estimators", n_estimators);
    formData.append("max_depth", max_depth);
    formData.append("loss", loss);
    formData.append("learning_rate", learning_rate);
    formData.append("criterion", criterion);
    formData.append("selectedInputHeaders", selectedInputHeaders);
    formData.append("selectedOutputHeaders", selectedOutputHeaders);
    formData.append("csvData", csvFile);

    // Dispatch the trainData action with the form data.
    dispatch(trainData(formData));
  };

  // Handle changes in input fields.
  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    // Dispatch an action to update the input values in the Redux store.
    dispatch(handleChange({ name, value }));
  };

  return (
    <Wrapper>
      <form className="form form-row">
        <h3>Training Data</h3>
        {/* File input for selecting a CSV file */}
        <FormRow
          name="CSV File"
          type="file"
          handleChange={handleFileChange}
          acceptFormat=".csv"
        />

        {/* Buttons to parse the head or tail of the CSV file */}
        <div className="btn-container ">
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
          {/* MultiSelectDropdown components for selecting input and output parameters */}
          <MultiSelectDropdown
            name="Input Parameters"
            options={headersList}
            targetList="selectedInputHeaders"
            onChange={handleDropdownChange}
          />
          <MultiSelectDropdown
            name="Output Parameters"
            options={headersList}
            targetList="selectedOutputHeaders"
            onChange={handleDropdownChange}
          />

          {/* Input fields for various hyperparameters */}
          <FormRow
            type="number"
            name="n_estimators"
            value={n_estimators}
            handleChange={handleInput}
          />
          <FormRow
            type="number"
            name="max_depth"
            value={max_depth}
            handleChange={handleInput}
          />
          <FormRow
            type="text"
            name="loss"
            value={loss}
            handleChange={handleInput}
          />
          <FormRow
            type="number"
            name="learning_rate"
            value={learning_rate}
            handleChange={handleInput}
          />
          <FormRow
            type="text"
            name="criterion"
            value={criterion}
            handleChange={handleInput}
          />
        </div>

        {/* Submit button to start training */}
        <button type="submit" className="btn btn-block" onClick={handleSubmit}>
          {isTraining ? "Training ..." : "Train"}
        </button>
      </form>
    </Wrapper>
  );
};

export default TrainingForm;
