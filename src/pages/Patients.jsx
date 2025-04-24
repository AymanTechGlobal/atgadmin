import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  InputAdornment,
  TextField,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
  Warning as WarningIcon,
  Restore as RestoreIcon,
} from "@mui/icons-material";
import axios from "axios";

const API_URL = "http://localhost:5000/api/patients";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    deceased: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPatients();
    fetchStats();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setPatients(response.data.data);
      }
    } catch (error) {
      setError("Error fetching patient details");
      console.error("Error fetching patients", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/stats`);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching patient statistics", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "warning";
      case "Deceased":
        return "error";
      default:
        return "default";
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.careNavigator?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatCard = ({ title, value, icon, color }) => (
    <Card className="h-full">
      <CardContent>
        <Box className="flex items-center justify-between">
          <Box>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Box
            className={`p-3 rounded-full bg-${color}-100`}
            sx={{ color: `${color}.main` }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3, pt: 10 }}>
      <Typography variant="h4" className="mb-6 text-center font-bold">
        Patient Management
      </Typography>

      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Patients"
            value={stats.total}
            icon={<PersonIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Patients"
            value={stats.active}
            icon={<HospitalIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Inactive Patients"
            value={stats.inactive}
            icon={<RestoreIcon />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Deceased Patients"
            value={stats.deceased}
            icon={<WarningIcon />}
            color="error"
          />
        </Grid>
      </Grid>

      <Box className="mb-6">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by patient ID, name, or care navigator"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loading ? (
        <Box className="flex justify-center items-center h-64">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} className="shadow-lg">
          <Table>
            <TableHead>
              <TableRow className="bg-gray-50">
                <TableCell className="font-bold">Patient ID</TableCell>
                <TableCell className="font-bold">Name</TableCell>
                <TableCell className="font-bold">Age</TableCell>
                <TableCell className="font-bold">Gender</TableCell>
                <TableCell className="font-bold">Phone</TableCell>
                <TableCell className="font-bold">Care Navigator</TableCell>
                <TableCell className="font-bold">Status</TableCell>
                <TableCell className="font-bold">Registration Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow
                  key={patient._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell>{patient.patientId}</TableCell>
                  <TableCell>{patient.patientName}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.careNavigator}</TableCell>
                  <TableCell>
                    <Chip
                      label={patient.status}
                      color={getStatusColor(patient.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(patient.regDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Patients;
