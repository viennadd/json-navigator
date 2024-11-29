import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import * as monaco from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { JsonObject } from "./Json";
import { CodeOnlyIcon, SplitViewIcon } from "./Icons";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";

interface CodeEditorProps {
  initialContent?: JsonObject;
  onChange?: (value: string) => void;
  height?: string;
  setShowSplitView: Dispatch<SetStateAction<boolean>>
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialContent, setShowSplitView }) => {
  // const [position, setPosition] = useState({ line: 1, column: 1 });
  // const [selection, setSelection] = useState(0);
  const [language, setLanguage] = useState("javascript");
  const defaultTabSize = 4;
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (
    monacoEditor: editor.IStandaloneCodeEditor
  ): void => {
    editorRef.current = monacoEditor;

    // // Set up cursor position listener
    // monacoEditor.onDidChangeCursorPosition((e) => {
    //   setPosition({
    //     line: e.position.lineNumber,
    //     column: e.position.column,
    //   });
    // });

    // // Set up selection listener
    // monacoEditor.onDidChangeCursorSelection(() => {
    //   const selection = monacoEditor.getSelection()!;
    //   const selectedText = monacoEditor.getModel()!.getValueInRange(selection);
    //   setSelection(selectedText.length);
    // });

    // Set up language change listener
    monacoEditor.onDidChangeModelLanguage(() => {
      setLanguage(monacoEditor.getModel()!.getLanguageId());
    });

    // Format the JSON content on mount
    monacoEditor.getAction("editor.action.formatDocument")?.run();
    setLanguage(monacoEditor.getModel()!.getLanguageId());
  };

  const defaultContent = initialContent
    ? JSON.stringify(initialContent, null, defaultTabSize)
    : JSON.stringify({ example: "data" }, null, defaultTabSize);

  return (
    <div className="w-full" id="editor">
      <monaco.Editor
        defaultLanguage="json"
        defaultValue={defaultContent}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: true },
          fontSize: 14,
          wordWrap: "off",
          formatOnPaste: true,
          formatOnType: true,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: defaultTabSize,
        }}
        onMount={handleEditorDidMount}
      />

      <div id="statusBar">
        {/* <div className="status-left">
          <span className="status-item" id="position">
            Ln {position.line}, Col {position.column}
          </span>

          <span className="status-item" id="selection">
            Sel {selection}
          </span>
        </div> */}

        

        <div className="status-actions">
          <span className="status-item" id="codeOnlyIcon"  title="Show code view only." onClick={() => setShowSplitView(false)}>
            <CodeOnlyIcon></CodeOnlyIcon>
          </span>
          <span className="status-item" id="splitViewIcon" title="Show split view." onClick={() => setShowSplitView(true)}>
            <SplitViewIcon></SplitViewIcon>
          </span>
        </div>
        <div className="status-right">
          <span className="status-item" id="language">
            {language}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
