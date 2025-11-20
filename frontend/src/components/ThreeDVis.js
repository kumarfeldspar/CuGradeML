import React, { useState, useEffect, useMemo } from "react";
import Plot from "react-plotly.js";
import convexhull from "convex-hull";
import { useSelector, useDispatch } from "react-redux";

// ----- Helper Functions -----
const isZeroVector = (v, epsilon = 1e-6) =>
  v.every((val) => Math.abs(val) < epsilon);

const crossProduct = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

function processCluster(points) {
  if (points.length < 4) return { points: [], faces: [] };
  try {
    const hull = convexhull(points);
    const uniqueIdx = [...new Set(hull.flat())];
    const verts = uniqueIdx.map((i) => points[i]);
    const indexMap = new Map();
    uniqueIdx.forEach((orig, idx) => indexMap.set(orig, idx));
    const faces = hull.map(([i, j, k]) => [
      indexMap.get(i),
      indexMap.get(j),
      indexMap.get(k),
    ]);
    return { points: verts, faces };
  } catch (e) {
    console.error("Convex hull error:", e);
    return { points: [], faces: [] };
  }
}

const colors = [
  "#FF6B6B",
  "#6BCB77",
  "#4D96FF",
  "#FFD93D",
  "#FF6F91",
  "#6A4C93",
  "#38B6FF",
  "#FF9F1C",
  "#9DFF00",
  "#F15BB5",
  "#00F5D4",
];

const ThreeDVis = () => {
  const { csvTrainingFile, csvTestFile, isTestMode } = useSelector(
    (state) => state.estimationData
  );
  const dispatch = useDispatch();
  const activeFile = isTestMode ? csvTestFile : csvTrainingFile;

  const [hullData, setHullData] = useState([]);
  const [globalHull, setGlobalHull] = useState(null);
  const [xRange, setXRange] = useState([-10, 10]);
  const [yRange, setYRange] = useState([-10, 10]);
  const [zRange, setZRange] = useState([-10, 10]);
  const [currentX, setCurrentX] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [currentZ, setCurrentZ] = useState(0);

  // Stats states
  const [summaryStats, setSummaryStats] = useState(null);
  const [errorStats, setErrorStats] = useState(null);

  // Slice modal state
  const [slicePoints, setSlicePoints] = useState([]);
  const [modalAxis, setModalAxis] = useState(null);
  const [detailModal, setDetailModal] = useState(false);
  const [selectedHole, setSelectedHole] = useState(null);
  const [camera, setCamera] = useState({ eye: { x: 1.5, y: 1.5, z: 1.5 } });

  // Read CSV on file or mode change
  useEffect(() => {
    if (!activeFile) return;
    setHullData([]);
    setGlobalHull(null);
    setSummaryStats(null);
    setErrorStats(null);

    const reader = new FileReader();
    reader.onload = ({ target }) => {
      const lines = target.result.split("\n").filter((l) => l.trim());
      const headers = lines[0].split(",").map((h) => h.trim());
      const idx = {
        holeid: headers.indexOf("holeid"),
        x: headers.indexOf("X"),
        y: headers.indexOf("Y"),
        z: headers.indexOf("Z"),
        grade: headers.indexOf("GRADE"),
      };
      const predIdx = headers.indexOf("Predicted_GRADE"); // Check for prediction column

      // Check if required columns exist
      if (Object.values(idx).some((i) => i < 0)) return;

      const clusters = {};
      const allPts = [];
      const holeErrors = {};

      lines.slice(1).forEach((row) => {
        const cols = row.split(",").map((c) => c.trim());
        const hole = cols[idx.holeid];
        const x = parseFloat(cols[idx.x]);
        const y = parseFloat(cols[idx.y]);
        const z = parseFloat(cols[idx.z]);

        // Use Predicted_GRADE if it exists, otherwise use GRADE
        const gradeIdx = predIdx >= 0 ? predIdx : idx.grade;
        const g = parseFloat(cols[gradeIdx]);

        if ([x, y, z, g].some((n) => isNaN(n))) return;
        clusters[hole] = clusters[hole] || [];
        clusters[hole].push([x, y, z, g]);
        allPts.push({ X: x, Y: y, Z: z, GRADE: g });

        // Collect prediction data only in test mode
        if (isTestMode && predIdx >= 0 && predIdx !== idx.grade) {
          const actual = parseFloat(cols[idx.grade]);
          const pred = parseFloat(cols[predIdx]);
          if (!isNaN(actual) && !isNaN(pred)) {
            holeErrors[hole] = holeErrors[hole] || [];
            holeErrors[hole].push({ actual, pred });
          }
        }
      });

      // Compute statistics for numeric columns
      const numericCols = ["X", "Y", "Z", "GRADE"];
      const stats = {};
      numericCols.forEach((col) => {
        const vals = allPts.map((d) => d[col]).sort((a, b) => a - b);
        const n = vals.length;
        const mean = vals.reduce((sum, v) => sum + v, 0) / n;
        const median =
          n % 2 === 1 ? vals[(n - 1) / 2] : (vals[n / 2 - 1] + vals[n / 2]) / 2;
        const freq = {};
        let maxCount = 0;
        let mode = vals[0];
        vals.forEach((v) => {
          freq[v] = (freq[v] || 0) + 1;
          if (freq[v] > maxCount) {
            maxCount = freq[v];
            mode = v;
          }
        });
        const variance = vals.reduce((sum, v) => sum + (v - mean) ** 2, 0) / n;
        stats[col] = { mean, median, mode, variance };
      });
      setSummaryStats(stats);

      // Compute error metrics per hole only in test mode if predictions exist
      if (isTestMode && predIdx >= 0 && predIdx !== idx.grade) {
        const errs = {};
        Object.entries(holeErrors).forEach(([hole, arr]) => {
          const n = arr.length;
          const { sumAbsError, sumSqError } = arr.reduce(
            (acc, d) => {
              const error = d.pred - d.actual;
              acc.sumAbsError += Math.abs(error);
              acc.sumSqError += error ** 2;
              return acc;
            },
            { sumAbsError: 0, sumSqError: 0 }
          );
          const mae = sumAbsError / n;
          const mse = sumSqError / n;
          const rmse = Math.sqrt(mse);
          errs[hole] = { mae, rmse };
        });
        setErrorStats(errs);
      } else {
        setErrorStats(null); // Ensure no error stats in training mode
      }

      // Compute ranges for 3D
      const xs = allPts.map((d) => d.X);
      const ys = allPts.map((d) => d.Y);
      const zs = allPts.map((d) => d.Z);
      const newXRange = [Math.min(...xs) - 1, Math.max(...xs) + 1];
      const newYRange = [Math.min(...ys) - 1, Math.max(...ys) + 1];
      const newZRange = [Math.min(...zs) - 1, Math.max(...zs) + 1];
      setXRange(newXRange);
      setYRange(newYRange);
      setZRange(newZRange);
      setCurrentX((newXRange[0] + newXRange[1]) / 2);
      setCurrentY((newYRange[0] + newYRange[1]) / 2);
      setCurrentZ((newZRange[0] + newZRange[1]) / 2);

      // Process clusters
      const processed = Object.keys(clusters).map((key, i) => {
        const pts = clusters[key];
        const hull = processCluster(pts);
        return {
          name: key,
          original: pts,
          ...hull,
          color: colors[i % colors.length],
        };
      });
      setHullData(processed);
      setGlobalHull({
        ...processCluster(Object.values(clusters).flat()),
        color: isTestMode ? "#AAA" : "#ffcf70",
        opacity: isTestMode ? 0.3 : 0.5,
      });
    };
    reader.readAsText(activeFile);
  }, [activeFile, isTestMode]);

  // Slice handler
  const slice = (axis, val) => {
    const pts = [];
    hullData.forEach(({ original, name, color }) => {
      original.forEach((p) => {
        if (
          (axis === "X" && Math.abs(p[0] - val) < 1) ||
          (axis === "Y" && Math.abs(p[1] - val) < 1) ||
          (axis === "Z" && Math.abs(p[2] - val) < 1)
        )
          pts.push({
            x: axis === "X" ? p[1] : p[0],
            y: axis === "Z" ? p[2] : p[axis === "Y" ? 2 : 1],
            cluster: name,
            color,
          });
      });
    });
    setSlicePoints(pts);
  };

  // 3D traces
  const traces3D = useMemo(() => {
    const meshTrace = (h, showBelow) => {
      if (!h.points?.length) return null;
      const faces = showBelow
        ? h.faces.filter(
            ([i, j, k]) =>
              h.points[i][2] <= currentZ &&
              h.points[j][2] <= currentZ &&
              h.points[k][2] <= currentZ
          )
        : h.faces;
      return {
        type: "mesh3d",
        x: h.points.map((p) => p[0]),
        y: h.points.map((p) => p[1]),
        z: h.points.map((p) => p[2]),
        i: faces.map((f) => f[0]),
        j: faces.map((f) => f[1]),
        k: faces.map((f) => f[2]),
        color: h.color,
        opacity: h.opacity || 0.7,
        name: h.name || "",
        flatshading: true,
      };
    };
    const mesh = hullData.map((h) => meshTrace(h, true));
    const global = globalHull && meshTrace(globalHull, false);
    const scat = hullData.map((h) => ({
      type: "scatter3d",
      mode: "markers",
      x: h.original.map((p) => p[0]),
      y: h.original.map((p) => p[1]),
      z: h.original.map((p) => p[2]),
      marker: { size: 3, color: h.color, opacity: 0.8, line: { width: 0 } },
      hovertemplate: `Hole: ${h.name}<br>X:%{x}<br>Y:%{y}<br>Z:%{z}<extra></extra>`,
      name: `${h.name} pts`,
    }));
    return [...mesh, global, ...scat].filter(Boolean);
  }, [hullData, globalHull, currentZ]);

  // 2D Grade vs Z traces
  const traces2D = useMemo(
    () =>
      hullData.map((h) => ({
        type: "scatter",
        mode: "lines+markers",
        x: h.original.map((p) => p[2]),
        y: h.original.map((p) => p[3]),
        name: h.name,
        marker: { color: h.color },
        line: { dash: "solid" },
      })),
    [hullData]
  );

  const plotKey = activeFile ? `${activeFile.name}-${isTestMode}` : "empty";

  return (
    <div style={{ display: "flex", backgroundColor: "#000" }}>
      {/* Sidebar */}
      <div
        style={{
          width: 200,
          padding: 10,
          backgroundColor: "#333",
          color: "#fff",
          marginTop: 150,
        }}>
        <h4>Holes</h4>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {hullData.map((h) => (
            <li
              key={h.name}
              onDoubleClick={() => {
                setSelectedHole(h);
                setDetailModal(true);
              }}
              style={{
                padding: 5,
                cursor: "pointer",
                borderBottom: "1px solid #555",
              }}>
              {h.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: 10, backgroundColor: "#000" }}>
        <h3 style={{ color: "#fff" }}>
          {isTestMode ? "Test Visualization" : "Training Visualization"}
        </h3>

        {/* Controls */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <button
            onClick={() => dispatch({ type: "SET_TEST_MODE", payload: true })}
            style={{ padding: 8, cursor: "pointer" }}>
            Test
          </button>
          {["X", "Y", "Z"].map((ax) => (
            <button
              key={ax}
              onClick={() => {
                setModalAxis(ax);
                setSlicePoints([]);
              }}
              style={{ padding: 8, cursor: "pointer" }}>
              Slice {ax}
            </button>
          ))}
        </div>

        {/* 3D Plot */}
        <Plot
          key={plotKey}
          data={traces3D}
          layout={{
            title: `3D Clusters (${isTestMode ? "Test" : "Training"})`,
            margin: { l: 0, r: 0, b: 0, t: 30 },
            paper_bgcolor: "#222",
            font: { color: "#fff" },
            scene: {
              bgcolor: "#111",
              camera,
              aspectmode: "manual",
              aspectratio: { x: 1.5, y: 1, z: 2 },
              xaxis: {
                title: "X",
                range: xRange,
                gridcolor: "#444",
                zerolinecolor: "#444",
              },
              yaxis: {
                title: "Y",
                range: yRange,
                gridcolor: "#444",
                zerolinecolor: "#444",
              },
              zaxis: {
                title: "Z",
                range: zRange,
                gridcolor: "#444",
                zerolinecolor: "#444",
              },
            },
          }}
          config={{ responsive: true, displaylogo: false }}
          style={{ width: "100%", height: "80vh" }}
          onRelayout={(data) =>
            data["scene.camera"] && setCamera(data["scene.camera"])
          }
          useResizeHandler
        />

        {/* 2D Grade vs Z Plot */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ color: "#fff" }}>Grade vs Z Plot</h4>
          <Plot
            data={traces2D}
            layout={{
              title: "Grade vs Z by Hole",
              xaxis: { title: "Z" },
              yaxis: { title: "Grade" },
              paper_bgcolor: "#222",
              plot_bgcolor: "#111",
              font: { color: "#fff" },
            }}
            config={{ responsive: true, displaylogo: false }}
            style={{ width: "100%", height: "400px" }}
          />
        </div>

        {/* Statistical Summary Table */}
        {summaryStats && (
          <div style={{ marginBottom: 20, color: "#fff" }}>
            <h4>Statistical Summary</h4>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #555", padding: 8 }}>
                    Column
                  </th>
                  <th style={{ border: "1px solid #555", padding: 8 }}>Mean</th>
                  <th style={{ border: "1px solid #555", padding: 8 }}>
                    Median
                  </th>
                  <th style={{ border: "1px solid #555", padding: 8 }}>Mode</th>
                  <th style={{ border: "1px solid #555", padding: 8 }}>
                    Variance
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(summaryStats).map(([col, s]) => (
                  <tr key={col}>
                    <td style={{ border: "1px solid #555", padding: 8 }}>
                      {col}
                    </td>
                    <td style={{ border: "1px solid #555", padding: 8 }}>
                      {s.mean.toFixed(2)}
                    </td>
                    <td style={{ border: "1px solid #555", padding: 8 }}>
                      {s.median.toFixed(2)}
                    </td>
                    <td style={{ border: "1px solid #555", padding: 8 }}>
                      {s.mode.toFixed(2)}
                    </td>
                    <td style={{ border: "1px solid #555", padding: 8 }}>
                      {s.variance.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Error Metrics Table */}
        {errorStats && (
          <div style={{ marginBottom: 20, color: "#fff" }}>
            <h4>Error Metrics (per Hole)</h4>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #555", padding: 8 }}>Hole</th>
                  <th style={{ border: "1px solid #555", padding: 8 }}>MAE</th>
                  <th style={{ border: "1px solid #555", padding: 8 }}>RMSE</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(errorStats).map(([hole, e]) => (
                  <tr key={hole}>
                    <td style={{ border: "1px solid #555", padding: 8 }}>
                      {hole}
                    </td>
                    <td style={{ border: "1px solid #555", padding: 8 }}>
                      {e.mae.toFixed(4)}
                    </td>
                    <td style={{ border: "1px solid #555", padding: 8 }}>
                      {e.rmse.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Slice Modal */}
        {modalAxis && (
          <div style={modalStyle}>
            <div style={modalContentStyle}>
              <button
                style={closeButtonStyle}
                onClick={() => setModalAxis(null)}>
                Close
              </button>
              <h4 style={{ color: "#fff" }}>
                Slice Options ({modalAxis}-axis)
              </h4>
              <div style={{ color: "#fff", marginBottom: 10 }}>
                <label style={{ display: "block" }}>
                  {modalAxis}-value:{" "}
                  {modalAxis === "X"
                    ? currentX
                    : modalAxis === "Y"
                    ? currentY
                    : currentZ}
                  <input
                    type="range"
                    min={
                      modalAxis === "X"
                        ? xRange[0]
                        : modalAxis === "Y"
                        ? yRange[0]
                        : zRange[0]
                    }
                    max={
                      modalAxis === "X"
                        ? xRange[1]
                        : modalAxis === "Y"
                        ? yRange[1]
                        : zRange[1]
                    }
                    step={
                      (modalAxis === "X"
                        ? xRange[1] - xRange[0]
                        : modalAxis === "Y"
                        ? yRange[1] - yRange[0]
                        : zRange[1] - zRange[0]) / 100
                    }
                    value={
                      modalAxis === "X"
                        ? currentX
                        : modalAxis === "Y"
                        ? currentY
                        : currentZ
                    }
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      if (modalAxis === "X") setCurrentX(v);
                      if (modalAxis === "Y") setCurrentY(v);
                      if (modalAxis === "Z") setCurrentZ(v);
                      slice(modalAxis, v);
                    }}
                    style={{ width: "100%", marginTop: 10 }}
                  />
                </label>
                <label style={{ display: "block" }}>
                  Enter {modalAxis}:
                  <input
                    type="number"
                    value={
                      modalAxis === "X"
                        ? currentX
                        : modalAxis === "Y"
                        ? currentY
                        : currentZ
                    }
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      if (isNaN(v)) return;
                      if (modalAxis === "X") setCurrentX(v);
                      if (modalAxis === "Y") setCurrentY(v);
                      if (modalAxis === "Z") setCurrentZ(v);
                      slice(modalAxis, v);
                    }}
                    style={{ marginLeft: 10, padding: 5 }}
                  />
                </label>
              </div>
              {slicePoints.length > 0 ? (
                <Plot
                  data={[
                    {
                      type: "scatter",
                      mode: "markers",
                      x: slicePoints.map((p) => p.x),
                      y: slicePoints.map((p) => p.y),
                      marker: {
                        size: 6,
                        color: slicePoints.map((p) => p.color),
                      },
                      text: slicePoints.map((p) => p.cluster),
                    },
                  ]}
                  layout={{
                    title: `Points on ${modalAxis}=...`,
                    paper_bgcolor: "#222",
                    plot_bgcolor: "#111",
                    font: { color: "#fff" },
                  }}
                  style={{ width: "100%", height: 400 }}
                  config={{ displaylogo: false, responsive: true }}
                />
              ) : (
                <p style={{ color: "#fff" }}>No points found on this plane.</p>
              )}
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {detailModal && selectedHole && (
          <div style={modalStyle}>
            <div style={{ ...modalContentStyle, width: "90%", height: "90%" }}>
              <button
                style={closeButtonStyle}
                onClick={() => setDetailModal(false)}>
                Close
              </button>
              <h3 style={{ color: "#fff" }}>
                Detailed View: {selectedHole.name}
              </h3>
              <Plot
                data={[
                  {
                    type: "scatter3d",
                    mode: "markers",
                    x: selectedHole.original.map((p) => p[0]),
                    y: selectedHole.original.map((p) => p[1]),
                    z: selectedHole.original.map((p) => p[2]),
                    marker: {
                      size: 3,
                      color: selectedHole.original.map((p) => p[3]),
                      colorscale: "Viridis",
                      colorbar: { title: "Grade" },
                      cmin: Math.min(...selectedHole.original.map((p) => p[3])),
                      cmax: Math.max(...selectedHole.original.map((p) => p[3])),
                      opacity: 0.8,
                    },
                    name: "Points",
                  },
                  ...(selectedHole.points.length
                    ? [
                        {
                          type: "mesh3d",
                          x: selectedHole.points.map((p) => p[0]),
                          y: selectedHole.points.map((p) => p[1]),
                          z: selectedHole.points.map((p) => p[2]),
                          i: selectedHole.faces.map((f) => f[0]),
                          j: selectedHole.faces.map((f) => f[1]),
                          k: selectedHole.faces.map((f) => f[2]),
                          color: selectedHole.color,
                          opacity: 0.5,
                          name: "Hull",
                          flatshading: true,
                        },
                      ]
                    : []),
                ]}
                layout={{
                  title: `Hole ${selectedHole.name}`,
                  scene: {
                    bgcolor: "#111",
                    aspectmode: "manual",
                    aspectratio: { x: 1, y: 1, z: 1 },
                  },
                  paper_bgcolor: "#222",
                  font: { color: "#fff" },
                }}
                style={{ width: "100%", height: "100%" }}
                config={{ responsive: true, displaylogo: false }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};
const modalContentStyle = {
  backgroundColor: "#222",
  padding: 20,
  borderRadius: 8,
  width: "80%",
  maxWidth: 600,
  overflowY: "auto",
  position: "relative",
};
const closeButtonStyle = {
  position: "absolute",
  top: 20,
  right: 10,
  backgroundColor: "#555",
  color: "#fff",
  border: "none",
  padding: "5px 10px",
  cursor: "pointer",
};

export default ThreeDVis;
