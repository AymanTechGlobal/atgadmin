import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
  Alert,
  Snackbar,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { spacing } from "@mui/system";

const API_URL = "http://localhost:5000/api/patients";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
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
      setError("Error fetching patent details");
      console.error("Error fetching patients", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

    const filteredPatients = patients.filter(
      (patients) =>
        patients.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patients.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  return (
    <Box>
      <Typography variant="h4" className="mb-4 text-center">
        Registered Patients
      </Typography>

      <Box className="flex justify-between items-left mb-4">
        <TextField
          variant="outlined"
          placeholder="search by patient name, ID"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          className="w-1/3"
        />
      </Box>

      {loading ? (
        <Box className="flex justify-center items-center h-64">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} className="mt-4">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient ID</TableCell>
                <TableCell>Patient Name</TableCell>
                <TableCell>Age To Date</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Reg Date</TableCell>
                <TableCell>Telephone</TableCell>
                <TableCell>Assigned CareNavigator</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient._id}>
                  <TableCell>{patient.patientId}</TableCell>
                  <TableCell>{patient.patientName}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.regDate}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.careNavigator}</TableCell>
                 
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
