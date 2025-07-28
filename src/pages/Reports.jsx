// This page is used to view the business overview report for the admin

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
  Button,
  Alert,
  IconButton,
  Tooltip,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
} from "@mui/icons-material";
import { PieChart as MUIPieChart } from "@mui/x-charts/PieChart";
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

  const fetchData = async (newParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(endpoint, {
        params: { ...params, ...newParams },
        responseType: "json",
      });
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
const BusinessOverview = ({
  data,
  loading,
  error,
  dateRange,
  onDateRangeChange,
}) => {
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Business Overview</Typography>
        <Box display="flex" gap={2}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={dateRange.startDate}
              onChange={(date) => onDateRangeChange("startDate", date)}
              slotProps={{ textField: { size: "small" } }}
            />
            <DatePicker
              label="End Date"
              value={dateRange.endDate}
              onChange={(date) => onDateRangeChange("endDate", date)}
              slotProps={{ textField: { size: "small" } }}
            />
          </LocalizationProvider>
        </Box>
      </Box>

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

// Export Dialog Component
const ExportDialog = ({
  open,
  onClose,
  onExport,
  format,
  setFormat,
  loading,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Export Business Overview Report</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Format</InputLabel>
            <Select
              value={format}
              label="Format"
              onChange={(e) => setFormat(e.target.value)}
              disabled={loading}
            >
              <MenuItem value="csv">CSV</MenuItem>
              <MenuItem value="json">JSON</MenuItem>
            </Select>
          </FormControl>
          {loading && (
            <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={20} />
              <Typography variant="body2">Exporting report...</Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={() => onExport(format)}
          disabled={loading}
          variant="contained"
          color="primary"
        >
          Export
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Reports Component
const Reports = () => {
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("csv");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [exportLoading, setExportLoading] = useState(false);

  // Fetch business overview data
  const businessOverview = useReportData(
    API_ENDPOINTS.REPORTS.BUSINESS_OVERVIEW,
    dateRange
  );

  // Refetch data when date range changes
  useEffect(() => {
    if (dateRange.startDate || dateRange.endDate) {
      businessOverview.refetch();
    }
  }, [dateRange.startDate, dateRange.endDate]);

  const handleRefresh = () => {
    businessOverview.refetch();
    setSnackbar({
      open: true,
      message: "Data refreshed successfully",
      severity: "success",
    });
  };

  const handleDateRangeChange = (field, value) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));

    // Add a small delay to avoid too many API calls
    setTimeout(() => {
      businessOverview.refetch();
    }, 500);
  };

  const handleExport = async (format) => {
    try {
      setExportLoading(true);
      const params = {
        format,
        ...(dateRange.startDate && {
          startDate: dateRange.startDate.toISOString().split("T")[0],
        }),
        ...(dateRange.endDate && {
          endDate: dateRange.endDate.toISOString().split("T")[0],
        }),
      };

      const response = await axios.get(API_ENDPOINTS.REPORTS.EXPORT, {
        params,
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `business-overview-${new Date().toISOString().split("T")[0]}.${format}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: "Report exported successfully",
        severity: "success",
      });
      setExportDialogOpen(false);
    } catch (error) {
      console.error("Export error:", error);
      setSnackbar({
        open: true,
        message: "Failed to export report",
        severity: "error",
      });
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportClick = () => {
    setExportDialogOpen(true);
  };

  const handleCloseExportDialog = () => {
    setExportDialogOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
            Business Overview Report
          </Typography>
          <Box display="flex" gap={2}>
            <Tooltip title="Refresh Data">
              <IconButton onClick={handleRefresh} color="primary">
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export Report">
              <IconButton onClick={handleExportClick} color="primary">
                <Download />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Paper sx={{ width: "100%", p: 3 }}>
          <BusinessOverview
            {...businessOverview}
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
          />
        </Paper>

        <ExportDialog
          open={exportDialogOpen}
          onClose={handleCloseExportDialog}
          onExport={handleExport}
          format={exportFormat}
          setFormat={setExportFormat}
          loading={exportLoading}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default Reports;
