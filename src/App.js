import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import "./index.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./layouts/Layout";
import CareNavigators from "./pages/CareNavigators";
import Appointments from "./pages/Appointments";
import CarePlans from "./pages/CarePlans";
import Patients from "./pages/Patients";
import Messages from "./pages/Messages";

import Profile from "./pages/Profile";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/care-navigators" element={<CareNavigators />} />
            <Route path="/appointment" element={<Appointments />} />
            <Route path="/careplans" element={<CarePlans />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/messages" element={<Messages />} />

            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
