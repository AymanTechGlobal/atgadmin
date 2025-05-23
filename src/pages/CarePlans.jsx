//This page is used to view the care plans created by the care navigators using the mobile app
// fetch the data from the ----> backend/routes/carePlanRoutes.js
// Uses RDS DB directly to fetch the data

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
  TablePagination,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import axios from "axios";

const API_URL = "http://localhost:5000/api/careplans";

const CarePlans = () => {
  const [careplans, setCareplans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "completed":
        return "info";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const filteredCarePlans = careplans.filter(
    (plan) =>
      plan.patientname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.careNavigator?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const paginatedCarePlans = filteredCarePlans.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3, pt: 10 }}>
      <Typography
        variant="h4"
        sx={{ mb: 4, color: "#09D1C7", textAlign: "center" }}
      >
        Care Plans
      </Typography>

      <Box className="flex justify-between items-center mb-4">
        <TextField
          placeholder="Search by patient name or care navigator"
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
                <TableCell>Date Created</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCarePlans.map((plan) => (
                <TableRow key={plan._id}>
                  <TableCell>{plan.patientname}</TableCell>
                  <TableCell>{plan.careNavigator}</TableCell>
                  <TableCell>
                    {plan.dateCreated
                      ? new Date(plan.dateCreated).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {plan.date ? new Date(plan.date).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={plan.status}
                      color={getStatusColor(plan.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{plan.actions || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredCarePlans.length}
            page={currentPage}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50]}
            labelRowsPerPage="Rows per page:"
          />
        </TableContainer>
      )}
      {error && (
        <Typography color="error" className="mt-4 text-center">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default CarePlans;
