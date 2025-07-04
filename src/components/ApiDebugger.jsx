import React, { useState } from "react";
import { Box, Button, Typography, Paper, Alert } from "@mui/material";
import { testApiConnection, logApiConfig } from "../utils/apiTest";
import { API_ENDPOINTS } from "../config/api";

const ApiDebugger = () => {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestApi = async () => {
    setIsLoading(true);
    setTestResult(null);

    // Log current configuration
    logApiConfig();

    // Test API connection
    const result = await testApiConnection();
    setTestResult(result);
    setIsLoading(false);
  };

  const currentApiUrl =
    process.env.REACT_APP_API_URL || "http://localhost:5000";

  return (
    <Paper className="p-4 mb-4">
      <Typography variant="h6" className="mb-3">
        🔧 API Connection Debugger
      </Typography>

      <Box className="mb-3">
        <Typography variant="body2" className="mb-1">
          <strong>Current API URL:</strong> {currentApiUrl}
        </Typography>
        <Typography variant="body2" className="mb-1">
          <strong>Environment Variable:</strong>{" "}
          {process.env.REACT_APP_API_URL ? "Set" : "Not Set"}
        </Typography>
        <Typography variant="body2" className="mb-1">
          <strong>Login Endpoint:</strong> {API_ENDPOINTS.LOGIN}
        </Typography>
      </Box>

      <Button
        variant="contained"
        onClick={handleTestApi}
        disabled={isLoading}
        className="mb-3"
      >
        {isLoading ? "Testing..." : "Test API Connection"}
      </Button>

      {testResult && (
        <Alert
          severity={testResult.success ? "success" : "error"}
          className="mt-2"
        >
          {testResult.success ? (
            <Box>
              <Typography variant="body2" className="font-bold">
                ✅ API Connection Successful!
              </Typography>
              <Typography variant="body2">
                Status: {testResult.data?.status || "OK"}
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="body2" className="font-bold">
                ❌ API Connection Failed
              </Typography>
              <Typography variant="body2">Error: {testResult.error}</Typography>
            </Box>
          )}
        </Alert>
      )}

      <Box className="mt-3">
        <Typography variant="body2" className="text-gray-600">
          💡 <strong>Troubleshooting Tips:</strong>
        </Typography>
        <Typography variant="body2" className="text-gray-600 ml-4">
          • Check if REACT_APP_API_URL is set in Vercel environment variables
        </Typography>
        <Typography variant="body2" className="text-gray-600 ml-4">
          • Ensure backend is running on Render
        </Typography>
        <Typography variant="body2" className="text-gray-600 ml-4">
          • Check browser console for detailed error messages
        </Typography>
      </Box>
    </Paper>
  );
};

export default ApiDebugger;
