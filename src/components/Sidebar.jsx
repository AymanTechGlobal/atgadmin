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
  { text: "Dashboard", icon: <HomeOutlined /> },
  { text: "Management Tools", icon: null },
  { text: "Care Navigators", icon: <PeopleOutlined /> },
  { text: "Care Plans", icon: <ReceiptOutlined /> },
  { text: "Event Logs", icon: <EventOutlined /> },
  { text: "Messages", icon: <MessageOutlined /> },
  { text: "System Analytics", icon: null },
  { text: "Reports", icon: <BarChartOutlined /> },
  { text: "User Management", icon: <ManageAccountsOutlined /> },
  { text: "User Engagement", icon: <BarChartOutlined /> },
  { text: "System Settings", icon: <SettingsOutlined /> },
  { text: "Transactions", icon: null },
  { text: "Invoices", icon: <ReceiptOutlined /> },
  { text: "Payments", icon: <PaymentOutlined /> },
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

  useEffect(() => {
    setActive(pathname.substring(1));
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
            color: theme.palette.secondary[200],
            backgroundColor: theme.palette.background.alt,
            boxSizing: "border-box",
            borderWidth: isNonMobile ? 0 : 2,
            borderRadius: "0 2rem 2rem 0",
            boxShadow: "0.15rem 0.2rem 0.15rem 0.1rem rgba(0, 0, 0, 0.8)",
            width: drawerWidth,
            position: "relative",
            height: "100vh",
          },
        }}
      >
        <Box width="100%">
          <Box m="1.5rem 2rem 2rem 3rem">
            <FlexBetween color={theme.palette.secondary.main}>
              <Box display="flex" alignItems="center" gap="0.5rem">
                <Typography variant="h3" fontWeight="bold">
                  ATG ADMIN
                </Typography>
                {isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(false)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </Box>
            </FlexBetween>
          </Box>

          <List>
            {navItems.map(({ text, icon }) => {
              if (!icon) {
                return (
                  <Typography
                    key={text}
                    sx={{ m: "2.25rem 0 1rem 2rem" }}
                    fontSize="12px"
                    fontWeight="bold"
                    color={theme.palette.secondary.main}
                  >
                    <Divider />
                    {text}
                  </Typography>
                );
              }

              const isActive = active === text.toLowerCase().replace(" ", "-");

              return (
                <ListItem key={text} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      const path = text.toLowerCase().replace(" ", "-");
                      navigate(`/${path}`);
                      setActive(path);
                      if (!isNonMobile) setIsSidebarOpen(false);
                    }}
                    sx={{
                      backgroundColor: isActive
                        ? theme.palette.secondary[300]
                        : "transparent",
                      color: isActive
                        ? theme.palette.primary.main
                        : theme.palette.secondary[100],
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        ml: "2rem",
                        color: isActive
                          ? theme.palette.primary.main
                          : theme.palette.secondary[200],
                      }}
                    >
                      {icon}
                    </ListItemIcon>
                    <ListItemText primary={text} />
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
