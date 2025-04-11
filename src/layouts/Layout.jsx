import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "../components/Header";

const Layout = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: "64px", // Height of the header
          px: 3,
          py: 2,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
