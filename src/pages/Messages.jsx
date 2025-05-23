// This page is used to send messages to the care navigators
// sending messages from atghealthcare.admin@gmail.com
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

const CARE_NAVIGATOR_API = "http://localhost:5000/api/care-navigators";
const MESSAGES_API = "http://localhost:5000/api/messages";
const ADMIN_EMAIL = "atghealthcare.admin@gmail.com";

const tabOptions = [
  { label: "Inbox", value: "inbox" },
  { label: "Sent", value: "sent" },
  { label: "Drafts", value: "draft" },
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

  // Fetch care navigators on mount
  useEffect(() => {
    const fetchCareNavigators = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(CARE_NAVIGATOR_API, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setCareNavigators(res.data.data);
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
        let user = ADMIN_EMAIL;
        let url = `${MESSAGES_API}?user=${user}`;
        if (status) url += `&status=${status}`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setMessages(res.data.data);
      } catch (err) {
        setError("Failed to fetch messages");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [tab]);

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
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${MESSAGES_API}/send`,
        { ...composeForm },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setSuccess("Message sent successfully");
        setSnackbarOpen(true);
        setComposeOpen(false);
        setTab("sent");
      }
    } catch (err) {
      setError("Failed to send message");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${MESSAGES_API}/draft`,
        { ...composeForm },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setSuccess("Draft saved successfully");
        setSnackbarOpen(true);
        setComposeOpen(false);
        setTab("draft");
      }
    } catch (err) {
      setError("Failed to save draft");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Helper: get display name for care navigator
  const getNavigatorName = (email) => {
    const nav = careNavigators.find((n) => n.email === email);
    return nav ? nav.name : email;
  };

  return (
    <Box className="w-full min-h-screen bg-gray-50 p-4 mt-8">
      <Box className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-4">
        <Box className="flex items-center justify-between mb-4 mt-4">
          <Typography variant="h4" className="font-bold text-gray-800">
            Messages
          </Typography>
          <Fab
            color="primary"
            aria-label="compose"
            onClick={handleComposeOpen}
            className="ml-4"
            size="medium"
          >
            <AddIcon />
          </Fab>
        </Box>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          aria-label="message tabs"
          className="mb-4"
        >
          {tabOptions.map((t) => (
            <Tab key={t.value} label={t.label} value={t.value} />
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
                {messages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" className="text-gray-500">
                        No messages found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  messages.map((msg) => (
                    <TableRow
                      key={msg._id}
                      hover
                      tabIndex={0}
                      aria-label={`Message: ${msg.subject}`}
                    >
                      <TableCell>{getNavigatorName(msg.to)}</TableCell>
                      <TableCell>
                        {msg.from === ADMIN_EMAIL
                          ? "Admin"
                          : getNavigatorName(msg.from)}
                      </TableCell>
                      <TableCell>{msg.subject}</TableCell>
                      <TableCell>
                        {new Date(msg.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {msg.status.charAt(0).toUpperCase() +
                          msg.status.slice(1)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {/* Compose Modal */}
        <Dialog
          open={composeOpen}
          onClose={handleComposeClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Compose Message</DialogTitle>
          <DialogContent>
            <FormControl fullWidth className="my-2">
              <InputLabel id="to-label">To</InputLabel>
              <Select
                labelId="to-label"
                name="to"
                value={composeForm.to}
                onChange={handleFormChange}
                label="To"
                required
                inputProps={{
                  "aria-label": "Select care navigator",
                  tabIndex: 0,
                }}
              >
                {careNavigators.map((nav) => (
                  <MenuItem key={nav.email} value={nav.email}>
                    {nav.name} ({nav.email})
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
              className="my-2"
            />
            <TextField
              margin="dense"
              name="body"
              label="Message"
              type="text"
              fullWidth
              multiline
              minRows={4}
              value={composeForm.body}
              onChange={handleFormChange}
              required
              inputProps={{
                "aria-label": "Message body",
                tabIndex: 0,
              }}
              className="my-2"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleComposeClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveDraft} color="info" variant="outlined">
              Save as Draft
            </Button>
            <Button
              onClick={handleSend}
              color="primary"
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Send"}
            </Button>
          </DialogActions>
        </Dialog>
        {/* Snackbar for feedback */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
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
