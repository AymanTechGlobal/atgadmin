import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Navigate to login page
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if the server request fails, we'll still clear local storage and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        p="1rem"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        backgroundColor="white"
        boxShadow="0 1px 3px rgba(0,0,0,0.1)"
      >
        <Box display="flex" alignItems="center" gap="1rem">
          <Avatar
            alt="Profile"
            src="/default-avatar.png"
            sx={{ width: 40, height: 40, cursor: "pointer" }}
            onClick={() => navigate("/profile")}
          />
          <IconButton
            onClick={handleOpenDialog}
            sx={{ color: "primary.main" }}
            disabled={loading}
          >
            <Logout />
          </IconButton>
        </Box>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="logout-dialog-title"
      >
        <DialogTitle id="logout-dialog-title">Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Logging out..." : "Logout"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
