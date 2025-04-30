import React from "react";
import { Box, Typography } from "@mui/material";

const Dashboard = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        p: 3,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{ mt: 4, color: "#09D1C7", textAlign: "center" }}
      >
        Admin View
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {/* Add your dashboard content here */}
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: "background.paper",
            boxShadow: 1,
          }}
        >
          <Typography variant="h6">Welcome to your Dashboard</Typography>
          <Typography variant="body1" color="text.secondary">
            This is a sample dashboard layout. You can add your content here.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
