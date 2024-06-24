import React from 'react';
import { Editor, OnMount } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "./constants";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import * as monaco from "monaco-editor";

interface CodeEditorProps {
  editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ editorRef, value, setValue, language, setLanguage }) => {

  const onMount: OnMount = (editor) => {
    if (editorRef) {
      editorRef.current = editor;
      editor.focus();
    }
  };

  const onSelect = (language: string) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  return (
    <Card className="text-white">
      <CardHeader className="pb-0 pt-6 px-4 flex-col items-start text-white">
        <LanguageSelector language={language} onSelect={onSelect} />
      </CardHeader>
      <CardBody>
          <Editor
            className="bg-navbarColors"
            options={{
              minimap: {
                enabled: false,
              },
            }}
            height="40vh"
            theme="vs-dark"
            language={language}
            defaultValue={CODE_SNIPPETS[language]}
            onMount={onMount}
            value={value}
            onChange={(value) => setValue(value || "")}
          />
      </CardBody>
    </Card>
  );
};

export default CodeEditor;
