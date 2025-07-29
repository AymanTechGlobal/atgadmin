import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { LockReset as LockResetIcon } from "@mui/icons-material";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [token]);

  const { newPassword, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validatePassword = (password) => {
    const minLength = 6;
    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long`;
    }
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate passwords
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const result = await resetPassword(token, newPassword);

      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4">
        <Paper elevation={3} className="p-8 rounded-xl max-w-md w-full">
          <Box className="text-center">
            <LockResetIcon className="text-4xl text-red-500 mb-4" />
            <Typography
              variant="h5"
              className="font-semibold text-gray-900 mb-2"
            >
              Invalid Reset Link
            </Typography>
            <Typography variant="body2" className="text-gray-600 mb-6">
              The password reset link is invalid or has expired.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/forgot-password")}
              className="w-full"
            >
              Request New Reset Link
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-start pt-12 px-4">
      {/* Page Title */}
      <Box className="text-center mb-10">
        <Typography
          variant="h3"
          className="font-bold text-indigo-700 mb-2 tracking-tight"
        >
          Reset Password
        </Typography>
        <Typography variant="subtitle1" className="text-gray-600 text-lg">
          Enter your new password
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

          {/* Reset Password Form */}
          <Paper
            elevation={3}
            className="w-full md:w-1/2 max-w-md p-8 rounded-xl"
          >
            <Box className="text-center mb-6">
              <LockResetIcon className="text-4xl text-indigo-600 mb-2" />
              <Typography variant="h5" className="font-semibold text-gray-900">
                Set New Password
              </Typography>
              <Typography variant="body2" className="text-gray-600 mt-1">
                Choose a strong password for your account
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

            <form onSubmit={onSubmit} className="space-y-6">
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={onChange}
                required
                variant="outlined"
                className="bg-white"
                InputProps={{
                  className: "rounded-lg",
                  endAdornment: (
                    <Button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="min-w-0 p-1"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={onChange}
                required
                variant="outlined"
                className="bg-white"
                InputProps={{
                  className: "rounded-lg",
                  endAdornment: (
                    <Button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="min-w-0 p-1"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </Button>
                  ),
                }}
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
                  "Reset Password"
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

export default ResetPassword;
