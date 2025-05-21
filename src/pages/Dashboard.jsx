import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import axios from "axios";

const Dashboard = () => {
  const [carePlansCount, setCarePlansCount] = useState(0);
  const [careNavigatorsCount, setCareNavigatorsCount] = useState(0);
  const [patientsCount, setPatientsCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/appointments"
        );
        const upcomingAppointments = response.data.filter(
          (appointment) => new Date(appointment.date) > new Date()
        );
        setAppointmentCount(response.data.length);
        setUpcomingAppointments(upcomingAppointments);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/careplans");
        setCarePlansCount(response.data.length);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/carenavigators"
        );
        setCareNavigatorsCount(response.data.length);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/patients");
        setPatientsCount(response.data.length);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        p: 3,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{ mt: 4, color: "#09D1C7", textAlign: "center" }}
      >
        Admin View
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {/*  dashboard content */}
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: "background.paper",
            boxShadow: 1,
          }}
        >
          <Typography variant="h6">Total Registered Patients</Typography>
          <Typography variant="body1" color="text.secondary">
            {patientsCount}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: "background.paper",
            boxShadow: 1,
          }}
        >
          <Typography variant="h6">Total Care Plans</Typography>
          <Typography variant="body1" color="text.secondary">
            {carePlansCount}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: "background.paper",
            boxShadow: 1,
          }}
        >
          <Typography variant="h6">Total Care Navigators</Typography>
          <Typography variant="body1" color="text.secondary">
            {careNavigatorsCount}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: "background.paper",
            boxShadow: 1,
          }}
        >
          <Typography variant="h6">Total Upcoming Appointments</Typography>
          <Typography variant="body1" color="text.secondary">
            {appointmentCount}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
