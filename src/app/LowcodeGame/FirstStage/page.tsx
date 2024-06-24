"use client";

import React, { useState, useRef, useEffect } from "react";
import Level from "./Level";
import CodePanel from "./Codepanel";
import Link from "next/link";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig/firebase";
import { useUserContext } from "@/contexts/userDataContext";
import { AuthError } from "firebase/auth";
import Loading from "@/Components/Loader/logos";
import { Toaster, toast } from "sonner";

const levels = [
  {
    id: 1,
    size: { width: 3, height: 5 },
    initialPosition: { top: 0, left: 1 },
    goalPosition: { top: 3, left: 1 },
    numBox: 3,
    xp: 100,
  },
  {
    id: 2,
    size: { width: 6, height: 12 },
    initialPosition: { top: 1, left: 1 },
    goalPosition: { top: 10, left: 5 },
    keyPosition: { top: 5, left: 5 },
    obstacles: [
      { top: 3, left: 2 },
      { top: 4, left: 4 },
      { top: 7, left: 1 },
    ],
    numBox: 26,
    xp: 200,
  },
  // Add more levels as needed
];

const directions = ["south", "west", "north", "east"];

const App: React.FC = () => {
  const userData = useUserContext();
  const [loading, setLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(0);
  const level = levels[currentLevel];
  const [characterPosition, setCharacterPosition] = useState(
    level.initialPosition
  );
  const [characterDirection, setCharacterDirection] = useState(0); // Start facing south

  const positionRef = useRef(characterPosition);
  const directionRef = useRef(characterDirection);
  const hasCollectedKeyRef = useRef(false);

  useEffect(() => {
    positionRef.current = characterPosition;
  }, [characterPosition]);

  useEffect(() => {
    directionRef.current = characterDirection;
  }, [characterDirection]);

  useEffect(() => {
    // Reset position, direction, and key collection when the level changes
    resetCharacterPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevel]);

  useEffect(() => {
    async function checkProgress() {
      try {
        const docRef = doc(db, "Users", userData.email as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setCurrentLevel(data.lowCodeLevel);
        }
      } catch (error) {
        console.error("Error retrieving team data:", error);
      } finally {
        setLoading(false);
      }
    }
    checkProgress();
  }, [userData.email]);

  //save progress
  async function saveProgress(nextLevel: number) {
    const usersCollection = collection(db, "Users");
    const docRef = doc(usersCollection, userData.email as string);
    try {
      await updateDoc(docRef, {
        lowCodeLevel: nextLevel,
        xp: userData.xp + level.xp,
      });
    } catch (error) {
      console.log("Error: ", (error as AuthError).message);
      return false;
    }
  }

  const validateMove = (newPosition: { top: number; left: number }) => {
    // Check bounds
    if (
      newPosition.top < 0 ||
      newPosition.top >= level.size.height ||
      newPosition.left < 0 ||
      newPosition.left >= level.size.width
    ) {
      toast.error("Move is out of bounds");
      return false;
    }
    // Check obstacles
    if (
      level.obstacles?.some(
        (obstacle) =>
          obstacle.top === newPosition.top && obstacle.left === newPosition.left
      )
    ) {
      toast.error("Move is into an obstacle");
      return false;
    }
    return true;
  };

  const moveForward = () => {
    const newPosition = { ...positionRef.current };
    switch (directions[directionRef.current]) {
      case "north":
        newPosition.top -= 1;
        break;
      case "east":
        newPosition.left += 1;
        break;
      case "south":
        newPosition.top += 1;
        break;
      case "west":
        newPosition.left -= 1;
        break;
      default:
        break;
    }
    if (validateMove(newPosition)) {
      positionRef.current = newPosition; // Update the positionRef before setting state
      setCharacterPosition(newPosition);
      // Check if the new position is the key position
      if (
        level.keyPosition &&
        newPosition.top === level.keyPosition.top &&
        newPosition.left === level.keyPosition.left
      ) {
        hasCollectedKeyRef.current = true;
        toast.info("Key collected");
      }
      return true;
    } else {
      toast.error("Invalid move");
      return false;
    }
  };

  const rotateClockwise = () => {
    setCharacterDirection((prevDirection) => {
      const newDirection = (prevDirection + 1) % 4;
      directionRef.current = newDirection; // Update the directionRef
      return newDirection;
    });
  };

  const rotateAnticlockwise = () => {
    setCharacterDirection((prevDirection) => {
      const newDirection = (prevDirection - 1 + 4) % 4;
      directionRef.current = newDirection; // Update the directionRef
      return newDirection;
    });
  };

  const resetCharacterPosition = () => {
    const level = levels[currentLevel];
    positionRef.current = level.initialPosition; // Reset the positionRef
    setCharacterPosition(level.initialPosition);
    setCharacterDirection(0); // Reset direction to south
    directionRef.current = 0; // Reset the directionRef
    hasCollectedKeyRef.current = false; // Reset key collection status
  };

  const executeAction = async (data: number[]) => {
    for (let i = 0; i < data.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800)); // 0.8-second delay for each action
      let actionSuccess;
      if (data[i] === 1) {
        actionSuccess = moveForward();
      } else if (data[i] === 2) {
        rotateClockwise();
        actionSuccess = true; // Rotation is always successful
      } else {
        rotateAnticlockwise();
        actionSuccess = true; // Rotation is always successful
      }

      if (!actionSuccess) {
        toast.error("Stopping further actions due to invalid move");
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
        resetCharacterPosition();
        return false;
      }
    }
    // Check if character is at goal position and has collected the key if required
    if (
      (level.keyPosition && !hasCollectedKeyRef.current) ||
      positionRef.current.top !== level.goalPosition.top ||
      positionRef.current.left !== level.goalPosition.left
    ) {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
      resetCharacterPosition();
      return false;
    }
    return true;
  };

  const changeLevel = () => {
    setCurrentLevel((prevLevel) => {
      const nextLevel = (prevLevel + 1) % levels.length;
      saveProgress(nextLevel);
      return nextLevel;
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="relative h-screen w-screen bg-custom-bg">
      <Toaster position="top-center" richColors closeButton />
      <Link href="/Game/levels">
        <h3 className="m-5 text-lg/tight font-small text-white">{"<"} Back</h3>
      </Link>
      <Level
        level={level}
        characterPosition={characterPosition}
        characterDirection={characterDirection}
        hasCollectedKey={hasCollectedKeyRef.current}
      />
      <CodePanel
        id={level.id}
        numBoxes={level.numBox}
        handlePlayCode={executeAction}
        onPlayNextLevel={changeLevel}
        onRetry={resetCharacterPosition}
        xp={level.xp}
      />
    </div>
  );
};

export default App;
