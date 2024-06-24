"use client";

import React, { useState, useEffect } from "react";
import DraggableButton from "../Components/DraggableButton";
import DroppableBox from "../Components/DroppableBox";
import { RotateCw, RotateCcw, ArrowBigRightDash, Trash2 } from "lucide-react";
import Image from "next/image";

const buttonOptions = [
  {
    id: 1,
    color: "bg-blue-500 hover:bg-blue-700",
    name: "Forward",
    icon: <ArrowBigRightDash />,
  },
  {
    id: 2,
    color: "bg-green-500 hover:bg-green-700",
    name: "Clockwise",
    icon: <RotateCw />,
  },
  {
    id: 3,
    color: "bg-green-500 hover:bg-green-700",
    name: "Anti-clockwise",
    icon: <RotateCcw />,
  },
];

interface CodePanelProps {
  id: number;
  numBoxes: number;
  xp: number;
  handlePlayCode: (data: number[]) => Promise<boolean>;
  onPlayNextLevel: () => void;
  onRetry: () => void;
}

const CodePanel: React.FC<CodePanelProps> = ({
  id,
  numBoxes,
  xp,
  handlePlayCode,
  onPlayNextLevel,
  onRetry,
}) => {
  const [draggedElement, setDraggedElement] = useState<{
    id: number;
    element: JSX.Element;
  } | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [droppedElements, setDroppedElements] = useState<
    Array<{ id: number; element: JSX.Element } | null>
  >(Array(numBoxes).fill(null));
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setDroppedElements(Array(numBoxes).fill(null));
  }, [numBoxes]);

  const handleDragStart = (
    e: React.DragEvent<HTMLButtonElement | HTMLDivElement>,
    id: number,
    element: JSX.Element,
    index: number | null = null
  ) => {
    setDraggedElement({ id, element });
    setDraggedIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedElement !== null) {
      const newDroppedElements = [...droppedElements];
      if (draggedIndex !== null) {
        const temp = newDroppedElements[index];
        newDroppedElements[index] = newDroppedElements[draggedIndex];
        newDroppedElements[draggedIndex] = temp;
      } else {
        newDroppedElements[index] = draggedElement;
      }
      setDroppedElements(newDroppedElements);
      setDraggedElement(null); // Clear the dragged element
      setDraggedIndex(null); // Clear the dragged index
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleButtonClick = (id: number, element: JSX.Element) => {
    const newDroppedElements = [...droppedElements];
    const firstEmptyIndex = newDroppedElements.findIndex((e) => e === null);
    if (firstEmptyIndex !== -1) {
      newDroppedElements[firstEmptyIndex] = { id, element };
      setDroppedElements(newDroppedElements);
    }
  };

  const handleDroppedButtonClick = (index: number) => {
    const newDroppedElements = [...droppedElements];
    newDroppedElements[index] = null;
    setDroppedElements(newDroppedElements);
  };

  const clearAllDroppedItems = () => {
    setDroppedElements(Array(numBoxes).fill(null));
  };

  const handlePlayButtonClick = async () => {
    setIsPlaying(true);
    const ids = droppedElements
      .filter((value) => value)
      .map((value) => value?.id) as number[];

    const success = await handlePlayCode(ids);
    setIsPlaying(false);
    setIsSuccess(success);
  };

  const handleRetryButton = () => {
    setDroppedElements(Array(numBoxes).fill(null));
    setIsSuccess(false);
    onRetry();
  };

  const handlePlayNextLevel = () => {
    setDroppedElements(Array(numBoxes).fill(null));
    setIsSuccess(false);
    onPlayNextLevel();
  };

  const isPlayButtonDisabled =
    isPlaying || droppedElements.every((e) => e === null);

  return (
    <div className="fixed right-8 top-8 custom-artboard bg-artboardColor bg-art-bg bg-cover bg-center text-white rounded-lg shadow-lg p-8 w-[450px]">
      {isSuccess ? (
        <>
          <div className="text-2xl font-bold mb-4 text-center">SUCCESS</div>
          <div className="flex space-x-4 mb-4 justify-center">
            <Image
              src="/LowCode/firework.png"
              width={300}
              height={300}
              alt="Success"
            />
          </div>
          <div className="flex justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handlePlayNextLevel}
            >
              Play next level
            </button>
            <button
              className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              onClick={handleRetryButton}
            >
              Retry
            </button>
          </div>
        </>
      ) : (
        <>
          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-lg/tight font-medium text-white">
                Quest #{id}/2
              </h3>
              <button
                className="text-gray-400 hover:text-gray-200"
                onClick={clearAllDroppedItems}
              >
                <Trash2 color="#ffffff" />
              </button>
            </div>
            <p className="mt-0.5 text-gray-500">
              You, the young coder, have arrived in the Kingdom of Java. The
              first task given to you by the King is to greet Princess Java. You
              shall be rewarded later through the journey.
            </p>

            <progress
              className="progress progress-error w-56"
              value="10"
              max="100"
            ></progress>
            <p className="text-white text-xs">{xp} XP.</p>
          </div>
          <div className="flex flex-wrap mt-4 gap-2">
            {droppedElements.map((item, index) => (
              <DroppableBox
                key={index}
                index={index}
                element={item?.element || null}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragStart={(e) =>
                  handleDragStart(
                    e,
                    item?.id || 0,
                    item?.element || <div />,
                    index
                  )
                }
                onClick={() => handleDroppedButtonClick(index)}
              />
            ))}
          </div>

          <br />
          <hr />
          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-2">
              {buttonOptions.map((option) => (
                <DraggableButton
                  key={option.id}
                  color={option.color}
                  icon={option.icon}
                  onDragStart={(e) =>
                    handleDragStart(
                      e,
                      option.id,
                      <button
                        key={option.id}
                        className={`w-12 h-12 ${option.color} text-white font-bold rounded flex items-center justify-center`}
                      >
                        {option.icon}
                      </button>
                    )
                  }
                  onClick={() =>
                    handleButtonClick(
                      option.id,
                      <button
                        key={option.id}
                        className={`w-12 h-12 ${option.color} text-white font-bold rounded flex items-center justify-center`}
                      >
                        {option.icon}
                      </button>
                    )
                  }
                />
              ))}
            </div>
            <div className="button green flex ">
              <button
                className={`bg-gray-800 ${
                  isPlayButtonDisabled
                    ? "bg-gray-600 cursor-not-allowed"
                    : "hover:bg-gray-800"
                } text-white font-bold py-2 px-4 rounded flex items-center`}
                onClick={handlePlayButtonClick}
                disabled={isPlayButtonDisabled}
              >
                Play code
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CodePanel;
