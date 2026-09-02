import { useState } from "react";
import axios from "axios";

const CROPS = [
  "Cassava",
  "Maize",
  "Plantains and others",
  "Potatoes",
  "Rice, paddy",
  "Sorghum",
  "Soybeans",
  "Sweet potatoes",
  "Wheat",
  "Yams",
];

function YieldPredictor() {
  const [formData, setFormData] = useState({
    item: "Maize",
    rainfall: "",
    pesticides: "",
    temperature: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/yield/predict", {
        item: formData.item,
        rainfall: parseFloat(formData.rainfall),
        pesticides: parseFloat(formData.pesticides),
        temperature: parseFloat(formData.temperature),
      });

      setResult(response.data);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Prediction failed.");
      } else {
        setError("Could not reach the server. Is the backend running?");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Crop Yield Predictor</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Crop</label>
          <select
            name="item"
            value={formData.item}
            onChange={handleChange}
            style={{ width: "100%", padding: 8 }}
          >
            {CROPS.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Rainfall (mm/year)</label>
          <input
            type="number"
            name="rainfall"
            value={formData.rainfall}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Pesticides (tonnes)</label>
          <input
            type="number"
            name="pesticides"
            value={formData.pesticides}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Average Temperature (°C)</label>
          <input
            type="number"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ padding: "10px 20px" }}>
          {loading ? "Predicting..." : "Predict Yield"}
        </button>
      </form>

      {error && <div style={{ marginTop: 16, color: "red" }}>{error}</div>}

      {result && (
        <div style={{ marginTop: 16, padding: 12, background: "#f0f9f0", borderRadius: 6 }}>
          <strong>Predicted Yield:</strong> {result.predicted_yield} {result.unit}
        </div>
      )}
    </div>
  );
}

export default YieldPredictor;
