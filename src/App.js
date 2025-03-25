import React, { useState } from 'react';
import './index.css';

export default function App() {
  const [formData, setFormData] = useState({
    pH: "", sulphate: "", hardness: "", chlorine: "", 
    chlorimines: "", solids: "", conductivity: "", 
    organicCarbon: "", turbidity: "", trihalomethanes: ""
  });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateInput = () => {
    for (const [key, value] of Object.entries(formData)) {
      if (value === "" || isNaN(parseFloat(value))) {
        setError(`Please enter a valid number for ${key.replace(/([A-Z])/g, " $1").trim()}`);
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setError("Unable to fetch water quality prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      pH: "", sulphate: "", hardness: "", chlorine: "", 
      chlorimines: "", solids: "", conductivity: "", 
      organicCarbon: "", turbidity: "", trihalomethanes: ""
    });
    setResult(null);
    setError(null);
  };

  return (
    <div className="app-container">
      <h1 className="title">💧 Water Quality Checker</h1>
      <p className="subtitle">Enter water parameters to assess safety and get insights</p>

      {error && <div className="error-message">⚠️ {error}</div>}

      <form className="form-grid" onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <div key={key} className="input-container">
            <label htmlFor={key} className="input-label">{key.replace(/([A-Z])/g, " $1").trim()}</label>
            <input
              id={key}
              type="number"
              name={key}
              step="0.01"
              placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").trim()}`}
              value={formData[key]}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
        ))}
        
        <div className="button-group">
          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? 'Analyzing...' : 'Check Water Quality'}
          </button>
          <button type="button" onClick={resetForm} className="reset-btn">Reset</button>
        </div>
      </form>

      {result && (
        <div className="result-box">
          <h2>{result.safety ? "✅ Water is Safe" : "⚠️ Water Quality Concerns"}</h2>
          <p><strong>Key Findings:</strong> {result.key_findings}</p>
          <p><strong>Recommended Solutions:</strong> {result.solutions}</p>
        </div>
      )}
    </div>
  );
}
