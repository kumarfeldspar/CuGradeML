import React from "react";

// This component, CSVDataTable, is a reusable table component that takes an array of data objects and renders them as a table.
const CSVDataTable = ({ data = [] }) => {
  // Determine the headers for the table based on the keys of the first object in the data array.
  // If the data array is empty, headers will be an empty array.
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <>
      {/* If data is empty or not provided, display an empty paragraph tag. */}
      {!data || data?.length === 0 ? (
        <p></p>
      ) : (
        // If data is provided, render the table with the given styles.
        <table style={tableStyle}>
          <thead>
            <tr>
              {/* Map through the headers and create a table header cell (th) for each. */}
              {headers.map((header, index) => (
                <th key={index} style={tableHeaderStyle}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Map through each row of data to create table rows (tr). */}
            {data.map((row, index) => (
              <tr key={index}>
                {/* For each row, map through the headers to create a table data cell (td) for each header. */}
                {headers.map((header, columnIndex) => (
                  <td key={columnIndex} style={tableCellStyle}>
                    {row[header]}{" "}
                    {/* Display the value of the current header for this row */}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

// Style object for the entire table
const tableStyle = {
  borderCollapse: "collapse", // Collapse borders so they don't have space between them
  width: "100%", // Make the table take up the full width of its container
  borderRadius: "10px", // Round the corners of the table
  overflow: "hidden", // Ensure content does not overflow the table's rounded corners
  boxShadow: "40px 90px 55px -20px rgba(155, 184, 243, 0.2)", // Apply a shadow effect to the table
};

// Style object for the table headers (th elements)
const tableHeaderStyle = {
  fontSize: "14px", // Font size for the header text
  fontWeight: 500, // Font weight for the header text
  color: "#ffffff", // Text color for the header (white)
  backgroundColor: "#3b82f6", // Background color for the header (blue)
  borderBottom: "1px solid #ddd", // Bottom border for the header cells
  padding: "15px", // Padding inside each header cell
  textAlign: "left", // Align text to the left within the header cells
};

// Style object for the table cells (td elements)
const tableCellStyle = {
  fontSize: "14px", // Font size for the cell text
  fontWeight: 500, // Font weight for the cell text
  borderBottom: "1px solid #ddd", // Bottom border for the cells
  padding: "15px", // Padding inside each cell
  backgroundColor: "#fff", // Background color for the cells (white)
};

export default CSVDataTable; // Export the component so it can be used in other parts of the application
