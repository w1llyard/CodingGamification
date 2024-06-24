import { useState, RefObject, useEffect } from "react";
import { Box, Text, useToast } from "@chakra-ui/react";
import { executeCode } from "@/app/api/api";
import * as monaco from "monaco-editor";
import { Card } from "@nextui-org/react";

interface OutputProps {
  editorRef: RefObject<monaco.editor.IStandaloneCodeEditor | null>;
  language: string;
  setOutput: (output: string[]) => void;
  output: string[];
  setIsRepeat: (message: string) => void; // Add this line
}

const Output = ({ editorRef, language, setOutput, output, setIsRepeat }: OutputProps) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const runCode = async () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) return;

    // Check for repeated sequences of R, L, U, D
    const repeatedSequencePattern = /(R{2,}|L{2,}|U{2,}|D{2,})/;
    if (repeatedSequencePattern.test(sourceCode)) {
      setIsRepeat("Repeated sequences of R, L, U, D are not allowed");
      return;
    }

    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      console.log('API Response:', result);  // Logging API response
      if (result.stderr) {
        setIsError(true);
        setOutput(result.stderr.split("\n"));
      } else {
        setIsError(false);
        setOutput(result.stdout.split("\n"));
      }
    } catch (error: any) {
      console.log('Error:', error);  // Logging error
      toast({
        title: "An error occurred.",
        description: error.message || "Unable to run code",
        status: "error",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <div className="button green">
        <button onClick={runCode} disabled={isLoading}>
          {isLoading ? "Running..." : "Run Code"}
        </button>
      </div>

      <Box
        height="40vh"
        p={2}
        color={isError ? "red" : "white"}
        border="1px solid"
        borderRadius={4}
        borderColor={"#333"}
        overflow={"auto"}
      >
        {output.length > 0
          ? output.map((line, i) => <Text key={i}>{line}</Text>)
          : 'Click "Run Code" to see the output here'}
      </Box>
    </Card>
  );
};

export default Output;
