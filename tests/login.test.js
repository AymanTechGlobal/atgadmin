import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../src/pages/Login";
import axios from "axios";

// Mock axios
jest.mock("axios");

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Login Component", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    localStorage.clear();
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  test("renders login form with all required elements", () => {
    renderLogin();

    // Check for main elements
    expect(screen.getByText("ATG Admin")).toBeInTheDocument();
    expect(screen.getByText("Login to the admin panel")).toBeInTheDocument();
    expect(screen.getByText("Welcome Back")).toBeInTheDocument();

    // Check for form elements
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/remember me/i)).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();

    // Check for Lottie animation (mocked)
    expect(screen.getByTestId("lottie-animation")).toBeInTheDocument();
  });

  test("handles form submission successfully", async () => {
    const mockResponse = {
      data: {
        token: "fake-token",
        user: { id: 1, email: "test@example.com" },
      },
    };
    axios.post.mockResolvedValueOnce(mockResponse);

    renderLogin();

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    // Check if loading state is shown
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // Wait for the API call to complete
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5000/api/auth/login",
        {
          email: "test@example.com",
          password: "password123",
        },
        expect.any(Object)
      );
    });

    // Check if token and user data are stored
    expect(localStorage.getItem("token")).toBe("fake-token");
    expect(localStorage.getItem("user")).toBe(
      JSON.stringify(mockResponse.data.user)
    );

    // Check if navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith("/Dashboard");
  });

  test("handles login error", async () => {
    const errorMessage = "Invalid credentials";
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: errorMessage,
        },
      },
    });

    renderLogin();

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Check if loading state is removed
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  test("validates required fields", () => {
    renderLogin();

    // Try to submit without filling the form
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    // Check if form validation is triggered
    expect(screen.getByLabelText(/email address/i)).toBeInvalid();
    expect(screen.getByLabelText(/password/i)).toBeInvalid();
  });

  test("validates email format", () => {
    renderLogin();

    // Enter invalid email
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "invalid-email" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    // Check if email validation is triggered
    expect(screen.getByLabelText(/email address/i)).toBeInvalid();
  });
});
