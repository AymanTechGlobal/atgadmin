import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  CircularProgress,
  Alert,
} from "@mui/material";
import { LockOutlined as LockIcon } from "@mui/icons-material";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        config
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/Dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
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
          ATG Admin
        </Typography>
        <Typography variant="subtitle1" className="text-gray-600 text-lg">
          Login to the admin panel
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

          {/* Login Form */}
          <Paper
            elevation={3}
            className="w-full md:w-1/2 max-w-md p-8 rounded-xl"
          >
            <Box className="text-center mb-6">
              <LockIcon className="text-4xl text-indigo-600 mb-2" />
              <Typography variant="h5" className="font-semibold text-gray-900">
                Welcome Back
              </Typography>
              <Typography variant="body2" className="text-gray-600 mt-1">
                Sign in to access your account
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" className="mb-4">
                {error}
              </Alert>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={email}
                onChange={onChange}
                required
                variant="outlined"
                className="bg-white"
                InputProps={{ className: "rounded-lg" }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={password}
                onChange={onChange}
                required
                variant="outlined"
                className="bg-white"
                InputProps={{ className: "rounded-lg" }}
              />

              <Box className="flex items-center justify-between">
                <FormControlLabel
                  control={<Checkbox color="primary" />}
                  label="Remember me"
                />
                <Link
                  href="/reset-password"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </Link>
              </Box>

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
                  "Sign In"
                )}
              </Button>
            </form>

            <Box className="mt-6 text-center">
              <Typography variant="body2" className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Contact Administrator
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
