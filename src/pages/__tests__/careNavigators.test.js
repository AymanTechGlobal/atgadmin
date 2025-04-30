import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import CareNavigators from "../CareNavigators";

// Mock axios
jest.mock("axios");

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

describe("CareNavigators Component", () => {
  const mockNavigators = [
    {
      _id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      status: "Active",
      dateJoined: "2024-01-01",
    },
    {
      _id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "0987654321",
      status: "Inactive",
      dateJoined: "2024-01-02",
    },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue("mock-token");
    axios.get.mockResolvedValue({
      data: { success: true, data: mockNavigators },
    });
  });

  it("renders the care navigators page", async () => {
    render(<CareNavigators />);

    // Check if the page title is rendered
    expect(screen.getByTestId("page-title")).toHaveTextContent(
      "Care Navigators"
    );

    // Check if the search input is rendered
    expect(screen.getByTestId("search-input")).toBeInTheDocument();

    // Check if the add button is rendered
    expect(screen.getByTestId("add-button")).toHaveTextContent(
      "Add Care Navigator"
    );

    // Wait for the table to load and check if navigators are displayed
    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  it("filters navigators based on search input", async () => {
    render(<CareNavigators />);

    // Wait for the table to load
    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    // Type in the search input
    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "John" } });

    // Check if only John Doe is displayed
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
  });

  describe("Add Care Navigator", () => {
    it("opens add dialog when add button is clicked", async () => {
      render(<CareNavigators />);

      // Wait for the table to load
      await waitFor(() => {
        expect(screen.getByRole("table")).toBeInTheDocument();
      });

      // Click the add button
      const addButton = screen.getByTestId("add-button");
      fireEvent.click(addButton);

      // Check if the dialog is opened with correct title
      expect(screen.getByTestId("navigator-dialog")).toBeInTheDocument();
      expect(screen.getByTestId("dialog-title")).toHaveTextContent(
        "Add Care Navigator"
      );
    });

    it("adds a new care navigator", async () => {
      // Mock the post API call
      axios.post.mockResolvedValueOnce({ data: { success: true } });

      render(<CareNavigators />);

      // Wait for the table to load
      await waitFor(() => {
        expect(screen.getByRole("table")).toBeInTheDocument();
      });

      // Click the add button
      const addButton = screen.getByTestId("add-button");
      fireEvent.click(addButton);

      // Fill in the form
      fireEvent.change(screen.getByTestId("name-input"), {
        target: { name: "name", value: "New Navigator" },
      });
      fireEvent.change(screen.getByTestId("email-input"), {
        target: { name: "email", value: "new@example.com" },
      });
      fireEvent.change(screen.getByTestId("phone-input"), {
        target: { name: "phone", value: "1234567890" },
      });
      fireEvent.change(screen.getByTestId("status-select"), {
        target: { name: "status", value: "Active" },
      });

      // Submit the form
      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      // Check if the API was called
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          "http://localhost:5000/api/care-navigators",
          {
            name: "New Navigator",
            email: "new@example.com",
            phone: "1234567890",
            status: "Active",
          },
          expect.any(Object)
        );
      });

      // Check if success message is shown
      expect(
        screen.getByText("Care navigator added successfully")
      ).toBeInTheDocument();
    });
  });

  describe("Edit Care Navigator", () => {
    it("opens edit dialog with navigator data", async () => {
      render(<CareNavigators />);

      // Wait for the table to load
      await waitFor(() => {
        expect(screen.getByRole("table")).toBeInTheDocument();
      });

      // Click the edit button for the first navigator
      const editButton = screen.getByTestId("edit-button-1");
      fireEvent.click(editButton);

      // Check if the dialog is opened with correct title and data
      expect(screen.getByTestId("navigator-dialog")).toBeInTheDocument();
      expect(screen.getByTestId("dialog-title")).toHaveTextContent(
        "Edit Care Navigator"
      );
      expect(screen.getByTestId("name-input")).toHaveValue("John Doe");
      expect(screen.getByTestId("email-input")).toHaveValue("john@example.com");
    });

    it("updates a care navigator", async () => {
      // Mock the put API call
      axios.put.mockResolvedValueOnce({ data: { success: true } });

      render(<CareNavigators />);

      // Wait for the table to load
      await waitFor(() => {
        expect(screen.getByRole("table")).toBeInTheDocument();
      });

      // Click the edit button
      const editButton = screen.getByTestId("edit-button-1");
      fireEvent.click(editButton);

      // Update the form
      fireEvent.change(screen.getByTestId("name-input"), {
        target: { name: "name", value: "Updated Name" },
      });

      // Submit the form
      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      // Check if the API was called
      await waitFor(() => {
        expect(axios.put).toHaveBeenCalledWith(
          "http://localhost:5000/api/care-navigators/1",
          expect.objectContaining({
            name: "Updated Name",
          }),
          expect.any(Object)
        );
      });

      // Check if success message is shown
      expect(
        screen.getByText("Care navigator updated successfully")
      ).toBeInTheDocument();
    });
  });

  describe("Delete Care Navigator", () => {
    it("opens delete dialog when delete button is clicked", async () => {
      render(<CareNavigators />);

      // Wait for the table to load
      await waitFor(() => {
        expect(screen.getByRole("table")).toBeInTheDocument();
      });

      // Click the delete button
      const deleteButton = screen.getByTestId("delete-button-1");
      fireEvent.click(deleteButton);

      // Check if delete dialog is opened
      expect(screen.getByTestId("delete-dialog")).toBeInTheDocument();
      expect(screen.getByTestId("delete-dialog-title")).toHaveTextContent(
        "Delete Care Navigator"
      );
    });

    it("closes delete dialog when cancel button is clicked", async () => {
      render(<CareNavigators />);

      // Wait for the table to load
      await waitFor(() => {
        expect(screen.getByRole("table")).toBeInTheDocument();
      });

      // Click the delete button
      const deleteButton = screen.getByTestId("delete-button-1");
      fireEvent.click(deleteButton);

      // Check if delete dialog is opened
      expect(screen.getByTestId("delete-dialog")).toBeInTheDocument();

      // Click cancel button
      const cancelButton = screen.getByTestId("cancel-delete-button");
      fireEvent.click(cancelButton);

      // Check if delete dialog is closed
      expect(screen.queryByTestId("delete-dialog")).not.toBeInTheDocument();
    });

    it("deletes a care navigator when confirmed", async () => {
      // Mock the delete API call
      axios.delete.mockResolvedValueOnce({ data: { success: true } });

      render(<CareNavigators />);

      // Wait for the table to load
      await waitFor(() => {
        expect(screen.getByRole("table")).toBeInTheDocument();
      });

      // Click the delete button
      const deleteButton = screen.getByTestId("delete-button-1");
      fireEvent.click(deleteButton);

      // Check if delete dialog is opened
      expect(screen.getByTestId("delete-dialog")).toBeInTheDocument();

      // Click confirm button
      const confirmButton = screen.getByTestId("confirm-delete-button");
      fireEvent.click(confirmButton);

      // Check if delete API was called
      await waitFor(() => {
        expect(axios.delete).toHaveBeenCalledWith(
          "http://localhost:5000/api/care-navigators/1",
          expect.any(Object)
        );
      });

      // Check if success message is shown
      expect(
        screen.getByText("Care navigator deleted successfully")
      ).toBeInTheDocument();
    });

    it("shows error message when delete fails", async () => {
      // Mock the delete API call to fail
      axios.delete.mockRejectedValueOnce(new Error("Delete failed"));

      render(<CareNavigators />);

      // Wait for the table to load
      await waitFor(() => {
        expect(screen.getByRole("table")).toBeInTheDocument();
      });

      // Click the delete button
      const deleteButton = screen.getByTestId("delete-button-1");
      fireEvent.click(deleteButton);

      // Check if delete dialog is opened
      expect(screen.getByTestId("delete-dialog")).toBeInTheDocument();

      // Click confirm button
      const confirmButton = screen.getByTestId("confirm-delete-button");
      fireEvent.click(confirmButton);

      // Check if error message is shown
      await waitFor(() => {
        expect(
          screen.getByText("Error deleting care navigator")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("shows error message when fetching navigators fails", async () => {
      // Mock the get API call to fail
      axios.get.mockRejectedValueOnce(new Error("Fetch failed"));

      render(<CareNavigators />);

      // Check if error message is shown
      await waitFor(() => {
        expect(
          screen.getByText("Error fetching care navigators")
        ).toBeInTheDocument();
      });
    });

    it("shows loading spinner when fetching navigators", async () => {
      // Mock the get API call to delay
      axios.get.mockImplementationOnce(() => new Promise(() => {}));

      render(<CareNavigators />);

      // Check if loading spinner is shown
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });
  });
});
