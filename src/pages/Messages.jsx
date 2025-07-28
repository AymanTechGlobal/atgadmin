// This page is used to send messages to the care navigators
// sending messages from akindukodithuwakku@gmail.com (business email)
// sending, receiving, drafts, sent messages will be shown in the table and stored in the database

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
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Fab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  Send as SendIcon,
  Save as SaveIcon,
  Email as EmailIcon,
  Drafts as DraftsIcon,
  Inbox as InboxIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

const BUSINESS_EMAIL = "akinduscience@gmail.com";

const tabOptions = [
  { label: "Inbox", value: "inbox", icon: <InboxIcon /> },
  { label: "Sent", value: "sent", icon: <EmailIcon /> },
  { label: "Drafts", value: "draft", icon: <DraftsIcon /> },
];

const Messages = () => {
  const [tab, setTab] = useState("inbox");
  const [messages, setMessages] = useState([]);
  const [careNavigators, setCareNavigators] = useState([]);
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeForm, setComposeForm] = useState({
    to: "",
    subject: "",
    body: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [messageStats, setMessageStats] = useState({
    total: 0,
    sent: 0,
    draft: 0,
  });

  // Fetch care navigators on mount
  useEffect(() => {
    const fetchCareNavigators = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(API_ENDPOINTS.CARE_NAVIGATORS, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          // Only keep the email field
          setCareNavigators(res.data.data.map((nav) => nav.email));
        }
      } catch (err) {
        setError("Failed to fetch care navigators");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCareNavigators();
  }, []);

  // Fetch messages when tab changes
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        let status = tab === "inbox" ? undefined : tab;
        let user = BUSINESS_EMAIL;
        let url = `${API_ENDPOINTS.MESSAGES}?user=${user}`;
        if (status) url += `&status=${status}`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setMessages(res.data.data);
          setCurrentPage(0); // Reset to first page on tab change
        }
      } catch (err) {
        setError("Failed to fetch messages");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [tab]);

  // Fetch message statistics
  useEffect(() => {
    const fetchMessageStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_ENDPOINTS.MESSAGES}/stats?user=${BUSINESS_EMAIL}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data.success) {
          setMessageStats(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch message stats:", err);
      }
    };
    fetchMessageStats();
  }, [messages]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleComposeOpen = () => {
    setComposeForm({ to: "", subject: "", body: "" });
    setComposeOpen(true);
  };

  const handleComposeClose = () => {
    setComposeOpen(false);
    setError("");
    setSuccess("");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setComposeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSend = async () => {
    if (!composeForm.to || !composeForm.subject || !composeForm.body) {
      setError("Please fill in all required fields");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_ENDPOINTS.MESSAGES}/send`,
        { ...composeForm },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setSuccess(res.data.message || "Message sent successfully");
        setSnackbarOpen(true);
        setComposeOpen(false);
        setTab("sent");
        // Refresh messages
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to send message";
      setError(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!composeForm.to || !composeForm.subject || !composeForm.body) {
      setError("Please fill in all required fields");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_ENDPOINTS.MESSAGES}/draft`,
        { ...composeForm },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setSuccess(res.data.message || "Draft saved successfully");
        setSnackbarOpen(true);
        setComposeOpen(false);
        setTab("draft");
        // Refresh messages
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to save draft";
      setError(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // Helper: get display name for care navigator
  const getNavigatorName = (email) => {
    return email;
  };

  // Get status color for chips
  const getStatusColor = (status) => {
    switch (status) {
      case "sent":
        return "success";
      case "draft":
        return "warning";
      default:
        return "default";
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const paginatedMessages = messages.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  return (
    <Box className="w-full min-h-screen bg-gray-50 p-4 mt-8">
      <Box className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-4">
        <Box className="flex items-center justify-between mb-6 mt-4">
          <Typography
            variant="h4"
            className="font-bold text-gray-800"
            sx={{ color: "#09D1C7", textAlign: "center" }}
          >
            Professional Communication
          </Typography>
          <Box display="flex" gap={2}>
            <Tooltip title="Refresh Messages">
              <IconButton onClick={handleRefresh} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Fab
              color="primary"
              aria-label="compose"
              onClick={handleComposeOpen}
              size="medium"
            >
              <AddIcon />
            </Fab>
          </Box>
        </Box>

        {/* Message Statistics */}
        <Grid container spacing={2} className="mb-4">
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent className="text-center">
                <Typography variant="h6" color="primary">
                  {messageStats.total}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Messages
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent className="text-center">
                <Typography variant="h6" color="success.main">
                  {messageStats.sent}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Sent Messages
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent className="text-center">
                <Typography variant="h6" color="warning.main">
                  {messageStats.draft}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Draft Messages
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Tabs
          value={tab}
          onChange={handleTabChange}
          aria-label="message tabs"
          className="mb-4"
        >
          {tabOptions.map((t) => (
            <Tab
              key={t.value}
              label={t.label}
              value={t.value}
              icon={t.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>

        {loading ? (
          <Box className="flex justify-center items-center h-40">
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} className="mb-6">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>To</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedMessages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" className="text-gray-500">
                        No messages found in {tab}.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedMessages.map((msg) => (
                    <TableRow
                      key={msg._id}
                      hover
                      tabIndex={0}
                      aria-label={`Message: ${msg.subject}`}
                    >
                      <TableCell>{getNavigatorName(msg.to)}</TableCell>
                      <TableCell>
                        {msg.from === BUSINESS_EMAIL
                          ? "Business Admin"
                          : getNavigatorName(msg.from)}
                      </TableCell>
                      <TableCell>{msg.subject}</TableCell>
                      <TableCell>
                        {new Date(msg.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            msg.status.charAt(0).toUpperCase() +
                            msg.status.slice(1)
                          }
                          color={getStatusColor(msg.status)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={messages.length}
              page={currentPage}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Rows per page:"
            />
          </TableContainer>
        )}

        {/* Compose Modal */}
        <Dialog
          open={composeOpen}
          onClose={handleComposeClose}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            <Typography variant="h6" color="primary">
              Compose Professional Message
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Send from: {BUSINESS_EMAIL}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth className="my-3">
              <InputLabel id="to-label">To (Care Navigator)</InputLabel>
              <Select
                labelId="to-label"
                name="to"
                value={composeForm.to}
                onChange={handleFormChange}
                label="To (Care Navigator)"
                required
                inputProps={{
                  "aria-label": "Select care navigator",
                  tabIndex: 0,
                }}
              >
                {careNavigators.map((email) => (
                  <MenuItem key={email} value={email}>
                    {email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              name="subject"
              label="Subject"
              type="text"
              fullWidth
              value={composeForm.subject}
              onChange={handleFormChange}
              required
              inputProps={{
                "aria-label": "Subject",
                tabIndex: 0,
              }}
              className="my-3"
            />
            <TextField
              margin="dense"
              name="body"
              label="Message"
              type="text"
              fullWidth
              multiline
              minRows={6}
              value={composeForm.body}
              onChange={handleFormChange}
              required
              inputProps={{
                "aria-label": "Message body",
                tabIndex: 0,
              }}
              className="my-3"
              placeholder="Write your professional message here..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleComposeClose} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleSaveDraft}
              color="info"
              variant="outlined"
              startIcon={<SaveIcon />}
              disabled={loading}
            >
              Save as Draft
            </Button>
            <Button
              onClick={handleSend}
              color="primary"
              variant="contained"
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} /> : <SendIcon />
              }
            >
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for feedback */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          {error ? (
            <Alert
              onClose={handleSnackbarClose}
              severity="error"
              sx={{ width: "100%" }}
            >
              {error}
            </Alert>
          ) : success ? (
            <Alert
              onClose={handleSnackbarClose}
              severity="success"
              sx={{ width: "100%" }}
            >
              {success}
            </Alert>
          ) : null}
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Messages;
