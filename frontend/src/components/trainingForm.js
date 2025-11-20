import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Wrapper from "../Wrappers/ParametersForm";
import {
  handleChange,
  trainData,
} from "../features/estimationData/estimationDataSlice";
import FormRow from "./FormRow";
import MultiSelectDropdown from "./multiselectDropdown";
import { toast } from "react-toastify";
import FormRowSelect from "./FormRowSelect";
import "./TrainingForm.css";

const TrainingForm = () => {
  const dispatch = useDispatch();

  const {
    model,
    selectedInputHeaders,
    selectedOutputHeaders,
    isTraining,
    gbm_n_estimators,
    gbm_max_depth,
    gbm_loss,
    gbm_learning_rate,
    gbm_criterion,
    gbm_model_n_estimators,
    gbm_model_max_depth,
    gbm_model_loss,
    gbm_model_learning_rate,
    gbm_model_criterion,
    gbmreg_n_estimators,
    gbmreg_max_depth,
    gbmreg_loss,
    gbmreg_learning_rate,
    gbmreg_criterion,
    rf_n_estimators,
    rf_criterion,
    rf_max_depth,
    rf_max_features,
    rf_bootstrap,
    rf_min_samples_leaf,
    rf_min_samples_split,
    parsedData,
    csvFile,
    csvTrainingFile,
  } = useSelector((store) => store.estimationData);

  const [csvData, setCSVData] = useState("");
  const [headersList, setHeadersList] = useState([]);
  const [inputMethod, setInputMethod] = useState("slider");
  const [sliderPreset, setSliderPreset] = useState("medium");

  const modelList = ["GBMREG", "RandomForest"];
  const inputMethodOptions = ["manual", "slider"];

  const presetValues = {
    GBMREG: {
      low: {
        gbmreg_n_estimators: 150,
        gbmreg_max_depth: 15,
        gbmreg_loss: "squared_error",
        gbmreg_learning_rate: 0.25,
        gbmreg_criterion: "friedman_mse",
      },
      medium: {
        gbmreg_n_estimators: 200,
        gbmreg_max_depth: 20,
        gbmreg_loss: "squared_error",
        gbmreg_learning_rate: 0.2,
        gbmreg_criterion: "friedman_mse",
      },
      high: {
        gbmreg_n_estimators: 250,
        gbmreg_max_depth: 25,
        gbmreg_loss: "squared_error",
        gbmreg_learning_rate: 0.15,
        gbmreg_criterion: "friedman_mse",
      },
    },
    RandomForest: {
      low: {
        rf_n_estimators: 50,
        rf_criterion: "squared_error",
        rf_max_depth: 10,
        rf_max_features: "sqrt",
        rf_bootstrap: true,
        rf_min_samples_leaf: 2,
        rf_min_samples_split: 4,
      },
      medium: {
        rf_n_estimators: 55,
        rf_criterion: "squared_error",
        rf_max_depth: 11,
        rf_max_features: "sqrt",
        rf_bootstrap: true,
        rf_min_samples_leaf: 1,
        rf_min_samples_split: 2,
      },
      high: {
        rf_n_estimators: 65,
        rf_criterion: "friedman_mse",
        rf_max_depth: 12,
        rf_max_features: "sqrt",
        rf_bootstrap: true,
        rf_min_samples_leaf: 1,
        rf_min_samples_split: 2,
      },
    },
  };

  const modelParameters = {
    GBMREG: [
      {
        name: "gbmreg_n_estimators",
        label: "Number of Estimators",
        type: "number",
      },
      { name: "gbmreg_max_depth", label: "Max Depth", type: "number" },
      {
        name: "gbmreg_loss",
        label: "Loss Function",
        type: "select",
        options: ["squared_error", "absolute_error", "huber", "quantile"],
      },
      { name: "gbmreg_learning_rate", label: "Learning Rate", type: "number" },
      {
        name: "gbmreg_criterion",
        label: "Criterion",
        type: "select",
        options: ["friedman_mse", "squared_error"],
      },
    ],
    GBM_MODEL: [
      {
        name: "gbm_model_n_estimators",
        label: "Number of Estimators",
        type: "number",
      },
      { name: "gbm_model_max_depth", label: "Max Depth", type: "number" },
      {
        name: "gbm_model_loss",
        label: "Loss Function",
        type: "select",
        options: ["squared_error", "absolute_error", "huber", "quantile"],
      },
      {
        name: "gbm_model_learning_rate",
        label: "Learning Rate",
        type: "number",
      },
      {
        name: "gbm_model_criterion",
        label: "Criterion",
        type: "select",
        options: ["friedman_mse", "squared_error"],
      },
    ],
    RandomForest: [
      {
        name: "rf_n_estimators",
        label: "Number of Estimators",
        type: "number",
      },
      {
        name: "rf_criterion",
        labelText: "Criterion",
        type: "select",
        options: ["squared_error", "friedman_mse", "absolute_error"],
      },
      { name: "rf_max_depth", label: "Max Depth", type: "number" },
      {
        name: "rf_max_features",
        label: "Max Features",
        type: "select",
        options: ["log2", "sqrt", "None"],
      },
      {
        name: "rf_bootstrap",
        label: "Bootstrap",
        type: "select",
        options: ["True", "False"],
      },
      {
        name: "rf_min_samples_leaf",
        label: "Min Samples Leaf",
        type: "number",
      },
      {
        name: "rf_min_samples_split",
        label: "Min Samples Split",
        type: "number",
      },
    ],
  };

  const paramValues = {
    gbm_n_estimators,
    gbm_max_depth,
    gbm_loss,
    gbm_learning_rate,
    gbm_criterion,
    gbm_model_n_estimators,
    gbm_model_max_depth,
    gbm_model_loss,
    gbm_model_learning_rate,
    gbm_model_criterion,
    gbmreg_n_estimators,
    gbmreg_max_depth,
    gbmreg_loss,
    gbmreg_learning_rate,
    gbmreg_criterion,
    rf_n_estimators,
    rf_criterion,
    rf_max_depth,
    rf_max_features,
    rf_bootstrap,
    rf_min_samples_leaf,
    rf_min_samples_split,
  };

  const handleInput = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (["rf_bootstrap"].includes(name)) {
      value = value === "True";
    }
    dispatch(handleChange({ name, value }));
  };

  const handleInputMethodChange = (e) => {
    const method = e.target.value;
    setInputMethod(method);
    if (method === "slider" && model) {
      applyPresetValues(model, sliderPreset);
    }
  };

  const applyPresetValues = (selectedModel, preset) => {
    if (presetValues[selectedModel] && presetValues[selectedModel][preset]) {
      const modelPresets = presetValues[selectedModel][preset];
      Object.entries(modelPresets).forEach(([name, value]) => {
        dispatch(handleChange({ name, value }));
      });
      toast.info(`Applied ${preset} preset values for ${selectedModel}`);
    }
  };

  const handleModelChange = (e) => {
    const selectedModel = e.target.value;
    handleInput(e);
    if (inputMethod === "slider" && selectedModel) {
      applyPresetValues(selectedModel, sliderPreset);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    dispatch(handleChange({ name: "csvFile", value: file }));
    dispatch(handleChange({ name: "csvTrainingFile", value: file }));
    console.log("Selected file:", file);

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
    if (csvText.trim().length === 0) {
      toast.error("CSV file is empty.");
      return;
    }
    const lines = csvText.split("\n").filter((line) => line.trim() !== "");
    if (lines.length === 0) {
      toast.error("CSV file contains no data.");
      return;
    }
    const headers = lines[0].split(",").map((header) => header.trim());
    const parsedData = [];
    const startIndex = type === "Head" ? 1 : Math.max(1, lines.length - 10);
    const endIndex =
      type === "Head" ? Math.min(11, lines.length) : lines.length;
    for (let i = startIndex; i < endIndex; i++) {
      const currentLine = lines[i].split(",").map((item) => item.trim());
      if (currentLine.length === headers.length) {
        const row = {};
        for (let j = 0; j < headers.length; j++) {
          row[headers[j]] = currentLine[j];
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

    let modelParams = {};
    if (model === "GBMREG") {
      modelParams = {
        gbmreg_n_estimators,
        gbmreg_max_depth,
        gbmreg_loss,
        gbmreg_learning_rate,
        gbmreg_criterion,
      };
      for (let param in modelParams) {
        if (
          modelParams[param] === undefined ||
          modelParams[param] === "" ||
          (typeof modelParams[param] === "number" && isNaN(modelParams[param]))
        ) {
          toast.error(`Please provide a valid value for ${param}.`);
          return;
        }
      }
    } else if (model === "GBM_MODEL") {
      modelParams = {
        gbm_model_n_estimators,
        gbm_model_max_depth,
        gbm_model_loss,
        gbm_model_learning_rate,
        gbm_model_criterion,
      };
      for (let param in modelParams) {
        if (
          modelParams[param] === undefined ||
          modelParams[param] === "" ||
          (typeof modelParams[param] === "number" && isNaN(modelParams[param]))
        ) {
          toast.error(`Please provide a valid value for ${param}.`);
          return;
        }
      }
    } else if (model === "RandomForest") {
      modelParams = {
        rf_n_estimators,
        rf_criterion,
        rf_max_depth: rf_max_depth === "None" ? null : parseInt(rf_max_depth),
        rf_max_features,
        rf_bootstrap,
        rf_min_samples_leaf: parseInt(rf_min_samples_leaf),
        rf_min_samples_split: parseInt(rf_min_samples_split),
      };
      for (let param in modelParams) {
        if (
          (typeof modelParams[param] === "number" &&
            isNaN(modelParams[param])) ||
          modelParams[param] === undefined ||
          modelParams[param] === ""
        ) {
          toast.error(`Please provide a valid value for ${param}.`);
          return;
        }
      }
    }

    const formData = new FormData();
    formData.append("model", model);
    formData.append("selectedInputHeaders", selectedInputHeaders.join(","));
    formData.append("selectedOutputHeaders", selectedOutputHeaders.join(","));
    formData.append("csvData", csvFile);
    for (let key in modelParams) {
      formData.append(key, modelParams[key]);
    }

    dispatch(trainData(formData))
      .unwrap()
      .then((url) => {
        toast.success("Training completed successfully.");
      })
      .catch((error) => {
        const errorMessage =
          error?.result || "An unexpected error occurred during training.";
        toast.error(`Training failed: ${errorMessage}`);
      });
  };

  const displayParameterValues = () => {
    if (!model || inputMethod !== "slider") return null;

    const currentPreset = presetValues[model]?.[sliderPreset];
    if (!currentPreset) return null;

    return (
      <div className="parameter-values">
        <h4>Current Parameter Values</h4>
        <div className="parameter-list">
          {Object.entries(currentPreset).map(([param, value]) => (
            <div key={param} className="parameter-item">
              <span className="parameter-name">{param}</span>
              <span className="parameter-value">{String(value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Wrapper>
      <form className="form">
        <h3>Training Data</h3>
        <FormRow
          name="csvFile"
          labelText="CSV File"
          type="file"
          handleChange={handleFileChange}
          accept=".csv"
        />
        <div className="btn-container">
          {csvFile && (
            <>
              <button
                type="button"
                className="btn"
                onClick={() => parseCSV(csvData, "Head")}>
                Display Head
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => parseCSV(csvData, "Tail")}>
                Display Tail
              </button>
            </>
          )}
        </div>
        <div className="form-center">
          <MultiSelectDropdown
            name="Input Parameters"
            labelText="Input Parameters"
            options={headersList}
            targetList="selectedInputHeaders"
            onChange={(targetList, headers) =>
              dispatch(handleChange({ name: targetList, value: headers }))
            }
          />
          <MultiSelectDropdown
            name="Output Parameters"
            labelText="Output Parameters"
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
            handleChange={handleModelChange}
          />
          <FormRowSelect
            labelText="Input Method"
            name="inputMethod"
            value={inputMethod}
            list={inputMethodOptions}
            handleChange={handleInputMethodChange}
          />
          {inputMethod === "slider" && (
            <div className="form-row">
              <label htmlFor="sliderPreset" className="form-label">
                Parameter Preset:{" "}
                {sliderPreset.charAt(0).toUpperCase() + sliderPreset.slice(1)}
              </label>
              <div className="slider-container">
                <div className="slider-labels">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
                <input
                  type="range"
                  id="sliderPreset"
                  min="1"
                  max="3"
                  step="1"
                  value={
                    sliderPreset === "low"
                      ? 1
                      : sliderPreset === "medium"
                      ? 2
                      : 3
                  }
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    const preset =
                      value === 1 ? "low" : value === 2 ? "medium" : "high";
                    setSliderPreset(preset);
                    if (model) {
                      applyPresetValues(model, preset);
                    }
                  }}
                  disabled={!model}
                  className="form-input"
                />
              </div>
            </div>
          )}
          {inputMethod === "slider" && displayParameterValues()}
          {inputMethod === "manual" &&
            model &&
            modelParameters[model] &&
            modelParameters[model].map((param) => {
              const value =
                paramValues[param.name] !== undefined
                  ? paramValues[param.name]
                  : "";
              if (param.type === "select") {
                return (
                  <FormRowSelect
                    key={param.name}
                    labelText={param.label}
                    name={param.name}
                    value={value}
                    list={param.options}
                    handleChange={handleInput}
                  />
                );
              } else {
                return (
                  <FormRow
                    key={param.name}
                    type={param.type}
                    name={param.name}
                    labelText={param.label}
                    value={value}
                    handleChange={handleInput}
                  />
                );
              }
            })}
        </div>
        <button
          type="submit"
          className="btn btn-block"
          onClick={handleSubmit}
          disabled={isTraining}>
          {isTraining ? "Training..." : "Train"}
        </button>
      </form>
    </Wrapper>
  );
};

export default TrainingForm;
