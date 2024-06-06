import { useState, useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  Panel,
  NodeTypes,
  Node,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from "reactflow";
import "reactflow/dist/style.css";
import TextMessage, {
  TextMessageSettingsPanel,
  TextNodePanelView,
} from "./components/nodes/text.node";
import { toast } from "sonner";

const customNodes: NodeTypes = {
  TextMessage: TextMessage,
};

function Flow() {
  // nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // connecting nodes
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((oldEdges) => addEdge(connection, oldEdges));
    },
    [setEdges]
  );

  // node panel - local state
  const [nodePanel, setNodePanel] = useState<Node>();

  return (
    <div style={{ height: "100%" }}>
      <ReactFlow
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodes={nodes}
        edges={edges}
        nodeTypes={customNodes}
        onNodeClick={(_, node) => {
          setNodePanel(node);
        }}
        onConnect={onConnect}
        onDrop={(event) => {
          event.preventDefault();

          const type = event.dataTransfer.getData("application/reactflow");

          // check if the dropped element is valid
          if (typeof type === "undefined" || !type) {
            return;
          }

          const position = {
            x: event.clientX,
            y: event.clientY,
          };

          const newNode = {
            id: (nodes.length + 1).toString(),
            type,
            position,
            data: { message: `new ${type} node added` },
          };

          setNodes((nds) => nds.concat(newNode));
        }}
        onDragOver={(evn) => {
          evn.preventDefault();
          evn.dataTransfer.dropEffect = "move";
        }}
      >
        <Background />
        <Controls />
        <Panel position={"top-right"}>
          <div className="min-w-[300px] p-4 h-[100%] border-l rounded-md shadow-xl bg-gray-50 mb-4">
            <button
              disabled={nodes.length === 0}
              onClick={() => {
                // if nodes length is greater than 1
                if (nodes.length > 1) {
                  // we got unique target handles
                  const targetHandles = new Set(
                    edges.map((edge) => edge.target)
                  );

                  // check if all the nodes, except the first one, have a target handle
                  const allNodesHaveTargetHandle = nodes
                    .slice(1)
                    .every((node) => targetHandles.has(node.id));

                  // if not, alert the user
                  if (!allNodesHaveTargetHandle) {
                    toast.error("All nodes must have a target handle");
                    return;
                  }

                  // TODO save the flow to the store, i.e. local storage, database, etc.
                }
                toast.success("Flow has been saved successfully");
              }}
              className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              Save Data
            </button>
          </div>
          {!nodePanel ? (
            <div>
              <div className="min-w-[300px] p-4 h-[100%] border-l rounded-md shadow-xl bg-white">
                <div className="pb-4 border-b">
                  <h1>Node Panel</h1>
                </div>
                <div className="space-y-4 py-4">
                  <button
                    className="w-full"
                    onClick={() => {
                      const newNode: Node = {
                        id: (nodes.length + 1).toString(),
                        data: { message: "this is a test message" },
                        // add shift to the position based on current index
                        position: {
                          x: 100 + nodes.length * 100,
                          y: 100 + nodes.length * 100,
                        },

                        type: "TextMessage",
                      };

                      setNodes([...nodes, newNode]);
                    }}
                  >
                    <TextNodePanelView />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <TextMessageSettingsPanel
                setNodePanel={setNodePanel}
                nodePanel={nodePanel}
                setNodes={setNodes}
              />
            </div>
          )}
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default Flow;
