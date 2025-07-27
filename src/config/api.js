// API Configuration
// This file centralizes all API-related configuration

// Determine the correct API URL
const getApiBaseUrl = () => {
  // Check if we're in production and environment variable is not set
  if (process.env.NODE_ENV === "production" && !process.env.REACT_APP_API_URL) {
    console.warn("⚠️ REACT_APP_API_URL not set in production, using fallback");
    return "https://atg-admin-backend.onrender.com";
  }

  // In development, use localhost by default, but allow override via environment variable
  return process.env.REACT_APP_API_URL || "http://localhost:5000";
};

const API_BASE_URL = getApiBaseUrl();

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  LOGOUT: `${API_BASE_URL}/api/logout`,
  VALIDATE_TOKEN: `${API_BASE_URL}/api/auth/validate`,
  GET_USER: `${API_BASE_URL}/api/auth/me`,
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

  // Reports endpoints
  REPORTS: {
    BUSINESS_OVERVIEW: `${API_BASE_URL}/api/reports/business-overview`,
    PATIENT_ANALYTICS: `${API_BASE_URL}/api/reports/patient-analytics`,
    CARE_NAVIGATOR_PERFORMANCE: `${API_BASE_URL}/api/reports/care-navigator-performance`,
    APPOINTMENT_ANALYTICS: `${API_BASE_URL}/api/reports/appointment-analytics`,
    CARE_PLAN_EFFECTIVENESS: `${API_BASE_URL}/api/reports/care-plan-effectiveness`,
    SYSTEM_USAGE: `${API_BASE_URL}/api/reports/system-usage`,
  },
};

// Axios configuration
export const axiosConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

// Export API_BASE_URL as both named and default export
export { API_BASE_URL };
export default API_BASE_URL;
