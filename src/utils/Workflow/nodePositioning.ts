import { WorkflowNodeData } from "@/lib/types/workflow/workflow";
import { Node, XYPosition, Edge } from "reactflow";

export interface NodeBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export const NODE_WIDTH = 240;
export const NODE_HEIGHT = 150;
export const GRID_SIZE = 20;
export const MIN_SPACING = 50;

/**
 * Snap position to grid
 */
export const snapToGrid = (position: XYPosition): XYPosition => {
  return {
    x: Math.round(position.x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(position.y / GRID_SIZE) * GRID_SIZE,
  };
};

/**
 * Check if two nodes overlap
 */
export const nodesOverlap = (
  pos1: XYPosition,
  pos2: XYPosition,
  padding: number = MIN_SPACING
): boolean => {
  return (
    Math.abs(pos1.x - pos2.x) < NODE_WIDTH + padding &&
    Math.abs(pos1.y - pos2.y) < NODE_HEIGHT + padding
  );
};

/**
 * Find a non-overlapping position near a target position
 */
export const findNonOverlappingPosition = (
  targetPosition: XYPosition,
  existingNodes: Node<WorkflowNodeData>[],
  preferredDirection: "right" | "bottom" | "diagonal" = "diagonal"
): XYPosition => {
  const positions: XYPosition[] = [];

  switch (preferredDirection) {
    case "right":
      for (let i = 0; i < 10; i++) {
        positions.push({
          x: targetPosition.x + (NODE_WIDTH + MIN_SPACING) * (i + 1),
          y: targetPosition.y,
        });
      }
      break;

    case "bottom":
      for (let i = 0; i < 10; i++) {
        positions.push({
          x: targetPosition.x,
          y: targetPosition.y + (NODE_HEIGHT + MIN_SPACING) * (i + 1),
        });
      }
      break;

    case "diagonal":
    default:
      for (let i = 1; i <= 5; i++) {
        positions.push({
          x: targetPosition.x + (NODE_WIDTH + MIN_SPACING) * 0.5 * i,
          y: targetPosition.y + (NODE_HEIGHT + MIN_SPACING) * i,
        });
        positions.push({
          x: targetPosition.x + (NODE_WIDTH + MIN_SPACING) * i,
          y: targetPosition.y + (NODE_HEIGHT + MIN_SPACING) * 0.5 * i,
        });
      }

      for (let i = 1; i <= 5; i++) {
        positions.push({
          x: targetPosition.x + (NODE_WIDTH + MIN_SPACING) * i,
          y: targetPosition.y,
        });
      }

      for (let i = 1; i <= 5; i++) {
        positions.push({
          x: targetPosition.x,
          y: targetPosition.y + (NODE_HEIGHT + MIN_SPACING) * i,
        });
      }
      break;
  }

  for (const candidatePos of positions) {
    const overlaps = existingNodes.some((node) =>
      nodesOverlap(candidatePos, node.position)
    );
    if (!overlaps) {
      return snapToGrid(candidatePos);
    }
  }

  return snapToGrid({
    x: targetPosition.x + (NODE_WIDTH + MIN_SPACING) * 5,
    y: targetPosition.y,
  });
};

/**
 * Get the bounds of all nodes
 */
export const getNodeBounds = (nodes: Node[]): NodeBounds | null => {
  if (nodes.length === 0) return null;

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  nodes.forEach((node) => {
    minX = Math.min(minX, node.position.x);
    maxX = Math.max(maxX, node.position.x + NODE_WIDTH);
    minY = Math.min(minY, node.position.y);
    maxY = Math.max(maxY, node.position.y + NODE_HEIGHT);
  });

  return { minX, maxX, minY, maxY };
};

/**
 * Calculate center position for new nodes
 */
export const getDefaultNodePosition = (
  nodes: Node<WorkflowNodeData>[],
  viewportCenter?: XYPosition
): XYPosition => {
  if (nodes.length === 0) {
    // If viewport center is provided, use it, otherwise use default center
    const defaultPosition = viewportCenter || { x: 0, y: 0 };
    return snapToGrid(defaultPosition);
  }

  const lastNode = nodes[nodes.length - 1];

  // Place directly below the last node
  const newPosition = {
    x: lastNode.position.x,
    y: lastNode.position.y + NODE_HEIGHT + MIN_SPACING * 2,
  };

  // Check if this position overlaps with any existing node
  const hasOverlap = nodes.some((node) =>
    nodesOverlap(newPosition, node.position, 20)
  );

  if (hasOverlap) {
    // If there's overlap, find a non-overlapping position below
    return findNonOverlappingPosition(newPosition, nodes, "bottom");
  }

  return snapToGrid(newPosition);
};

/**
 * Auto-arrange nodes in a vertical layout
 */
export const autoArrangeNodes = (
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): Node<WorkflowNodeData>[] => {
  if (nodes.length === 0) return nodes;

  // Find root nodes (nodes with no incoming edges)
  const nodesWithIncoming = new Set(edges.map((e) => e.target));
  const rootNodes = nodes.filter((n) => !nodesWithIncoming.has(n.id));

  // If no root nodes exist, arrange all nodes vertically
  if (rootNodes.length === 0 || edges.length === 0) {
    // All nodes are disconnected, arrange them vertically
    return nodes.map((node, index) => {
      return {
        ...node,
        position: snapToGrid({
          x: 250, // Center horizontally
          y: index * (NODE_HEIGHT + MIN_SPACING * 3),
        }),
      };
    });
  }

  // Build adjacency map
  const adjacency = new Map<string, string[]>();
  edges.forEach((edge) => {
    if (!adjacency.has(edge.source)) {
      adjacency.set(edge.source, []);
    }
    adjacency.get(edge.source)!.push(edge.target);
  });

  // Calculate levels (depth in the tree) using BFS
  const levels = new Map<string, number>();
  const visited = new Set<string>();

  const calculateLevel = (nodeId: string, level: number = 0) => {
    if (visited.has(nodeId)) return;

    visited.add(nodeId);
    const currentLevel = levels.get(nodeId) || 0;
    levels.set(nodeId, Math.max(level, currentLevel));

    const children = adjacency.get(nodeId) || [];
    children.forEach((childId) => calculateLevel(childId, level + 1));
  };

  // Process all root nodes
  rootNodes.forEach((node) => calculateLevel(node.id));

  // Handle orphaned nodes (disconnected from the main graph)
  nodes.forEach((node) => {
    if (!levels.has(node.id)) {
      levels.set(node.id, 0);
    }
  });

  // Group nodes by level
  const nodesByLevel = new Map<number, string[]>();
  levels.forEach((level, nodeId) => {
    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, []);
    }
    nodesByLevel.get(level)!.push(nodeId);
  });

  // Calculate positions - arrange vertically with branching horizontally
  const arrangedNodes = nodes.map((node) => {
    const level = levels.get(node.id) || 0;
    const nodesInLevel = nodesByLevel.get(level) || [];
    const indexInLevel = nodesInLevel.indexOf(node.id);

    // If only one node in level, center it
    // If multiple nodes in level (branching), spread them horizontally
    const x =
      nodesInLevel.length === 1
        ? 250 // Center single nodes
        : 250 +
          (indexInLevel - (nodesInLevel.length - 1) / 2) *
            (NODE_WIDTH + MIN_SPACING * 3);
    const y = level * (NODE_HEIGHT + MIN_SPACING * 4);

    return {
      ...node,
      position: snapToGrid({ x, y }),
    };
  });

  return arrangedNodes;
};
