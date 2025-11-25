import { WorkflowNodeData } from "@/lib/types/workflow/workflow";
import { Node, Edge } from "reactflow";

export type ValidationError = {
  nodeId: string;
  type: "error" | "warning";
  message: string;
};

export type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
};

/**
 * Validate a workflow
 */
export const validateWorkflow = (
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (nodes.length === 0) {
    errors.push({
      nodeId: "",
      type: "error",
      message: "Workflow is empty. Add at least one node.",
    });
    return { isValid: false, errors, warnings };
  }

  const nodesWithIncoming = new Set(edges.map((e) => e.target));
  const startNodes = nodes.filter((n) => !nodesWithIncoming.has(n.id));

  if (startNodes.length === 0) {
    errors.push({
      nodeId: "",
      type: "error",
      message: "No starting node found. All nodes have incoming connections.",
    });
  } else if (startNodes.length > 1) {
    warnings.push({
      nodeId: "",
      type: "warning",
      message: `Multiple starting nodes found (${startNodes.length}). Only the first will be used.`,
    });
  }

  nodes.forEach((node) => {
    if (node.type === "action") {
      if (!node.data.actionId) {
        errors.push({
          nodeId: node.id,
          type: "error",
          message: `Action node "${node.data.stepName}" has no action selected.`,
        });
      }

      if (node.data.action) {
        const requiredFields = node.data.action.configSchema.fields.filter(
          (f) => f.required
        );
        const configuredFields = Object.keys(node.data.config);

        const missingFields = requiredFields.filter(
          (f) => !configuredFields.includes(f.name)
        );

        if (missingFields.length > 0) {
          errors.push({
            nodeId: node.id,
            type: "error",
            message: `Action node "${
              node.data.stepName
            }" is missing required fields: ${missingFields
              .map((f) => f.label)
              .join(", ")}`,
          });
        }
      }
    } else if (node.type === "branch") {
      const branchesWithoutConditions = node.data.branches?.filter(
        (b) => !b.conditions || b.conditions.length === 0
      );

      if (branchesWithoutConditions && branchesWithoutConditions.length > 0) {
        warnings.push({
          nodeId: node.id,
          type: "warning",
          message: `Branch node "${node.data.stepName}" has ${branchesWithoutConditions.length} path(s) without conditions.`,
        });
      }

      const branchHandles = node.data.branches?.length || 0;
      const branchEdges = edges.filter((e) => e.source === node.id);

      if (branchEdges.length < branchHandles) {
        warnings.push({
          nodeId: node.id,
          type: "warning",
          message: `Branch node "${node.data.stepName}" has unconnected paths.`,
        });
      }
    }

    const outgoingEdges = edges.filter((e) => e.source === node.id);
    const incomingEdges = edges.filter((e) => e.target === node.id);

    // No need to display warning for end nodes
    // if (outgoingEdges.length === 0 && incomingEdges.length > 0) {
    //   warnings.push({
    //     nodeId: node.id,
    //     type: "warning",
    //     message: `Node "${node.data.stepName}" has no outgoing connections. This is the end of the workflow.`,
    //   });
    // }

    if (incomingEdges.length === 0 && node.id !== startNodes[0]?.id) {
      warnings.push({
        nodeId: node.id,
        type: "warning",
        message: `Node "${node.data.stepName}" is disconnected and will not be executed.`,
      });
    }
  });

  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const hasCycle = (nodeId: string): boolean => {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const outgoing = edges.filter((e) => e.source === nodeId);
    for (const edge of outgoing) {
      if (!visited.has(edge.target)) {
        if (hasCycle(edge.target)) return true;
      } else if (recursionStack.has(edge.target)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  };

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (hasCycle(node.id)) {
        errors.push({
          nodeId: node.id,
          type: "error",
          message:
            "Circular dependency detected in workflow. This will cause an infinite loop.",
        });
        break;
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Get validation status for a specific node
 */
export const getNodeValidationStatus = (
  node: Node<WorkflowNodeData>
): "valid" | "warning" | "error" => {
  if (node.type === "action") {
    if (!node.data.actionId) return "error";

    if (node.data.action) {
      const requiredFields = node.data.action.configSchema.fields.filter(
        (f) => f.required
      );
      const configuredFields = Object.keys(node.data.config);
      const missingFields = requiredFields.filter(
        (f) => !configuredFields.includes(f.name)
      );

      if (missingFields.length > 0) return "error";
    }
  } else if (node.type === "branch") {
    const hasConditions = node.data.branches?.some(
      (b) => b.conditions && b.conditions.length > 0
    );
    if (!hasConditions) return "warning";
  }

  return "valid";
};
