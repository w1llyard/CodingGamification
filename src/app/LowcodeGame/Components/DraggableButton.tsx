import React from "react";

const DraggableButton: React.FC<{
  color: string;
  icon: JSX.Element;
  onDragStart: (e: React.DragEvent<HTMLButtonElement>, element: JSX.Element) => void;
  onClick: (element: JSX.Element) => void;
}> = ({ color, icon, onDragStart, onClick }) => (
  <button
    className={`w-12 h-12 ${color} text-white font-bold rounded flex items-center justify-center`}
    draggable
    onDragStart={(e) =>
      onDragStart(
        e,
        <button
          className={`w-12 h-12 ${color} text-white font-bold rounded flex items-center justify-center`}
        >
          {icon}
        </button>
      )
    }
    onClick={() =>
      onClick(
        <button
          className={`w-12 h-12 ${color} text-white font-bold rounded flex items-center justify-center`}
        >
          {icon}
        </button>
      )
    }
  >
    {icon}
  </button>
);

export default DraggableButton;
