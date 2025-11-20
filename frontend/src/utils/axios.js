import axios from "axios"; // Import the axios library to handle HTTP requests

// Create an axios instance with custom configuration
const customFetch = axios.create({
  baseURL: "http://127.0.0.1:8001", // Set the base URL for all requests made with this axios instance
  // You can also add other configurations like headers, timeout, etc., if needed
});

// Utility function to handle unauthorized responses
export const checkForUnauthorizedResponse = (error, thunkAPI) => {
  // This function checks for an unauthorized error response and handles it
  // It uses thunkAPI to reject the action with a specific error message
  return thunkAPI.rejectWithValue(error.response.data.msg);
  // The `msg` property in `error.response.data` is passed as the reason for rejection
};

// Export the custom axios instance as the default export
export default customFetch;
