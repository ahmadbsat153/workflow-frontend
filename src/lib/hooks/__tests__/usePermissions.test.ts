import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePermissions } from "../usePermissions";

// Mock the AuthContext
const mockUseAuth = vi.fn();

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("usePermissions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("hasPermission", () => {
    it("should return false when user is null", () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAdmin: false,
      });

      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasPermission("users.view")).toBe(false);
    });

    it("should return true for any permission when user is admin", () => {
      mockUseAuth.mockReturnValue({
        user: { permissions: [] },
        isAdmin: true,
      });

      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasPermission("users.view")).toBe(true);
      expect(result.current.hasPermission("any.permission")).toBe(true);
    });

    it("should return true when user has the specific permission", () => {
      mockUseAuth.mockReturnValue({
        user: { permissions: ["users.view", "users.edit"] },
        isAdmin: false,
      });

      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasPermission("users.view")).toBe(true);
      expect(result.current.hasPermission("users.edit")).toBe(true);
    });

    it("should return false when user does not have the permission", () => {
      mockUseAuth.mockReturnValue({
        user: { permissions: ["users.view"] },
        isAdmin: false,
      });

      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasPermission("users.delete")).toBe(false);
    });

    it("should handle user with undefined permissions array", () => {
      mockUseAuth.mockReturnValue({
        user: { permissions: undefined },
        isAdmin: false,
      });

      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasPermission("users.view")).toBe(false);
    });

    it("should handle user with empty permissions array", () => {
      mockUseAuth.mockReturnValue({
        user: { permissions: [] },
        isAdmin: false,
      });

      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasPermission("users.view")).toBe(false);
    });
  });

  describe("hasAllPermissions", () => {
    it("should return true when user has all specified permissions", () => {
      mockUseAuth.mockReturnValue({
        user: { permissions: ["users.view", "users.edit", "users.delete"] },
        isAdmin: false,
      });

      const { result } = renderHook(() => usePermissions());
      expect(
        result.current.hasAllPermissions(["users.view", "users.edit"])
      ).toBe(true);
    });

    it("should return false when user is missing any permission", () => {
      mockUseAuth.mockReturnValue({
        user: { permissions: ["users.view"] },
        isAdmin: false,
      });

      const { result } = renderHook(() => usePermissions());
      expect(
        result.current.hasAllPermissions(["users.view", "users.edit"])
      ).toBe(false);
    });

    it("should return true for empty permissions array", () => {
      mockUseAuth.mockReturnValue({
        user: { permissions: [] },
        isAdmin: false,
      });

      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasAllPermissions([])).toBe(true);
    });

    it("should return true for admin regardless of permissions", () => {
      mockUseAuth.mockReturnValue({
        user: { permissions: [] },
        isAdmin: true,
      });

      const { result } = renderHook(() => usePermissions());
      expect(
        result.current.hasAllPermissions([
          "any.permission",
          "another.permission",
        ])
      ).toBe(true);
    });
  });

  describe("hasAnyPermission", () => {
    it("should return true when user has at least one permission", () => {
      mockUseAuth.mockReturnValue({
        user: { permissions: ["users.view"] },
        isAdmin: false,
      });

      const { result } = renderHook(() => usePermissions());
      expect(
        result.current.hasAnyPermission(["users.view", "users.edit"])
      ).toBe(true);
    });

    it("should return false when user has none of the permissions", () => {
      mockUseAuth.mockReturnValue({
        user: { permissions: ["forms.view"] },
        isAdmin: false,
      });

      const { result } = renderHook(() => usePermissions());
      expect(
        result.current.hasAnyPermission(["users.view", "users.edit"])
      ).toBe(false);
    });

    it("should return false for empty permissions array", () => {
      mockUseAuth.mockReturnValue({
        user: { permissions: ["users.view"] },
        isAdmin: false,
      });

      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasAnyPermission([])).toBe(false);
    });

    it("should return true for admin regardless of permissions", () => {
      mockUseAuth.mockReturnValue({
        user: { permissions: [] },
        isAdmin: true,
      });

      const { result } = renderHook(() => usePermissions());
      expect(
        result.current.hasAnyPermission(["any.permission", "another.permission"])
      ).toBe(true);
    });
  });

  describe("isSuperAdmin", () => {
    it("should return true when user is admin", () => {
      mockUseAuth.mockReturnValue({
        user: { permissions: [] },
        isAdmin: true,
      });

      const { result } = renderHook(() => usePermissions());
      expect(result.current.isSuperAdmin()).toBe(true);
    });

    it("should return false when user is not admin", () => {
      mockUseAuth.mockReturnValue({
        user: { permissions: ["users.view"] },
        isAdmin: false,
      });

      const { result } = renderHook(() => usePermissions());
      expect(result.current.isSuperAdmin()).toBe(false);
    });

    it("should return false when user is null", () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAdmin: false,
      });

      const { result } = renderHook(() => usePermissions());
      expect(result.current.isSuperAdmin()).toBe(false);
    });
  });

  describe("integration scenarios", () => {
    it("should correctly check multiple permission types for regular user", () => {
      mockUseAuth.mockReturnValue({
        user: {
          permissions: [
            "users.view",
            "users.edit",
            "forms.view",
            "forms.create",
          ],
        },
        isAdmin: false,
      });

      const { result } = renderHook(() => usePermissions());

      // Single permission checks
      expect(result.current.hasPermission("users.view")).toBe(true);
      expect(result.current.hasPermission("users.delete")).toBe(false);

      // All permissions check
      expect(
        result.current.hasAllPermissions(["users.view", "forms.view"])
      ).toBe(true);
      expect(
        result.current.hasAllPermissions(["users.view", "users.delete"])
      ).toBe(false);

      // Any permission check
      expect(
        result.current.hasAnyPermission(["users.delete", "forms.view"])
      ).toBe(true);
      expect(
        result.current.hasAnyPermission(["users.delete", "forms.delete"])
      ).toBe(false);

      // Super admin check
      expect(result.current.isSuperAdmin()).toBe(false);
    });

    it("should correctly check all permissions for admin user", () => {
      mockUseAuth.mockReturnValue({
        user: { permissions: [] },
        isAdmin: true,
      });

      const { result } = renderHook(() => usePermissions());

      // Admin should have all permissions
      expect(result.current.hasPermission("anything")).toBe(true);
      expect(result.current.hasAllPermissions(["a", "b", "c"])).toBe(true);
      expect(result.current.hasAnyPermission(["x", "y", "z"])).toBe(true);
      expect(result.current.isSuperAdmin()).toBe(true);
    });
  });
});
