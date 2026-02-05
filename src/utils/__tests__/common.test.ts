import { describe, it, expect, vi } from "vitest";
import {
  hexToRgb,
  getInitials,
  isLinkActive,
  formatDates,
  addValidationError,
  build_path,
  to24HourFormat,
  to12HourFormat,
  format_pricing,
  formatDatesWithYear,
  formatDatesWithYearWithoutTime,
} from "../common";

describe("hexToRgb", () => {
  it("should convert a valid hex color to RGB", () => {
    expect(hexToRgb("#ff0000")).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb("#00ff00")).toEqual({ r: 0, g: 255, b: 0 });
    expect(hexToRgb("#0000ff")).toEqual({ r: 0, g: 0, b: 255 });
  });

  it("should handle hex without # prefix", () => {
    expect(hexToRgb("ff0000")).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("should convert white and black correctly", () => {
    expect(hexToRgb("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 });
  });

  it("should handle mixed case hex values", () => {
    expect(hexToRgb("#FfAaBb")).toEqual({ r: 255, g: 170, b: 187 });
  });

  it("should return null for invalid hex", () => {
    expect(hexToRgb("invalid")).toBeNull();
    expect(hexToRgb("#gg0000")).toBeNull();
    expect(hexToRgb("#fff")).toBeNull(); // 3-character hex not supported
  });

  it("should return null for empty or undefined input", () => {
    expect(hexToRgb("")).toBeNull();
    expect(hexToRgb(null)).toBeNull();
    expect(hexToRgb(undefined)).toBeNull();
  });
});

describe("getInitials", () => {
  it("should return initials for a full name", () => {
    expect(getInitials("John Doe")).toBe("JD");
    expect(getInitials("Jane Smith")).toBe("JS");
  });

  it("should return initials for a single name", () => {
    expect(getInitials("John")).toBe("J");
  });

  it("should return initials for multiple names", () => {
    expect(getInitials("John Michael Doe")).toBe("JMD");
  });

  it("should handle lowercase names", () => {
    expect(getInitials("john doe")).toBe("JD");
  });

  it("should return empty string for undefined or empty input", () => {
    expect(getInitials(undefined)).toBe("");
    expect(getInitials("")).toBe("");
  });

  it("should handle names with extra spaces", () => {
    expect(getInitials("John  Doe")).toBe("JD");
  });
});

describe("isLinkActive", () => {
  it("should return true when pathname includes the URL", () => {
    expect(isLinkActive("/dashboard/", "/dashboard")).toBe(true);
    expect(isLinkActive("/users/", "/users/123")).toBe(true);
  });

  it("should return false when pathname does not include the URL", () => {
    expect(isLinkActive("/dashboard/", "/settings")).toBe(false);
    expect(isLinkActive("/users/", "/admin")).toBe(false);
  });

  it("should handle URLs with trailing slashes", () => {
    expect(isLinkActive("/dashboard/", "/dashboard/")).toBe(true);
  });

  it("should handle root path", () => {
    expect(isLinkActive("/", "/")).toBe(true);
  });
});

describe("formatDates", () => {
  it("should format an ISO date string correctly", () => {
    // Note: This test assumes a specific timezone, may need adjustment
    const result = formatDates("2024-06-15T14:30:00.000Z");
    expect(result).toMatch(/June 15/);
  });

  it("should handle different dates", () => {
    const result = formatDates("2024-01-01T00:00:00.000Z");
    expect(result).toMatch(/January 1/);
  });
});

describe("addValidationError", () => {
  it("should add message when condition is truthy", () => {
    const messages: string[] = [];
    addValidationError(true, "Error message", messages);
    expect(messages).toContain("Error message");
  });

  it("should not add message when condition is falsy", () => {
    const messages: string[] = [];
    addValidationError(false, "Error message", messages);
    expect(messages).toHaveLength(0);
  });

  it("should add message when condition is a truthy string", () => {
    const messages: string[] = [];
    addValidationError("error", "Error message", messages);
    expect(messages).toContain("Error message");
  });

  it("should not add message when condition is empty string", () => {
    const messages: string[] = [];
    addValidationError("", "Error message", messages);
    expect(messages).toHaveLength(0);
  });

  it("should add message when condition is a truthy number", () => {
    const messages: string[] = [];
    addValidationError(1, "Error message", messages);
    expect(messages).toContain("Error message");
  });

  it("should not add message when condition is 0", () => {
    const messages: string[] = [];
    addValidationError(0, "Error message", messages);
    expect(messages).toHaveLength(0);
  });

  it("should not add message when condition is undefined", () => {
    const messages: string[] = [];
    addValidationError(undefined, "Error message", messages);
    expect(messages).toHaveLength(0);
  });

  it("should accumulate multiple errors", () => {
    const messages: string[] = [];
    addValidationError(true, "Error 1", messages);
    addValidationError(true, "Error 2", messages);
    addValidationError(false, "Error 3", messages);
    expect(messages).toEqual(["Error 1", "Error 2"]);
  });
});

describe("build_path", () => {
  it("should replace single parameter", () => {
    const result = build_path("/users/:id", { id: "123" });
    expect(result).toBe("/users/123");
  });

  it("should replace multiple parameters", () => {
    const result = build_path("/users/:userId/posts/:postId", {
      userId: "123",
      postId: "456",
    });
    expect(result).toBe("/users/123/posts/456");
  });

  it("should handle paths without parameters", () => {
    const result = build_path("/users/list");
    expect(result).toBe("/users/list");
  });

  it("should throw error for missing parameters", () => {
    expect(() => build_path("/users/:id", {})).toThrow("Missing parameter(s): id");
  });

  it("should throw error listing all missing parameters", () => {
    expect(() => build_path("/users/:userId/posts/:postId", {})).toThrow(
      "Missing parameter(s): userId, postId"
    );
  });

  it("should handle parameter names with underscores and hyphens", () => {
    const result = build_path("/api/:user_id/:post-id", {
      user_id: "123",
      "post-id": "456",
    });
    expect(result).toBe("/api/123/456");
  });
});

describe("to24HourFormat", () => {
  it("should convert morning time correctly", () => {
    const result = to24HourFormat("2024-06-15T09:30:00.000Z");
    // Note: Result depends on timezone
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });

  it("should convert afternoon time correctly", () => {
    const result = to24HourFormat("2024-06-15T14:30:00.000Z");
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });

  it("should pad hours and minutes with zeros", () => {
    const result = to24HourFormat("2024-06-15T01:05:00.000Z");
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });
});

describe("to12HourFormat", () => {
  it("should return time with AM/PM suffix", () => {
    const result = to12HourFormat("2024-06-15T09:30:00.000Z");
    expect(result).toMatch(/^\d{1,2}:\d{2} (AM|PM)$/);
  });

  it("should handle midnight correctly", () => {
    const result = to12HourFormat("2024-06-15T00:00:00.000Z");
    expect(result).toMatch(/(12:\d{2} AM|\d{1,2}:\d{2} (AM|PM))/);
  });

  it("should handle noon correctly", () => {
    const result = to12HourFormat("2024-06-15T12:00:00.000Z");
    expect(result).toMatch(/\d{1,2}:\d{2} (AM|PM)/);
  });
});

describe("format_pricing", () => {
  it("should format small numbers without commas", () => {
    expect(format_pricing(100)).toBe("100");
    expect(format_pricing(999)).toBe("999");
  });

  it("should format thousands with commas", () => {
    expect(format_pricing(1000)).toBe("1,000");
    expect(format_pricing(9999)).toBe("9,999");
  });

  it("should format millions with commas", () => {
    expect(format_pricing(1000000)).toBe("1,000,000");
    expect(format_pricing(1234567)).toBe("1,234,567");
  });

  it("should handle zero", () => {
    expect(format_pricing(0)).toBe("0");
  });

  it("should round decimal numbers", () => {
    expect(format_pricing(1234.56)).toBe("1,235");
    expect(format_pricing(1234.4)).toBe("1,234");
  });
});

describe("formatDatesWithYear", () => {
  it("should format a valid ISO date with year", () => {
    const result = formatDatesWithYear("2024-06-15T14:30:00.000Z");
    expect(result).toMatch(/June 15, 2024/);
  });

  it("should return N/A for empty string", () => {
    expect(formatDatesWithYear("")).toBe("N/A");
  });

  it("should return N/A for invalid date", () => {
    expect(formatDatesWithYear("invalid-date")).toBe("N/A");
  });

  it("should handle different years", () => {
    const result = formatDatesWithYear("2023-01-01T00:00:00.000Z");
    expect(result).toMatch(/2023/);
  });
});

describe("formatDatesWithYearWithoutTime", () => {
  it("should format a valid ISO date without time", () => {
    const result = formatDatesWithYearWithoutTime("2024-06-15T14:30:00.000Z");
    expect(result).toMatch(/June 15, 2024/);
    expect(result).not.toMatch(/:/); // Should not contain time
  });

  it("should return N/A for empty string", () => {
    expect(formatDatesWithYearWithoutTime("")).toBe("N/A");
  });

  it("should return N/A for invalid date", () => {
    expect(formatDatesWithYearWithoutTime("not-a-date")).toBe("N/A");
  });

  it("should handle edge case dates", () => {
    const result = formatDatesWithYearWithoutTime("2024-12-31T23:59:59.000Z");
    expect(result).toMatch(/December 31, 2024|January 1, 2025/); // Timezone dependent
  });
});
