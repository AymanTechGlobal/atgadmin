import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import {
  SettingsOutlined,
  ChevronLeft,
  HomeOutlined,
  ReceiptOutlined,
  BarChartOutlined,
  ManageAccountsOutlined,
  PaymentOutlined,
  PeopleOutlined,
  EventOutlined,
  MessageOutlined,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";

const navItems = [
  { text: "Dashboard", icon: <HomeOutlined />, path: "/dashboard" },
  { text: "Management Tools", icon: null },
  {
    text: "Care Navigators",
    icon: <PeopleOutlined />,
    path: "/care-navigators",
  },
  { text: "Care Plans", icon: <ReceiptOutlined />, path: "/careplans" },
  { text: "Appointments", icon: <EventOutlined />, path: "/appointment" },
  { text: "Messages", icon: <MessageOutlined />, path: "/messages" },
  {
    text: "Registered Patients",
    icon: <ManageAccountsOutlined />,
    path: "/patients",
  },
  { text: "System Analytics", icon: null },
  { text: "Reports", icon: <BarChartOutlined />, path: "/reports" },

  {
    text: "User Engagement",
    icon: <BarChartOutlined />,
    path: "/user-engagement",
  },
  { text: "System Settings", icon: <SettingsOutlined />, path: "/profile" },
  
];

const Sidebar = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  return (
    <Box component="nav">
      <Drawer
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        variant={isNonMobile ? "persistent" : "temporary"}
        anchor="left"
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            color: "white",
            background: "linear-gradient(180deg, #09D1C7 0%, #35AFEA 100%)",
            boxSizing: "border-box",
            borderWidth: isNonMobile ? 0 : 2,
            borderRadius: "0 2rem 2rem 0",
            boxShadow: "0.15rem 0.2rem 0.15rem 0.1rem rgba(0, 0, 0, 0.8)",
            width: drawerWidth,
            position: "fixed",
            height: "100vh",
            transition: "all 0.3s ease",
          },
        }}
      >
        <Box width="100%">
          <Box m="1.5rem 2rem 2rem 3rem">
            <FlexBetween color="white">
              <Box display="flex" alignItems="center" gap="0.5rem">
                <Typography variant="h4" fontWeight="bold" color="white">
                  ATG ADMIN
                </Typography>
                {isNonMobile && (
                  <IconButton
                    onClick={() => setIsSidebarOpen(false)}
                    sx={{ color: "white" }}
                  >
                    <ChevronLeft />
                  </IconButton>
                )}
              </Box>
            </FlexBetween>
          </Box>

          <List>
            {navItems.map(({ text, icon, path }) => {
              if (!icon) {
                return (
                  <Typography
                    key={text}
                    sx={{
                      m: "2.25rem 0 1rem 2rem",
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {text}
                  </Typography>
                );
              }

              const isActive = active === path;

              return (
                <ListItem key={text} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate(path);
                      if (isMobile) setIsSidebarOpen(false);
                    }}
                    sx={{
                      backgroundColor: isActive
                        ? "rgba(255,255,255,0.2)"
                        : "transparent",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                      },
                      borderRadius: "0 20px 20px 0",
                      marginRight: "1rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        ml: "2rem",
                        color: isActive ? "white" : "rgba(255,255,255,0.7)",
                        minWidth: "40px",
                      }}
                    >
                      {icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      sx={{
                        "& .MuiTypography-root": {
                          fontWeight: isActive ? "bold" : "normal",
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
