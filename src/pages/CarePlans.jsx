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
  Chip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import axios from "axios";

const API_URL = "http://localhost:5000/api/careplans";

const CarePlans = () => {
  const [careplans, setCareplans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedCarePlan, setSelectedCarePlan] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchCarePlans();
  }, []);

  const fetchCarePlans = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setCareplans(response.data.data);
      }
    } catch (error) {
      setError("Error fetching care plans");
      console.error("Error fetching care plans", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCloseSnackbar = () => {
    setSuccess(null);
    setError(null);
  };

  const handlePreview = async (carePlan) => {
    try {
      const response = await axios.get(`${API_URL}/${carePlan._id}/signed-url`);
      if (response.data.success) {
        setPreviewUrl(response.data.data.signedUrl);
        setSelectedCarePlan(carePlan);
        setPreviewOpen(true);
      }
    } catch (error) {
      setError("Failed to generate preview URL");
    }
  };

  const handleDownload = async (carePlan) => {
    try {
      const response = await axios.get(`${API_URL}/${carePlan._id}/document`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${carePlan.planName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError("Failed to download the document");
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewUrl("");
    setSelectedCarePlan(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Completed":
        return "info";
      case "Cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const filteredCarePlans = careplans.filter(
    (plan) =>
      plan.patientname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.careNavigator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.planName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3, pt: 10 }}>
      <Typography variant="h4" sx={{ mb: 4, color: "#09D1C7", textAlign: "center" }}>
        Care Plans
      </Typography>

      <Box className="flex justify-between items-center mb-4">
        <TextField
          placeholder="Search by patient name, care navigator, or plan name"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 400 }}
        />
      </Box>

      {loading ? (
        <Box className="flex justify-center items-center h-64">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient Name</TableCell>
                <TableCell>Care Navigator</TableCell>
                <TableCell>Plan Name</TableCell>
                <TableCell>Date Created</TableCell>
                <TableCell>End Date</TableCell>
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
                  <TableCell>
                    {new Date(plan.dateCreated).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(plan.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={plan.status}
                      color={getStatusColor(plan.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handlePreview(plan)}
                      color="primary"
                      title="Preview"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDownload(plan)}
                      color="secondary"
                      title="Download"
                    >
                      <DownloadIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedCarePlan?.planName} - Preview</DialogTitle>
        <DialogContent>
          <iframe
            src={previewUrl}
            style={{ width: "100%", height: "80vh" }}
            title="Care Plan Preview"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>Close</Button>
          <Button
            onClick={() => selectedCarePlan && handleDownload(selectedCarePlan)}
            variant="contained"
            color="primary"
          >
            Download
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

export default CarePlans;
