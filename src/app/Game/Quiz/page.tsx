'use client'

import Create from "../../../../pages/controller/create";
import { ImagesSlider } from "@/Components/Dashboard/ui/images-slider";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Home = () => {
  const images = [
    "https://wallpaperaccess.com/full/345152.jpg",
    "https://c4.wallpaperflare.com/wallpaper/889/802/363/video-games-landscape-apocalyptic-darksiders-3-wallpaper-preview.jpg",
    "https://wallpapers.com/images/high/open-world-games-1920-x-1080-wallpaper-z8a01poggz96zme0.webp",
  ];
  const router = useRouter();

  return (
    <div>
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
                Test yourself in the  <br /> Multiplayer Challenge
              </motion.p>


            </motion.div>
          </ImagesSlider>

          <Create />

        </section>
      </div>

    </div>
  );
};

export default Home;

