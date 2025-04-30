import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

const Profile = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    contact: "",
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setAdmins(response.data.data);
      }
    } catch (error) {
      setError("Error fetching admins");
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (admin = null) => {
    if (admin) {
      setSelectedAdmin(admin);
      setFormData({
        email: admin.email,
        contact: admin.contact,
        password: "",
      });
    } else {
      setSelectedAdmin(null);
      setFormData({
        email: "",
        password: "",
        contact: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAdmin(null);
    setError(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      if (selectedAdmin) {
        const response = await axios.put(
          `${API_URL}/${selectedAdmin._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setSuccess("Admin updated successfully");
          fetchAdmins();
          handleCloseDialog();
        }
      } else {
        const response = await axios.post(API_URL, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setSuccess("Admin added successfully");
          fetchAdmins();
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
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${API_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setSuccess("Admin deleted successfully");
          fetchAdmins();
        }
      } catch (error) {
        setError("Error deleting admin");
        console.error("Error deleting admin:", error);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(null);
    setError(null);
  };

  if (loading && admins.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, pt: 10 }}>
      <Typography variant="h4" sx={{ mb: 3, color: "#09D1C7" }}>
        Admin Management
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: "linear-gradient(135deg, #09D1C7 0%, #35AFEA 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #08BDB4 0%, #2E9FD9 100%)",
            },
          }}
        >
          Add New Admin
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgba(9,209,199,0.1)" }}>
              <TableCell>Email</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin._id}>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.contact}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleOpenDialog(admin)}
                    sx={{ color: "#09D1C7" }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(admin._id)}
                    sx={{ color: "#ff4444" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            minWidth: "400px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            "& .MuiDialogTitle-root": {
              background: "linear-gradient(135deg, #09D1C7 0%, #35AFEA 100%)",
              color: "#ffffff",
              padding: "16px 24px",
              borderRadius: "12px 12px 0 0",
            },
            "& .MuiDialogContent-root": {
              padding: "24px",
              background: "#ffffff",
            },
            "& .MuiDialogActions-root": {
              padding: "16px 24px",
              background: "#f8f9fa",
              borderRadius: "0 0 12px 12px",
            },
          },
        }}
      >
        <DialogTitle>
          {selectedAdmin ? "Edit Admin" : "Add New Admin"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
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
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              required={!selectedAdmin}
            />
            <TextField
              label="Contact"
              name="contact"
              type="number"
              value={formData.contact}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: "#666",
              "&:hover": {
                backgroundColor: "rgba(9,209,199,0.1)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{
              background: "linear-gradient(135deg, #09D1C7 0%, #35AFEA 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #08BDB4 0%, #2E9FD9 100%)",
              },
            }}
          >
            {loading ? "Saving..." : selectedAdmin ? "Update" : "Add"}
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

export default Profile;
