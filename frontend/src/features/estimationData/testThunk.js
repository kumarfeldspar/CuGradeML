

import customFetch, { checkForUnauthorizedResponse } from "../../utils/axios";
import JSZip from "jszip";

// Asynchronous thunk function for handling the testing process
export const testThunk = async (testData, thunkAPI) => {
  try {
    // Log the testing data being sent to the server for debugging
    console.log("Sending testing data:", testData);

    // Send a POST request to the '/test' endpoint with the testing data
    // The response is expected to be in 'blob' format (binary data like files)
    const { data } = await customFetch.post("/test", testData, {
      responseType: "blob",
    });

    console.log("Received testing response:", data);

    // Create a new Blob object from the response data
    const zipBlob = new Blob([data]);

    // Initialize JSZip for extracting files from the zip
    const zip = await JSZip.loadAsync(zipBlob);

    // Find the first CSV file
    const csvFileKey = Object.keys(zip.files).find((key) =>
      key.endsWith(".csv")
    );
    let csvFile = null;
    if (csvFileKey) {
      const csvBlob = await zip.files[csvFileKey].async("blob");
      csvFile = new File([csvBlob], csvFileKey, { type: "text/csv" });
    }
    
    console.log(csvFile,"Final CSV File");

    // Initialize an object to hold extracted file URLs
    const extractedFiles = {};

    // Loop through each file in the zip and create a downloadable URL for it
    await Promise.all(
      Object.keys(zip.files).map(async (filename) => {
        const fileData = await zip.files[filename].async("blob");
        const fileUrl = URL.createObjectURL(fileData);
        extractedFiles[filename] = fileUrl;
      })
    );

    // Return the extracted file URLs and the csvFile
    return  {extractedFiles,csvFile};
  } catch (error) {
    // Log the error for debugging
    console.error("Testing failed:", error);

    // Handle unauthorized responses and other errors
    return checkForUnauthorizedResponse(error.response.data.msg);
  }
};
