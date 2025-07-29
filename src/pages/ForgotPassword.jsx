import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Link,
} from "@mui/material";
import { Email as EmailIcon } from "@mui/icons-material";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { requestPasswordReset } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await requestPasswordReset(email);

      if (result.success) {
        setSuccess(result.message);
        setEmail("");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-start pt-12 px-4">
      {/* Page Title */}
      <Box className="text-center mb-10">
        <Typography
          variant="h3"
          className="font-bold text-indigo-700 mb-2 tracking-tight"
        >
          Forgot Password
        </Typography>
        <Typography variant="subtitle1" className="text-gray-600 text-lg">
          Enter your email to reset your password
        </Typography>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg">
        <Box className="flex flex-col md:flex-row items-center justify-center gap-12">
          {/* Lottie Animation */}
          <Box className="w-full md:w-1/2 flex justify-center">
            <DotLottieReact
              src="https://lottie.host/d71dadf7-4865-4156-b66d-89ba8b7931a0/wLN2Qpkiu7.lottie"
              loop
              autoplay
              className="w-[280px] h-[280px] md:w-[320px] md:h-[320px]"
            />
          </Box>

          {/* Forgot Password Form */}
          <Paper
            elevation={3}
            className="w-full md:w-1/2 max-w-md p-8 rounded-xl"
          >
            <Box className="text-center mb-6">
              <EmailIcon className="text-4xl text-indigo-600 mb-2" />
              <Typography variant="h5" className="font-semibold text-gray-900">
                Reset Your Password
              </Typography>
              <Typography variant="body2" className="text-gray-600 mt-1">
                We'll send you a link to reset your password
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" className="mb-4">
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" className="mb-4">
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant="outlined"
                className="bg-white"
                InputProps={{ className: "rounded-lg" }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                className="h-12 rounded-lg text-base font-semibold"
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>

            <Box className="mt-6 text-center">
              <Typography variant="body2" className="text-gray-600">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
