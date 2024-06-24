import React from "react";

const DroppableBox: React.FC<{
  index: number;
  element: JSX.Element | null;
  onDrop: (index: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, element: JSX.Element | null, index: number) => void;
  onClick: (index: number) => void;
}> = ({ index, element, onDrop, onDragOver, onDragStart, onClick }) => (
  <div
    className="w-12 h-12 border-2 border-dotted border-gray-400 flex items-center justify-center"
    onDrop={() => onDrop(index)}
    onDragOver={onDragOver}
    onDragStart={(e) => onDragStart(e, element, index)}
    draggable
    onClick={() => onClick(index)}
  >
    {element}
  </div>
);

export default DroppableBox;
