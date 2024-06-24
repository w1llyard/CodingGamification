import React from "react";
import { IsometricCube } from "isometric-react";

interface GoalProps {
  position: { top: number; left: number };
}

const Goal: React.FC<GoalProps> = ({ position }) => {
  return (
    <IsometricCube
      key={`goal`}
      position={{
        top: position.top * 5,
        left: position.left * 5,
        elevation: 5,
      }}
      color="transparent"
      depth={5}
      width={5}
      height={5}
    >
      <div></div>
      <div></div>
      <div></div>
      <img src="/LowCode/target.png" alt="" />
    </IsometricCube>
  );
};

export default Goal;
