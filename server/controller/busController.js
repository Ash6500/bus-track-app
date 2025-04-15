// controller/busController.js
import axios from "axios";

// Predict ETA for the next stop
export const predictETA = async (req, res) => {
  try {
    const { busId } = req.body;

    // Ensure busId is provided
    if (!busId) {
      return res.status(400).json({
        success: false,
        message: "busId is required"
      });
    }

    // Send POST request to the ETA prediction API
    const response = await axios.post('http://localhost:5001/predict', {
      busId: busId
    });

    // Handle response from ETA prediction API
    return res.status(200).json({
      success: true,
      next_stop: response.data.next_stop,
      next_stop_eta_minutes: response.data.next_stop_eta_minutes,
      predicted_at: response.data.predicted_at
    });

  } catch (error) {
    console.error("Error calling ML service:", error.message);

    // Handling different error scenarios
    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        message: error.response.data.error || "Prediction failed"
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "ML prediction failed."
      });
    }
  }
};

// Predict ETA for the final destination
export const finalDestinationETA = async (req, res) => {
  try {
    const { busId } = req.body;

    // Ensure busId is provided
    if (!busId) {
      return res.status(400).json({
        success: false,
        message: "busId is required"
      });
    }

    // Send POST request to the ETA prediction API for final destination
    const response = await axios.post('http://localhost:5001/final_destination_eta', {
      busId: busId
    });

    // Handle response from ETA prediction API for final destination
    return res.status(200).json({
      success: true,
      final_destination: response.data.final_destination,
      final_destination_eta_minutes: response.data.final_destination_eta_minutes,
      predicted_at: response.data.predicted_at
    });

  } catch (error) {
    console.error("Error calling ML service:", error.message);

    // Handling different error scenarios
    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        message: error.response.data.error || "Final destination prediction failed"
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "ML prediction failed."
      });
    }
  }
};

