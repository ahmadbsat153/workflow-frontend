import { NodeTypes } from "reactflow";
import { ActionNode } from "./ActionNode";
import { BranchNode } from "./BranchNode";

export const nodeTypes: NodeTypes = {
  action: ActionNode,
  branch: BranchNode,
};

export { ActionNode, BranchNode };