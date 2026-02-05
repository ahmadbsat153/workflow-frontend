import { describe, it, expect } from "vitest";
import {
  validateWorkflow,
  getNodeValidationStatus,
  type ValidationResult,
} from "../validation";
import type { Node, Edge } from "reactflow";
import type { WorkflowNodeData, BranchData } from "@/lib/types/workflow/workflow";
import type { Action } from "@/lib/types/actions/action";

// Helper to create mock action node
const createActionNode = (
  id: string,
  options: {
    actionId?: string;
    action?: Partial<Action>;
    config?: Record<string, unknown>;
    stepName?: string;
  } = {}
): Node<WorkflowNodeData> => ({
  id,
  type: "action",
  position: { x: 0, y: 0 },
  data: {
    label: `Action ${id}`,
    tempId: id,
    stepName: options.stepName || `Action Step ${id}`,
    actionId: options.actionId,
    action: options.action as Action | undefined,
    config: options.config || {},
  },
});

// Helper to create mock branch node
const createBranchNode = (
  id: string,
  branches: BranchData[] = [],
  stepName?: string
): Node<WorkflowNodeData> => ({
  id,
  type: "branch",
  position: { x: 0, y: 0 },
  data: {
    label: `Branch ${id}`,
    tempId: id,
    stepName: stepName || `Branch Step ${id}`,
    config: {},
    branches,
  },
});

// Helper to create mock edge
const createEdge = (source: string, target: string): Edge => ({
  id: `${source}-${target}`,
  source,
  target,
});

describe("validateWorkflow", () => {
  describe("empty workflow", () => {
    it("should return valid for empty workflow", () => {
      const result = validateWorkflow([], []);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe("starting nodes", () => {
    it("should error when all nodes have incoming connections (no start node)", () => {
      const nodes = [
        createActionNode("1", { actionId: "action-1" }),
        createActionNode("2", { actionId: "action-2" }),
      ];
      const edges = [createEdge("1", "2"), createEdge("2", "1")]; // Circular

      const result = validateWorkflow(nodes, edges);
      expect(result.errors.some((e) => e.message.includes("No starting node"))).toBe(true);
    });

    it("should warn when multiple starting nodes exist", () => {
      const nodes = [
        createActionNode("1", { actionId: "action-1" }),
        createActionNode("2", { actionId: "action-2" }),
        createActionNode("3", { actionId: "action-3" }),
      ];
      // Node 1 and 2 have no incoming edges (both are starting nodes)
      const edges = [createEdge("1", "3"), createEdge("2", "3")];

      const result = validateWorkflow(nodes, edges);
      expect(result.warnings.some((w) => w.message.includes("Multiple starting nodes"))).toBe(true);
    });

    it("should be valid with single starting node", () => {
      const nodes = [
        createActionNode("1", { actionId: "action-1" }),
        createActionNode("2", { actionId: "action-2" }),
      ];
      const edges = [createEdge("1", "2")];

      const result = validateWorkflow(nodes, edges);
      expect(result.errors.filter((e) => e.message.includes("starting node"))).toHaveLength(0);
    });
  });

  describe("action node validation", () => {
    it("should error when action node has no action selected", () => {
      const nodes = [createActionNode("1", { actionId: undefined })];
      const result = validateWorkflow(nodes, []);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes("no action selected"))).toBe(true);
    });

    it("should error when action node is missing required fields", () => {
      const nodes = [
        createActionNode("1", {
          actionId: "action-1",
          action: {
            configSchema: {
              fields: [
                { name: "field1", label: "Field 1", required: true, type: "text" },
                { name: "field2", label: "Field 2", required: true, type: "text" },
              ],
            },
          } as Partial<Action>,
          config: { field1: "value" }, // Missing field2
        }),
      ];

      const result = validateWorkflow(nodes, []);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes("missing required fields"))).toBe(true);
      expect(result.errors.some((e) => e.message.includes("Field 2"))).toBe(true);
    });

    it("should be valid when all required fields are configured", () => {
      const nodes = [
        createActionNode("1", {
          actionId: "action-1",
          action: {
            configSchema: {
              fields: [
                { name: "field1", label: "Field 1", required: true, type: "text" },
              ],
            },
          } as Partial<Action>,
          config: { field1: "value" },
        }),
      ];

      const result = validateWorkflow(nodes, []);
      expect(result.errors.filter((e) => e.message.includes("missing required"))).toHaveLength(0);
    });
  });

  describe("branch node validation", () => {
    it("should warn when branch has paths without conditions", () => {
      const branches: BranchData[] = [
        { name: "Yes", conditions: [], targetStepTempId: null },
        { name: "No", conditions: [{ field: "status", operator: "equals", value: "approved" }], targetStepTempId: null },
      ];
      const nodes = [createBranchNode("1", branches)];

      const result = validateWorkflow(nodes, []);
      expect(result.warnings.some((w) => w.message.includes("without conditions"))).toBe(true);
    });

    it("should warn when branch has unconnected paths", () => {
      const branches: BranchData[] = [
        { name: "Yes", conditions: [{ field: "a", operator: "eq", value: 1 }], targetStepTempId: null },
        { name: "No", conditions: [{ field: "a", operator: "eq", value: 2 }], targetStepTempId: null },
      ];
      const nodes = [
        createBranchNode("1", branches),
        createActionNode("2", { actionId: "action-1" }),
      ];
      // Only one edge from branch, but it has 2 handles
      const edges = [createEdge("1", "2")];

      const result = validateWorkflow(nodes, edges);
      expect(result.warnings.some((w) => w.message.includes("unconnected paths"))).toBe(true);
    });
  });

  describe("disconnected nodes", () => {
    it("should warn about disconnected nodes (not the start node)", () => {
      const nodes = [
        createActionNode("1", { actionId: "action-1" }),
        createActionNode("2", { actionId: "action-2" }),
        createActionNode("orphan", { actionId: "action-3", stepName: "Orphan Node" }),
      ];
      const edges = [createEdge("1", "2")]; // orphan is not connected

      const result = validateWorkflow(nodes, edges);
      expect(result.warnings.some((w) => w.message.includes("disconnected"))).toBe(true);
      expect(result.warnings.some((w) => w.message.includes("Orphan Node"))).toBe(true);
    });
  });

  describe("circular dependency detection", () => {
    it("should error on direct circular dependency", () => {
      const nodes = [
        createActionNode("1", { actionId: "action-1" }),
        createActionNode("2", { actionId: "action-2" }),
      ];
      const edges = [createEdge("1", "2"), createEdge("2", "1")];

      const result = validateWorkflow(nodes, edges);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes("Circular dependency"))).toBe(true);
    });

    it("should error on indirect circular dependency", () => {
      const nodes = [
        createActionNode("1", { actionId: "action-1" }),
        createActionNode("2", { actionId: "action-2" }),
        createActionNode("3", { actionId: "action-3" }),
      ];
      const edges = [
        createEdge("1", "2"),
        createEdge("2", "3"),
        createEdge("3", "1"), // Back to start
      ];

      const result = validateWorkflow(nodes, edges);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes("Circular dependency"))).toBe(true);
    });

    it("should not error on valid linear workflow", () => {
      const nodes = [
        createActionNode("1", { actionId: "action-1" }),
        createActionNode("2", { actionId: "action-2" }),
        createActionNode("3", { actionId: "action-3" }),
      ];
      const edges = [createEdge("1", "2"), createEdge("2", "3")];

      const result = validateWorkflow(nodes, edges);
      expect(result.errors.filter((e) => e.message.includes("Circular"))).toHaveLength(0);
    });

    it("should not error on valid branching workflow", () => {
      const nodes = [
        createActionNode("1", { actionId: "action-1" }),
        createActionNode("2", { actionId: "action-2" }),
        createActionNode("3", { actionId: "action-3" }),
        createActionNode("4", { actionId: "action-4" }),
      ];
      // 1 -> 2 and 1 -> 3, both converge to 4
      const edges = [
        createEdge("1", "2"),
        createEdge("1", "3"),
        createEdge("2", "4"),
        createEdge("3", "4"),
      ];

      const result = validateWorkflow(nodes, edges);
      expect(result.errors.filter((e) => e.message.includes("Circular"))).toHaveLength(0);
    });
  });

  describe("validation result structure", () => {
    it("should return correct structure", () => {
      const result = validateWorkflow([], []);
      expect(result).toHaveProperty("isValid");
      expect(result).toHaveProperty("errors");
      expect(result).toHaveProperty("warnings");
      expect(Array.isArray(result.errors)).toBe(true);
      expect(Array.isArray(result.warnings)).toBe(true);
    });

    it("should set isValid to false when errors exist", () => {
      const nodes = [createActionNode("1", { actionId: undefined })];
      const result = validateWorkflow(nodes, []);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should set isValid to true when only warnings exist", () => {
      const branches: BranchData[] = [
        { name: "Path", conditions: [], targetStepTempId: null },
      ];
      const nodes = [createBranchNode("1", branches)];
      const result = validateWorkflow(nodes, []);

      // Branch without conditions is a warning, not error
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.isValid).toBe(true);
    });
  });
});

describe("getNodeValidationStatus", () => {
  describe("action nodes", () => {
    it("should return error when actionId is missing", () => {
      const node = createActionNode("1", { actionId: undefined });
      expect(getNodeValidationStatus(node)).toBe("error");
    });

    it("should return error when required fields are missing", () => {
      const node = createActionNode("1", {
        actionId: "action-1",
        action: {
          configSchema: {
            fields: [{ name: "required", label: "Required", required: true, type: "text" }],
          },
        } as Partial<Action>,
        config: {}, // Missing required field
      });
      expect(getNodeValidationStatus(node)).toBe("error");
    });

    it("should return valid when action is fully configured", () => {
      const node = createActionNode("1", {
        actionId: "action-1",
        action: {
          configSchema: {
            fields: [{ name: "field", label: "Field", required: true, type: "text" }],
          },
        } as Partial<Action>,
        config: { field: "value" },
      });
      expect(getNodeValidationStatus(node)).toBe("valid");
    });

    it("should return valid when action has no required fields", () => {
      const node = createActionNode("1", {
        actionId: "action-1",
        action: {
          configSchema: {
            fields: [{ name: "optional", label: "Optional", required: false, type: "text" }],
          },
        } as Partial<Action>,
        config: {},
      });
      expect(getNodeValidationStatus(node)).toBe("valid");
    });
  });

  describe("branch nodes", () => {
    it("should return warning when no branches have conditions", () => {
      const branches: BranchData[] = [
        { name: "Path 1", conditions: [], targetStepTempId: null },
        { name: "Path 2", conditions: [], targetStepTempId: null },
      ];
      const node = createBranchNode("1", branches);
      expect(getNodeValidationStatus(node)).toBe("warning");
    });

    it("should return valid when at least one branch has conditions", () => {
      const branches: BranchData[] = [
        { name: "Yes", conditions: [{ field: "a", operator: "eq", value: 1 }], targetStepTempId: null },
        { name: "No", conditions: [], targetStepTempId: null },
      ];
      const node = createBranchNode("1", branches);
      expect(getNodeValidationStatus(node)).toBe("valid");
    });

    it("should return warning when branches array is empty", () => {
      const node = createBranchNode("1", []);
      expect(getNodeValidationStatus(node)).toBe("warning");
    });

    it("should return warning when branches is undefined", () => {
      const node = createBranchNode("1");
      node.data.branches = undefined;
      expect(getNodeValidationStatus(node)).toBe("warning");
    });
  });

  describe("other node types", () => {
    it("should return valid for non-action, non-branch nodes", () => {
      const node: Node<WorkflowNodeData> = {
        id: "1",
        type: "custom",
        position: { x: 0, y: 0 },
        data: {
          label: "Custom",
          tempId: "1",
          stepName: "Custom Step",
          config: {},
        },
      };
      expect(getNodeValidationStatus(node)).toBe("valid");
    });
  });
});
