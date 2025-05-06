import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import Patients from "../Patients";

// Mock axios
jest.mock("axios");

// Mock data
const mockPatients = {
  success: true,
  data: [
    {
      _id: "1",
      userId: "P001",
      fullName: "John Doe",
      dateOfBirth: "1990-01-01",
      gender: "Male",
      contactNumber: "1234567890",
      allergies: "Penicillin",
      submittedAt: "2024-03-20T10:00:00Z",
    },
    {
      _id: "2",
      userId: "P002",
      fullName: "Jane Smith",
      dateOfBirth: "1995-05-15",
      gender: "Female",
      contactNumber: "9876543210",
      allergies: null,
      submittedAt: "2024-03-20T11:00:00Z",
    },
  ],
};

describe("Patients Component", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test("fetches and displays patients data successfully", async () => {
    // Mock the axios get request
    axios.get.mockResolvedValueOnce({ data: mockPatients });

    // Render the component
    render(<Patients />);

    // Initially should show loading state
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // Wait for the data to be loaded
    await waitFor(() => {
      // Check if loading spinner is removed
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Verify that the API was called with correct URL
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:5000/api/patients"
    );

    // Verify that the patient data is displayed
    expect(screen.getByText("P001")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  test("handles API error gracefully", async () => {
    // Mock the axios get request to reject
    axios.get.mockRejectedValueOnce(new Error("API Error"));

    // Render the component
    render(<Patients />);

    // Initially should show loading state
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // Wait for the error state
    await waitFor(() => {
      // Check if loading spinner is removed
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Verify that the API was called
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:5000/api/patients"
    );

    // Verify that the table is empty (no data)
    expect(screen.queryByText("P001")).not.toBeInTheDocument();
  });
});
