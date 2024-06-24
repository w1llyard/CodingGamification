import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";

// Ensure that custom field types are registered if necessary
Blockly.fieldRegistry.register("field_string", Blockly.FieldTextInput);

const defineCustomBlocks = () => {
  // Define custom blocks if they are not already defined
  if (!Blockly.Blocks["moveforward"]) {
    Blockly.Blocks["moveforward"] = {
      init: function () {
        this.jsonInit({
          type: "moveforward",
          message0: "move forward",

          colour: 190,
          previousStatement: null,
          nextStatement: null,
        });
      },
    };
    javascriptGenerator.forBlock["moveforward"] = function (block) {
      return `moveForward();\n`;
    };
  }

  if (!Blockly.Blocks["turnright"]) {
    Blockly.Blocks["turnright"] = {
      init: function () {
        this.jsonInit({
          type: "turnright",
          message0: "Turn %1",
          args0: [
            {
              type: "field_dropdown",
              name: "DIRECTION",
              options: [
                ["right", "RIGHT"],
                ["left", "LEFT"],
              ],
            },
          ],
          colour: 290,
          previousStatement: null,
          nextStatement: null,
        });
      },
    };
    javascriptGenerator.forBlock["turnright"] = function (block) {
      var direction = block.getFieldValue("DIRECTION");
      return `turnRight('${direction}');\n`;
    };
  }

  if (!Blockly.Blocks["turnleft"]) {
    Blockly.Blocks["turnleft"] = {
      init: function () {
        this.jsonInit({
          type: "turnleft",
          message0: "Turn %1",
          args0: [
            {
              type: "field_dropdown",
              name: "DIRECTION",
              options: [
                ["left", "LEFT"],
                ["right", "RIGHT"],
              ],
            },
          ],
          colour: 210,
          previousStatement: null,
          nextStatement: null,
        });
      },
    };
    javascriptGenerator.forBlock["turnleft"] = function (block) {
      var direction = block.getFieldValue("DIRECTION");
      return `turnLeft('${direction}');\n`;
    };
  }

  if (!Blockly.Blocks["repeat_until"]) {
    Blockly.Blocks["repeat_until"] = {
      init: function () {
        this.jsonInit({
          type: "repeat_until",
          message0: "repeat until %1",
          args0: [
            {
              type: "field_image",
              src: "LowCode/Target.png",
              width: 15,
              height: 15,
              alt: "*",
            },
          ],
          message1: "do %1",
          args1: [
            {
              type: "input_statement",
              name: "DO",
            },
          ],
          previousStatement: null,
          nextStatement: null,
          colour: 120,
          tooltip: "Repeats the statements until the condition is true.",
          helpUrl: "",
        });
      },
    };
    javascriptGenerator.forBlock["repeat_until"] = function (block) {
      var statements = javascriptGenerator.statementToCode(block, "DO");
      return `while (notAt()) {\n${statements}}\n`;
    };
  }

  if (!Blockly.Blocks["if_else_move_direction"]) {
    Blockly.Blocks["if_else_move_direction"] = {
      init: function () {
        this.jsonInit({
          type: "if_else_move_direction",
          message0: "if path %1",
          args0: [
            {
              type: "field_dropdown",
              name: "DIRECTION",
              options: [
                ["to the left", "LEFT"],
                ["to the right", "RIGHT"],
                ["ahead", "AHEAD"],
              ],
            },
          ],
          message1: "do %1",
          args1: [
            {
              type: "input_statement",
              name: "DO",
            },
          ],
          message2: "else do %1",
          args2: [
            {
              type: "input_statement",
              name: "ELSE",
            },
          ],
          previousStatement: null,
          nextStatement: null,
          colour: 210,
          tooltip:
            "If the path is to the specified direction, do the following actions; otherwise, do the alternative actions.",
          helpUrl: "",
        });
      },
    };
    javascriptGenerator.forBlock["if_else_move_direction"] = function (block) {
      var direction = block.getFieldValue("DIRECTION");
      var statementsDo = javascriptGenerator.statementToCode(block, "DO");
      var statementsElse = javascriptGenerator.statementToCode(block, "ELSE");
      return `if (pathIs('${direction}')) {\n${statementsDo}} else {\n${statementsElse}}\n`;
    };
  }

  if (!Blockly.Blocks["if_do_direction"]) {
    Blockly.Blocks["if_do_direction"] = {
      init: function () {
        this.jsonInit({
          type: "if_do_direction",
          message0: "if %1",
          args0: [
            {
              type: "field_dropdown",
              name: "DIRECTION",
              options: [
                ["to the left", "LEFT"],
                ["to the right", "RIGHT"],
                ["ahead", "AHEAD"],
              ],
            },
          ],
          message1: "do %1",
          args1: [
            {
              type: "input_statement",
              name: "DO",
            },
          ],
          previousStatement: null,
          nextStatement: null,
          colour: 210,
          tooltip:
            "Executes the block if the path is to the specified direction, then perform the actions.",
          helpUrl: "",
        });
      },
    };
    javascriptGenerator.forBlock["if_do_direction"] = function (block) {
      var direction = block.getFieldValue("DIRECTION");
      var statementsDo = javascriptGenerator.statementToCode(block, "DO");
      return `if (pathIs('${direction}')) {\n${statementsDo}}\n`;
    };
  }
};

export default defineCustomBlocks;
