import React from "react";
import {
  Isometric,
  IsometricContainer,
  IsometricCube,
  IsometricGrid,
} from "isometric-react";
import Character from "./Character";
import Goal from "./Goal";
import Obstacle from "./Obstacle";
import Key from "./Key";

interface LevelProps {
  level: any;
  characterPosition: { top: number; left: number };
  characterDirection: number;
  hasCollectedKey: boolean; // Add hasCollectedKey prop
}

const Level: React.FC<LevelProps> = ({
  level,
  characterPosition,
  characterDirection,
  hasCollectedKey, // Destructure hasCollectedKey
}) => {
  const { width, height } = level.size;
  const blockImageTop = "/LowCode/block_top.png";
  const blockImageSide = "/LowCode/block_side.png";

  const generateBlocks = () => {
    const blocks = [];
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        blocks.push(
          <IsometricCube
            key={`${row}-${col}`}
            position={{ top: row * 5, left: col * 5, elevation: 0 }}
            color="#ffffff"
            depth={5}
            width={5}
            height={5}
            border={{
              size: "0.5px",
              style: "solid",
              color: "#000000",
            }}
          >
            <img alt="" src={blockImageTop} style={{ width: "100%" }} />
            <img alt="" src={blockImageSide} style={{ width: "100%" }} />
            <img alt="" src={blockImageSide} style={{ width: "100%" }} />
          </IsometricCube>
        );
      }
    }
    return <>{blocks}</>; // Return a React fragment containing the blocks
  };

  return (
    <IsometricContainer>
      <Isometric className="">
        <IsometricGrid
          size={5}
          sizeMultiplier={{
            width: width,
            height: height,
          }}
          lineweight={1}
          color="red"
        >
          {generateBlocks()}
          <Character position={characterPosition} direction={characterDirection} />
          <Goal position={level.goalPosition} />
          {level.obstacles?.map((obstacle: any, index: number) => (
            <Obstacle key={index} position={obstacle} />
          ))}
          {level.keyPosition && !hasCollectedKey && <Key position={level.keyPosition} />}
        </IsometricGrid>
      </Isometric>
    </IsometricContainer>
  );
};

export default Level;
