import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { testThunk } from "./testThunk";
import { trainThunk } from "./trainThunk";
import { toast } from "react-toastify";

const initialState = {
  model: "GBMREG",
  selectedInputHeaders: [],
  selectedOutputHeaders: [],
  parsedData: [],
  csvFile: null,
  csvTestFile: null,
  csvTrainingFile: null,
  isTraining: false,
  isTesting: false,
  trainingPlot: null,
  testPlot: null,
  isTestMode: false,
  extractedFiles: {}, // Moved into initialState
  // GBM Parameters
  gbm_n_estimators: 30,
  gbm_max_depth: 30,
  gbm_loss: "quantile",
  gbm_learning_rate: 0.5,
  gbm_criterion: "friedman_mse",
  // GBM_MODEL Parameters
  gbm_model_n_estimators: 50,
  gbm_model_max_depth: 25,
  gbm_model_loss: "huber",
  gbm_model_learning_rate: 0.3,
  gbm_model_criterion: "friedman_mse",
  // GBMREG Parameters
  gbmreg_n_estimators: 200,
  gbmreg_max_depth: 20,
  gbmreg_loss: "absolute_error",
  gbmreg_learning_rate: 0.2,
  gbmreg_criterion: "friedman_mse",
  // Random Forest Specific Parameters
  rf_n_estimators: 75,
  rf_criterion: "squared_error",
  rf_max_depth: 12,
  rf_max_features: "sqrt",
  rf_bootstrap: true,
  rf_min_samples_leaf: 1,
  rf_min_samples_split: 2,
  // Random Forest Testing Parameters
  rf_t1: "",
  rf_t2: "",
  rf_t3: "",
  rf_t4: "",
  rf_t5: "",
  rf_t6: "",
};

export const testData = createAsyncThunk("estimationData/test", testThunk);
export const trainData = createAsyncThunk("estimationData/train", trainThunk);

const estimationDataSlice = createSlice({
  name: "estimationData",
  initialState,
  reducers: {
    handleChange: (state, { payload: { name, value } }) => {
      state[name] = value;
    },
    toggleTestMode: (state) => {
      state.isTestMode = !state.isTestMode;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(testData.pending, (state) => {
        state.isTesting = true;
      })
      .addCase(testData.fulfilled, (state, { payload }) => {
        console.log(state, payload, "State and Payload in TestData Fulfilled");
        state.isTesting = false;
        state.csvFile = payload.csvFile; // Store the CSV file
        state.csvTestFile = payload.csvFile; // Store the URL
        state.extractedFiles = payload.extractedFiles; // Store extracted files
        // Find and set testPlot if a .png file exists in extractedFiles
        const pngFileKey = Object.keys(payload.extractedFiles).find((key) =>
          key.endsWith(".png")
        );
        if (pngFileKey) {
          state.testPlot = payload.extractedFiles[pngFileKey];
        }
      })
      .addCase(testData.rejected, (state, { payload }) => {
        state.isTesting = false;
        toast.error(payload || "Testing failed. Please try again.");
      })
      .addCase(trainData.pending, (state) => {
        state.isTraining = true;
      })
      .addCase(trainData.fulfilled, (state, { payload }) => {
        state.isTraining = false;
        state.trainingPlot = payload;
      })
      .addCase(trainData.rejected, (state, { payload }) => {
        state.isTraining = false;
        console.error(payload);
        toast.error(
          payload || "Training failed. Please check your parameters."
        );
      });
  },
});

export default estimationDataSlice.reducer;
export const { handleChange, toggleTestMode } = estimationDataSlice.actions;
