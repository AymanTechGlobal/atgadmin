import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useMediaQuery } from "@mui/material";
import { useState } from "react";

const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Box display="flex" width="100%" height="100vh">
      <Sidebar
        isNonMobile={isNonMobile}
        drawerWidth="300px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minHeight: "100vh",
          width: isSidebarOpen ? "calc(100% - 250px)" : "100%",
          transition: "width 0.3s ease",
        }}
      >
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: "64px", // Height of the header
            px: 3,
            py: 2,
            overflow: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
