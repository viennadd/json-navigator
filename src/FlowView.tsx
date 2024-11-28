"use client";

import {
  Background,
  Edge,
  ReactFlow,
  Node,
  useNodesState,
  Panel,
  useEdgesState,
  Controls,
  ReactFlowInstance,
  useNodesInitialized,
  ReactFlowProvider,
} from "@xyflow/react";
import { DatabaseSchemaNode } from "@/components/database-schema-node";
import Dagre from "@dagrejs/dagre";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  JsonArray,
  JsonObject,
  JsonValue,
  JsonField,
  getJsonType,
} from "./Json";

interface LayoutOptions {
  direction: string;
}

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  options: LayoutOptions = { direction: "LR" }
) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: options.direction });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    })
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

const nodeTypes = {
  databaseSchema: DatabaseSchemaNode,
};

type FlowElements = {
  nodes: Node[];
  edges: Edge[];
};

type QueueItem = {
  jsonValue: JsonValue;
  parentId?: string;
  fieldName?: string;
};

const getFlowElementsFromJsonObject = (
  jsonContent: JsonObject
): FlowElements => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Helper function to generate unique IDs
  const generateId = (): string => Math.random().toString(36).substring(2, 11);

  const getTopLabel = (
    parentId: string | undefined,
    fieldName: string | undefined,
    jsonValue: JsonValue
  ): string => {
    if (!parentId) return "$";

    const valueType = getJsonType(jsonValue);
    if (valueType === "array") return `${fieldName}[]`;
    if (valueType === "object") return `${fieldName}{}`;
    return fieldName!;
  };

  // Initialize queue with root object
  const queue: QueueItem[] = [{ jsonValue: jsonContent }];

  // Process queue until empty
  while (queue.length > 0) {
    const { jsonValue, parentId, fieldName } = queue.shift()!;
    const currentNodeId = generateId();
    const fields: JsonField[] = [];

    // Process all properties of current object
    if (typeof jsonValue === "object") {
      Object.entries(jsonValue as object).forEach(([key, value]) => {
        const valueType = getJsonType(value);
        fields.push({
          title: key,
          type: valueType,
          value: value,
        });

        // If value is an object, add to queue for processing
        if (valueType === "object") {
          if (Object.keys(valueType).length > 0) {
            queue.push({
              jsonValue: value as JsonObject,
              parentId: currentNodeId,
              fieldName: key,
            });
          }
        }
        // if value is an array, add to queue for new node processing
        if (valueType === "array") {
          if (valueType.length > 0) {
            queue.push({
              jsonValue: value as JsonArray,
              parentId: currentNodeId,
              fieldName: key,
            });
          }
        }
      });
    } else if (Array.isArray(jsonValue)) {
      (jsonValue as Array<JsonValue>).forEach(
        (value: JsonValue, index: number, array: JsonValue[]) => {
          const valueType = getJsonType(value);
          fields.push({
            title: index.toString(),
            type: valueType,
            value: value,
          });
        }
      );
    }

    // Create current node
    const currentNode: Node = {
      id: currentNodeId,
      position: { x: 0, y: 0 },
      type: "databaseSchema",
      data: {
        label: getTopLabel(parentId, fieldName, jsonValue),
        schema: fields,
      },
    };

    nodes.push(currentNode);

    // Create edge if there's a parent
    if (parentId) {
      edges.push({
        id: `${parentId}-${currentNodeId}`,
        source: parentId,
        target: currentNodeId,
        sourceHandle: fieldName,
        targetHandle: getTopLabel(parentId, fieldName, jsonValue),
      });
    }
  }

  return { nodes, edges };
};

const JsonFlowView = (props: { jsonContent: JsonObject }) => {
  const { jsonContent } = props;
  const { nodes: defaultNodes, edges: defaultEdges } =
    getFlowElementsFromJsonObject(jsonContent);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);
  const nodesInitialized = useNodesInitialized();
  const [isInstanceReady, setIsInstanceReady] = useState<boolean>(false);

  const onLayout = useCallback(
    (direction: LayoutOptions = { direction: "LR" }) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, direction);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
      setTimeout(() => {
        reactFlowInstance.current?.fitView({ duration: 618 });
      }, 100);
    },
    [nodes, edges]
  );

  useEffect(() => {
    if (nodesInitialized && isInstanceReady) {
      onLayout();
    }
  }, [nodesInitialized, isInstanceReady]);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance;
    setIsInstanceReady(true);
  }, []);

  return (
    <div className="h-full w-full">
      <ReactFlow
        colorMode="dark"
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        onInit={onInit}
      >
        <Controls orientation="horizontal" />

        <Panel position="top-right">
          <button onClick={() => onLayout({ direction: "TB" })}>
            vertical layout
          </button>
          <button onClick={() => onLayout({ direction: "LR" })}>
            horizontal layout
          </button>
        </Panel>
        <Background />
      </ReactFlow>
    </div>
  );
};

export default function FlowView(props: { jsonContent: JsonObject }) {
  return (
    <ReactFlowProvider>
      <JsonFlowView {...props}></JsonFlowView>
    </ReactFlowProvider>
  );
}
