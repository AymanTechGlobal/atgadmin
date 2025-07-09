import React from "react";
import { Box, Typography, Alert, Paper } from "@mui/material";
import { API_ENDPOINTS } from "../config/api";

const EnvCheck = () => {
  const currentApiUrl = process.env.REACT_APP_API_URL || "Not Set";
  const isProduction = process.env.NODE_ENV === "production";
  const isLocalhost = currentApiUrl.includes("localhost");

  return (
    <Paper className="p-4 mb-4">
      <Typography variant="h6" className="mb-3">
        🔧 Environment Check
      </Typography>

      <Box className="space-y-2">
        <Typography variant="body2">
          <strong>Environment:</strong> {process.env.NODE_ENV}
        </Typography>

        <Typography variant="body2">
          <strong>REACT_APP_API_URL:</strong> {currentApiUrl}
        </Typography>

        <Typography variant="body2">
          <strong>Login Endpoint:</strong> {API_ENDPOINTS.LOGIN}
        </Typography>

        {isProduction && isLocalhost && (
          <Alert severity="error" className="mt-2">
            ⚠️ Production environment is using localhost! Please set
            REACT_APP_API_URL in Vercel environment variables.
          </Alert>
        )}

        {isProduction && !isLocalhost && (
          <Alert severity="success" className="mt-2">
            ✅ Production environment configured correctly!
          </Alert>
        )}

        {!isProduction && (
          <Alert severity="info" className="mt-2">
            ℹ️ Development environment - using localhost
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default EnvCheck;
