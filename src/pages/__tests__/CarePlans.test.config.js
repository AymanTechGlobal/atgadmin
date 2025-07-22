// Test configuration and utilities for CarePlans component tests

// Mock data generators
export const generateMockCarePlans = (count = 4) => {
  return Array.from({ length: count }, (_, index) => ({
    _id: `careplan-${index + 1}`,
    patientname: `Patient ${index + 1}`,
    careNavigator: `Dr. Navigator ${index + 1}`,
    dateCreated: new Date(2024, 0, 15 + index).toISOString(),
    date: new Date(2024, 1, 15 + index).toISOString(),
    status: ["active", "completed", "cancelled"][index % 3],
    actions: `Action ${index + 1}`,
  }));
};

export const generateMockCarePlan = (overrides = {}) => {
  return {
    _id: "test-careplan-1",
    patientname: "Test Patient",
    careNavigator: "Dr. Test Navigator",
    dateCreated: "2024-01-15T10:30:00Z",
    date: "2024-02-15T10:30:00Z",
    status: "active",
    actions: "Test action",
    ...overrides,
  };
};

// Test utilities
export const waitForElementToBeRemoved = async (element, timeout = 5000) => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (!document.contains(element)) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Element was not removed within ${timeout}ms`);
};

export const waitForLoadingToComplete = async (screen) => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const loadingElement = screen.queryByRole("progressbar");
  if (loadingElement) {
    await waitForElementToBeRemoved(loadingElement);
  }
};

// Test constants
export const TEST_CONSTANTS = {
  API_ENDPOINT: "http://localhost:5000/api/careplans",
  VALID_STATUSES: ["active", "completed", "cancelled"],
  DEFAULT_TIMEOUT: 5000,
  SEARCH_PLACEHOLDER: "Search by patient name or care navigator",
  TABLE_HEADERS: [
    "Patient Name",
    "Care Navigator",
    "Date Created",
    "End Date",
    "Status",
    "Actions",
  ],
};

// Mock API responses
export const mockApiResponses = {
  success: {
    data: { success: true, data: generateMockCarePlans() },
  },
  empty: {
    data: { success: true, data: [] },
  },
  error: {
    response: {
      status: 500,
      data: { success: false, message: "Internal server error" },
    },
  },
  networkError: new Error("Network Error"),
  timeoutError: {
    code: "ECONNABORTED",
    message: "timeout of 5000ms exceeded",
  },
  unauthorized: {
    response: {
      status: 401,
      data: { success: false, message: "Unauthorized" },
    },
  },
  notFound: {
    response: {
      status: 404,
      data: { success: false, message: "Care plans not found" },
    },
  },
};

// Test data scenarios
export const testScenarios = {
  normalData: generateMockCarePlans(4),
  emptyData: [],
  largeDataset: generateMockCarePlans(1000),
  missingFields: [
    {
      _id: "1",
      patientname: null,
      careNavigator: undefined,
      dateCreated: null,
      date: null,
      status: "active",
      actions: null,
    },
  ],
  invalidDates: [
    {
      _id: "1",
      patientname: "Test Patient",
      careNavigator: "Dr. Test",
      dateCreated: "invalid-date",
      date: "invalid-date",
      status: "active",
      actions: "Test action",
    },
  ],
  invalidStatus: [
    {
      _id: "1",
      patientname: "Test Patient",
      careNavigator: "Dr. Test",
      dateCreated: "2024-01-15T10:30:00Z",
      date: "2024-02-15T10:30:00Z",
      status: "invalid-status",
      actions: "Test action",
    },
  ],
  longText: [
    {
      _id: "1",
      patientname: "Test Patient",
      careNavigator: "Dr. Test",
      dateCreated: "2024-01-15T10:30:00Z",
      date: "2024-02-15T10:30:00Z",
      status: "active",
      actions:
        "This is a very long action text that might cause layout issues in the table cell. It contains multiple sentences and should be handled properly by the component to ensure good user experience.",
    },
  ],
};

// Validation functions
export const validateCarePlanStructure = (carePlan) => {
  const requiredFields = [
    "_id",
    "patientname",
    "careNavigator",
    "dateCreated",
    "date",
    "status",
    "actions",
  ];
  const stringFields = ["_id", "patientname", "careNavigator", "status"];

  // Check required fields exist
  requiredFields.forEach((field) => {
    expect(carePlan).toHaveProperty(field);
  });

  // Check string fields are strings
  stringFields.forEach((field) => {
    if (carePlan[field] !== null && carePlan[field] !== undefined) {
      expect(typeof carePlan[field]).toBe("string");
    }
  });

  // Check status is valid
  if (carePlan.status) {
    expect(TEST_CONSTANTS.VALID_STATUSES).toContain(carePlan.status);
  }

  // Check dates are valid if present
  if (carePlan.dateCreated) {
    expect(() => new Date(carePlan.dateCreated)).not.toThrow();
  }
  if (carePlan.date) {
    expect(() => new Date(carePlan.date)).not.toThrow();
  }
};

export const validateApiResponse = (response) => {
  expect(response).toHaveProperty("data");
  expect(response.data).toHaveProperty("success");
  expect(typeof response.data.success).toBe("boolean");

  if (response.data.success) {
    expect(response.data).toHaveProperty("data");
    expect(Array.isArray(response.data.data)).toBe(true);
  }
};

// Performance test helpers
export const measurePerformance = async (asyncFunction) => {
  const startTime = Date.now();
  const result = await asyncFunction();
  const endTime = Date.now();

  return {
    result,
    duration: endTime - startTime,
    isWithinLimit: endTime - startTime < TEST_CONSTANTS.DEFAULT_TIMEOUT,
  };
};

export const runConcurrentTests = async (testFunction, count = 5) => {
  const promises = Array.from({ length: count }, () => testFunction());
  return await Promise.all(promises);
};

// Accessibility test helpers
export const checkAccessibility = (container) => {
  // Check for proper table structure
  const table = container.querySelector("table");
  expect(table).toBeInTheDocument();

  // Check for proper table headers
  const headers = container.querySelectorAll("th");
  TEST_CONSTANTS.TABLE_HEADERS.forEach((headerText, index) => {
    expect(headers[index]).toHaveTextContent(headerText);
  });

  // Check for search input accessibility
  const searchInput = container.querySelector('input[placeholder*="Search"]');
  expect(searchInput).toBeInTheDocument();

  // Check for pagination accessibility
  const pagination = container.querySelector('[role="navigation"]');
  if (pagination) {
    expect(pagination).toBeInTheDocument();
  }
};

// Error handling test helpers
export const testErrorScenarios = async (axiosMock, testFunction) => {
  const errorScenarios = [
    {
      name: "Network Error",
      mock: () =>
        axiosMock.mockRejectedValueOnce(mockApiResponses.networkError),
    },
    {
      name: "Timeout Error",
      mock: () =>
        axiosMock.mockRejectedValueOnce(mockApiResponses.timeoutError),
    },
    {
      name: "500 Error",
      mock: () => axiosMock.mockRejectedValueOnce(mockApiResponses.error),
    },
    {
      name: "401 Error",
      mock: () =>
        axiosMock.mockRejectedValueOnce(mockApiResponses.unauthorized),
    },
    {
      name: "404 Error",
      mock: () => axiosMock.mockRejectedValueOnce(mockApiResponses.notFound),
    },
  ];

  for (const scenario of errorScenarios) {
    it(`handles ${scenario.name}`, async () => {
      scenario.mock();
      await testFunction();
    });
  }
};

// Search functionality test helpers
export const testSearchScenarios = async (user, searchInput, testData) => {
  const searchScenarios = [
    {
      searchTerm: "John",
      expectedResults: ["John Smith"],
      expectedAbsent: ["Mary Wilson"],
    },
    {
      searchTerm: "Dr. Sarah",
      expectedResults: ["Dr. Sarah Johnson"],
      expectedAbsent: ["Dr. Michael Brown"],
    },
    {
      searchTerm: "john",
      expectedResults: ["John Smith"],
      expectedAbsent: ["Mary Wilson"],
    }, // Case insensitive
    {
      searchTerm: "NonExistent",
      expectedResults: [],
      expectedAbsent: ["John Smith", "Mary Wilson"],
    },
    {
      searchTerm: "",
      expectedResults: ["John Smith", "Mary Wilson"],
      expectedAbsent: [],
    }, // Empty search
  ];

  for (const scenario of searchScenarios) {
    it(`filters correctly for search term: "${scenario.searchTerm}"`, async () => {
      await user.clear(searchInput);
      if (scenario.searchTerm) {
        await user.type(searchInput, scenario.searchTerm);
      }

      // Check expected results are present
      for (const expected of scenario.expectedResults) {
        expect(screen.getByText(expected)).toBeInTheDocument();
      }

      // Check expected absent items are not present
      for (const absent of scenario.expectedAbsent) {
        expect(screen.queryByText(absent)).not.toBeInTheDocument();
      }
    });
  }
};

export default {
  generateMockCarePlans,
  generateMockCarePlan,
  waitForElementToBeRemoved,
  waitForLoadingToComplete,
  TEST_CONSTANTS,
  mockApiResponses,
  testScenarios,
  validateCarePlanStructure,
  validateApiResponse,
  measurePerformance,
  runConcurrentTests,
  checkAccessibility,
  testErrorScenarios,
  testSearchScenarios,
};
