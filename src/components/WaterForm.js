import React, { useState } from "react";
import "./WaterForm.css"; // Import styles

function WaterForm() {
    const [formData, setFormData] = useState({
        pH: "",
        sulphate: "",
        hardness: "",
        chlorimines: "",
        solids: "",
        conductivity: "",
        organic_carbon: "",
        turbidity: "",
        trihalomethanes: "",
        portability: "",
    });

    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await fetch("http://127.0.0.1:5000/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            setPrediction(data);
        } catch (error) {
            console.error("Error:", error);
        }

        setLoading(false);
    };

    return (
        <div className="form-container">
            <h2>Enter Water Quality Parameters</h2>
            <form onSubmit={handleSubmit}>
                {Object.keys(formData).map((key) => (
                    <div key={key} className="input-group">
                        <label>{key.toUpperCase()}</label>
                        <input
                            type="number"
                            name={key}
                            value={formData[key]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}
                <button type="submit" disabled={loading}>
                    {loading ? "Analyzing..." : "Check Water Quality"}
                </button>
            </form>

            {prediction && (
                <div className="result">
                    <h3>Prediction: {prediction.result}</h3>
                    <p>Key Findings: {prediction.findings}</p>
                    <p>Side Effects: {prediction.side_effects}</p>
                    <p>Solutions: {prediction.solutions}</p>
                </div>
            )}
        </div>
    );
}

export default WaterForm;