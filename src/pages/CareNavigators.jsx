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

const API_URL = "http://localhost:5000/api/management/care-navigators";

const CareNavigators = () => {
  const [navigators, setNavigators] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNavigator, setSelectedNavigator] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchNavigators();
  }, []);

  const fetchNavigators = async () => {
    try {
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setNavigators(response.data.data);
      }
    } catch (error) {
      setError("Error fetching care navigators");
      console.error("Error fetching care navigators:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenDialog = (navigator = null) => {
    if (navigator) {
      setSelectedNavigator(navigator);
      setFormData({
        name: navigator.name,
        email: navigator.email,
        phone: navigator.phone,
        status: navigator.status,
      });
    } else {
      setSelectedNavigator(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        status: "Active",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedNavigator(null);
    setError(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (selectedNavigator) {
        const response = await axios.put(
          `${API_URL}/${selectedNavigator._id}`,
          formData
        );
        if (response.data.success) {
          setSuccess("Care navigator updated successfully");
          fetchNavigators();
          handleCloseDialog();
        }
      } else {
        const response = await axios.post(API_URL, formData);
        if (response.data.success) {
          setSuccess("Care navigator added successfully");
          fetchNavigators();
          handleCloseDialog();
        }
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setError(error.response.data.errors.join(", "));
      } else {
        setError(error.response?.data?.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this care navigator?")
    ) {
      try {
        const response = await axios.delete(`${API_URL}/${id}`);
        if (response.data.success) {
          setSuccess("Care navigator deleted successfully");
          fetchNavigators();
        }
      } catch (error) {
        setError("Error deleting care navigator");
        console.error("Error deleting care navigator:", error);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(null);
    setError(null);
  };

  const filteredNavigators = navigators.filter((navigator) =>
    navigator.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Care Navigator
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Date Joined</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredNavigators.map((navigator) => (
              <TableRow key={navigator._id}>
                <TableCell>{navigator.name}</TableCell>
                <TableCell>{navigator.email}</TableCell>
                <TableCell>{navigator.phone}</TableCell>
                <TableCell>
                  {new Date(navigator.dateJoined).toLocaleDateString()}
                </TableCell>
                <TableCell>{navigator.status}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleOpenDialog(navigator)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(navigator._id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

       {/*  this is for new care navigator creation */ }
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedNavigator ? "Edit Care Navigator" : "Add Care Navigator"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              fullWidth
              required
              inputProps={{ maxLength: 10 }}
            />
            <TextField
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              fullWidth
              SelectProps={{
                native: true,
              }}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? "Saving..." : selectedNavigator ? "Update" : "Add"}
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

export default CareNavigators;
