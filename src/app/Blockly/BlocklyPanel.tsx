import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { BlocklyWorkspace } from "react-blockly";
import { useState } from "react";
import defineCustomBlocks from "./custom-blocks";
import { CirclePlay } from "lucide-react";

interface PlayComponent {
  onPlay: (data: string) => void;
}

const BlocklyPanel: React.FC<PlayComponent> = ({ onPlay }) => {
  const [xml, setXml] = useState("");
  const initialXml = '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>';

  const toolbox = {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "repeat_until" },
      { kind: "block", type: "moveforward" },
      { kind: "block", type: "turnright" },
      { kind: "block", type: "turnleft" },
      { kind: "block", type: "if_else_move_direction" },
      { kind: "block", type: "if_do_direction" },
    ],
  };

  // Define custom blocks
  defineCustomBlocks();

  const handleGenerateJSCode = () => {
    const workspace = Blockly.getMainWorkspace();
    javascriptGenerator.addReservedWords('code');

    const jsCode = javascriptGenerator.workspaceToCode(workspace);

    onPlay(jsCode);
  };

  const handleXmlChange = (newXml: string) => {
    setXml(newXml);
  };

  return (
    <div className="flex flex-col w-full bg-white text-black border-large">
      <div className="flex justify-between p-4">
        <h1 className="font-bold text-2xl">Blockly Code</h1>
        <CirclePlay size={40} className="cursor-pointer" color="#00ff00" onClick={handleGenerateJSCode} />
      </div>

      <BlocklyWorkspace
        className="flex-1"
        initialXml={initialXml}
        toolboxConfiguration={toolbox}
        workspaceConfiguration={{
          grid: {
            spacing: 20,
            length: 3,
            colour: "#ccc",
            snap: true,
          },
        }}
        onXmlChange={handleXmlChange}
      />
      <div></div>
    </div>
  );
};

export default BlocklyPanel;
