// This page is used to view the reports for the admin
// still under development

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  IconButton,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  People,
  Schedule,
  Assignment,
  Assessment,
  Download,
  Refresh,
  Visibility,
  VisibilityOff,
  BarChart,
  PieChart,
  ShowChart,
} from "@mui/icons-material";
import { PieChart as MUIPieChart } from "@mui/x-charts/PieChart";
import { BarChart as MUIBarChart } from "@mui/x-charts/BarChart";
import { LineChart as MUILineChart } from "@mui/x-charts/LineChart";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

// Custom hook for data fetching
const useReportData = (endpoint, params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(endpoint, { params });
      setData(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return { data, loading, error, refetch: fetchData };
};

// Tab Panel Component
const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`reports-tabpanel-${index}`}
    aria-labelledby={`reports-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

// Metric Card Component
const MetricCard = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  color = "primary",
}) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
          {trend && (
            <Box display="flex" alignItems="center" mt={1}>
              {trend > 0 ? (
                <TrendingUp color="success" fontSize="small" />
              ) : (
                <TrendingDown color="error" fontSize="small" />
              )}
              <Typography
                variant="body2"
                color={trend > 0 ? "success.main" : "error.main"}
                ml={0.5}
              >
                {Math.abs(trend)}%
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}.light`,
            borderRadius: "50%",
            p: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// Business Overview Component
const BusinessOverview = ({ data, loading, error }) => {
  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!data) return null;

  const { overview, growth, appointmentStats } = data;

  const patientStatusData = [
    {
      id: 0,
      value: overview.activePatients,
      label: "Active",
      color: "#4caf50",
    },
    {
      id: 1,
      value: overview.inactivePatients,
      label: "Inactive",
      color: "#f44336",
    },
  ];

  const appointmentStatusData = appointmentStats.map((stat, index) => ({
    id: index,
    value: stat.count,
    label: stat.status,
    color:
      stat.status === "completed"
        ? "#4caf50"
        : stat.status === "cancelled"
        ? "#f44336"
        : "#ff9800",
  }));

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Business Overview
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Patients"
            value={overview.totalPatients}
            subtitle={`${growth.newPatientsThisMonth} new this month`}
            trend={growth.growthRate}
            icon={<People />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Care Navigators"
            value={overview.totalCareNavigators}
            icon={<Assignment />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Appointments"
            value={overview.totalAppointments}
            subtitle={`${overview.completionRate}% completion rate`}
            icon={<Schedule />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Care Plans"
            value={overview.totalCarePlans}
            icon={<Assessment />}
            color="success"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Patient Status Distribution
            </Typography>
            <MUIPieChart
              series={[
                {
                  data: patientStatusData,
                },
              ]}
              width={350}
              height={200}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Appointment Status
            </Typography>
            <MUIPieChart
              series={[
                {
                  data: appointmentStatusData,
                },
              ]}
              width={350}
              height={200}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// Patient Analytics Component
const PatientAnalytics = ({ data, loading, error }) => {
  const [period, setPeriod] = useState("monthly");

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!data) return null;

  const { registrationTrends, ageGroups, healthConditions, retention } = data;

  const registrationData = registrationTrends.map((trend, index) => ({
    period: trend.period,
    newPatients: trend.newPatients,
  }));

  const ageGroupData = ageGroups.map((group, index) => ({
    ageGroup: group.ageGroup,
    count: group.count,
  }));

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Patient Analytics</Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Period</InputLabel>
          <Select
            value={period}
            label="Period"
            onChange={(e) => setPeriod(e.target.value)}
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Patient Registration Trends
            </Typography>
            <MUILineChart
              xAxis={[{ dataKey: "period", scaleType: "band" }]}
              series={[
                {
                  dataKey: "newPatients",
                  label: "New Patients",
                  color: "#2196f3",
                },
              ]}
              width={600}
              height={300}
              dataset={registrationData}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Patient Retention
            </Typography>
            <Box textAlign="center">
              <Typography variant="h3" color="primary">
                {retention.retentionRate}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Retention Rate
              </Typography>
              <Typography variant="body2" mt={1}>
                {retention.recentPatients} active in last 30 days
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Age Distribution
            </Typography>
            <MUIBarChart
              xAxis={[{ dataKey: "ageGroup", scaleType: "band" }]}
              series={[
                {
                  dataKey: "count",
                  label: "Count",
                  color: "#4caf50",
                },
              ]}
              width={500}
              height={300}
              dataset={ageGroupData}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Common Health Conditions
            </Typography>
            <Box>
              {healthConditions.slice(0, 8).map((condition, index) => (
                <Chip
                  key={index}
                  label={`${condition.condition} (${condition.count})`}
                  sx={{ m: 0.5 }}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// Care Navigator Performance Component
const CareNavigatorPerformance = ({ data, loading, error }) => {
  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!data) return null;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Care Navigator Performance
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Care Plans</TableCell>
              <TableCell>Completion Rate</TableCell>
              <TableCell>Appointments</TableCell>
              <TableCell>Appointment Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((navigator) => (
              <TableRow key={navigator.id}>
                <TableCell>{navigator.name}</TableCell>
                <TableCell>
                  <Chip
                    label={navigator.status}
                    color={
                      navigator.status === "Active" ? "success" : "default"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {navigator.carePlans.total} ({navigator.carePlans.active}{" "}
                  active)
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Typography
                      color={
                        navigator.carePlans.completionRate > 70
                          ? "success.main"
                          : "warning.main"
                      }
                      mr={1}
                    >
                      {navigator.carePlans.completionRate}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={navigator.carePlans.completionRate}
                      sx={{ width: 60, height: 8, borderRadius: 4 }}
                      color={
                        navigator.carePlans.completionRate > 70
                          ? "success"
                          : "warning"
                      }
                    />
                  </Box>
                </TableCell>
                <TableCell>{navigator.appointments.total}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Typography
                      color={
                        navigator.appointments.completionRate > 80
                          ? "success.main"
                          : "warning.main"
                      }
                      mr={1}
                    >
                      {navigator.appointments.completionRate}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={navigator.appointments.completionRate}
                      sx={{ width: 60, height: 8, borderRadius: 4 }}
                      color={
                        navigator.appointments.completionRate > 80
                          ? "success"
                          : "warning"
                      }
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Appointment Analytics Component
const AppointmentAnalytics = ({ data, loading, error }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!data) return null;

  const { trends, statusDistribution, peakTimes, avgDuration } = data;

  const appointmentTrendData = trends.map((trend, index) => ({
    date: trend.date,
    total: trend.totalAppointments,
    completed: trend.completed,
    cancelled: trend.cancelled,
  }));

  const statusData = statusDistribution.map((status, index) => ({
    status: status.status,
    count: status.count,
    percentage: status.percentage,
  }));

  const peakTimeData = peakTimes.map((peak, index) => ({
    hour: `${peak.hour}:00`,
    count: peak.appointmentCount,
  }));

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Appointment Analytics</Typography>
        <Box display="flex" gap={2}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              renderInput={(params) => <TextField {...params} size="small" />}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              renderInput={(params) => <TextField {...params} size="small" />}
            />
          </LocalizationProvider>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Appointment Trends
            </Typography>
            <MUILineChart
              xAxis={[{ dataKey: "date", scaleType: "band" }]}
              series={[
                {
                  dataKey: "total",
                  label: "Total",
                  color: "#2196f3",
                },
                {
                  dataKey: "completed",
                  label: "Completed",
                  color: "#4caf50",
                },
                {
                  dataKey: "cancelled",
                  label: "Cancelled",
                  color: "#f44336",
                },
              ]}
              width={600}
              height={300}
              dataset={appointmentTrendData}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Average Duration
            </Typography>
            <Box textAlign="center">
              <Typography variant="h3" color="primary">
                {avgDuration} min
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Average Appointment Duration
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Status Distribution
            </Typography>
            <MUIPieChart
              series={[
                {
                  data: statusData.map((status, index) => ({
                    id: index,
                    value: status.count,
                    label: `${status.status} ${status.percentage}%`,
                    color:
                      status.status === "completed"
                        ? "#4caf50"
                        : status.status === "cancelled"
                        ? "#f44336"
                        : "#ff9800",
                  })),
                },
              ]}
              width={350}
              height={200}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Peak Appointment Times
            </Typography>
            <MUIBarChart
              xAxis={[{ dataKey: "hour", scaleType: "band" }]}
              series={[
                {
                  dataKey: "count",
                  label: "Appointments",
                  color: "#ff9800",
                },
              ]}
              width={500}
              height={300}
              dataset={peakTimeData}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// Care Plan Effectiveness Component
const CarePlanEffectiveness = ({ data, loading, error }) => {
  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!data) return null;

  const { statusDistribution, completionTrends, durationStats, commonActions } =
    data;

  const statusData = statusDistribution.map((status, index) => ({
    id: index,
    value: status.count,
    label: `${status.status} ${status.percentage}%`,
    color:
      status.status === "completed"
        ? "#4caf50"
        : status.status === "active"
        ? "#2196f3"
        : "#ff9800",
  }));

  const completionData = completionTrends.map((trend, index) => ({
    month: trend.month,
    rate: trend.completionRate,
  }));

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Care Plan Effectiveness
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Status Distribution
            </Typography>
            <MUIPieChart
              series={[
                {
                  data: statusData,
                },
              ]}
              width={350}
              height={200}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Completion Trends
            </Typography>
            <MUILineChart
              xAxis={[{ dataKey: "month", scaleType: "band" }]}
              series={[
                {
                  dataKey: "rate",
                  label: "Completion Rate %",
                  color: "#4caf50",
                },
              ]}
              width={500}
              height={300}
              dataset={completionData}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Duration Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    {Math.round(durationStats.avgDuration || 0)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Avg Days
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">
                    {durationStats.minDuration || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Min Days
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Typography variant="h4" color="warning.main">
                    {durationStats.maxDuration || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Max Days
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Common Actions
            </Typography>
            <Box>
              {commonActions.slice(0, 6).map((action, index) => (
                <Chip
                  key={index}
                  label={`${action.actions} (${action.count})`}
                  sx={{ m: 0.5 }}
                  color="secondary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// System Usage Component
const SystemUsage = ({ data, loading, error }) => {
  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!data) return null;

  const { adminMetrics, messageMetrics, systemHealth, recentActivity } = data;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        System Usage Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Admin Metrics
            </Typography>
            <Box>
              <Typography variant="h4" color="primary">
                {adminMetrics.total}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Admins
              </Typography>
              <Typography variant="body2" mt={1}>
                {adminMetrics.active} Active, {adminMetrics.inactive} Inactive
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Message Metrics
            </Typography>
            <Box>
              <Typography variant="h4" color="primary">
                {messageMetrics.total}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Messages
              </Typography>
              <Typography variant="body2" mt={1}>
                {messageMetrics.sendRate}% Send Rate
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Health
            </Typography>
            <Box>
              <Typography variant="h4" color="primary">
                {systemHealth.totalUsers}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Users
              </Typography>
              <Typography variant="body2" mt={1}>
                {systemHealth.growthRate}% Growth Rate
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentActivity.slice(0, 10).map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Chip
                          label={activity.type}
                          color={
                            activity.type === "appointment"
                              ? "primary"
                              : "secondary"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{activity.user}</TableCell>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell>
                        {new Date(activity.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// Main Reports Component
const Reports = () => {
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  // Fetch data for different sections
  const businessOverview = useReportData(
    API_ENDPOINTS.REPORTS.BUSINESS_OVERVIEW,
    dateRange
  );
  const patientAnalytics = useReportData(
    API_ENDPOINTS.REPORTS.PATIENT_ANALYTICS
  );
  const careNavigatorPerformance = useReportData(
    API_ENDPOINTS.REPORTS.CARE_NAVIGATOR_PERFORMANCE
  );
  const appointmentAnalytics = useReportData(
    API_ENDPOINTS.REPORTS.APPOINTMENT_ANALYTICS,
    dateRange
  );
  const carePlanEffectiveness = useReportData(
    API_ENDPOINTS.REPORTS.CARE_PLAN_EFFECTIVENESS
  );
  const systemUsage = useReportData(API_ENDPOINTS.REPORTS.SYSTEM_USAGE);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRefresh = () => {
    businessOverview.refetch();
    patientAnalytics.refetch();
    careNavigatorPerformance.refetch();
    appointmentAnalytics.refetch();
    carePlanEffectiveness.refetch();
    systemUsage.refetch();
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export functionality to be implemented");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box className="p-6 mt-10">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" className="text-[#09D1C7]">
            Reports & Analytics
          </Typography>
          <Box display="flex" gap={2}>
            <Tooltip title="Refresh Data">
              <IconButton onClick={handleRefresh} color="primary">
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export Report">
              <IconButton onClick={handleExport} color="primary">
                <Download />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Paper sx={{ width: "100%" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="reports tabs"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="Business Overview" />
            <Tab label="Patient Analytics" />
            <Tab label="Care Navigator Performance" />
            <Tab label="Appointment Analytics" />
            <Tab label="Care Plan Effectiveness" />
            <Tab label="System Usage" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <BusinessOverview {...businessOverview} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <PatientAnalytics {...patientAnalytics} />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <CareNavigatorPerformance {...careNavigatorPerformance} />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <AppointmentAnalytics {...appointmentAnalytics} />
          </TabPanel>
          <TabPanel value={tabValue} index={4}>
            <CarePlanEffectiveness {...carePlanEffectiveness} />
          </TabPanel>
          <TabPanel value={tabValue} index={5}>
            <SystemUsage {...systemUsage} />
          </TabPanel>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default Reports;
