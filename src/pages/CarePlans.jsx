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
import { Search as SearchIcon, Edit as EditIcon } from "@mui/icons-material";
import axios from "axios";

const API_URL = "http://localhost:5000/api/careplans";

const CarePlans = () => {
  const [careplans, setCareplans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedCarePlan, setSelectedCarePlan] = useState(null);

  useEffect(() => {
    fetchCarePlans();
  }, []);

  const fetchCarePlans = async () => {
    try {
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setCareplans(response.data.data);
      }
    } catch (error) {
      setError("Error fetching care plans");
      console.error("Error fetching care plans", error);
    }
  };

  const handleViewDocument = async (carePlan) => {
    try {
      const response = await axios.get(`${API_URL}/${carePlan._id}/document`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      window.open(url);
    } catch (err) {
      setError("Failed to download the document.");
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCarePlan(null);
    setError(null);
  };

  const handleCloseSnackbar = () => {
    setSuccess(null);
    setError(null);
  };

  const filteredCarePlans = careplans.filter((plan) =>
    plan.patientname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3, pt: 10 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <TextField
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient Name</TableCell>
              <TableCell>Care Navigator</TableCell>
              <TableCell>Care Plan Name</TableCell>
              <TableCell>Date Created</TableCell>
              <TableCell>Date End</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCarePlans.map((plan) => (
              <TableRow key={plan._id}>
                <TableCell>{plan.patientname}</TableCell>
                <TableCell>{plan.careNavigator}</TableCell>
                <TableCell>{plan.planName}</TableCell>
                <TableCell>{plan.dateCreated}</TableCell>
                <TableCell>{plan.date}</TableCell>
                <TableCell>{plan.status}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleViewDocument(plan)}
                    color="primary"
                  >
                    <EditIcon />
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

export default CarePlans;
