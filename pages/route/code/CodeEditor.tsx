import React from 'react';
import { Editor, OnMount } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
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
  };

  return (
    <div>
      <LanguageSelector language={language} onSelect={onSelect} />
      <Editor
        options={{ minimap: { enabled: false } }}
        height="40vh"
        theme="vs-dark"
        language={language}
        onMount={onMount}
        value={value}
        onChange={(value) => setValue(value || "")}
      />
    </div>
  );
};

export default CodeEditor;
