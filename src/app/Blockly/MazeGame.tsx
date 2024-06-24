import React, { useEffect, useState, useRef } from "react";
import "./MazeGame.css";
import BlocklyPanel from "./BlocklyPanel";
import { toast, Toaster } from "sonner";

interface Level {
  map: number[][];
  player: { x: number; y: number };
  goal: { x: number; y: number };
  theme: string;
}

const levels: Level[] = [
  {
    map: [
      [1, 1, 1],
      [1, 0, 1],
      [1, 0, 1],
      [1, 0, 1],
      [1, 0, 1],
      [1, 1, 1],
    ],
    player: { x: 1, y: 4 },
    goal: { x: 1, y: 1 },
    theme: "default",
  },
  {
    map: [
      [1, 1, 1, 2, 2],
      [1, 0, 1, 2, 2],
      [1, 0, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 0, 1],
      [2, 2, 1, 0, 1],
      [2, 2, 1, 1, 1],
    ],
    player: { x: 3, y: 5 },
    goal: { x: 1, y: 1 },
    theme: "grassland",
  },
  {
    map: [
      [1, 1, 1, 2, 2, 2],
      [1, 0, 1, 1, 2, 2],
      [1, 0, 0, 1, 1, 2],
      [1, 1, 0, 0, 1, 1],
      [2, 1, 1, 0, 0, 1],
      [2, 2, 1, 1, 0, 1],
      [2, 2, 2, 1, 1, 1],
    ],
    player: { x: 4, y: 5 },
    goal: { x: 1, y: 1 },
    theme: "dungeon",
  },
  {
    map: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 0, 1],
      [2, 2, 2, 2, 1, 0, 1],
      [2, 2, 2, 2, 1, 1, 1],
    ],
    player: { x: 5, y: 6 },
    goal: { x: 3, y: 3 },
    theme: "dungeon",
  },
  {
    map: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 0, 1],
      [2, 2, 2, 2, 1, 0, 1],
      [2, 2, 2, 2, 1, 1, 1],
    ],
    player: { x: 5, y: 6 },
    goal: { x: 5, y: 2 },
    theme: "dungeon",
  },
  {
    map: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 0, 1],
      [2, 2, 1, 0, 0, 0, 1],
      [2, 2, 1, 1, 1, 0, 1],
      [2, 2, 2, 2, 1, 0, 1],
      [2, 2, 2, 2, 1, 0, 1],
      [2, 2, 2, 2, 1, 1, 1],
    ],
    player: { x: 5, y: 6 },
    goal: { x: 1, y: 1 },
    theme: "dungeon",
  },
];

const MazeGame: React.FC = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [rotation, setRotation] = useState(0); // Add the setRotation state hook
  const rotationRef = useRef(0);
  const playerRef = useRef(levels[0].player);
  const [player, setPlayer] = useState(levels[0].player);
  const [goal, setGoal] = useState(levels[0].goal);
  const [completedCode, setCompletedCode] = useState(""); // Add a state for the completed code

  const currentLevel = levels[currentLevelIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.keyCode === 37) {
        turnLeft();
      } else if (e.keyCode === 39) {
        turnRight();
      } else if (e.keyCode === 38) {
        moveForward();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [player]);

  const updateRotation = () => {
    setRotation(rotationRef.current);
  };

  const turnLeft = () => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
          rotationRef.current = (rotationRef.current - 90 + 360) % 360;
          updateRotation();
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 1000);
    });
  };

  const turnRight = () => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
          rotationRef.current = (rotationRef.current + 90) % 360;
          updateRotation();
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 1000);
    });
  };

  const moveForward = () => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
          const directions = [
            { dx: 0, dy: -1 },
            { dx: 1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
          ];

          const direction = directions[(rotationRef.current / 90) % 4];
          const newX = playerRef.current.x + direction.dx;
          const newY = playerRef.current.y + direction.dy;

          if (
            newX < 0 ||
            newX >= currentLevel.map[0].length ||
            newY < 0 ||
            newY >= currentLevel.map.length ||
            currentLevel.map[newY][newX] === 1
          ) {
            collide();
            reject(new Error("Collision"));
          } else {
            const newPlayer = { x: newX, y: newY };
            playerRef.current = newPlayer;
            setPlayer(newPlayer);
            if (checkGoal(newX, newY)) {
              document.getElementById("congratsModal")!.style.display = "flex";
            }
            resolve();
          }
        } catch (error) {
          reject(error);
        }
      }, 1000);
    });
  };

  const collide = () => {
    const playerEl = document.getElementById("player");
    if (playerEl) {
      playerEl.classList.add("collide");
      setTimeout(() => playerEl.classList.remove("collide"), 200);
    }
    resetPlayer();
    throw new Error("Collision");
  };

  const resetPlayer = () => {
    const level = levels[currentLevelIndex];
    setPlayer(level.player);
    playerRef.current = level.player;
    rotationRef.current = 0;
    setRotation(0);
  };

  const checkGoal = (x: number, y: number) => {
    if (x === goal.x && y === goal.y) {
      return true;
    }
    return false;
  };

  const changeLevel = () => {
    const newIndex = (currentLevelIndex + 1) % levels.length;
    setCurrentLevelIndex(newIndex);
    loadLevel(levels[newIndex]);
    document.getElementById("congratsModal")!.style.display = "none";
  };

  const loadLevel = (level: Level) => {
    setPlayer(level.player);
    playerRef.current = level.player;
    setGoal(level.goal);
    rotationRef.current = 0;
    setRotation(0);
    document.querySelector("#game-container-1")!.className =
      "game-container " + level.theme;
  };

  const createTile = (x: number, y: number, type: string) => (
    <div
      className={type}
      style={{ width: "32px", height: "32px", left: x * 32, top: y * 32 }}
      key={`${x}-${y}`}
    ></div>
  );

  const createPlayerOrGoal = (
    sprite: { x: number; y: number },
    type: string
  ) => (
    <div
      id={type}
      className={type}
      style={{
        width: "32px",
        height: "32px",
        left: sprite.x * 32,
        top: sprite.y * 32,
        borderRadius: "32px",
        transform: type === "player" ? `rotate(${rotation}deg)` : undefined,
        zIndex: type === "player" ? 1 : 0,
      }}
    ></div>
  );

  const addAwaitToFunctions = (code: string) => {
    // Define the functions to target
    const functionsToAwait = ["moveForward()", "turnLeft(", "turnRight("];

    // Iterate through each function and add await if not already present
    functionsToAwait.forEach((func) => {
      let escapedFunc = func.replace(/\(/g, "\\(").replace(/\)/g, "\\)"); // Escape both '(' and ')'
      let regex = new RegExp(`${escapedFunc}`, "g");
      code = code.replace(regex, `await ${func}`);
    });

    code = `(async () => { ${code} })();`;

    return code;
  };

  const playGame = async (jsCode: string) => {
    const code = addAwaitToFunctions(jsCode);
    console.log(code);
    try {
      await eval(code);
      setCompletedCode(jsCode); // Set the completed code when the level is completed
    } catch (error) {
      toast.error("Collision");
    }
  };

  function notAt() {
    return !checkGoal(playerRef.current.x, playerRef.current.y);
  }

  function pathIs(direction: string) {
    const directions: any = {
      LEFT: { dx: -1, dy: 0 },
      RIGHT: { dx: 1, dy: 0 },
      AHEAD: { dx: 0, dy: -1 },
      DOWN: { dx: 0, dy: 1 },
    };

    const { dx, dy } = directions[direction];
    const newX = playerRef.current.x + dx;
    const newY = playerRef.current.y + dy;

    if (
      newX < 0 ||
      newX >= currentLevel.map[0].length ||
      newY < 0 ||
      newY >= currentLevel.map.length
    ) {
      return false;
    }

    return currentLevel.map[newY][newX] !== 1;
  }

  return (
    <div className="w-screen h-screen p-8">
      <Toaster position="top-center" richColors closeButton />
      <div className="flex h-full rounded-large overflow-hidden">
        <div className=" flex flex-col w-6/12 bg-white p-4">
          <div
            id="game-container-1"
            className={`flex items-center justify-center flex-1 ${currentLevel.theme} `}
          >
            <div id="map-and-controls">
              <div
                id="game-map-1"
                className="game-map"
                style={{
                  height: currentLevel.map.length * 32,
                  width: currentLevel.map[0].length * 32,
                }}
              >
                <div id="tiles" className="layer">
                  {currentLevel.map.map((row, y) =>
                    row.map((tileCode, x) =>
                      createTile(x, y, ["floor", "wall"][tileCode])
                    )
                  )}
                </div>
                <div id="sprites" className="layer">
                  {createPlayerOrGoal(player, "player")}
                  {createPlayerOrGoal(goal, "goal")}
                </div>
              </div>
            </div>

            <div id="congratsModal" className="modals">
              <div className="modal-content text-black">
                <p className="text-lg">Congratulations! You reached the goal!</p>
                <p className="text-left text-sm">Here is a version of your code:</p>
                
                <div className="mockup-code">
                  <pre className="text-left">
                    <code className="px-8 block">{completedCode}</code>
                  </pre>
                </div>
                <button id="nextLevelBtn" onClick={changeLevel}>
                  Next Level
                </button>
              </div>
            </div>
          </div>
        </div>
        <BlocklyPanel onPlay={playGame} />
      </div>
    </div>
  );
};

export default MazeGame;
