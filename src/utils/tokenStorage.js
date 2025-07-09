// Token Storage Utility
// Handles secure token storage and retrieval

export const TokenStorage = {
  // Store token with validation
  setToken: (token) => {
    try {
      if (!token || typeof token !== "string") {
        throw new Error("Invalid token provided");
      }
      localStorage.setItem("token", token);
      return true;
    } catch (error) {
      console.error("Error storing token:", error);
      return false;
    }
  },

  // Get token with validation
  getToken: () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return null;
      }
      return token;
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  },

  // Remove token
  removeToken: () => {
    try {
      localStorage.removeItem("token");
      return true;
    } catch (error) {
      console.error("Error removing token:", error);
      return false;
    }
  },

  // Check if token exists
  hasToken: () => {
    try {
      const token = localStorage.getItem("token");
      return !!token;
    } catch (error) {
      console.error("Error checking token:", error);
      return false;
    }
  },

  // Store user data
  setUser: (user) => {
    try {
      if (!user || typeof user !== "object") {
        throw new Error("Invalid user data provided");
      }
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    } catch (error) {
      console.error("Error storing user data:", error);
      return false;
    }
  },

  // Get user data
  getUser: () => {
    try {
      const user = localStorage.getItem("user");
      if (!user) {
        return null;
      }
      return JSON.parse(user);
    } catch (error) {
      console.error("Error retrieving user data:", error);
      return null;
    }
  },

  // Remove user data
  removeUser: () => {
    try {
      localStorage.removeItem("user");
      return true;
    } catch (error) {
      console.error("Error removing user data:", error);
      return false;
    }
  },

  // Clear all auth data
  clearAuth: () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return true;
    } catch (error) {
      console.error("Error clearing auth data:", error);
      return false;
    }
  },
};
