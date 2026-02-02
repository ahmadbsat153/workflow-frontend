"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Connection,
  useNodesState,
  useEdgesState,
  MiniMap,
  OnSelectionChangeParams,
  useReactFlow,
  ReactFlowProvider,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";

import { Button } from "@/lib/ui/button";
import { NodeConfigPanel } from "./Panels/NodeConfigPanel";
import { ActionLibrarySidebar } from "./Sidebar/ActionLibrarySidebar";
import { nodeTypes } from "./Nodes";
import { Action } from "@/lib/types/actions/action";
import { toast } from "sonner";
import {
  Trash2,
  Save,
  Maximize,
  GitBranch,
  CheckCircle,
  AlertTriangle,
  Grid3x3,
} from "lucide-react";

import { Badge } from "@/lib/ui/badge";
import {
  BranchData,
  SaveWorkflowRequest,
  WorkflowJSON,
  WorkflowNode,
  WorkflowNodeData,
  WorkflowStep,
} from "@/lib/types/workflow/workflow";
import {
  autoArrangeNodes,
  findNonOverlappingPosition,
  getDefaultNodePosition,
  snapToGrid,
  nodesOverlap,
  NODE_WIDTH,
  NODE_HEIGHT,
} from "@/utils/Workflow/nodePositioning";
import { API_WORKFLOW } from "@/lib/services/Workflow/workflow_service";
import { ActionSelectionModal } from "./Panels/ActionSelectModal";
import { SaveWorkflowDialog } from "./Dialog/SaveWorkflowDialog";
import { validateWorkflow } from "@/utils/Workflow/validation";
import { useParams } from "next/navigation";
import DotsLoader from "../../Loader/DotsLoader";
import { handleServerError } from "@/lib/api/_axios";
import { ErrorResponse } from "@/lib/types/common";
import { useFormEditContext } from "@/lib/context/FormEditContext";

// Sidebar widths for viewport calculation
const SIDEBAR_WIDTH_EXPANDED = 320; // w-80
const SIDEBAR_WIDTH_COLLAPSED = 48; // w-12
const CONFIG_PANEL_WIDTH = 384; // w-96

const WorkflowBuilderInner = () => {
  const params = useParams();
  const form_id = params.id as string;

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNodeData>([]);
  const { getNodes, screenToFlowPosition, fitView, getViewport } =
    useReactFlow();

  // UI State
  const [loading, setLoading] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [snapToGridEnabled, setSnapToGridEnabled] = useState(true);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [pendingNodeId, setPendingNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [configPanelNodeId, setConfigPanelNodeId] = useState<string | null>(null);

  // Track initial state for dirty detection
  const initialStateRef = useRef<{ nodes: string; edges: string } | null>(null);
  const isInitialLoadRef = useRef(true);

  // Get dirty state context (may be undefined if not wrapped in provider)
  let setWorkflowDirty: ((dirty: boolean) => void) | undefined;
  try {
    const context = useFormEditContext();
    setWorkflowDirty = context.setWorkflowDirty;
  } catch {
    // Context not available, dirty tracking disabled
  }

  // Track dirty state when nodes or edges change
  useEffect(() => {
    if (isInitialLoadRef.current || !initialStateRef.current) return;

    const currentNodesJson = JSON.stringify(nodes.map(n => ({ id: n.id, position: n.position, data: n.data })));
    const currentEdgesJson = JSON.stringify(edges);

    const isDirty =
      currentNodesJson !== initialStateRef.current.nodes ||
      currentEdgesJson !== initialStateRef.current.edges;

    setWorkflowDirty?.(isDirty);
  }, [nodes, edges, setWorkflowDirty]);

  // Load workflow by form ID on mount
  useEffect(() => {
    const loadWorkflowByForm = async () => {
      if (!form_id) return;

      try {
        setLoading(true);
        isInitialLoadRef.current = true;
        const workflow = await API_WORKFLOW.getWorkflowByForm(form_id);

        if (workflow) {
          setWorkflowId(workflow._id);
          setWorkflowName(workflow.name);
          setWorkflowDescription(workflow.description || "");
          // Clear selected state from loaded nodes to prevent auto-selection
          const nodesWithoutSelection = (workflow.nodes || []).map((node) => ({
            ...node,
            selected: false,
          }));
          setNodes(nodesWithoutSelection);
          setEdges(workflow.edges || []);

          // Store initial state for dirty tracking
          initialStateRef.current = {
            nodes: JSON.stringify(nodesWithoutSelection.map(n => ({ id: n.id, position: n.position, data: n.data }))),
            edges: JSON.stringify(workflow.edges || []),
          };

          setLoading(false);
          // Mark initial load as complete after state is set
          setTimeout(() => {
            isInitialLoadRef.current = false;
          }, 100);
          // Fit view with better zoom settings after nodes are loaded
          setTimeout(() => {
            fitView({
              duration: 300,
              padding: 0.3,
              minZoom: 0.5,
              maxZoom: 1.2,
            });
          }, 100);
        } else {
          // No existing workflow - set empty initial state
          initialStateRef.current = {
            nodes: JSON.stringify([]),
            edges: JSON.stringify([]),
          };
          setLoading(false);
          setTimeout(() => {
            isInitialLoadRef.current = false;
          }, 100);
        }
      } catch (error) {
        setLoading(false);
        isInitialLoadRef.current = false;
        // Set empty initial state on error
        initialStateRef.current = {
          nodes: JSON.stringify([]),
          edges: JSON.stringify([]),
        };
        handleServerError(error as ErrorResponse, (err_msg) => {
          toast.error(err_msg);
        });
      }
    };

    if (form_id) {
      loadWorkflowByForm();
    }
  }, [form_id]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isInputField =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (!isInputField) {
        // Delete
        if (event.key === "Delete" || event.key === "Backspace") {
          event.preventDefault();
          deleteSelectedNodes();
        }

        // Save
        if ((event.ctrlKey || event.metaKey) && event.key === "s") {
          event.preventDefault();
          setIsSaveDialogOpen(true);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  // Listen for custom events from node toolbar
  useEffect(() => {
    interface NodeActionEvent extends CustomEvent {
      detail: {
        nodeId: string;
      };
    }
    const handleDuplicateNode = (event: Event) => {
      const customEvent = event as NodeActionEvent;
      const nodeId = customEvent.detail.nodeId;
      duplicateNode(nodeId);
    };

    const handleDeleteNode = (event: Event) => {
      const customEvent = event as NodeActionEvent;
      const nodeId = customEvent.detail.nodeId;
      deleteNode(nodeId);
    };

    window.addEventListener("duplicateNode", handleDuplicateNode);
    window.addEventListener("deleteNode", handleDeleteNode);

    return () => {
      window.removeEventListener("duplicateNode", handleDuplicateNode);
      window.removeEventListener("deleteNode", handleDeleteNode);
    };
  }, [nodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return nodes.find((node) => node.id === selectedNodeId) || null;
  }, [selectedNodeId, nodes]);

  // Node for config panel (only opened on double-click)
  const configPanelNode = useMemo(() => {
    if (!configPanelNodeId) return null;
    return nodes.find((node) => node.id === configPanelNodeId) || null;
  }, [configPanelNodeId, nodes]);

  // Handle double-click to open config panel
  const onNodeDoubleClick = useCallback(
    (_event: React.MouseEvent, node: WorkflowNode) => {
      setConfigPanelNodeId(node.id);
    },
    []
  );

  const onSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    const selectedNodes = params.nodes as WorkflowNode[];
    if (selectedNodes.length === 1) {
      setSelectedNodeId(selectedNodes[0].id);
    } else {
      setSelectedNodeId(null);
    }
  }, []);

  // Validation
  const validation = useMemo(() => {
    return validateWorkflow(nodes, edges);
  }, [nodes, edges]);

  // Drop handler with smart positioning
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const actionData = event.dataTransfer.getData("actionData");
      if (!actionData) return;

      const action: Action = JSON.parse(actionData);
      // Get the position where user dropped
      let position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Offset to center node on cursor
      position = {
        x: position.x - NODE_WIDTH / 2,
        y: position.y - NODE_HEIGHT / 2,
      };

      // Apply snap to grid if enabled
      if (snapToGridEnabled) {
        position = snapToGrid(position);
      }

      // Check for overlap after snapping
      const hasOverlap = nodes.some((node) =>
        nodesOverlap(position, node.position, 20)
      );

      // Only adjust if there's still an overlap after snapping
      if (hasOverlap) {
        position = findNonOverlappingPosition(position, nodes, "bottom");
      }

      const nodeId = `action-${Date.now()}`;
      const tempId = `action-${Date.now()}`;

      const newNode: WorkflowNode = {
        id: nodeId,
        type: "action",
        position,
        data: {
          label: action.displayName,
          tempId: tempId,
          stepName: action.displayName,
          actionId: action._id,
          action: action,
          config: {},
        },
      };

      setNodes((nds) => [...nds, newNode]);
      setSelectedNodeId(nodeId);
      toast.success(`Added ${action.displayName}`);
    },
    [screenToFlowPosition, setNodes, nodes, snapToGridEnabled]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleActionClick = useCallback(
    (action: Action) => {
      // Get viewport center for better positioning
      // Account for sidebars when calculating the actual canvas center
      const viewport = getViewport();
      const leftSidebarWidth = isSidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;
      const rightPanelWidth = configPanelNodeId ? CONFIG_PANEL_WIDTH : 0;
      const actualCanvasWidth = window.innerWidth - leftSidebarWidth - rightPanelWidth;

      const viewportCenter = {
        x: -viewport.x / viewport.zoom + (leftSidebarWidth + actualCanvasWidth / 2) / viewport.zoom,
        y: -viewport.y / viewport.zoom + window.innerHeight / 2 / viewport.zoom,
      };

      let position = getDefaultNodePosition(nodes, viewportCenter);

      if (snapToGridEnabled) {
        position = snapToGrid(position);
      }

      const nodeId = `action-${Date.now()}`;
      const tempId = `action-${Date.now()}`;

      const newNode: WorkflowNode = {
        id: nodeId,
        type: "action",
        position,
        data: {
          label: action.displayName,
          tempId: tempId,
          stepName: action.displayName,
          actionId: action._id,
          action: action,
          config: {},
        },
      };

      setNodes((nds) => [...nds, newNode]);
      setSelectedNodeId(nodeId);
      toast.success(`Added ${action.displayName}`);
    },
    [setNodes, nodes, snapToGridEnabled, getViewport, isSidebarCollapsed, configPanelNodeId]
  );

  const addActionNode = () => {
    setIsActionModalOpen(true);
    setPendingNodeId(null);
  };

  const handleSelectAction = (action: Action) => {
    const nodeId = pendingNodeId || `action-${Date.now()}`;
    const tempId = `action-${Date.now()}`;

    if (pendingNodeId) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === pendingNodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  label: action.displayName,
                  stepName: action.displayName,
                  actionId: action._id,
                  action: action,
                  config: {},
                },
              }
            : node
        )
      );
      toast.success("Action updated successfully");
    } else {
      // Get viewport center for better positioning
      // Use a sensible default position if no nodes exist
      let viewportCenter: { x: number; y: number } | undefined;

      if (nodes.length === 0) {
        // For the first node, place it at a fixed reasonable position
        viewportCenter = { x: 250, y: 100 };
      } else {
        // Account for sidebars when calculating the actual canvas center
        const viewport = getViewport();
        const leftSidebarWidth = isSidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;
        const rightPanelWidth = configPanelNodeId ? CONFIG_PANEL_WIDTH : 0;
        const actualCanvasWidth = window.innerWidth - leftSidebarWidth - rightPanelWidth;

        viewportCenter = {
          x: -viewport.x / viewport.zoom + (leftSidebarWidth + actualCanvasWidth / 2) / viewport.zoom,
          y: -viewport.y / viewport.zoom + window.innerHeight / 2 / viewport.zoom,
        };
      }

      let position = getDefaultNodePosition(nodes, viewportCenter);
      if (snapToGridEnabled) {
        position = snapToGrid(position);
      }

      const newNode: WorkflowNode = {
        id: nodeId,
        type: "action",
        position,
        data: {
          label: action.displayName,
          tempId: tempId,
          stepName: action.displayName,
          actionId: action._id,
          action: action,
          config: {},
        },
      };
      setNodes((nds) => [...nds, newNode]);
      setSelectedNodeId(nodeId);
      toast.success("Action added to workflow");
    }

    setPendingNodeId(null);
  };

  const addBranchNode = () => {
    // Get viewport center for better positioning
    // Use a sensible default position if no nodes exist
    let viewportCenter: { x: number; y: number } | undefined;

    if (nodes.length === 0) {
      // For the first node, place it at a fixed reasonable position
      viewportCenter = { x: 250, y: 100 };
    } else {
      // Account for sidebars when calculating the actual canvas center
      const viewport = getViewport();
      const leftSidebarWidth = isSidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;
      const rightPanelWidth = configPanelNodeId ? CONFIG_PANEL_WIDTH : 0;
      const actualCanvasWidth = window.innerWidth - leftSidebarWidth - rightPanelWidth;

      viewportCenter = {
        x: -viewport.x / viewport.zoom + (leftSidebarWidth + actualCanvasWidth / 2) / viewport.zoom,
        y: -viewport.y / viewport.zoom + window.innerHeight / 2 / viewport.zoom,
      };
    }

    let position = getDefaultNodePosition(nodes, viewportCenter);
    if (snapToGridEnabled) {
      position = snapToGrid(position);
    }

    const nodeId = `branch-${Date.now()}`;
    const newNode: WorkflowNode = {
      id: nodeId,
      type: "branch",
      position,
      data: {
        label: "Branch Decision",
        tempId: `branch-${Date.now()}`,
        stepName: "Branch Decision",
        config: {},
        branches: [
          { name: "Path 1", conditions: [], targetStepTempId: null },
          { name: "Path 2", conditions: [], targetStepTempId: null },
        ],
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(nodeId);
    toast.success("Branch node added");
  };

  const deleteSelectedNodes = useCallback(() => {
    const currentNodes = getNodes();
    const selectedNodes = currentNodes.filter((node) => node.selected);

    if (selectedNodes.length === 0) {
      toast.error("No nodes selected");
      return;
    }

    const selectedNodeIds = selectedNodes.map((node) => node.id);

    setNodes((nds) => nds.filter((node) => !selectedNodeIds.includes(node.id)));
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          !selectedNodeIds.includes(edge.source) &&
          !selectedNodeIds.includes(edge.target)
      )
    );

    if (selectedNodeId && selectedNodeIds.includes(selectedNodeId)) {
      setSelectedNodeId(null);
    }

    // Close config panel if the deleted node was being configured
    if (configPanelNodeId && selectedNodeIds.includes(configPanelNodeId)) {
      setConfigPanelNodeId(null);
    }

    toast.success(
      `Deleted ${selectedNodes.length} node${
        selectedNodes.length > 1 ? "s" : ""
      }`
    );
  }, [getNodes, setNodes, setEdges, selectedNodeId, configPanelNodeId]);

  const duplicateNode = useCallback(
    (nodeId: string) => {
      const nodeToDuplicate = nodes.find((n) => n.id === nodeId);
      if (!nodeToDuplicate) return;

      let newPosition = {
        x: nodeToDuplicate.position.x + 50,
        y: nodeToDuplicate.position.y + 50,
      };

      newPosition = findNonOverlappingPosition(newPosition, nodes, "diagonal");

      if (snapToGridEnabled) {
        newPosition = snapToGrid(newPosition);
      }

      const newNodeId = `${nodeToDuplicate.type}-${Date.now()}`;
      const newNode: WorkflowNode = {
        ...nodeToDuplicate,
        id: newNodeId,
        position: newPosition,
        data: {
          ...nodeToDuplicate.data,
          tempId: `${nodeToDuplicate.type}-${Date.now()}`,
          stepName: `${nodeToDuplicate.data.stepName} (Copy)`,
        },
      };

      setNodes((nds) => [...nds, newNode]);
      setSelectedNodeId(newNodeId);
      toast.success("Node duplicated");
    },
    [nodes, setNodes, snapToGridEnabled]
  );

  const handleUpdateConfig = useCallback(
    (nodeId: string, config: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, config } }
            : node
        )
      );
      toast.success("Configuration saved");
    },
    [setNodes]
  );

  const handleChangeAction = useCallback((nodeId: string) => {
    setPendingNodeId(nodeId);
    setIsActionModalOpen(true);
  }, []);

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );

      if (selectedNodeId === nodeId) {
        setSelectedNodeId(null);
      }

      // Close config panel if this node was being configured
      if (configPanelNodeId === nodeId) {
        setConfigPanelNodeId(null);
      }

      toast.success("Node deleted");
    },
    [setNodes, setEdges, selectedNodeId, configPanelNodeId]
  );

  const handleUpdateBranches = useCallback(
    (nodeId: string, branches: BranchData[]) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, branches } }
            : node
        )
      );
      toast.success("Branch configuration saved");
    },
    [setNodes]
  );

  const handleCloseConfigPanel = useCallback(() => {
    // Close the config panel
    setConfigPanelNodeId(null);
  }, []);

  // Auto-arrange nodes
  const handleAutoArrange = useCallback(() => {
    const arranged = autoArrangeNodes(nodes, edges);
    setNodes(arranged);
    toast.success("Nodes arranged");
    setTimeout(() => {
      fitView({
        duration: 300,
        padding: 0.3,
        minZoom: 0.5,
        maxZoom: 1.2,
      });
    }, 100);
  }, [nodes, edges, setNodes, fitView]);

  // Fit view
  const handleFitView = useCallback(() => {
    fitView({
      duration: 300,
      padding: 0.3,
      minZoom: 0.5,
      maxZoom: 1.2,
    });
  }, [fitView]);

  // Save workflow
  const handleSaveWorkflow = async (name: string, description: string) => {
    const workflowJSON = generateWorkflowJSON();
    if (!workflowJSON) return;

    const saveData: SaveWorkflowRequest = {
      workflowId: workflowId || undefined,
      name,
      description,
      nodes: nodes, // Remove action object
      edges,
      workflowJSON,
    };

    try {
      if (workflowId) {
        await API_WORKFLOW.updateWorkflow(workflowId, saveData);
        toast.success("Workflow updated successfully");
      } else {
        const response = await API_WORKFLOW.saveWorkflow(form_id, saveData);
        setWorkflowId(response._id);
        toast.success("Workflow saved successfully");
      }
      setWorkflowName(name);

      // Update initial state to current state (no longer dirty)
      initialStateRef.current = {
        nodes: JSON.stringify(nodes.map(n => ({ id: n.id, position: n.position, data: n.data }))),
        edges: JSON.stringify(edges),
      };
      setWorkflowDirty?.(false);
    } catch (error) {
      console.error("Error saving workflow:", error);
      throw error;
    }
  };

  const generateWorkflowJSON = (): WorkflowJSON | null => {
    const steps: WorkflowStep[] = [];
    let startStepTempId = "";

    const nodesWithIncoming = new Set(edges.map((e) => e.target));
    const startNode = nodes.find((n) => !nodesWithIncoming.has(n.id));

    if (startNode) {
      startStepTempId = startNode.data.tempId;
    }

    // Validate before generating
    if (!validation.isValid) {
      toast.error("Cannot generate workflow: Please fix validation errors");
      return null;
    }

    nodes.forEach((node) => {
      const outgoingEdges = edges.filter((e) => e.source === node.id);
      const nextStepTempId = outgoingEdges[0]?.target
        ? nodes.find((n) => n.id === outgoingEdges[0].target)?.data.tempId
        : null;

      if (node.type === "action") {
        // Check if this is an approval node
        const isApprovalNode = node.data.action?.category === "approval";

        let config = { ...node.data.config };

        if (isApprovalNode) {
          // Find approve and reject edges by their sourceHandle
          const approveEdge = outgoingEdges.find((e) => e.sourceHandle === "approve");
          const rejectEdge = outgoingEdges.find((e) => e.sourceHandle === "reject");

          const approveTargetNode = approveEdge
            ? nodes.find((n) => n.id === approveEdge.target)
            : null;
          const rejectTargetNode = rejectEdge
            ? nodes.find((n) => n.id === rejectEdge.target)
            : null;

          config = {
            ...config,
            onApproveNextStepTempId: approveTargetNode?.data.tempId || null,
            onRejectNextStepTempId: rejectTargetNode?.data.tempId || null,
          };
        }

        steps.push({
          tempId: node.data.tempId,
          stepName: node.data.stepName,
          type: "action",
          actionId: node.data.actionId ?? null,
          conditions: [],
          conditionLogic: "AND",
          config,
          // For approval nodes, nextStepTempId is null since we use the approve/reject paths
          nextStepTempId: isApprovalNode ? null : (nextStepTempId ?? null),
        });
      } else if (node.type === "branch") {
        const branches = node.data.branches?.map((branch, idx) => {
          const branchEdge = edges.find(
            (e) => e.source === node.id && e.sourceHandle === `branch-${idx}`
          );
          const targetNode = branchEdge
            ? nodes.find((n) => n.id === branchEdge.target)
            : null;

          return {
            name: branch.name,
            conditions: branch.conditions || [],
            conditionLogic: branch.conditionLogic || "AND",
            targetStepTempId: targetNode?.data.tempId || null,
            nextStepTempIdAfterBranch: null,
          };
        });

        steps.push({
          tempId: node.data.tempId,
          stepName: node.data.stepName,
          type: "branch",
          actionId: null,
          conditions: [],
          conditionLogic: "AND",
          config: {
            branches,
            defaultTargetTempId: null,
          },
          nextStepTempId: null,
        });
      }
    });

    const workflowJSON: WorkflowJSON = {
      workflowId: workflowId || "new-workflow",
      startStepTempId,
      steps,
    };

    return workflowJSON;
  };

  if (loading) {
    return (
      <div className="min-h-[90vh] w-full flex justify-center items-center ">
        <DotsLoader />
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-full flex min-h-0">
        <ActionLibrarySidebar
          onDragStart={(action) => console.log("Dragging:", action.displayName)}
          onActionClick={handleActionClick}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <div className="flex-1 flex flex-col min-h-0">
          {/* Toolbar */}
          <div className="p-4 border-b flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2">
              <h2 className="font-semibold text-lg">{workflowName}</h2>
              {validation.errors.length > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {validation.errors.length} error
                  {validation.errors.length > 1 ? "s" : ""}
                </Badge>
              )}
              {validation.warnings.length > 0 && (
                <Badge variant="secondary" className="gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {validation.warnings.length} warning
                  {validation.warnings.length > 1 ? "s" : ""}
                </Badge>
              )}
              {validation.isValid && nodes.length > 0 && (
                <Badge
                  variant="outline"
                  className="gap-1 text-green-600 border-green-600"
                >
                  <CheckCircle className="h-3 w-3" />
                  Valid
                </Badge>
              )}
            </div>

            <Button variant="default" size="sm" onClick={addActionNode}>
              Add Action
            </Button>
            <Button variant="secondary" size="sm" onClick={addBranchNode}>
              <GitBranch className="h-4 w-4 mr-2" />
              Add Branch
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={deleteSelectedNodes}
              disabled={!selectedNode}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>

            <div className="h-6 w-px bg-border" />

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSaveDialogOpen(true)}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onSelectionChange={onSelectionChange}
              onNodeDoubleClick={onNodeDoubleClick}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}
              minZoom={0.5}
              maxZoom={1.5}
              deleteKeyCode={null}
              snapToGrid={snapToGridEnabled}
              snapGrid={[20, 20]}
            >
              <Background />
              <Controls />
              <MiniMap />

              {/* Bottom Panel */}
              <Panel position="bottom-left" className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAutoArrange}
                  disabled={nodes.length === 0}
                >
                  Auto Arrange
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFitView}
                  disabled={nodes.length === 0}
                >
                  <Maximize className="h-4 w-4 mr-2" />
                  Fit View
                </Button>
                <Button
                  variant={snapToGridEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSnapToGridEnabled(!snapToGridEnabled)}
                >
                  <Grid3x3 className="h-4 w-4 mr-2" />
                  Snap to Grid
                </Button>
              </Panel>

              {/* Stats Panel */}
              <Panel
                position="top-right"
                className="bg-background/95 backdrop-blur border rounded-lg p-3 shadow-lg"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Nodes:</span>
                    <span className="font-medium">{nodes.length}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Connections:</span>
                    <span className="font-medium">{edges.length}</span>
                  </div>
                </div>
              </Panel>
            </ReactFlow>
          </div>
        </div>

        {configPanelNode && (
          <NodeConfigPanel
            node={configPanelNode}
            onClose={handleCloseConfigPanel}
            onUpdateConfig={handleUpdateConfig}
            onChangeAction={handleChangeAction}
            onDeleteNode={deleteNode}
            onUpdateBranches={handleUpdateBranches}
            formId={form_id}
          />
        )}
      </div>

      <ActionSelectionModal
        open={isActionModalOpen}
        onClose={() => {
          setIsActionModalOpen(false);
          setPendingNodeId(null);
        }}
        onSelectAction={handleSelectAction}
      />

      <SaveWorkflowDialog
        open={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        onSave={handleSaveWorkflow}
        defaultName={workflowName}
        defaultDescription={workflowDescription}
      />
    </>
  );
};

const WorkflowBuilder = () => {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderInner />
    </ReactFlowProvider>
  );
};

export default WorkflowBuilder;
