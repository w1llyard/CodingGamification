import React from "react";
import { IsometricCube } from "isometric-react";

interface ObstacleProps {
  position: { top: number; left: number };
}

const Obstacle: React.FC<ObstacleProps> = ({ position }) => {
  return (
    <IsometricCube
      key={`obstacle-${position.top}-${position.left}`}
      position={{
        top: position.top * 5,
        left: position.left * 5,
        elevation: 5,
      }}
      color="transparent"
      depth={1}
      width={5}
      height={5}
      border={{ color: "#ff0000", size: "1px", style: "solid" }}
    >
      <img src="/LowCode/lava.gif" alt="" />
      <img src="/LowCode/lava.gif" alt="" />
      <img src="/LowCode/lava.gif" alt="" />
    </IsometricCube>
  );
};

export default Obstacle;
