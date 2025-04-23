//appointments page uses to fetch, update, delete existing appointments created by care navigators
//After care navigator confirms an appointment the data will be fetched from db automatically

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
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import axios from "axios";
import { width } from "@mui/system";

const API_URL = "http://localhost:5000/api/client/appointments";

//  end points
//  /appointment
//  /appointment/:id -> update
//  /appointment/id -> delete

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    appointmentDate: "",
    appointmentTime: "",
    status: "Scheduled",
    Doctor: "",
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      setError("Error fetching appointments");
      console.error("Error fetching appointments:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenDialog = (appointment = null) => {
    if (appointment) {
      setSelectedAppointment(appointment);
      setFormData({
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        status: appointment.status,
        Doctor: appointment.Doctor,
      });
    } else {
      setSelectedAppointment(null);
      setFormData({
        appointmentDate: "",
        appointmentTime: "",
        status: "Scheduled",
        Doctor: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppointment(null);
    setError(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (selectedAppointment) {
        // update the existing appointment
        const response = await axios.put(
          `${API_URL}/${selectedAppointment._id}`,
          formData
        );
        if (response.data.success) {
          setSuccess("Appointment updated successfully");
          fetchAppointments();
          handleCloseDialog();
        } else {
          setError("Error updating appointment");
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError(error.response?.data?.message || "Error updating appointment");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm("Are you sure, you want to delete this appointment?")) {
      try {
        const response = await axios.delete(`${API_URL}/${appointmentId}`);
        if (response.data.success) {
          setSuccess("Appointment deleted successfully");
          fetchAppointments();
        }
      } catch (error) {
        setError("Error deleting appointment");
        console.error("Error deleting appointment:", error);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(null);
    setError(null);
  };

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.appointmentId.includes(searchTerm.toLowerCase()) ||
      appointment.Doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Appointments
      </Typography>
      <TextField
        variant="outlined"
        placeholder="Search by appointment ID or doctor name"
        value={searchTerm}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        fullWidth
        sx={{ marginBottom: 2 }}
      />

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Appointment ID</TableCell>
              <TableCell>PatientName</TableCell>
              <TableCell>Care Need</TableCell>
              <TableCell>Care Navigator</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Appointment Date</TableCell>
              <TableCell>Appointment Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAppointments.map((appointment) => (
              <TableRow key={appointment._id}>
                <TableCell>{appointment.appointmentId}</TableCell>
                <TableCell>{appointment.patientName}</TableCell>
                <TableCell>{appointment.careNeed}</TableCell>
                <TableCell>{appointment.CareNavigator}</TableCell>
                <TableCell>{appointment.Doctor}</TableCell>
                <TableCell>
                  {new Date(appointment.appointmentDate).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  {new Date(appointment.appointmentTime).toLocaleTimeString(
                    [],
                    { hour: "2-digit", minute: "2-digit" }
                  )}
                </TableCell>
                <TableCell>{appointment.status}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(appointment)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(appointment._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Appointments;
