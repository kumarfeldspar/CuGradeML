import customFetch, { checkForUnauthorizedResponse } from "../../utils/axios";
// Import the custom axios instance and a utility function to handle unauthorized responses

// Function to parse a CSV string into an array of objects
const parseCSV = (csvText) => {
  if (csvText.length === 0) {
    return; // If the CSV text is empty, return immediately
  }

  const lines = csvText.split("\n"); // Split the CSV text into lines
  const headers = lines[0].split(","); // Extract headers from the first line
  const parsedData = []; // Initialize an array to store the parsed data

  // Iterate over the lines starting from the second line (skipping headers)
  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(","); // Split each line into individual values

    // Only process the line if the number of values matches the number of headers
    if (currentLine.length === headers.length) {
      const row = {}; // Initialize an object to represent the current row
      for (let j = 0; j < headers.length; j++) {
        row[headers[j].trim()] = currentLine[j].trim(); // Map each header to its corresponding value in the row
      }
      parsedData.push(row); // Add the row object to the parsed data array
    }
  }

  return parsedData; // Return the parsed data array
};

// Function to read a CSV file from a Blob and parse its content
async function getTextCSV(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader(); // Create a FileReader to read the Blob as text

    // Define what happens when the file is successfully read
    reader.onload = (e) => {
      const parsedData = parseCSV(e.target.result); // Parse the CSV text into an array of objects
      return resolve(parsedData); // Resolve the promise with the parsed data
    };

    // Define what happens if an error occurs during file reading
    reader.onerror = (e) => {
      return reject(e); // Reject the promise with the error
    };

    reader.readAsText(blob); // Start reading the Blob as a text file
  });
}

// Async thunk function to handle testing data by sending it to the server and processing the response
export const testThunk = async (testData) => {
  try {
    console.log("testing data: ", testData); // Log the testing data for debugging

    // Send a POST request to the server with the test data, expecting a blob response
    const { data } = await customFetch.post("/test", testData, {
      responseType: "blob",
    });

    const blob = new Blob([data]); // Create a Blob from the response data

    return await getTextCSV(blob); // Parse the Blob into CSV data and return it
  } catch (error) {
    console.log("ttt = ", error); // Log any errors that occur during the process
    return checkForUnauthorizedResponse(error.response.data.msg);
    // Check for unauthorized responses and handle them appropriately
  }
};
