import { configureStore } from "@reduxjs/toolkit"; // Import configureStore from Redux Toolkit
import estimationDataSlice from "./features/estimationData/estimationDataSlice"; // Import the slice reducer for estimation data

// Create and configure the Redux store
export const store = configureStore({
  reducer: {
    // Add the estimationData slice reducer to the store
    estimationData: estimationDataSlice,
  },
});
