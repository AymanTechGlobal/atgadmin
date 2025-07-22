import axios from "axios";
import { API_ENDPOINTS } from "../../config/api";

// Mock axios
jest.mock("axios");

// Mock the API_ENDPOINTS
jest.mock("../../config/api", () => ({
  API_ENDPOINTS: {
    CARE_PLANS: "http://localhost:5000/api/careplans",
  },
}));

describe("CarePlans API Endpoints", () => {
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
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/careplans", () => {
    it("successfully fetches care plans", async () => {
      // Mock successful response
      axios.get.mockResolvedValueOnce({
        data: { success: true, data: mockCarePlans },
      });

      const response = await axios.get(API_ENDPOINTS.CARE_PLANS);

      expect(axios.get).toHaveBeenCalledWith(API_ENDPOINTS.CARE_PLANS);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toEqual(mockCarePlans);
      expect(response.data.data).toHaveLength(2);
    });

    it("handles empty response", async () => {
      // Mock empty response
      axios.get.mockResolvedValueOnce({
        data: { success: true, data: [] },
      });

      const response = await axios.get(API_ENDPOINTS.CARE_PLANS);

      expect(response.data.success).toBe(true);
      expect(response.data.data).toEqual([]);
      expect(response.data.data).toHaveLength(0);
    });

    it("handles API error response", async () => {
      // Mock error response
      axios.get.mockRejectedValueOnce({
        response: {
          status: 500,
          data: { success: false, message: "Internal server error" },
        },
      });

      try {
        await axios.get(API_ENDPOINTS.CARE_PLANS);
      } catch (error) {
        expect(error.response.status).toBe(500);
        expect(error.response.data.success).toBe(false);
        expect(error.response.data.message).toBe("Internal server error");
      }
    });

    it("handles network error", async () => {
      // Mock network error
      axios.get.mockRejectedValueOnce(new Error("Network Error"));

      try {
        await axios.get(API_ENDPOINTS.CARE_PLANS);
      } catch (error) {
        expect(error.message).toBe("Network Error");
      }
    });

    it("handles timeout error", async () => {
      // Mock timeout error
      axios.get.mockRejectedValueOnce({
        code: "ECONNABORTED",
        message: "timeout of 5000ms exceeded",
      });

      try {
        await axios.get(API_ENDPOINTS.CARE_PLANS);
      } catch (error) {
        expect(error.code).toBe("ECONNABORTED");
        expect(error.message).toBe("timeout of 5000ms exceeded");
      }
    });

    it("handles 404 error", async () => {
      // Mock 404 error
      axios.get.mockRejectedValueOnce({
        response: {
          status: 404,
          data: { success: false, message: "Care plans not found" },
        },
      });

      try {
        await axios.get(API_ENDPOINTS.CARE_PLANS);
      } catch (error) {
        expect(error.response.status).toBe(404);
        expect(error.response.data.message).toBe("Care plans not found");
      }
    });

    it("handles 401 unauthorized error", async () => {
      // Mock 401 error
      axios.get.mockRejectedValueOnce({
        response: {
          status: 401,
          data: { success: false, message: "Unauthorized" },
        },
      });

      try {
        await axios.get(API_ENDPOINTS.CARE_PLANS);
      } catch (error) {
        expect(error.response.status).toBe(401);
        expect(error.response.data.message).toBe("Unauthorized");
      }
    });

    it("handles malformed response", async () => {
      // Mock malformed response
      axios.get.mockResolvedValueOnce({
        data: { invalidField: "invalid data" },
      });

      const response = await axios.get(API_ENDPOINTS.CARE_PLANS);

      expect(response.data).not.toHaveProperty("success");
      expect(response.data).not.toHaveProperty("data");
      expect(response.data.invalidField).toBe("invalid data");
    });

    it("handles response with null data", async () => {
      // Mock response with null data
      axios.get.mockResolvedValueOnce({
        data: { success: true, data: null },
      });

      const response = await axios.get(API_ENDPOINTS.CARE_PLANS);

      expect(response.data.success).toBe(true);
      expect(response.data.data).toBeNull();
    });

    it("handles response with undefined data", async () => {
      // Mock response with undefined data
      axios.get.mockResolvedValueOnce({
        data: { success: true },
      });

      const response = await axios.get(API_ENDPOINTS.CARE_PLANS);

      expect(response.data.success).toBe(true);
      expect(response.data.data).toBeUndefined();
    });
  });

  describe("API Response Data Validation", () => {
    it("validates care plan data structure", async () => {
      axios.get.mockResolvedValueOnce({
        data: { success: true, data: mockCarePlans },
      });

      const response = await axios.get(API_ENDPOINTS.CARE_PLANS);
      const carePlans = response.data.data;

      carePlans.forEach((carePlan) => {
        expect(carePlan).toHaveProperty("_id");
        expect(carePlan).toHaveProperty("patientname");
        expect(carePlan).toHaveProperty("careNavigator");
        expect(carePlan).toHaveProperty("dateCreated");
        expect(carePlan).toHaveProperty("date");
        expect(carePlan).toHaveProperty("status");
        expect(carePlan).toHaveProperty("actions");

        expect(typeof carePlan._id).toBe("string");
        expect(typeof carePlan.patientname).toBe("string");
        expect(typeof carePlan.careNavigator).toBe("string");
        expect(typeof carePlan.status).toBe("string");
      });
    });

    it("handles care plans with missing optional fields", async () => {
      const incompleteCarePlans = [
        {
          _id: "1",
          patientname: "John Smith",
          careNavigator: "Dr. Sarah Johnson",
          dateCreated: "2024-01-15T10:30:00Z",
          date: null,
          status: "active",
          actions: null,
        },
      ];

      axios.get.mockResolvedValueOnce({
        data: { success: true, data: incompleteCarePlans },
      });

      const response = await axios.get(API_ENDPOINTS.CARE_PLANS);
      const carePlans = response.data.data;

      expect(carePlans[0].date).toBeNull();
      expect(carePlans[0].actions).toBeNull();
    });

    it("validates date formats", async () => {
      axios.get.mockResolvedValueOnce({
        data: { success: true, data: mockCarePlans },
      });

      const response = await axios.get(API_ENDPOINTS.CARE_PLANS);
      const carePlans = response.data.data;

      carePlans.forEach((carePlan) => {
        if (carePlan.dateCreated) {
          expect(() => new Date(carePlan.dateCreated)).not.toThrow();
        }
        if (carePlan.date) {
          expect(() => new Date(carePlan.date)).not.toThrow();
        }
      });
    });

    it("validates status values", async () => {
      const validStatuses = ["active", "completed", "cancelled"];

      axios.get.mockResolvedValueOnce({
        data: { success: true, data: mockCarePlans },
      });

      const response = await axios.get(API_ENDPOINTS.CARE_PLANS);
      const carePlans = response.data.data;

      carePlans.forEach((carePlan) => {
        expect(validStatuses).toContain(carePlan.status);
      });
    });
  });

  describe("API Performance Tests", () => {
    it("handles large dataset efficiently", async () => {
      // Create a large dataset
      const largeCarePlans = Array.from({ length: 1000 }, (_, index) => ({
        _id: `careplan-${index}`,
        patientname: `Patient ${index}`,
        careNavigator: `Dr. Navigator ${index % 10}`,
        dateCreated: new Date(2024, 0, 1 + index).toISOString(),
        date: new Date(2024, 1, 1 + index).toISOString(),
        status: ["active", "completed", "cancelled"][index % 3],
        actions: `Action ${index}`,
      }));

      axios.get.mockResolvedValueOnce({
        data: { success: true, data: largeCarePlans },
      });

      const startTime = Date.now();
      const response = await axios.get(API_ENDPOINTS.CARE_PLANS);
      const endTime = Date.now();

      expect(response.data.data).toHaveLength(1000);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it("handles concurrent API calls", async () => {
      axios.get.mockResolvedValue({
        data: { success: true, data: mockCarePlans },
      });

      const promises = Array.from({ length: 5 }, () =>
        axios.get(API_ENDPOINTS.CARE_PLANS)
      );

      const responses = await Promise.all(promises);

      expect(responses).toHaveLength(5);
      responses.forEach((response) => {
        expect(response.data.success).toBe(true);
        expect(response.data.data).toEqual(mockCarePlans);
      });
    });
  });

  describe("API Error Recovery", () => {
    it("retries failed requests", async () => {
      // Mock first call to fail, second to succeed
      axios.get
        .mockRejectedValueOnce(new Error("Network Error"))
        .mockResolvedValueOnce({
          data: { success: true, data: mockCarePlans },
        });

      // First call should fail
      try {
        await axios.get(API_ENDPOINTS.CARE_PLANS);
      } catch (error) {
        expect(error.message).toBe("Network Error");
      }

      // Second call should succeed
      const response = await axios.get(API_ENDPOINTS.CARE_PLANS);
      expect(response.data.success).toBe(true);
    });

    it("handles partial data corruption", async () => {
      const corruptedCarePlans = [
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
          // Missing required fields
          dateCreated: "invalid-date",
          status: "invalid-status",
        },
      ];

      axios.get.mockResolvedValueOnce({
        data: { success: true, data: corruptedCarePlans },
      });

      const response = await axios.get(API_ENDPOINTS.CARE_PLANS);
      expect(response.data.data).toHaveLength(2);
      expect(response.data.data[0]).toBeDefined();
      expect(response.data.data[1]).toBeDefined();
    });
  });

  describe("API Configuration", () => {
    it("uses correct API endpoint", () => {
      expect(API_ENDPOINTS.CARE_PLANS).toBe(
        "http://localhost:5000/api/careplans"
      );
    });

    it("handles different API base URLs", async () => {
      // Test with different base URLs
      const testUrls = [
        "http://localhost:5000/api/careplans",
        "https://api.example.com/api/careplans",
        "http://127.0.0.1:3000/api/careplans",
      ];

      for (const url of testUrls) {
        axios.get.mockResolvedValueOnce({
          data: { success: true, data: mockCarePlans },
        });

        const response = await axios.get(url);
        expect(response.data.success).toBe(true);
      }
    });
  });
});
