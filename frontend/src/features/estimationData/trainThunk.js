// src/features/estimationData/trainThunk.js

import customFetch, { checkForUnauthorizedResponse } from "../../utils/axios";

// Asynchronous thunk function for handling the training process
export const trainThunk = async (trainingData, thunkAPI) => {
  try {
    // Log the training data being sent to the server for debugging

    // Send a POST request to the '/train' endpoint with the training data
    // The response is expected to be in 'blob' format, typically used for binary data like images
    const { data } = await customFetch.post("/train", trainingData, {
      responseType: "blob", // Specify that the response is a binary large object (blob)
    });


    // Create a new Blob object from the response data
    const blob = new Blob([data]);

    // Generate a URL for the Blob, which can be used to download or display the file
    const url = URL.createObjectURL(blob);

    // Return the URL so it can be used by the calling function/component
    return url;
  } catch (error) {
    // If an error occurs, check if it's an unauthorized response
    // Use the 'checkForUnauthorizedResponse' function to handle the error accordingly
    return checkForUnauthorizedResponse(error.response.data.msg);
  }
};
