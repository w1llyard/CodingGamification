// src/app/Game/scene/page.tsx
"use client";
import { motion } from "framer-motion";
import { ImagesSlider } from "@/Components/Dashboard/ui/images-slider";
import { StickyScroll } from "@/Components/Dashboard/ui/sticky-scroll-reveal";
import { CardContent } from "@/Components/Dashboard/Card";
import Image from "next/image";
import dynamic from "next/dynamic";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Dynamically import PhaserGame
const PhaserGame = dynamic(() => import("@/Components/Game/GameMain"), {
  ssr: false,
});

const GamePage = () => {
  const router = useRouter();

  const images = [
    "https://wallpaperaccess.com/full/345152.jpg",
    "https://c4.wallpaperflare.com/wallpaper/889/802/363/video-games-landscape-apocalyptic-darksiders-3-wallpaper-preview.jpg",
    "https://wallpapers.com/images/high/open-world-games-1920-x-1080-wallpaper-z8a01poggz96zme0.webp",
  ];
  const content = [
    {
      title: "Ruled Based Kitty",
      description:
        "Kids can learn the basics of programming with this fun and interactive game. Help the kitty reach the code by dragging and dropping commands to move forward, turn left, or turn right. Collect all the fish to win!",
      content: (
        <div className="h-full w-full flex items-center justify-center text-white relative">
          <Image
            src="/1 (1).jpg"
            width={540}
            height={400}
            className=" bg-center rounded-xl"
            alt="linear board demo"
          />
          <div className="absolute bottom-4 right-4  button red flex ">
            <Link href={"/LowcodeGame/FirstStage"}>
              <button className="">Play</button>
            </Link>
          </div>
        </div>
      ),
    },

    {
      title: "Blockly Low Code",
      description:
        "Welcome to a challenging game of strategy and navigation! Guide your character through a maze using commands to move forward, turn left, or turn right. Collect keys, avoid obstacles, and reach the goal within limited steps to win!",
      content: (
        <div className="h-full w-full flex items-center justify-center text-white relative">
          <Image
            src="/blockly.png"
            width={540}
            height={400}
            className=" bg-center rounded-xl"
            alt="linear board demo"
          />
          <div className="absolute bottom-4 right-4  button red flex ">
            <Link href={"/Blockly"}>
              <button className="">Play</button>
            </Link>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="flex flex-col gap-5 w-full  my-10">
      <section className=" grid w-full grid-cols-1">
        <ImagesSlider className="h-[25rem] rounded-xl" images={images}>
          <motion.div
            initial={{
              opacity: 0,
              y: -80,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="z-50 flex flex-col justify-center items-center"
          >
            <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
              Test yourself in the <br /> Multiplayer Challenge
            </motion.p>

            <div className="button green flex ">
              <button className="">Join Now</button>
            </div>
          </motion.div>
        </ImagesSlider>
      </section>

      <section className="grid grid-cols-1 gap-5 transition-all lg:grid-cols-3">
        <CardContent className="bg-continue-bg bg-cover bg-center lg:col-span-1 flex">
          <div className="h-40"></div>
          <motion.p className="font-bold text-3xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
            Dungeon <br /> Coder
          </motion.p>

          <div className="button green">
            <button
              onClick={() => {
                router.push("/Game/scene");
              }}
            >
              New Journey
            </button>
          </div>
        </CardContent>

        <div className="lg:col-span-2">
          {/* loop over content and render the title, description, and content for each item */}
          {content.map((item, index) => (
            <div key={item.title + index} className="my-5 flex">
              <div>
                <motion.h2
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  className="text-2xl font-bold text-slate-100"
                >
                  {" "}
                  {item.title}
                </motion.h2>
                <motion.p
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  className="text-kg text-slate-300 max-w-sm mt-5"
                >
                  {item.description}
                </motion.p>
              </div>
              {item.content}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GamePage;
