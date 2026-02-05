import { describe, it, expect } from "vitest";
import {
  snapToGrid,
  nodesOverlap,
  findNonOverlappingPosition,
  getNodeBounds,
  getDefaultNodePosition,
  autoArrangeNodes,
  NODE_WIDTH,
  NODE_HEIGHT,
  GRID_SIZE,
  MIN_SPACING,
} from "../nodePositioning";
import type { Node, Edge } from "reactflow";
import type { WorkflowNodeData } from "@/lib/types/workflow/workflow";

// Helper to create mock nodes
const createMockNode = (
  id: string,
  x: number,
  y: number,
  type: string = "action"
): Node<WorkflowNodeData> => ({
  id,
  type,
  position: { x, y },
  data: {
    label: `Node ${id}`,
    tempId: id,
    stepName: `Step ${id}`,
    config: {},
  },
});

// Helper to create mock edges
const createMockEdge = (source: string, target: string): Edge => ({
  id: `${source}-${target}`,
  source,
  target,
});

describe("Constants", () => {
  it("should have correct default values", () => {
    expect(NODE_WIDTH).toBe(240);
    expect(NODE_HEIGHT).toBe(150);
    expect(GRID_SIZE).toBe(20);
    expect(MIN_SPACING).toBe(50);
  });
});

describe("snapToGrid", () => {
  it("should snap position to nearest grid point", () => {
    expect(snapToGrid({ x: 15, y: 15 })).toEqual({ x: 20, y: 20 });
    expect(snapToGrid({ x: 25, y: 25 })).toEqual({ x: 20, y: 20 });
  });

  it("should handle exact grid positions", () => {
    expect(snapToGrid({ x: 20, y: 40 })).toEqual({ x: 20, y: 40 });
    expect(snapToGrid({ x: 100, y: 100 })).toEqual({ x: 100, y: 100 });
  });

  it("should handle zero position", () => {
    expect(snapToGrid({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 });
  });

  it("should handle negative positions", () => {
    expect(snapToGrid({ x: -15, y: -25 })).toEqual({ x: -20, y: -20 });
  });

  it("should round to nearest grid (not floor)", () => {
    // 10 is exactly halfway, Math.round goes to even (banker's rounding in some cases)
    // But Math.round(10/20) = Math.round(0.5) = 1, so 10 -> 20
    expect(snapToGrid({ x: 10, y: 10 })).toEqual({ x: 20, y: 20 });
    expect(snapToGrid({ x: 9, y: 9 })).toEqual({ x: 0, y: 0 });
    expect(snapToGrid({ x: 11, y: 11 })).toEqual({ x: 20, y: 20 });
  });
});

describe("nodesOverlap", () => {
  it("should return true when nodes overlap completely", () => {
    const pos1 = { x: 100, y: 100 };
    const pos2 = { x: 100, y: 100 };
    expect(nodesOverlap(pos1, pos2)).toBe(true);
  });

  it("should return true when nodes overlap partially", () => {
    const pos1 = { x: 100, y: 100 };
    const pos2 = { x: 200, y: 150 }; // Within NODE_WIDTH + MIN_SPACING
    expect(nodesOverlap(pos1, pos2)).toBe(true);
  });

  it("should return false when nodes are far apart", () => {
    const pos1 = { x: 100, y: 100 };
    const pos2 = { x: 500, y: 500 }; // Far apart
    expect(nodesOverlap(pos1, pos2)).toBe(false);
  });

  it("should return false when nodes are just outside overlap range", () => {
    const pos1 = { x: 0, y: 0 };
    // NODE_WIDTH + MIN_SPACING = 240 + 50 = 290
    const pos2 = { x: NODE_WIDTH + MIN_SPACING + 1, y: 0 };
    expect(nodesOverlap(pos1, pos2)).toBe(false);
  });

  it("should respect custom padding", () => {
    const pos1 = { x: 0, y: 0 };
    const pos2 = { x: NODE_WIDTH + 10, y: 0 }; // 250

    // Default padding (MIN_SPACING = 50): 250 < 290, so overlap
    expect(nodesOverlap(pos1, pos2, MIN_SPACING)).toBe(true);

    // Custom padding 5: 250 < 245? No, so no overlap
    expect(nodesOverlap(pos1, pos2, 5)).toBe(false);
  });

  it("should check both x and y dimensions", () => {
    const pos1 = { x: 0, y: 0 };
    // X overlap but Y doesn't
    const pos2 = { x: 100, y: NODE_HEIGHT + MIN_SPACING + 1 };
    expect(nodesOverlap(pos1, pos2)).toBe(false);
  });
});

describe("getNodeBounds", () => {
  it("should return null for empty nodes array", () => {
    expect(getNodeBounds([])).toBeNull();
  });

  it("should return bounds for single node", () => {
    const nodes = [createMockNode("1", 100, 100)];
    const bounds = getNodeBounds(nodes);
    expect(bounds).toEqual({
      minX: 100,
      maxX: 100 + NODE_WIDTH,
      minY: 100,
      maxY: 100 + NODE_HEIGHT,
    });
  });

  it("should return bounds for multiple nodes", () => {
    const nodes = [
      createMockNode("1", 0, 0),
      createMockNode("2", 200, 100),
      createMockNode("3", 100, 300),
    ];
    const bounds = getNodeBounds(nodes);
    expect(bounds).toEqual({
      minX: 0,
      maxX: 200 + NODE_WIDTH,
      minY: 0,
      maxY: 300 + NODE_HEIGHT,
    });
  });

  it("should handle negative positions", () => {
    const nodes = [
      createMockNode("1", -100, -50),
      createMockNode("2", 100, 100),
    ];
    const bounds = getNodeBounds(nodes);
    expect(bounds?.minX).toBe(-100);
    expect(bounds?.minY).toBe(-50);
  });
});

describe("findNonOverlappingPosition", () => {
  it("should return snapped position when no nodes exist", () => {
    const target = { x: 100, y: 100 };
    const result = findNonOverlappingPosition(target, []);
    // First candidate position should be returned (snapped to grid)
    expect(result.x % GRID_SIZE).toBe(0);
    expect(result.y % GRID_SIZE).toBe(0);
  });

  it("should find position to the right when direction is right", () => {
    const nodes = [createMockNode("1", 100, 100)];
    const target = { x: 100, y: 100 };
    const result = findNonOverlappingPosition(target, nodes, "right");
    // Should be to the right of target
    expect(result.x).toBeGreaterThan(target.x);
    expect(result.y).toBe(snapToGrid(target).y);
  });

  it("should find position below when direction is bottom", () => {
    const nodes = [createMockNode("1", 100, 100)];
    const target = { x: 100, y: 100 };
    const result = findNonOverlappingPosition(target, nodes, "bottom");
    // Should be below target
    expect(result.y).toBeGreaterThan(target.y);
    expect(result.x).toBe(snapToGrid(target).x);
  });

  it("should find diagonal position when direction is diagonal", () => {
    const nodes = [createMockNode("1", 100, 100)];
    const target = { x: 100, y: 100 };
    const result = findNonOverlappingPosition(target, nodes, "diagonal");
    // Should not overlap with existing node
    expect(nodesOverlap(result, nodes[0].position)).toBe(false);
  });

  it("should skip overlapping positions", () => {
    // Create a grid of nodes
    const nodes = [
      createMockNode("1", 100, 100),
      createMockNode("2", 100 + NODE_WIDTH + MIN_SPACING, 100),
    ];
    const target = { x: 100, y: 100 };
    const result = findNonOverlappingPosition(target, nodes, "right");

    // Result should not overlap with any existing node
    const hasOverlap = nodes.some((n) => nodesOverlap(result, n.position));
    expect(hasOverlap).toBe(false);
  });
});

describe("getDefaultNodePosition", () => {
  it("should return viewport center when no nodes exist", () => {
    const viewportCenter = { x: 500, y: 300 };
    const result = getDefaultNodePosition([], viewportCenter);
    expect(result).toEqual(snapToGrid(viewportCenter));
  });

  it("should return origin when no nodes and no viewport center", () => {
    const result = getDefaultNodePosition([]);
    expect(result).toEqual({ x: 0, y: 0 });
  });

  it("should position below last node", () => {
    const nodes = [createMockNode("1", 100, 100)];
    const result = getDefaultNodePosition(nodes);
    // Should be below the last node
    expect(result.x).toBe(snapToGrid({ x: 100, y: 0 }).x);
    expect(result.y).toBeGreaterThan(100);
  });

  it("should find non-overlapping position if direct below overlaps", () => {
    // Create two nodes vertically aligned
    const nodes = [
      createMockNode("1", 100, 100),
      createMockNode("2", 100, 100 + NODE_HEIGHT + MIN_SPACING * 2),
    ];
    const result = getDefaultNodePosition(nodes);

    // Result should not overlap with any existing node
    const hasOverlap = nodes.some((n) =>
      nodesOverlap(result, n.position, 20)
    );
    expect(hasOverlap).toBe(false);
  });
});

describe("autoArrangeNodes", () => {
  it("should return empty array for empty nodes", () => {
    const result = autoArrangeNodes([], []);
    expect(result).toEqual([]);
  });

  it("should arrange disconnected nodes vertically", () => {
    const nodes = [
      createMockNode("1", 500, 500),
      createMockNode("2", 100, 100),
      createMockNode("3", 300, 700),
    ];
    const result = autoArrangeNodes(nodes, []);

    // All nodes should be at x=250 (centered)
    result.forEach((node) => {
      expect(node.position.x).toBe(snapToGrid({ x: 250, y: 0 }).x);
    });

    // Nodes should be vertically spaced
    expect(result[0].position.y).toBeLessThan(result[1].position.y);
    expect(result[1].position.y).toBeLessThan(result[2].position.y);
  });

  it("should arrange connected nodes in hierarchy", () => {
    const nodes = [
      createMockNode("1", 0, 0),
      createMockNode("2", 0, 0),
      createMockNode("3", 0, 0),
    ];
    const edges = [createMockEdge("1", "2"), createMockEdge("2", "3")];

    const result = autoArrangeNodes(nodes, edges);

    // First node (root) should be at level 0
    // Second node should be at level 1 (below first)
    // Third node should be at level 2 (below second)
    expect(result[0].position.y).toBeLessThan(result[1].position.y);
    expect(result[1].position.y).toBeLessThan(result[2].position.y);
  });

  it("should spread branching nodes horizontally", () => {
    const nodes = [
      createMockNode("root", 0, 0),
      createMockNode("branch1", 0, 0),
      createMockNode("branch2", 0, 0),
    ];
    // Root connects to both branch1 and branch2
    const edges = [
      createMockEdge("root", "branch1"),
      createMockEdge("root", "branch2"),
    ];

    const result = autoArrangeNodes(nodes, edges);

    // Find the branch nodes (level 1)
    const branchNodes = result.filter((n) => n.id !== "root");
    expect(branchNodes.length).toBe(2);

    // Branch nodes should be at the same y level
    expect(branchNodes[0].position.y).toBe(branchNodes[1].position.y);

    // Branch nodes should be spread horizontally
    expect(branchNodes[0].position.x).not.toBe(branchNodes[1].position.x);
  });

  it("should handle orphaned nodes", () => {
    const nodes = [
      createMockNode("1", 0, 0),
      createMockNode("2", 0, 0),
      createMockNode("orphan", 0, 0), // Not connected
    ];
    const edges = [createMockEdge("1", "2")];

    const result = autoArrangeNodes(nodes, edges);

    // All nodes should have valid positions
    result.forEach((node) => {
      expect(node.position.x).toBeDefined();
      expect(node.position.y).toBeDefined();
      expect(node.position.x % GRID_SIZE).toBe(0);
      expect(node.position.y % GRID_SIZE).toBe(0);
    });
  });

  it("should snap all positions to grid", () => {
    const nodes = [
      createMockNode("1", 13, 17),
      createMockNode("2", 123, 456),
    ];
    const edges = [createMockEdge("1", "2")];

    const result = autoArrangeNodes(nodes, edges);

    result.forEach((node) => {
      expect(node.position.x % GRID_SIZE).toBe(0);
      expect(node.position.y % GRID_SIZE).toBe(0);
    });
  });
});
