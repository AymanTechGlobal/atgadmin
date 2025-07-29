// Token Storage Utility
// Handles secure token storage and retrieval with remember me functionality

export const TokenStorage = {
  // Store token with validation and remember me support
  setToken: (token, rememberMe = false) => {
    try {
      if (!token || typeof token !== "string") {
        throw new Error("Invalid token provided");
      }

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", token);
      return true;
    } catch (error) {
      return false;
    }
  },

  // Get token with validation (checks both storages)
  getToken: () => {
    try {
      // Check localStorage first (remember me), then sessionStorage
      let token = localStorage.getItem("token");
      if (!token) {
        token = sessionStorage.getItem("token");
      }
      return token;
    } catch (error) {
      return null;
    }
  },

  // Remove token from both storages
  removeToken: () => {
    try {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      return true;
    } catch (error) {
      return false;
    }
  },

  // Check if token exists in either storage
  hasToken: () => {
    try {
      const localToken = localStorage.getItem("token");
      const sessionToken = sessionStorage.getItem("token");
      return !!(localToken || sessionToken);
    } catch (error) {
      return false;
    }
  },

  // Store user data with remember me support
  setUser: (user, rememberMe = false) => {
    try {
      if (!user || typeof user !== "object") {
        throw new Error("Invalid user data provided");
      }

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("user", JSON.stringify(user));
      return true;
    } catch (error) {
      return false;
    }
  },

  // Get user data from either storage
  getUser: () => {
    try {
      // Check localStorage first (remember me), then sessionStorage
      let user = localStorage.getItem("user");
      if (!user) {
        user = sessionStorage.getItem("user");
      }
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },

  // Remove user data from both storages
  removeUser: () => {
    try {
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      return true;
    } catch (error) {
      return false;
    }
  },

  // Clear all auth data from both storages
  clearAuth: () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      return true;
    } catch (error) {
      return false;
    }
  },

  // Check if remember me is enabled
  isRememberMeEnabled: () => {
    try {
      return !!localStorage.getItem("token");
    } catch (error) {
      return false;
    }
  },
};
