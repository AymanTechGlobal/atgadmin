// API Test Utility
// This file helps debug API connection issues

import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

export const testApiConnection = async () => {
  try {
    console.log("🔍 Testing API connection...");
    console.log(
      "📍 API Base URL:",
      process.env.REACT_APP_API_URL || "http://localhost:5000"
    );
    console.log("🔗 Login endpoint:", API_ENDPOINTS.LOGIN);

    // Test basic connectivity
    const response = await axios.get(
      `${
        process.env.REACT_APP_API_URL || "http://localhost:5000"
      }/api/dashboard/stats`,
      {
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ API connection successful!");
    console.log("📊 Response status:", response.status);
    console.log("📄 Response data:", response.data);

    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ API connection failed!");
    console.error("🚨 Error details:", error);

    if (error.response) {
      console.error("📡 Response status:", error.response.status);
      console.error("📄 Response data:", error.response.data);
    } else if (error.request) {
      console.error("🌐 Network error - no response received");
    } else {
      console.error("⚙️ Request setup error:", error.message);
    }

    return { success: false, error: error.message };
  }
};

export const logApiConfig = () => {
  console.log("🔧 API Configuration:");
  console.log("📍 REACT_APP_API_URL:", process.env.REACT_APP_API_URL);
  console.log(
    "🔗 API_BASE_URL:",
    process.env.REACT_APP_API_URL || "http://localhost:5000"
  );
  console.log("📋 All endpoints:", API_ENDPOINTS);
};
