import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { testThunk } from "./testThunk"; // Import the test thunk for testing data
import { trainThunk } from "./trainThunk"; // Import the train thunk for training data
import { toast } from "react-toastify"; // Import toast for displaying notifications

// Define the initial state for the estimation data slice
const initialState = {
  t1: 1, // Initial value for parameter t1
  t2: 2, // Initial value for parameter t2
  t3: 3, // Initial value for parameter t3
  t4: 4, // Initial value for parameter t4
  t5: 5, // Initial value for parameter t5
  t6: 6, // Initial value for parameter t6
  n_estimators: 30, // Number of estimators for model training
  max_depth: 30, // Maximum depth for model training
  loss: "quantile", // Loss function to be used in the model
  learning_rate: 0.5, // Learning rate for model training
  criterion: "friedman_mse", // Criterion for model training
  parsedData: [], // Array to store the parsed CSV data
  isTraining: false, // Flag to indicate if training is in progress
  isTesting: false, // Flag to indicate if testing is in progress
  selectedInputHeaders: [], // Array to store selected input headers
  selectedOutputHeaders: [], // Array to store selected output headers
  trainingPlot: null, // Variable to store the training plot or result
};

// Define async thunks for testing and training data
export const testData = createAsyncThunk("estimationData/test", testThunk);
export const trainData = createAsyncThunk("estimationData/train", trainThunk);

// Create a slice for estimation data with reducers and extra reducers
const estimationDataSlice = createSlice({
  name: "estimationData", // Name of the slice
  initialState, // Initial state defined above
  reducers: {
    // A reducer to handle changes in form input fields
    handleChange: (state, { payload: { name, value } }) => {
      state[name] = value; // Update the state with the new value for the corresponding field
    },
  },
  extraReducers: (builder) => {
    // Handle the async actions for testing data
    builder
      .addCase(testData.fulfilled, (state, { payload }) => {
        state.isTesting = false; // Set isTesting flag to false when testing is complete
        console.log("payload =", payload); // Log the payload for debugging
        state.parsedData = payload; // Update parsedData with the response from the test
      })
      .addCase(testData.rejected, (state, { payload }) => {
        state.isTesting = false; // Set isTesting flag to false if testing fails
        console.log(payload); // Log the error payload for debugging
        toast.error("Server Error."); // Display an error toast notification
      })
      .addCase(testData.pending, (state, { payload }) => {
        state.isTesting = true; // Set isTesting flag to true when testing is in progress
        console.log(payload); // Log the pending state payload for debugging
      })
      // Handle the async actions for training data
      .addCase(trainData.pending, (state) => {
        state.isTraining = true; // Set isTraining flag to true when training is in progress
      })
      .addCase(trainData.fulfilled, (state, { payload }) => {
        state.isTraining = false; // Set isTraining flag to false when training is complete
        console.log(payload); // Log the payload for debugging
        state.trainingPlot = payload; // Update trainingPlot with the response from the training
      })
      .addCase(trainData.rejected, (state, { payload }) => {
        state.isTraining = false; // Set isTraining flag to false if training fails
        console.log(payload); // Log the error payload for debugging
        toast.error("Please Enter Correct Parameters."); // Display an error toast notification
      });
  },
});

export default estimationDataSlice.reducer; // Export the reducer function from the slice
export const { handleChange } = estimationDataSlice.actions; // Export the handleChange action from the slice
