import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { editor } from "monaco-editor";
import { JsonObject } from "./json-utils";
import { CodeOnlyIcon, SplitViewIcon } from "./icons";
import { Editor } from "@monaco-editor/react";

interface CodeEditorProps {
  initialContent?: JsonObject;
  onChange?: (value: string) => void;
  height?: string;
  showSplitView: boolean;
  setShowSplitView: Dispatch<SetStateAction<boolean>>;
}

interface StatusBarProps {
  showSplitView: boolean;
  setShowSplitView: Dispatch<SetStateAction<boolean>>;
  position: { line: number; column: number };
  selection: number;
}

interface TopMenuProps {
  editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
}

const TopMenu: React.FC<TopMenuProps> = (props: TopMenuProps) => {
  const { editorRef } = props;
  const [folded, setFolded] = useState<boolean>(false);

  const setFoldingState = (folded: boolean) => {
    setFolded(folded);
  
    editorRef.current?.trigger(
      "fold",
      folded ? "editor.foldLevel2" : "editor.unfoldAll",
      {}
    );
  };
  

  return (
    <div id="topMenu">
      <div>
        {folded ? (
          <span
            className="menu-item"
            id="menu-unfold"
            title="Unfold code."
            onClick={() => setFoldingState(false)}
          >
            Unfold Code
          </span>
        ) : (
          <span
            className="menu-item"
            id="menu-fold"
            title="Fold code."
            onClick={() => setFoldingState(true)}
          >
            Fold Code
          </span>
        )}
      </div>
    </div>
  );
};

const StatusBar: React.FC<StatusBarProps> = (props: StatusBarProps) => {
  const { showSplitView, setShowSplitView, position, selection } = props;
  return (
    <div id="statusBar">
      <div className="status-actions">
        {showSplitView ? (
          <span
            className="status-item"
            id="codeOnlyIcon"
            title="Show code view only."
            onClick={() => setShowSplitView(false)}
          >
            <CodeOnlyIcon></CodeOnlyIcon>
          </span>
        ) : (
          <span
            className="status-item"
            id="splitViewIcon"
            title="Show split view."
            onClick={() => setShowSplitView(true)}
          >
            <SplitViewIcon></SplitViewIcon>
          </span>
        )}
      </div>
      <div className="status-right">
        <span className="status-item" id="position">
          Ln {position.line}, Col {position.column}
        </span>

        <span className="status-item" id="selection">
          Sel {selection}
        </span>
      </div>
    </div>
  );
};

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialContent,
  showSplitView,
  setShowSplitView,
}) => {
  const [position, setPosition] = useState({ line: 1, column: 1 });
  const [selection, setSelection] = useState(0);
  const defaultTabSize = 4;
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (
    monacoEditor: editor.IStandaloneCodeEditor
  ): void => {
    editorRef.current = monacoEditor;
    // Set up cursor position listener
    monacoEditor.onDidChangeCursorPosition((e) => {
      setPosition({
        line: e.position.lineNumber,
        column: e.position.column,
      });
    });

    // Set up selection listener
    monacoEditor.onDidChangeCursorSelection(() => {
      const selection = monacoEditor.getSelection()!;
      const selectedText = monacoEditor.getModel()!.getValueInRange(selection);
      setSelection(selectedText.length);
    });
  };

  const defaultContent = initialContent
    ? JSON.stringify(initialContent, null, defaultTabSize)
    : JSON.stringify({ example: "data" }, null, defaultTabSize);

  return (
    <div className="w-full" id="editor">
      <TopMenu editorRef={editorRef}></TopMenu>
      <Editor
        defaultLanguage="json"
        defaultValue={defaultContent}
        theme="vs"
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
      <StatusBar
        showSplitView={showSplitView}
        setShowSplitView={setShowSplitView}
        position={position}
        selection={selection}
      ></StatusBar>
    </div>
  );
};

export default CodeEditor;
