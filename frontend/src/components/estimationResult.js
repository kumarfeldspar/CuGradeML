import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Wrapper from "../Wrappers/ParametersForm";
import { toggleTestMode } from "../features/estimationData/estimationDataSlice"; // Adjust path as needed

const EstimationResult = () => {
  const { trainingPlot, testPlot, isTestMode, } = useSelector(
    (store) => store.estimationData
  );
  const dispatch = useDispatch();

  const currentPlot = isTestMode ? testPlot : trainingPlot;
  const activeFile = isTestMode ? testPlot : trainingPlot;  

  const downloadPlotFile = () => {
    const element = document.createElement("a");
    element.href = currentPlot;
    element.download = `${
      isTestMode ? "TestPlot" : "TrainingPlot"
    }_${Date.now()}.jpg`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!currentPlot) return null;

  return (
    <Wrapper>
      <div className="form form-row form-container">
        <h3>{isTestMode ? "Test Plot" : "Training Plot"}</h3>
        <div className="plot-controls" style={{ marginBottom: "20px" }}>
          <button
            type="button"
            onClick={() => dispatch(toggleTestMode())}
            className={`btn ${!isTestMode ? "active" : ""}`}
            style={{
              marginRight: "10px",
              padding: "10px 20px",
              backgroundColor: !isTestMode ? "#007BFF" : "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}>
            Training
          </button>
          <button
            type="button"
            onClick={() => dispatch(toggleTestMode())}
            className={`btn ${isTestMode ? "active" : ""}`}
            style={{
              padding: "10px 20px",
              backgroundColor: isTestMode ? "#007BFF" : "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}>
            Test
          </button>
        </div>
        <div className="plot-container" style={{ textAlign: "center" }}>
          <img
            src={currentPlot}
            alt={isTestMode ? "Test Plot" : "Training Plot"}
            className="resized-image"
            style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }}
          />
          <div className="btnDiv">
            <button
              type="button"
              className="btn"
              onClick={downloadPlotFile}
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}>
              Download
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default EstimationResult;
