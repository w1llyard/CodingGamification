import { useState, RefObject } from "react";
import * as monaco from "monaco-editor";
import { Socket } from "socket.io-client";
import { executeCode } from "@/lib/apiGetCode";

interface OutputProps {
  editorRef: RefObject<monaco.editor.IStandaloneCodeEditor | null>;
  language: string;
  setOutput: (output: string[]) => void;
  output: string[];
  problem: { problem: string; test_cases: [string, string][] };
  roomId: string;
  username: string;
  socket: Socket;
}

const Output = ({ editorRef, language, setOutput, output, problem, roomId, username, socket }: OutputProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const runCode = async () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) return;

    try {
      setIsLoading(true);
      let allPassed = true;
      let results = [];
      let passedTests = 0;

      for (let [input, expectedOutput] of problem.test_cases) {
        const { run: result } = await executeCode(language, `${sourceCode}\nprint(${input.trim()})`);
        const actualOutput = result.stdout.trim();
        if (actualOutput !== expectedOutput) {
          allPassed = false;
        } else {
          passedTests += 1;
        }
        results.push(`Input: ${input.trim()} | Expected: ${expectedOutput} | Output: ${actualOutput}`);
      }

      setOutput(results);
      setIsError(!allPassed);

      // Emit results to server
      socket.emit('submit', {
        room_id: roomId,
        user: username,
        passed_tests: passedTests,
        total_tests: problem.test_cases?.length || []
      });
    } catch (error: any) {
      setIsError(true);
      setOutput([error.message || "Unable to run code"]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={runCode} disabled={isLoading}>
        {isLoading ? "Running..." : "Run Code"}
      </button>
      <div className={`output-container ${isError ? 'error' : ''}`}>
        {output?.length > 0 ? (
          output.map((line, i) => <p key={i}>{line}</p>)
        ) : (
          'Click "Run Code" to see the output here'
        )}
      </div>
    </div>
  );
};

export default Output;
