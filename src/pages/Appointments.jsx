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
const API_URL = "http://localhost:5000/api/appointments";

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
    appointmentDate: new Date(),
    appointmentTime: new Date(),
    status: "Scheduled",
    Doctor: "",
    notes: "",
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      setError("Error fetching appointments");
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenDialog = (appointment = null) => {
    if (appointment) {
      setSelectedAppointment(appointment);
      setFormData({
        appointmentDate: new Date(appointment.appointmentDate),
        appointmentTime: new Date(appointment.appointmentTime),
        status: appointment.status,
        Doctor: appointment.Doctor,
        notes: appointment.notes || "",
      });
    } else {
      setSelectedAppointment(null);
      setFormData({
        appointmentDate: new Date(),
        appointmentTime: new Date(),
        status: "Scheduled",
        Doctor: "",
        notes: "",
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

  const handleDateChange = (newValue, field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: newValue,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const dataToSend = {
        ...formData,
        appointmentDate: formData.appointmentDate.toISOString(),
        appointmentTime: formData.appointmentTime.toISOString(),
      };

      if (selectedAppointment) {
        const response = await axios.put(
          `${API_URL}/${selectedAppointment._id}`,
          dataToSend
        );
        if (response.data.success) {
          setSuccess("Appointment updated successfully");
          fetchAppointments();
          handleCloseDialog();
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error updating appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      setLoading(true);
      try {
        const response = await axios.delete(`${API_URL}/${appointmentId}`);
        if (response.data.success) {
          setSuccess("Appointment deleted successfully");
          fetchAppointments();
        }
      } catch (error) {
        setError("Error deleting appointment");
        console.error("Error deleting appointment:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(null);
    setError(null);
  };

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.appointmentId
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.Doctor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ pt: 10, paddingRight: 10 }}>
      <Typography variant="h4" className="mb-4 text-center">
        Appointments
      </Typography>

      <Box className="flex justify-between items-left mb-4">
        <TextField
          variant="outlined"
          placeholder="Search by ID, doctor, or patient name"
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
                <TableCell>Appointment ID</TableCell>
                <TableCell>Patient Name</TableCell>
                <TableCell>Care Need</TableCell>
                <TableCell>Care Navigator</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
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
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        appointment.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(appointment)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
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
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedAppointment ? "Edit Appointment" : "New Appointment"}
        </DialogTitle>
        <DialogContent>
          <Box className="grid grid-cols-2 gap-4 mt-4">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Appointment Date"
                value={formData.appointmentDate}
                onChange={(newValue) =>
                  handleDateChange(newValue, "appointmentDate")
                }
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <DateTimePicker
                label="Appointment Time"
                value={formData.appointmentTime}
                onChange={(newValue) =>
                  handleDateChange(newValue, "appointmentTime")
                }
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={handleInputChange}
                name="status"
                label="Status"
              >
                <MenuItem value="Scheduled">Scheduled</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
                <MenuItem value="Rescheduled">Rescheduled</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Doctor"
              name="Doctor"
              value={formData.Doctor}
              onChange={handleInputChange}
            />

            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

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
