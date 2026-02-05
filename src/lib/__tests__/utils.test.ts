import { describe, it, expect } from "vitest";
import { cn, canEditForm } from "../utils";
import type { UserAuthenticated } from "../types/user/user";
import type { FormCanEdit } from "../types/form/form";

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes", () => {
    expect(cn("base", true && "included", false && "excluded")).toBe(
      "base included"
    );
  });

  it("should merge Tailwind classes correctly", () => {
    expect(cn("p-4", "p-6")).toBe("p-6");
  });

  it("should handle arrays of classes", () => {
    expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
  });

  it("should handle undefined and null values", () => {
    expect(cn("foo", undefined, null, "bar")).toBe("foo bar");
  });

  it("should handle empty strings", () => {
    expect(cn("foo", "", "bar")).toBe("foo bar");
  });

  it("should resolve Tailwind conflicts", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    expect(cn("bg-white", "bg-black")).toBe("bg-black");
    expect(cn("mt-2", "mt-4")).toBe("mt-4");
  });

  it("should handle object syntax", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
  });
});

describe("canEditForm function", () => {
  // Helper to create a mock user
  const createMockUser = (
    overrides: Partial<UserAuthenticated> = {}
  ): UserAuthenticated => ({
    _id: "user-123",
    firstname: "John",
    lastname: "Doe",
    email: "john@example.com",
    phone: "+1234567890",
    country_code: "US",
    is_super_admin: false,
    role: {
      id: "role-1",
      code: "EMPLOYEE",
      name: "Employee",
    },
    positionId: { _id: "position-1" } as UserAuthenticated["positionId"],
    departmentId: null,
    branchId: null,
    managerEmail: "",
    managerName: "",
    managerId: "",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    __v: 0,
    ...overrides,
  });

  describe("when user is null or undefined", () => {
    it("should return false for null user", () => {
      const result = canEditForm(null, undefined, "creator-123");
      expect(result).toBe(false);
    });

    it("should return false for undefined user", () => {
      const result = canEditForm(undefined, undefined, "creator-123");
      expect(result).toBe(false);
    });
  });

  describe("when user is super admin", () => {
    it("should return true for super admin", () => {
      const superAdmin = createMockUser({ is_super_admin: true });
      const result = canEditForm(superAdmin, undefined, "other-user");
      expect(result).toBe(true);
    });

    it("should return true even when canEdit restrictions exist", () => {
      const superAdmin = createMockUser({ is_super_admin: true });
      const canEdit: FormCanEdit = { roles: ["other-role"], positions: [] };
      const result = canEditForm(superAdmin, canEdit, "other-user");
      expect(result).toBe(true);
    });
  });

  describe("when user is form creator", () => {
    it("should return true when user is the creator", () => {
      const user = createMockUser({ _id: "creator-123" });
      const result = canEditForm(user, undefined, "creator-123");
      expect(result).toBe(true);
    });

    it("should return true even when canEdit restrictions exclude the user role", () => {
      const user = createMockUser({ _id: "creator-123" });
      const canEdit: FormCanEdit = { roles: ["other-role"], positions: [] };
      const result = canEditForm(user, canEdit, "creator-123");
      expect(result).toBe(true);
    });
  });

  describe("when canEdit is undefined or empty", () => {
    it("should return false when canEdit is undefined and user is not creator", () => {
      const user = createMockUser();
      const result = canEditForm(user, undefined, "other-creator");
      expect(result).toBe(false);
    });

    it("should return false when roles and positions are empty arrays", () => {
      const user = createMockUser();
      const canEdit: FormCanEdit = { roles: [], positions: [] };
      const result = canEditForm(user, canEdit, "other-creator");
      expect(result).toBe(false);
    });
  });

  describe("when checking role-based permissions", () => {
    it("should return true when user role is in allowed roles", () => {
      const user = createMockUser({
        role: { id: "allowed-role", code: "MANAGER", name: "Manager" },
      });
      const canEdit: FormCanEdit = {
        roles: ["allowed-role", "other-role"],
        positions: [],
      };
      const result = canEditForm(user, canEdit, "other-creator");
      expect(result).toBe(true);
    });

    it("should return false when user role is not in allowed roles", () => {
      const user = createMockUser({
        role: { id: "excluded-role", code: "EMPLOYEE", name: "Employee" },
      });
      const canEdit: FormCanEdit = {
        roles: ["manager-role", "admin-role"],
        positions: [],
      };
      const result = canEditForm(user, canEdit, "other-creator");
      expect(result).toBe(false);
    });
  });

  describe("when checking position-based permissions", () => {
    it("should return true when user position is in allowed positions (object format)", () => {
      const user = createMockUser({
        positionId: {
          _id: "allowed-position",
        } as UserAuthenticated["positionId"],
      });
      const canEdit: FormCanEdit = {
        roles: [],
        positions: ["allowed-position", "other-position"],
      };
      const result = canEditForm(user, canEdit, "other-creator");
      expect(result).toBe(true);
    });

    it("should return false when user position is not in allowed positions", () => {
      const user = createMockUser({
        positionId: {
          _id: "excluded-position",
        } as UserAuthenticated["positionId"],
      });
      const canEdit: FormCanEdit = {
        roles: [],
        positions: ["manager-position"],
      };
      const result = canEditForm(user, canEdit, "other-creator");
      expect(result).toBe(false);
    });

    it("should return false when user has no position", () => {
      const user = createMockUser({ positionId: null });
      const canEdit: FormCanEdit = {
        roles: [],
        positions: ["some-position"],
      };
      const result = canEditForm(user, canEdit, "other-creator");
      expect(result).toBe(false);
    });
  });

  describe("when both roles and positions are specified", () => {
    it("should return true if user matches role (even if position does not match)", () => {
      const user = createMockUser({
        role: { id: "allowed-role", code: "MANAGER", name: "Manager" },
        positionId: {
          _id: "non-matching-position",
        } as UserAuthenticated["positionId"],
      });
      const canEdit: FormCanEdit = {
        roles: ["allowed-role"],
        positions: ["other-position"],
      };
      const result = canEditForm(user, canEdit, "other-creator");
      expect(result).toBe(true);
    });

    it("should return true if user matches position (even if role does not match)", () => {
      const user = createMockUser({
        role: { id: "non-matching-role", code: "EMPLOYEE", name: "Employee" },
        positionId: {
          _id: "allowed-position",
        } as UserAuthenticated["positionId"],
      });
      const canEdit: FormCanEdit = {
        roles: ["other-role"],
        positions: ["allowed-position"],
      };
      const result = canEditForm(user, canEdit, "other-creator");
      expect(result).toBe(true);
    });

    it("should return false if user matches neither role nor position", () => {
      const user = createMockUser({
        role: { id: "non-matching-role", code: "EMPLOYEE", name: "Employee" },
        positionId: {
          _id: "non-matching-position",
        } as UserAuthenticated["positionId"],
      });
      const canEdit: FormCanEdit = {
        roles: ["manager-role"],
        positions: ["manager-position"],
      };
      const result = canEditForm(user, canEdit, "other-creator");
      expect(result).toBe(false);
    });
  });
});
