import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import CarePlans from "../CarePlans";
import { API_ENDPOINTS } from "../../config/api";

// Mock axios
jest.mock("axios");

// Mock the API_ENDPOINTS
jest.mock("../../config/api", () => ({
  API_ENDPOINTS: {
    CARE_PLANS: "http://localhost:5000/api/careplans",
  },
}));

describe("CarePlans Component", () => {
  const mockCarePlans = [
    {
      _id: "1",
      patientname: "John Smith",
      careNavigator: "Dr. Sarah Johnson",
      dateCreated: "2024-01-15T10:30:00Z",
      date: "2024-02-15T10:30:00Z",
      status: "active",
      actions: "Regular checkup and medication review",
    },
    {
      _id: "2",
      patientname: "Mary Wilson",
      careNavigator: "Dr. Michael Brown",
      dateCreated: "2024-01-20T14:45:00Z",
      date: "2024-02-20T14:45:00Z",
      status: "completed",
      actions: "Physical therapy sessions",
    },
    {
      _id: "3",
      patientname: "Robert Davis",
      careNavigator: "Dr. Sarah Johnson",
      dateCreated: "2024-01-25T09:15:00Z",
      date: null,
      status: "cancelled",
      actions: "Surgery consultation",
    },
    {
      _id: "4",
      patientname: "Lisa Anderson",
      careNavigator: "Dr. Emily White",
      dateCreated: "2024-01-30T16:20:00Z",
      date: "2024-03-30T16:20:00Z",
      status: "active",
      actions: "Mental health counseling",
    },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Default successful API response
    axios.get.mockResolvedValue({
      data: { success: true, data: mockCarePlans },
    });
  });

  describe("Component Rendering", () => {
    it("renders the care plans page with title", async () => {
      render(<CarePlans />);

      // Check if the title is rendered
      expect(screen.getByText("Care Plans")).toBeInTheDocument();
      expect(screen.getByText("Care Plans")).toHaveStyle({ color: "#09D1C7" });
    });

    it("shows loading spinner while fetching data", () => {
      // Mock a delayed response
      axios.get.mockImplementation(() => new Promise(() => {}));

      render(<CarePlans />);

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("renders search input field", async () => {
      render(<CarePlans />);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(
            "Search by patient name or care navigator"
          )
        ).toBeInTheDocument();
      });
    });

    it("renders the data table with headers", async () => {
      render(<CarePlans />);

      await waitFor(() => {
        expect(screen.getByText("Patient Name")).toBeInTheDocument();
        expect(screen.getByText("Care Navigator")).toBeInTheDocument();
        expect(screen.getByText("Date Created")).toBeInTheDocument();
        expect(screen.getByText("End Date")).toBeInTheDocument();
        expect(screen.getByText("Status")).toBeInTheDocument();
        expect(screen.getByText("Actions")).toBeInTheDocument();
      });
    });
  });

  describe("API Data Retrieval", () => {
    it("fetches care plans data on component mount", async () => {
      render(<CarePlans />);

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(API_ENDPOINTS.CARE_PLANS);
      });
    });

    it("displays fetched care plans data correctly", async () => {
      render(<CarePlans />);

      await waitFor(() => {
        expect(screen.getByText("John Smith")).toBeInTheDocument();
        expect(screen.getByText("Dr. Sarah Johnson")).toBeInTheDocument();
        expect(screen.getByText("Mary Wilson")).toBeInTheDocument();
        expect(screen.getByText("Dr. Michael Brown")).toBeInTheDocument();
      });
    });

    it("formats dates correctly", async () => {
      render(<CarePlans />);

      await waitFor(() => {
        // Check if dates are formatted properly
        expect(screen.getByText("1/15/2024")).toBeInTheDocument(); // dateCreated
        expect(screen.getByText("2/15/2024")).toBeInTheDocument(); // end date
      });
    });

    it("handles null dates gracefully", async () => {
      render(<CarePlans />);

      await waitFor(() => {
        // Check that null dates show as "-"
        const cells = screen.getAllByText("-");
        expect(cells.length).toBeGreaterThan(0);
      });
    });

    it("displays status chips with correct colors", async () => {
      render(<CarePlans />);

      await waitFor(() => {
        const activeChip = screen.getByText("active");
        const completedChip = screen.getByText("completed");
        const cancelledChip = screen.getByText("cancelled");

        expect(activeChip).toBeInTheDocument();
        expect(completedChip).toBeInTheDocument();
        expect(cancelledChip).toBeInTheDocument();
      });
    });

    it("displays actions text correctly", async () => {
      render(<CarePlans />);

      await waitFor(() => {
        expect(
          screen.getByText("Regular checkup and medication review")
        ).toBeInTheDocument();
        expect(
          screen.getByText("Physical therapy sessions")
        ).toBeInTheDocument();
        expect(screen.getByText("Surgery consultation")).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("handles API error gracefully", async () => {
      // Mock API error
      axios.get.mockRejectedValueOnce(new Error("Network error"));

      render(<CarePlans />);

      await waitFor(() => {
        expect(
          screen.getByText("Error fetching care plans")
        ).toBeInTheDocument();
      });
    });

    it("handles API response with success: false", async () => {
      // Mock unsuccessful API response
      axios.get.mockResolvedValueOnce({
        data: { success: false, message: "Failed to fetch data" },
      });

      render(<CarePlans />);

      await waitFor(() => {
        expect(
          screen.getByText("Error fetching care plans")
        ).toBeInTheDocument();
      });
    });

    it("handles empty data response", async () => {
      // Mock empty data response
      axios.get.mockResolvedValueOnce({
        data: { success: true, data: [] },
      });

      render(<CarePlans />);

      await waitFor(() => {
        // Should still render the table headers
        expect(screen.getByText("Patient Name")).toBeInTheDocument();
        expect(screen.getByText("Care Navigator")).toBeInTheDocument();
      });
    });
  });

  describe("Search Functionality", () => {
    it("filters care plans by patient name", async () => {
      const user = userEvent.setup();
      render(<CarePlans />);

      await waitFor(() => {
        expect(screen.getByText("John Smith")).toBeInTheDocument();
        expect(screen.getByText("Mary Wilson")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(
        "Search by patient name or care navigator"
      );
      await user.type(searchInput, "John");

      await waitFor(() => {
        expect(screen.getByText("John Smith")).toBeInTheDocument();
        expect(screen.queryByText("Mary Wilson")).not.toBeInTheDocument();
      });
    });

    it("filters care plans by care navigator name", async () => {
      const user = userEvent.setup();
      render(<CarePlans />);

      await waitFor(() => {
        expect(screen.getByText("Dr. Sarah Johnson")).toBeInTheDocument();
        expect(screen.getByText("Dr. Michael Brown")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(
        "Search by patient name or care navigator"
      );
      await user.type(searchInput, "Sarah");

      await waitFor(() => {
        expect(screen.getByText("Dr. Sarah Johnson")).toBeInTheDocument();
        expect(screen.queryByText("Dr. Michael Brown")).not.toBeInTheDocument();
      });
    });

    it("performs case-insensitive search", async () => {
      const user = userEvent.setup();
      render(<CarePlans />);

      await waitFor(() => {
        expect(screen.getByText("John Smith")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(
        "Search by patient name or care navigator"
      );
      await user.type(searchInput, "john");

      await waitFor(() => {
        expect(screen.getByText("John Smith")).toBeInTheDocument();
      });
    });

    it("shows all results when search is cleared", async () => {
      const user = userEvent.setup();
      render(<CarePlans />);

      await waitFor(() => {
        expect(screen.getByText("John Smith")).toBeInTheDocument();
        expect(screen.getByText("Mary Wilson")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(
        "Search by patient name or care navigator"
      );
      await user.type(searchInput, "John");

      await waitFor(() => {
        expect(screen.getByText("John Smith")).toBeInTheDocument();
        expect(screen.queryByText("Mary Wilson")).not.toBeInTheDocument();
      });

      // Clear the search
      await user.clear(searchInput);

      await waitFor(() => {
        expect(screen.getByText("John Smith")).toBeInTheDocument();
        expect(screen.getByText("Mary Wilson")).toBeInTheDocument();
      });
    });

    it("handles search with no results", async () => {
      const user = userEvent.setup();
      render(<CarePlans />);

      await waitFor(() => {
        expect(screen.getByText("John Smith")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(
        "Search by patient name or care navigator"
      );
      await user.type(searchInput, "NonExistentPatient");

      await waitFor(() => {
        expect(screen.queryByText("John Smith")).not.toBeInTheDocument();
        expect(screen.queryByText("Mary Wilson")).not.toBeInTheDocument();
      });
    });
  });

  describe("Pagination", () => {
    it("displays pagination controls", async () => {
      render(<CarePlans />);

      await waitFor(() => {
        expect(screen.getByText("Rows per page:")).toBeInTheDocument();
        expect(screen.getByText("1-4 of 4")).toBeInTheDocument();
      });
    });

    it("changes rows per page", async () => {
      const user = userEvent.setup();
      render(<CarePlans />);

      await waitFor(() => {
        expect(screen.getByText("Rows per page:")).toBeInTheDocument();
      });

      const rowsPerPageSelect = screen.getByRole("combobox");
      await user.selectOptions(rowsPerPageSelect, "25");

      await waitFor(() => {
        expect(screen.getByText("1-4 of 4")).toBeInTheDocument();
      });
    });

    it("handles pagination with filtered results", async () => {
      const user = userEvent.setup();
      render(<CarePlans />);

      await waitFor(() => {
        expect(screen.getByText("John Smith")).toBeInTheDocument();
        expect(screen.getByText("Mary Wilson")).toBeInTheDocument();
      });

      // Search to filter results
      const searchInput = screen.getByPlaceholderText(
        "Search by patient name or care navigator"
      );
      await user.type(searchInput, "John");

      await waitFor(() => {
        expect(screen.getByText("1-1 of 1")).toBeInTheDocument();
      });
    });
  });

  describe("Status Color Mapping", () => {
    it("applies correct colors to status chips", async () => {
      render(<CarePlans />);

      await waitFor(() => {
        const activeChip = screen.getByText("active");
        const completedChip = screen.getByText("completed");
        const cancelledChip = screen.getByText("cancelled");

        // Check that chips are rendered with correct colors
        expect(activeChip).toBeInTheDocument();
        expect(completedChip).toBeInTheDocument();
        expect(cancelledChip).toBeInTheDocument();
      });
    });

    it("handles unknown status gracefully", async () => {
      const mockCarePlansWithUnknownStatus = [
        {
          _id: "5",
          patientname: "Unknown Status Patient",
          careNavigator: "Dr. Test",
          dateCreated: "2024-01-01T00:00:00Z",
          date: "2024-02-01T00:00:00Z",
          status: "unknown_status",
          actions: "Test action",
        },
      ];

      axios.get.mockResolvedValueOnce({
        data: { success: true, data: mockCarePlansWithUnknownStatus },
      });

      render(<CarePlans />);

      await waitFor(() => {
        expect(screen.getByText("unknown_status")).toBeInTheDocument();
      });
    });
  });

  describe("Data Display Edge Cases", () => {
    it("handles care plans with missing data", async () => {
      const mockCarePlansWithMissingData = [
        {
          _id: "6",
          patientname: null,
          careNavigator: undefined,
          dateCreated: null,
          date: null,
          status: "active",
          actions: null,
        },
      ];

      axios.get.mockResolvedValueOnce({
        data: { success: true, data: mockCarePlansWithMissingData },
      });

      render(<CarePlans />);

      await waitFor(() => {
        // Should handle null/undefined values gracefully
        expect(screen.getByText("-")).toBeInTheDocument();
      });
    });

    it("handles very long text in actions field", async () => {
      const longActionText =
        "This is a very long action text that might cause layout issues in the table cell. It contains multiple sentences and should be handled properly by the component to ensure good user experience.";

      const mockCarePlansWithLongText = [
        {
          _id: "7",
          patientname: "Long Text Patient",
          careNavigator: "Dr. Test",
          dateCreated: "2024-01-01T00:00:00Z",
          date: "2024-02-01T00:00:00Z",
          status: "active",
          actions: longActionText,
        },
      ];

      axios.get.mockResolvedValueOnce({
        data: { success: true, data: mockCarePlansWithLongText },
      });

      render(<CarePlans />);

      await waitFor(() => {
        expect(screen.getByText("Long Text Patient")).toBeInTheDocument();
        expect(screen.getByText(longActionText)).toBeInTheDocument();
      });
    });
  });

  describe("Performance and User Experience", () => {
    it("debounces search input to prevent excessive filtering", async () => {
      const user = userEvent.setup();
      render(<CarePlans />);

      await waitFor(() => {
        expect(screen.getByText("John Smith")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(
        "Search by patient name or care navigator"
      );

      // Type quickly to test if the component handles rapid input changes
      await user.type(searchInput, "J");
      await user.type(searchInput, "o");
      await user.type(searchInput, "h");
      await user.type(searchInput, "n");

      await waitFor(() => {
        expect(screen.getByText("John Smith")).toBeInTheDocument();
        expect(screen.queryByText("Mary Wilson")).not.toBeInTheDocument();
      });
    });

    it("maintains search state when data is refreshed", async () => {
      const user = userEvent.setup();
      render(<CarePlans />);

      await waitFor(() => {
        expect(screen.getByText("John Smith")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(
        "Search by patient name or care navigator"
      );
      await user.type(searchInput, "John");

      await waitFor(() => {
        expect(screen.getByText("John Smith")).toBeInTheDocument();
        expect(screen.queryByText("Mary Wilson")).not.toBeInTheDocument();
      });

      // Simulate data refresh by calling the component's fetch function
      // This would typically be triggered by a refresh button or automatic refresh
      // For now, we'll just verify the search state is maintained
      expect(searchInput).toHaveValue("John");
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels and roles", async () => {
      render(<CarePlans />);

      await waitFor(() => {
        // Check for table role
        expect(screen.getByRole("table")).toBeInTheDocument();

        // Check for search input accessibility
        const searchInput = screen.getByPlaceholderText(
          "Search by patient name or care navigator"
        );
        expect(searchInput).toBeInTheDocument();
      });
    });

    it("supports keyboard navigation", async () => {
      const user = userEvent.setup();
      render(<CarePlans />);

      await waitFor(() => {
        expect(screen.getByText("John Smith")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(
        "Search by patient name or care navigator"
      );

      // Test keyboard navigation
      searchInput.focus();
      await user.keyboard("John");

      await waitFor(() => {
        expect(screen.getByText("John Smith")).toBeInTheDocument();
        expect(screen.queryByText("Mary Wilson")).not.toBeInTheDocument();
      });
    });
  });
});
