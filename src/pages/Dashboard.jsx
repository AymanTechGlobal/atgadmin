// This page is the dashboard for the admin panel
// it contains the stats of the mobileapp
// it also contains the charts and the tables for the admin to view the data
// it uses the backend/routes/dashboardRoutes.js to get the data
// uses RDS DB directly to fetch the data

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import { testApiConnection, logApiConfig } from "../utils/apiTest";
import ApiDebugger from "../components/ApiDebugger";
import EnvCheck from "../components/EnvCheck";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Log API configuration for debugging
    logApiConfig();

    axios
      .get(API_ENDPOINTS.DASHBOARD_STATS)
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Dashboard API Error:", error);
        setLoading(false);
      });
  }, []);

  if (loading || !stats) {
    return (
      <Box className="flex justify-center items-center h-96">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="p-6 mt-10">
      <Typography variant="h4" className="mb-8 text-center text-[#09D1C7]">
        Admin Dashboard
      </Typography>

      {/* Environment Check */}
      <EnvCheck />

      {/* API Debugger */}
      <ApiDebugger />
      <Grid container spacing={3} className="mb-8">
        <Grid item xs={12} sm={6} md={3}>
          <Paper className="p-4 text-center">
            <Typography variant="h6">Total Patients</Typography>
            <Typography variant="h4">{stats.totalPatients}</Typography>
            <Chip
              label={`+${stats.newThisMonth} this month`}
              color="success"
              className="mt-2"
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className="p-4 text-center">
            <Typography variant="h6">Care Navigators</Typography>
            <Typography variant="h4">{stats.totalCareNavigators}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className="p-4 text-center">
            <Typography variant="h6">Care Plans</Typography>
            <Typography variant="h4">{stats.totalCarePlans}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className="p-4 text-center">
            <Typography variant="h6">Appointments</Typography>
            <Typography variant="h4">{stats.totalAppointments}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} className="mb-8">
        <Grid item xs={12} md={6}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-2">
              Patients Status
            </Typography>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: stats.activePatients, label: "Active" },
                    { id: 1, value: stats.inactivePatients, label: "Inactive" },
                  ],
                },
              ]}
              width={350}
              height={200}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-2">
              Care Plans by Status
            </Typography>
            <PieChart
              series={[
                {
                  data: stats.carePlansByStatus.map((s, i) => ({
                    id: i,
                    value: s.count,
                    label: s.status,
                  })),
                },
              ]}
              width={350}
              height={200}
            />
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} className="mb-8">
        <Grid item xs={12} md={6}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-2">
              Most Common Allergies
            </Typography>
            {stats.mostCommonAllergies.map((a) => (
              <Chip
                key={a.allergy}
                label={`${a.allergy} (${a.count})`}
                className="mr-2 mb-2"
              />
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-2">
              Appointments by Status
            </Typography>
            <PieChart
              series={[
                {
                  data: stats.appointmentsByStatus.map((s, i) => ({
                    id: i,
                    value: s.count,
                    label: s.status,
                  })),
                },
              ]}
              width={350}
              height={200}
            />
          </Paper>
        </Grid>
      </Grid>

      <Paper className="p-4">
        <Typography variant="h6" className="mb-2">
          Recent Registrations
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Registered At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.recentRegistrations.map((r) => (
                <TableRow key={r.userId}>
                  <TableCell>{r.userId}</TableCell>
                  <TableCell>{r.fullName}</TableCell>
                  <TableCell>
                    {new Date(r.registeredAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;
