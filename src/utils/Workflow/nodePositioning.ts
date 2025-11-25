import { WorkflowNodeData } from "@/lib/types/workflow/workflow";
import { Node, XYPosition } from "reactflow";

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
    return snapToGrid(viewportCenter || { x: 250, y: 100 });
  }

  const lastNode = nodes[nodes.length - 1];

  return findNonOverlappingPosition(lastNode.position, nodes, "diagonal");
};

/**
 * Auto-arrange nodes in a hierarchical layout
 */
export const autoArrangeNodes = (
  nodes: Node<WorkflowNodeData>[],
  edges: any[]
): Node<WorkflowNodeData>[] => {
  if (nodes.length === 0) return nodes;

  const nodesWithIncoming = new Set(edges.map((e) => e.target));
  const rootNodes = nodes.filter((n) => !nodesWithIncoming.has(n.id));

  const adjacency = new Map<string, string[]>();
  edges.forEach((edge) => {
    if (!adjacency.has(edge.source)) {
      adjacency.set(edge.source, []);
    }
    adjacency.get(edge.source)!.push(edge.target);
  });

  const levels = new Map<string, number>();
  const positioned = new Set<string>();

  const calculateLevel = (nodeId: string, level: number = 0) => {
    if (positioned.has(nodeId)) return;

    levels.set(nodeId, Math.max(level, levels.get(nodeId) || 0));
    positioned.add(nodeId);

    const children = adjacency.get(nodeId) || [];
    children.forEach((childId) => calculateLevel(childId, level + 1));
  };

  rootNodes.forEach((node) => calculateLevel(node.id));

  const nodesByLevel = new Map<number, string[]>();
  levels.forEach((level, nodeId) => {
    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, []);
    }
    nodesByLevel.get(level)!.push(nodeId);
  });

  const arrangedNodes = nodes.map((node) => {
    const level = levels.get(node.id) || 0;
    const nodesInLevel = nodesByLevel.get(level) || [];
    const indexInLevel = nodesInLevel.indexOf(node.id);

    const x = indexInLevel * (NODE_WIDTH + MIN_SPACING * 2);
    const y = level * (NODE_HEIGHT + MIN_SPACING * 3);

    return {
      ...node,
      position: snapToGrid({ x, y }),
    };
  });

  return arrangedNodes;
};
