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
import logo from "../assets/Ayman_Logo.png";

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
          ml: { sm: `${isSidebarOpen ? "250px" : "0px"}` },
          transition: "all 0.3s ease",
          background: "linear-gradient(135deg, #09D1C7 0%, #35AFEA 100%)",
          color: "white",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar>
          {/* Sidebar toggle button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>

          {/* Logo on the left */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={logo}
              alt="Ayman Logo"
              style={{
                height: "40px",
                objectFit: "contain",
                marginRight: "1rem",
                marginLeft: ".5rem",
                cursor: "pointer",
                filter: "brightness(0) invert(1)",
              }}
              onClick={() => navigate("/dashboard")}
            />
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Profile & Logout */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              alt="Profile"
              src="/default-avatar.png"
              sx={{
                width: 40,
                height: 40,
                cursor: "pointer",
                border: "2px solid rgba(255,255,255,0.8)",
                "&:hover": {
                  border: "2px solid white",
                },
              }}
              onClick={() => navigate("/profile")}
            />
            <IconButton
              onClick={handleOpenDialog}
              color="inherit"
              disabled={loading}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
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
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle id="logout-dialog-title" sx={{ color: "#09D1C7" }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
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
            onClick={handleLogout}
            variant="contained"
            disabled={loading}
            sx={{
              background: "linear-gradient(135deg, #09D1C7 0%, #35AFEA 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #08BDB4 0%, #2E9FD9 100%)",
              },
            }}
          >
            {loading ? "Logging out..." : "Logout"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
