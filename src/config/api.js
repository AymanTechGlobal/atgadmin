// API Configuration
// This file centralizes all API-related configuration

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  LOGOUT: `${API_BASE_URL}/api/logout`,
  RESET_PASSWORD_REQUEST: `${API_BASE_URL}/api/auth/reset-password-request`,
  RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,

  // Dashboard endpoints
  DASHBOARD_STATS: `${API_BASE_URL}/api/dashboard/stats`,

  // Patient endpoints
  PATIENTS: `${API_BASE_URL}/api/patients`,

  // Care Navigator endpoints
  CARE_NAVIGATORS: `${API_BASE_URL}/api/care-navigators`,

  // Admin endpoints
  ADMIN: `${API_BASE_URL}/api/admin`,

  // Message endpoints
  MESSAGES: `${API_BASE_URL}/api/messages`,

  // Appointment endpoints
  APPOINTMENTS: `${API_BASE_URL}/api/appointments`,

  // Care Plan endpoints
  CARE_PLANS: `${API_BASE_URL}/api/careplans`,
};

// Axios configuration
export const axiosConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

export default API_BASE_URL;
