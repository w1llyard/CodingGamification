// Key.js
import React from "react";
import { IsometricCube } from "isometric-react";

interface Position {
  position: { top: number; left: number };
}

const Key: React.FC<Position> = ({ position}) => {
  return (
    <IsometricCube
      position={{
        top: position.top * 5,
        left: position.left * 5,
        elevation: 0,
      }}
      color="#ffffff00"
      depth={5}
      width={5}
      height={5}
    >
      <img alt="Key" src="/LowCode/key.png" style={{ width: "100%" }} />
    </IsometricCube>
  );
};

export default Key;
