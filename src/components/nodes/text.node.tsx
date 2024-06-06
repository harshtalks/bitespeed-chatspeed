// Ideally each node should be in its own file, with the Node ui, settings panel and the nodes ui in the nodes panel.

import { Handle, Node, NodeProps, Position } from "reactflow";
import WhatsApp from "../icons/whatsapp";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export type TextMessageNodeProps = NodeProps<{
  message: string;
}>;

/**
 * @description TextMessage node component, this is the node UI
 *
 */
const TextMessage = ({ data, selected, id }: TextMessageNodeProps) => {
  return (
    <>
      <div
        data-selectedNode={selected}
        className="max-w-[300px] min-w-[300px] bg-white border-2 rounded-md border-transparent shadow-2xl data-[selectedNode=true]:border-blue-500"
      >
        <div className="px-4 py-2 bg-blue-400 text-white flex justify-between items-center">
          <p className="text-[12px] font-semibold">Send Message</p>
          <WhatsApp />
        </div>
        <div className="p-4 text-[16px]">{data.message}</div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#555" }}
        id={`${id}-target`}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#555" }}
        id={`${id}-source`}
      />
    </>
  );
};

/**
 * @description TextMessage node panel view, this is the node panel UI. This is how the node will look in the node panel
 *
 */
export const TextNodePanelView = () => {
  return (
    <div
      onDragStart={(event) => {
        event.dataTransfer.setData("application/reactflow", "TextMessage");
        event.dataTransfer.effectAllowed = "move";
      }}
      draggable
      className="flex w-full items-center cursor-pointer rounded-md border border-transparent focus:border-blue-500 hover:border-blue-500 transition-all bg-blue-100 gap-2 px-4 py-2 text-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="size-6 text-blue-500"
      >
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        <path d="M8 12h.01" />
        <path d="M12 12h.01" />
        <path d="M16 12h.01" />
      </svg>
      <div className="text-base font-extrabold text-blue-600">Message Node</div>
    </div>
  );
};

/**
 * @description TextMessage node settings panel, this is the node settings panel UI
 */
export const TextMessageSettingsPanel = ({
  nodePanel,
  setNodes,
  setNodePanel,
}: {
  nodePanel: Node;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setNodePanel: Dispatch<SetStateAction<Node | undefined>>;
}) => {
  const [message, setMessage] = useState(nodePanel.data.message);

  useEffect(() => {
    setMessage(nodePanel.data.message);
  }, [nodePanel]);

  return (
    <div className="max-w-[300px] min-w-[300px] p-4 h-[100%] border-l rounded-md shadow-xl bg-white">
      <div className="pb-4 border-b">
        <h1>Node Settings: {nodePanel.type}</h1>
      </div>
      <div className="py-4 space-y-5">
        <h2>
          Node ID: <strong>{nodePanel.id}</strong>
        </h2>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setNodes((nodes) => {
            const nodeIndex = nodes.findIndex((n) => n.id === nodePanel.id);
            nodes[nodeIndex].data.message = message;
            return [...nodes];
          });
        }}
        className="space-y-4"
      >
        <label
          htmlFor="message"
          className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
        >
          <span className="text-xs font-medium text-gray-700">Message</span>

          <input
            name="message"
            type="text"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
          />
        </label>

        <div className="flex gap-4 items-center">
          <button
            type="submit"
            className="group relative inline-flex items-center overflow-hidden rounded bg-indigo-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-indigo-500"
          >
            <span className="absolute -start-full transition-all group-hover:start-4">
              <svg
                className="size-5 rtl:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>

            <span className="text-sm font-medium transition-all group-hover:ms-4">
              Save Message
            </span>
          </button>
          <button
            onClick={() => setNodePanel(undefined)}
            type="button"
            className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default TextMessage;
