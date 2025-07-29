import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import { TokenStorage } from "../utils/tokenStorage";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(TokenStorage.getToken());
  const [loading, setLoading] = useState(true);

  // Set up axios interceptor for authentication
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = TokenStorage.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  // Validate token on app start
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = TokenStorage.getToken();
      if (storedToken) {
        try {
          const response = await axios.get(API_ENDPOINTS.VALIDATE_TOKEN);
          if (response.data.valid) {
            setUser(response.data.user);
            setToken(storedToken);
          } else {
            logout();
          }
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
        rememberMe,
      });

      const { token: newToken, user: userData } = response.data;

      // Store token and user data
      TokenStorage.setToken(newToken, rememberMe);
      TokenStorage.setUser(userData, rememberMe);

      setToken(newToken);
      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    TokenStorage.clearAuth();
    setToken(null);
    setUser(null);
  };

  const validateToken = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.VALIDATE_TOKEN);
      return response.data.valid;
    } catch (error) {
      return false;
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      const response = await axios.post(API_ENDPOINTS.RESET_PASSWORD_REQUEST, {
        email,
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to send reset email",
      };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await axios.post(API_ENDPOINTS.RESET_PASSWORD, {
        token,
        newPassword,
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to reset password",
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    validateToken,
    requestPasswordReset,
    resetPassword,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
