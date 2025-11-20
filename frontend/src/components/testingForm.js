import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormRow from "./FormRow";
import Wrapper from "../Wrappers/ParametersForm";
import {
  handleChange,
  testData,
} from "../features/estimationData/estimationDataSlice";
import { toast } from "react-toastify";
import MultiSelectDropdown from "./multiselectDropdown";
import FormRowSelect from "./FormRowSelect";

const TestingForm = () => {
  const dispatch = useDispatch();
  const {
    model,
    selectedInputHeaders,
    selectedOutputHeaders,
    isTesting,
    params,
    csvFile, // CSV file now comes from Redux
    csvTestFile,
  } = useSelector((store) => store.estimationData);

  const [csvData, setCSVData] = useState("");
  const [headersList, setHeadersList] = useState([]);

  const modelList = ["GBMREG", "RandomForest"];

  const modelTestParameters = {
    RandomForest: [
      // You can add parameter definitions here if needed.
    ],
    GBMREG: [],
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("rf_t")) {
      const parsedValue = parseFloat(value);
      const finalValue = isNaN(parsedValue) ? "" : parsedValue;
      dispatch(
        handleChange({
          name: "params",
          value: { ...params, [name]: finalValue },
        })
      );
    } else {
      dispatch(handleChange({ name, value }));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // Save CSV file in Redux store
    console.log(file, "File in TestingForm");
    dispatch(handleChange({ name: "csvFile", value: file }));
    dispatch(handleChange({name: "csvTestFile", value: file}));
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvText = e.target.result;
        setCSVData(csvText);
        const lines = csvText.split("\n");
        const headers = lines[0].split(",").map((header) => header.trim());
        setHeadersList(headers);
      };
      reader.readAsText(file);
    }
  };

  const parseCSV = (csvText, type) => {
    if (csvText.length === 0) {
      toast.error("CSV file is empty.");
      return;
    }

    const lines = csvText.split("\n");
    const headers = lines[0].split(",");
    const parsedData = [];
    const startIndex = type === "Head" ? 1 : Math.max(1, lines.length - 11);
    const endIndex =
      type === "Head" ? Math.min(11, lines.length) : lines.length;

    for (let i = startIndex; i < endIndex; i++) {
      const currentLine = lines[i].split(",");
      if (currentLine.length === headers.length) {
        const row = {};
        for (let j = 0; j < headers.length; j++) {
          row[headers[j].trim()] = currentLine[j].trim();
        }
        parsedData.push(row);
      }
    }

    dispatch(handleChange({ name: "parsedData", value: parsedData }));
    toast.success(`Displayed ${type} of CSV file.`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !selectedInputHeaders.length ||
      !selectedOutputHeaders.length ||
      !csvFile ||
      !model
    ) {
      toast.error("Please enter all required fields.");
      return;
    }

    let paramsObject = {};

    if (model === "RandomForest") {
      paramsObject = { ...params };
      for (let [key, value] of Object.entries(paramsObject)) {
        if (value === undefined || value === "" || isNaN(value)) {
          toast.error(`Please provide a valid value for ${key}.`);
          return;
        }
      }
    }

    const formData = new FormData();
    formData.append("model", model);
    formData.append("selectedInputHeaders", selectedInputHeaders.join(","));
    formData.append("selectedOutputHeaders", selectedOutputHeaders.join(","));
    formData.append("csvData", csvFile);

    if (Object.keys(paramsObject).length > 0) {
      formData.append("params", JSON.stringify(paramsObject));
    }

    // dispatch(testData(formData))
    //   .unwrap()
    //   .then((fileUrls) => {
    //     console.log(fileUrls, "File URLs in TestingForm");
    //     Object.entries(fileUrls).forEach(([filename, fileUrl]) => {
    //       const link = document.createElement("a");
    //       link.href = fileUrl;
    //       link.setAttribute("download", filename);
    //       document.body.appendChild(link);
    //       link.click();
    //       document.body.removeChild(link);
    //     });
    //     toast.success("Testing completed successfully.");
    //   })
    //   .catch((error) => {
    //     toast.error(`Testing failed: ${error.result}`);
    //   });
    dispatch(testData(formData))
      .unwrap()
      .then(({ extractedFiles }) => {
        console.log(extractedFiles, "Extracted files");

        Object.entries(extractedFiles).forEach(([filename, fileUrl]) => {
          // create an <a> tag and click it to force download
          const link = document.createElement("a");
          link.href = fileUrl;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });

        toast.success("Testing completed successfully.");
      })
      .catch((error) => {
        toast.error(`Testing failed: ${error.result}`);
      });

  };

  return (
    <Wrapper>
      <form className="form form-row" onSubmit={handleSubmit}> 
        <h3>Testing Data</h3>
        <FormRow
          name="CSV File"
          type="file"
          handleChange={handleFileChange} 
          acceptFormat=".csv"
        />

        <div className="btn-container">
          {csvFile && (
            <>
              <button
                type="button"
                className="btn"
                onClick={() => parseCSV(csvData, "Head")}
              >
                Display Head
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => parseCSV(csvData, "Tail")}
              >
                Display Tail
              </button>
            </>
          )}
        </div>

        <div className="form-center">
          <MultiSelectDropdown
            name="Input Parameters"
            options={headersList}
            targetList="selectedInputHeaders"
            onChange={(targetList, headers) =>
              dispatch(handleChange({ name: targetList, value: headers }))
            }
          />

          <MultiSelectDropdown
            name="Output Parameters"
            options={headersList}
            targetList="selectedOutputHeaders"
            onChange={(targetList, headers) =>
              dispatch(handleChange({ name: targetList, value: headers }))
            }
          />

          <FormRowSelect
            labelText="Select Model"
            name="model"
            value={model}
            list={modelList}
            handleChange={handleInput}
          />

          {modelTestParameters[model].map((param) => (
            <FormRow
              key={param.name}
              type={param.type}
              name={param.name}
              labelText={param.label}
              value={params[param.name] || ""}
              handleChange={handleInput}
            />
          ))}
        </div>

        <button type="submit" className="btn btn-block" disabled={isTesting}>
          {isTesting ? "Testing..." : "Test"}
        </button>
      </form>
    </Wrapper>
  );
};

export default TestingForm;
