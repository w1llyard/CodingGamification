"use client";
import React, { useState, useEffect } from "react";
import { CardContent } from "@/Components/Dashboard/Card";
import { Image, Progress } from "@nextui-org/react";
import { motion } from "framer-motion";
import Leaderboard from "@/Components/Dashboard/leaderboard";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useUserContext } from "@/contexts/userDataContext";
import Loading from "@/Components/Loader/logos";
import { ImagesSlider } from "@/Components/Dashboard/ui/images-slider";
import { doSignOut } from "@/firebaseConfig/auth";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Toaster } from "sonner";
import { Card, CardBody, CardFooter,Spacer } from "@nextui-org/react";
import Quiz from "@/Components/Dashboard/quiz"; // Import the Quiz component

type CardItem = {
  title: string;
  img: string;
  difficulty: string;
};

export default function Dashboard() {
  const images = [
    "https://wallpaperaccess.com/full/345152.jpg",
    "https://c4.wallpaperflare.com/wallpaper/889/802/363/video-games-landscape-apocalyptic-darksiders-3-wallpaper-preview.jpg",
    "https://wallpapers.com/images/high/open-world-games-1920-x-1080-wallpaper-z8a01poggz96zme0.webp",
  ];

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const userData = useUserContext();
  const profilePic = userData.profilePic
    ? userData.profilePic
    : "https://images.saymedia-content.com/.image/c_limit%2Ccs_srgb%2Cq_auto:eco%2Cw_276/MTc2NDY0MTkxMzMzNDEwNzc4/skin-minecraft-characters-successfully-after-reading-this-minecraft-skin-info-guide.webp";
  const currentXP = userData.xp;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null); // State for selected card
  const {
    isOpen: isQuizOpen,
    onOpen: onQuizOpen,
    onOpenChange: onQuizOpenChange,
  } = useDisclosure();

  const list: CardItem[] = [
    {
      title: "Day 1",
      img: "/mcq.webp",
      difficulty: "Medium",
    },
    {
      title: "Day 2",
      img: "/mcq_completed.webp",
      difficulty: "Low",
    },
    {
      title: "Day 3",
      img: "/mcq.webp",
      difficulty: "Medium",
    },
    {
      title: "Day 4",
      img: "/mcq.webp",
      difficulty: "Medium",
    },
    {
      title: "Day 5",
      img: "/mcq.webp",
      difficulty: "High",
    },
    {
      title: "Day 6",
      img: "/mcq.webp",
      difficulty: "Medium",
    },
    {
      title: "Day 7",
      img: "/mcq.webp",
      difficulty: "Medium",
    },
    {
      title: "Day 8",
      img: "/mcq.webp",
      difficulty: "High",
    },
  ];

  const achievements = [
    {
      id: 1,
      title: "Beginner",
      xpRequired: 100,
      image: "/achievements/beginner.jpg",
      image1: "/achievements/beginner1.jpg",
    },
    {
      id: 2,
      title: "Intermediate",
      xpRequired: 500,
      image: "/achievements/intermediate.jpg",
      image1: "/achievements/intermediate1.jpg",
    },
    {
      id: 4,
      title: "Expert",
      xpRequired: 800,
      image: "/achievements/expert.jpg",
      image1: "/achievements/expert1.jpg",
    },
    {
      id: 5,
      title: "Master",
      xpRequired: 1000,
      image: "/achievements/master.jpg",
      image1: "/achievements/master1.jpg",
    },
  ];

  const nextAchievement = achievements.find(
    (achievement) => currentXP < achievement.xpRequired
  );

  const xpRemainingForNextAchievement = nextAchievement
    ? nextAchievement.xpRequired - currentXP
    : 0;

  const nextAchievementXP = nextAchievement ? nextAchievement.xpRequired : 0;
  const percentageCompletion = (currentXP / nextAchievementXP) * 100;

  const redeemCards = [
    {
      title: "Free Coffee",
      xpRequired: 200,
      image:
        "https://images.saymedia-content.com/.image/c_limit%2Ccs_srgb%2Cq_auto:eco%2Cw_276/MTc2NDY0MTkxMzMzNDEwNzc4/skin-minecraft-characters-successfully-after-reading-this-minecraft-skin-info-guide.webp",
      code: "FREECOFFEE",
    },
    {
      title: "20% on all shoes",
      xpRequired: 600,
      image:
        "https://images.saymedia-content.com/.image/c_limit%2Ccs_srgb%2Cq_auto:eco%2Cw_276/MTc2NDY0MTkxMzMzNDEwNzc4/skin-minecraft-characters-successfully-after-reading-this-minecraft-skin-info-guide.webp",
      code: "STEALDEAL20",
    },

    {
      title: "50% off on your next purchase",
      xpRequired: 1000,
      image:
        "https://images.saymedia-content.com/.image/c_limit%2Ccs_srgb%2Cq_auto:eco%2Cw_276/MTc2NDY0MTkxMzMzNDEwNzc4/skin-minecraft-characters-successfully-after-reading-this-minecraft-skin-info-guide.webp",
      code: "HALFOFF",
    },
  ];

  setTimeout(() => {
    setLoading(false);
  }, 1500);

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col gap-5 w-full  my-10">
      <section className="grid w-full grid-cols-1 gap-4  gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-3">
        <ImagesSlider
          className="h-[25rem] rounded-xl col-span-2"
          images={images}
        >
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
            <motion.p className="font-bold text-lg md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
              Learn Coding through
              <br /> Multiplayer Challenge
            </motion.p>

            <div className="button green flex ">
              <button className="">Start Journey</button>
            </div>
          </motion.div>
        </ImagesSlider>

        <div className="flex flex-col rounded-lg bg-navbarColors p-5 gap-5 shadow">
          <div className="flex items-stretch gap-4">
            <Image
              src={profilePic}
              alt="User Profile Picture"
              className="aspect-square w-20 rounded-lg object-cover"
            />

            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-lg/tight font-medium text-white">
                  Hi {userData.name}
                </h3>
              </div>

              <p className="mt-0.5 text-gray-500">{userData.email}</p>
              <LogOut
                onClick={() => {
                  doSignOut();
                  router.push("/");
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Progress
              label={`XP: ${currentXP}`}
              size="sm"
              value={percentageCompletion}
              maxValue={100}
              color="warning"
              showValueLabel={true}
              className="max-w-md"
            />
            {nextAchievement && (
              <p className="text-white text-xs">
                {xpRemainingForNextAchievement} XP needed to unlock{" "}
                {nextAchievement.title}
              </p>
            )}
          </div>
          <p className="text-white text-sm	">Achievements</p>
          <div className="grid grid-cols-3 gap-4 lg:grid-cols-6 lg:gap-8">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex flex-col items-center text-center"
              >
                <div className={"border h-12 w-12 rounded-lg"}>
                  <Image
                    src={
                      currentXP >= achievement.xpRequired
                        ? achievement.image
                        : achievement.image1
                    }
                    alt=""
                  />
                </div>
                <p className="text-xs mt-1">{achievement.title}</p>
                <p className="text-xs text-white">
                  {achievement.xpRequired} XP
                </p>
              </div>
            ))}
          </div>
          <>
            <Button onPress={onOpen}>Open Modal</Button>
            <Modal
              size="5xl"
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              className="bg-custom-bg"
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Daily Challenge
                    </ModalHeader>
                    <ModalBody>
                      <div className="gap-2 grid grid-cols-2  sm:grid-cols-4 ">
                        {list.map((item, index) => (
                          <Card
                            className=" border border-gray-600 bg-bgBlue"
                            shadow="sm"
                            key={index}
                            isPressable
                            onPress={() => {
                              setSelectedCard(item);
                              onQuizOpen();
                            }}
                          >
                            <CardBody className="overflow-visible p-0 bg-bgBlue">
                              <Image
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={item.title}
                                className="w-full object-cover h-[140px]"
                                src={item.img}
                              />
                            </CardBody>
                            <CardFooter className="text-small text-gray-200 justify-between">
                              <b>{item.title}</b>
                              <p className="text-default-500">
                                {item.difficulty}
                              </p>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-3">
        <CardContent className="lg:col-span-2">
          <p>Leaderboard</p>
          <Leaderboard />
        </CardContent>
        <CardContent className="overflow-y-auto max-h-100px no-scrollbar">
          <p>Redeem</p>
          {redeemCards.map((card, index) => {
            const redeemPercentageCompletion =
              (currentXP / card.xpRequired) * 100;
            const xpRemainingForRedeem = card.xpRequired - currentXP;
            const canRedeem = currentXP >= card.xpRequired;

            return (
              <div key={index} className="container mx-auto mb-4">
                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-center py-5 rounded-lg shadow-md relative flex flex-col items-center gap-3 mx-2">
                  <div className="flex items-center gap-5">
                    <Image
                      src={card.image}
                      alt=""
                      className="aspect-square w-10 rounded-lg object-cover"
                    />
                    <p>{card.title}</p>
                  </div>

                  <div className="flex items-center">
                    <span className="border-dashed border text-white px-4 py-2 rounded-l">
                      {canRedeem ? card.code : "*********"}
                    </span>
                    <span
                      className={`border border-white bg-white text-purple-600 px-4 py-2 rounded-r cursor-pointer ${
                        canRedeem ? "" : "opacity-50 cursor-not-allowed"
                      }`}
                    >
                      REDEEM
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Progress
                      label={`XP: ${card.xpRequired}`}
                      size="sm"
                      value={redeemPercentageCompletion}
                      maxValue={100}
                      color="warning"
                      showValueLabel={true}
                      className="max-w-md"
                    />
                    <p className="text-white text-xs">
                      {canRedeem
                        ? "You can redeem this voucher"
                        : `${xpRemainingForRedeem} XP needed to redeem the voucher`}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-navbarColors rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 -ml-6"></div>
                  <div className="w-12 h-12 bg-navbarColors rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 -mr-6"></div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </section>

      {selectedCard && (
        <Modal
          size="5xl"
          isOpen={isQuizOpen}
          onOpenChange={onQuizOpenChange}
          className="bg-custom-bg"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-5">
                  {selectedCard.title} Quiz
                </ModalHeader>
                <ModalBody>
                <Spacer y={10} />

                  <Quiz /> {/* Display the quiz here */}
                  <Spacer y={10} />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
