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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPatients();
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.contactNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <Box sx={{ p: 3, pt: 10 }}>
      <Typography variant="h4" sx={{ mb: 4, color: "#09D1C7" }}>
        Patient Management
      </Typography>

      <Box className="mb-6">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by patient ID, name, or contact number"
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
                <TableCell className="font-bold">User ID</TableCell>
                <TableCell className="font-bold">Full Name</TableCell>
                <TableCell className="font-bold">Age</TableCell>
                <TableCell className="font-bold">Gender</TableCell>
                <TableCell className="font-bold">Contact Number</TableCell>
                <TableCell className="font-bold">Allergies</TableCell>
                <TableCell className="font-bold">Registration Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow
                  key={patient._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell>{patient.userId}</TableCell>
                  <TableCell>{patient.fullName}</TableCell>
                  <TableCell>{calculateAge(patient.dateOfBirth)}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.contactNumber}</TableCell>
                  <TableCell>
                    <Chip
                      label={patient.allergies || "None"}
                      color={patient.allergies ? "warning" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(patient.submittedAt).toLocaleDateString()}
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
