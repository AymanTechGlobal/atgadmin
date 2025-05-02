import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

    // First check loading state
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

    // Wait for loading to complete and check page elements
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    // Now check the page content
    expect(screen.getByTestId("page-title")).toHaveTextContent(
      "Care Navigators"
    );
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("add-button")).toHaveTextContent(
      "Add Care Navigator"
    );

    // Check table content separately
    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("filters navigators based on search input", async () => {
    render(<CareNavigators />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    // Get the search input and update its value using userEvent
    const searchInput = screen.getByTestId("search-input");
    const user = userEvent.setup();
   await user.type(searchInput, "John");

    // Wait for the filter to be applied
  await waitFor(() => {
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
  });

  describe("Add Care Navigator", () => {
    it("opens add dialog when add button is clicked", async () => {
      render(<CareNavigators />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
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

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
      });

      // Click the add button
      const addButton = screen.getByTestId("add-button");
      fireEvent.click(addButton);

      // Fill in the form using userEvent
      const nameInput = screen.getByRole("textbox", { name: /name/i });
      const emailInput = screen.getByRole("textbox", { name: /email/i });
      const phoneInput = screen.getByRole("textbox", { name: /phone/i });
      const statusSelect = screen.getByRole("combobox", { name: /status/i });

      await userEvent.type(nameInput, "New Navigator");
      await userEvent.type(emailInput, "new@example.com");
      await userEvent.type(phoneInput, "1234567890");
      await userEvent.selectOptions(statusSelect, "Active");

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

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
      });

      // Click the edit button for the first navigator
      const editButton = screen.getByTestId("edit-button-1");
      fireEvent.click(editButton);

      // Check if the dialog is opened with correct title and data
      expect(screen.getByTestId("navigator-dialog")).toBeInTheDocument();
      expect(screen.getByTestId("dialog-title")).toHaveTextContent(
        "Edit Care Navigator"
      );
      expect(screen.getByRole("textbox", { name: /name/i })).toHaveValue(
        "John Doe"
      );
      expect(screen.getByRole("textbox", { name: /email/i })).toHaveValue(
        "john@example.com"
      );
    });

    it("updates a care navigator", async () => {
      // Mock the put API call
      axios.put.mockResolvedValueOnce({ data: { success: true } });

      render(<CareNavigators />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
      });

      // Click the edit button
      const editButton = screen.getByTestId("edit-button-1");
      fireEvent.click(editButton);

      // Update the form using userEvent
      const nameInput = screen.getByRole("textbox", { name: /name/i });
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, "Updated Name");

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

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
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

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
      });

      // Click the delete button
      const deleteButton = screen.getByTestId("delete-button-1");
      fireEvent.click(deleteButton);

      // Check if delete dialog is opened
      expect(screen.getByTestId("delete-dialog")).toBeInTheDocument();

      // Click cancel button
      const cancelButton = screen.getByTestId("cancel-delete-button");
      fireEvent.click(cancelButton);

      // Wait for dialog to close
      await waitFor(() => {
        expect(screen.queryByTestId("delete-dialog")).not.toBeInTheDocument();
      });
    });

    it("deletes a care navigator when confirmed", async () => {
      // Mock the delete API call
      axios.delete.mockResolvedValueOnce({ data: { success: true } });

      render(<CareNavigators />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
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

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
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
