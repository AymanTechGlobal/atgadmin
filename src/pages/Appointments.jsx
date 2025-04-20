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
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import axios from "axios";

const API_URL = "http://localhost:5000/api/client/appointments";


const Appointments = () => {
  const[appointments, setAppointments] = useState([]);
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

  const handleSearch= (event) => {
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
    }
    else {
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

  

  return (
    <div>
      {/* Add your component JSX here */}
    </div>
  );
}

export default Appointments;
