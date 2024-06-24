import React, { useRef, useEffect, useState } from "react";
import Phaser from "phaser";
import Preloader from "./preloader";
import Game from "./game";
import GameUI from "./scenes/GameUI";
import { sceneEvents } from "./events/EventsCenter";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig/firebase";
import { useUserContext } from "@/contexts/userDataContext";
import { AuthError } from "firebase/auth";
import { Toaster, toast } from "sonner";

const PhaserGame = ({ movement }: { movement: string }) => {
  const userData = useUserContext();
  const userEmail = userData.email as string;
  const gameRef = useRef<Phaser.Game | null>(null);
  const [inputMovement, setInputMovement] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [areAllChestsOpened, setAreAllChestsOpened] = useState(false);
  const [areTwoLizardsKilled, setAreTwoLizardsKilled] = useState(false);
  const [movedCharacter, setMovedCharacter] = useState(false);

  //save progress
  const updateProgress = async (field: string, value: boolean, xp: number) => {
    const docRef = doc(collection(db, "Users"), userEmail);
    try {
      await updateDoc(docRef, { [field]: value, xp: userData.xp + xp });
    } catch (error) {
      console.error("Error updating progress: ", (error as AuthError).message);
    }
  };

  function displayToast(field: string) {
    if (field === "movedCharacter") {
      toast.success("You earned 200xp for moving the character!");
    } else if (field === "chestOpened") {
      toast.success("You earned 300xp for opening all chests!");
    } else if (field === "lizardKilled") {
      toast.success("You earned 300xp for killing all enemies!");
    }
  }

  useEffect(() => {
    const docRef = doc(db, "Users", userEmail);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      try {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data) {
            setMovedCharacter(data.movedCharacter);
            if (data.movedCharacter) {
              setSelected((prev) => [...prev, "movement"]);
            }
            if (data.chestOpened) {
              setSelected((prev) => [...prev, "all-chests-opened"]);
            }
            if (data.lizardKilled) {
              setSelected((prev) => [...prev, "two-lizards-killed"]);
            }
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    });

    return () => unsubscribe();
  }, [userEmail]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: "phaser-container",
        width: 400,
        height: 250,
        scene: [Preloader, Game, GameUI],
        scale: {
          zoom: 1.5,
        },
        physics: {
          default: "arcade",
          arcade: {
            gravity: { x: 0, y: 0 },
          },
        },
      };

      gameRef.current = new Phaser.Game(config);

      const handleSceneReady = (gameScene: Game) => {
        gameScene.setMovementCallback(setInputMovement);
      };

      const handleSceneCreate = () => {
        const gameScene = gameRef.current?.scene.getScene("game") as Game;
        handleSceneReady(gameScene);
      };

      gameRef.current.events.on("create", handleSceneCreate);

      sceneEvents.on("all-chests-opened", async () => {
        setAreAllChestsOpened(true);
        setSelected((prev) => [...prev, "all-chests-opened"]);
        if (!areAllChestsOpened) {
          updateProgress("chestOpened", true, 300);
          displayToast("chestOpened");
        }
      });

      sceneEvents.on("two-lizards-killed", async () => {
        setAreTwoLizardsKilled(true);
        setSelected((prev) => [...prev, "two-lizards-killed"]);
        if (!areTwoLizardsKilled) {
          updateProgress("lizardKilled", true, 300);
          displayToast("lizardKilled");
        }
      });

      return () => {
        if (gameRef.current) {
          gameRef.current.destroy(true);
          gameRef.current = null;
        }
        sceneEvents.off("all-chests-opened");
        sceneEvents.off("two-lizards-killed");
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  useEffect(() => {
    // console.log("movement", movement);
    const gameScene = gameRef.current?.scene.getScene("game") as Game;
    if (movement.trim()) {
      gameScene.handleMovementCommand(movement.trim());
      setSelected((prev) => [...prev, "movement"]);
      if (!movedCharacter) {
        updateProgress("movedCharacter", true, 200);
        displayToast("movedCharacter");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movement]);

  return (
    <div>
      <Toaster richColors closeButton />
      <CheckboxGroup
        className="mb-5 flex justify-between"
        label="Challenges"
        orientation="horizontal"
        color="secondary"
        value={selected}
        onValueChange={setSelected}
        isDisabled={true}
      >
        <Checkbox value="movement">
          <p className="text-white">Move Character</p>
        </Checkbox>
        <Checkbox value="all-chests-opened">
          <p className="text-white">All Chests Opened</p>
        </Checkbox>
        <Checkbox value="two-lizards-killed">
          <p className="text-white">Two Lizards Killed</p>
        </Checkbox>
      </CheckboxGroup>
      <div id="phaser-container" />
    </div>
  );
};

export default PhaserGame;
