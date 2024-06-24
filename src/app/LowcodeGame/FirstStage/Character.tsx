import React from "react";
import { IsometricCube } from "isometric-react";

interface CharacterProps {
  position: { top: number; left: number };
  direction: number;
}

const Character: React.FC<CharacterProps> = ({ position, direction }) => {
  return (
    <div id="character" className="transition duration-100" style={{ transform: "translateZ(5rem)" }}>
      <IsometricCube
        key={`character`}
        position={{
          top: position.top * 5,
          left: position.left * 5,
          elevation: 5, // Adjust elevation if needed
        }}
        color="#ffffff"
        depth={5}
        width={5}
        height={5}
        border={{ color: "#000000", size: "1px", style: "solid" }}
        className={`!transform transition rotate-${direction * 90}`}
      >
        <img src="/LowCode/character_top.png" alt="" />
        <img src="/LowCode/character_face.png" alt="" />
        <img src="/LowCode/character_left.png" alt="" />
        <img src="/LowCode//character_side.png" alt="" />
        <img src="/LowCode/character_back.png" alt="" />
        <img src="/LowCode/character_left.png" alt="" />
      </IsometricCube>
      <div className="rotate-0"></div>
      <div className="rotate-90"></div>
      <div className="rotate-270"></div>
    </div>
  );
};

export default Character;
