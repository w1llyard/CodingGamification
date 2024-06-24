"use client";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";

import React, { useRef, useState, useEffect } from "react";
import CodeEditor from "@/Components/code/CodeEditor";
import * as monaco from "monaco-editor";
import Output from "@/Components/code/Output";
import { CODE_SNIPPETS } from "@/Components/code/constants";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Code,
} from "@nextui-org/react";
import printMessagesJson from "@/data/lang.json";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Toaster, toast } from "sonner"; // Import toast
import { Meteors } from "@/Components/Dashboard/ui/meteors";
type ContentItem = {
  type: "h1" | "h2" | "p" | "code";
  text: string | string[];
};

type PrintMessages = {
  [key: string]: {
    title: string;
    content: ContentItem[];
  };
};

const printMessages: PrintMessages = printMessagesJson as PrintMessages;
const PhaserGame = dynamic(() => import("@/Components/Game/GameMain"), {
  ssr: false,
});

export default function Scene() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [value, setValue] = useState<string>(CODE_SNIPPETS["javascript"]);
  const [language1, setLanguage1] = useState<string>("javascript");
  const [language, setLanguage] = useState<string>("javascript");
  const [isRepeat, setIsRepeat] = useState<string>(""); // Add this line

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [output, setOutput] = useState<string[]>([]);

  const renderContent = () => {
    const content = printMessages[language1]?.content || [];
    return content.map((item, index) => {
      switch (item.type) {
        case "h2":
          return (
            <h2 key={index} className="text-xl font-semibold mb-2">
              {item.text}
            </h2>
          );
        case "p":
          return (
            <p key={index} className="my-2">
              {item.text}
            </p>
          );
        case "code":
          return (
            <Code key={index} size="sm">
              {Array.isArray(item.text)
                ? item.text.map((line, i) => <p key={i}>{line}</p>)
                : item.text}
            </Code>
          );
        default:
          return null;
      }
    });
  };

  useEffect(() => {
    if (isRepeat) {
      toast(`isRepeat: ${isRepeat}`);
    }
  }, [isRepeat]);

  return (
    <div className="flex flex-col gap-2 w-full mb-10 mt-5 ">
      <Toaster />
      <Link href="/Game">
        <h3 className="text-lg/tight font-small text-white">{"<"} Back</h3>
      </Link>
      <section
        className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-2"
        style={{ height: "calc(100vh - 70px)" }}
      >
        <div className="flex flex-col rounded-lg bg-navbarColors p-5 gap-5 shadow border border-gray-600  overflow-auto">
          <div className="flex flex-col rounded-lg bg-navbarColors gap-5">
            {/* <div className="flex items-stretch gap-4">
                            <img
                                src="https://images.saymedia-content.com/.image/c_limit%2Ccs_srgb%2Cq_auto:eco%2Cw_276/MTc2NDY0MTkxMzMzNDEwNzc4/skin-minecraft-characters-successfully-after-reading-this-minecraft-skin-info-guide.webp"
                                alt=""
                                className="aspect-square w-20 rounded-lg object-cover"
                            />
                            <div>
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg/tight font-medium text-white">Quest #1/25</h3>
                                </div>
                                <p className="mt-0.5 text-gray-500">
                                    You, the young coder, have arrived in the Kingdom of Java. The first task given to you by the King is to greet Princess Java. You shall be rewarded later through the journey.
                                </p>
                                <progress className="progress progress-error w-56" value="10" max="100"></progress>
                                <p className='text-white text-xs'>{isRepeat}</p>
                            </div>
                        </div> */}
            <div className="">
              <div className=" w-full relative ">
                <div className="absolute inset-0 h-full w-full  rounded-full blur-3xl" />
                <div className="relative shadow-sm border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
                  <div className="h-5 w-5 rounded-full border flex items-center justify-center mb-4 border-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-2 w-2 text-gray-300"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25"
                      />
                    </svg>
                  </div>

                  <h1 className="font-bold text-xl text-white mb-4 relative z-50">
                    Dungeon Quest Guide
                  </h1>

                  <p className="font-normal text-base text-slate-500 mb-4 relative z-50">
                    I don&apos;t know what to write so I&apos;ll just paste
                    something cool here. One more sentence because lorem ipsum
                    is just unacceptable. Won&apos;t ChatGPT the shit out of
                    this.
                  </p>

                  <div className="flex gap-5">
                    <button
                      onClick={onOpen}
                      className="border px-4 py-1 rounded-lg  border-gray-500 text-gray-300"
                    >
                      Guide
                    </button>
                  </div>

                  {/* Meaty part - Meteor effect */}
                  <Meteors number={30} />
                </div>
              </div>
            </div>
            {/* <div className="flex gap-2 items-end justify-between">
                            <p className='text-white text-sm'><strong>Task: </strong>Print a greeting message.</p>
                            <Button isIconOnly color="danger" onPress={onOpen} aria-label="Help">
                                <FileQuestion />
                            </Button>
                        </div> */}
          </div>
          <CodeEditor
            editorRef={editorRef}
            value={value}
            setValue={setValue}
            language={language}
            setLanguage={setLanguage}
          />
        </div>
        <div className="flex flex-col rounded-lg bg-navbarColors p-5 gap-5 shadow border border-gray-600  overflow-auto">
          <Output
            editorRef={editorRef}
            language={language}
            setOutput={setOutput}
            output={output}
            setIsRepeat={setIsRepeat}
          />
          <PhaserGame movement={output.join(" ")} />
        </div>
      </section>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Quest Guide
                <form className="max-w-sm ">
                  <label
                    htmlFor="languages"
                    className="block mb-2 text-sm font-medium text-white dark:text-white"
                  >
                    Select Language
                  </label>
                  <select
                    id="languages"
                    value={language1}
                    onChange={(e) => setLanguage1(e.target.value)}
                    className="bg-navbarColors font-medium border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option disabled value="">
                      Choose a language
                    </option>
                    <option value="python">Python</option>
                    <option value="csharp">C#</option>
                    <option value="java">Java</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="php">PHP</option>
                  </select>
                </form>
              </ModalHeader>
              <ModalBody>
                <div className="text-white">{renderContent()}</div>
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
    </div>
  );
}
