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
  AppBar,
  Toolbar,
} from "@mui/material";
import { Logout, Menu } from "@mui/icons-material";
import axios from "axios";

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
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

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
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
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${isSidebarOpen ? "300px" : "0px"})` },
          ml: { sm: `${isSidebarOpen ? "300px" : "0px"}` },
          transition: "all 0.3s ease",
          backgroundColor: "white",
          color: "black",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              alt="Profile"
              src="/default-avatar.png"
              sx={{ width: 40, height: 40, cursor: "pointer" }}
              onClick={() => navigate("/profile")}
            />
            <IconButton
              onClick={handleOpenDialog}
              color="inherit"
              disabled={loading}
            >
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

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
