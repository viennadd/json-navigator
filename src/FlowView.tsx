"use client";
 
import { Background, Edge, ReactFlow, Node } from "@xyflow/react";
import { DatabaseSchemaNode } from "@/components/database-schema-node";

 
const defaultNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    type: "databaseSchema",
    data: {
      label: "Products",
      schema: [
        { title: "id", type: "uuid" },
        { title: "name", type: "varchar" },
        { title: "description", type: "varchar" },
        { title: "warehouse_id", type: "uuid" },
        { title: "supplier_id", type: "uuid" },
        { title: "price", type: "money" },
        { title: "quantity", type: "int4" },
      ],
    },
  },
  {
    id: "2",
    position: { x: 350, y: -100 },
    type: "databaseSchema",
    data: {
      label: "Warehouses",
      schema: [
        { title: "id", type: "uuid" },
        { title: "name", type: "varchar" },
        { title: "address", type: "varchar" },
        { title: "capacity", type: "int4" },
      ],
    },
  },
  {
    id: "3",
    position: { x: 350, y: 200 },
    type: "databaseSchema",
    data: {
      label: "Suppliers",
      schema: [
        { title: "id", type: "uuid" },
        { title: "name", type: "varchar" },
        { title: "description", type: "varchar" },
        { title: "country", type: "varchar" },
      ],
    },
  },
];
 
const defaultEdges: Edge[] = [
  {
    id: "products-warehouses",
    source: "1",
    target: "2",
    sourceHandle: "warehouse_id",
    targetHandle: "id",
  },
  {
    id: "products-suppliers",
    source: "1",
    target: "3",
    sourceHandle: "supplier_id",
    targetHandle: "id",
  },
];


const getLayoutedElements = (nodes, edges, options) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: options.direction });
 
  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    }),
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
 
export default function FlowView() {
  return (
    <div className="h-full w-full">
      <ReactFlow
        colorMode="dark"
        defaultNodes={defaultNodes}
        defaultEdges={defaultEdges}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
      </ReactFlow>
    </div>
  );
}