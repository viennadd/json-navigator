import React, { useRef, useState } from 'react';
import * as monaco from '@monaco-editor/react';
import { editor } from 'monaco-editor';

// Define a generic type for the JSON content
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

interface CodeEditorProps {
  initialContent?: JsonObject;
  onChange?: (value: string) => void;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  initialContent,
}) => {

  const [position, setPosition] = useState({ line: 1, column: 1 });
  const [selection, setSelection] = useState(0);
  const [language, setLanguage] = useState('javascript');
  const defaultTabSize = 4;
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (monacoEditor: editor.IStandaloneCodeEditor): void => {
    editorRef.current = monacoEditor;

    // Set up cursor position listener
    monacoEditor.onDidChangeCursorPosition(e => {
      setPosition({
        line: e.position.lineNumber,
        column: e.position.column
      });
    });

    // Set up selection listener
    monacoEditor.onDidChangeCursorSelection(() => {
      const selection = monacoEditor.getSelection()!;
      const selectedText = monacoEditor.getModel()!.getValueInRange(selection);
      setSelection(selectedText.length);
    });

    // Set up language change listener
    monacoEditor.onDidChangeModelLanguage(() => {
      setLanguage(monacoEditor.getModel()!.getLanguageId());
    });
    
    // Format the JSON content on mount
    monacoEditor.getAction('editor.action.formatDocument')?.run();
    setLanguage(monacoEditor.getModel()!.getLanguageId());
  };


  const defaultContent = initialContent ? 
    JSON.stringify(initialContent, null, defaultTabSize) : 
    JSON.stringify({ example: "data" }, null, defaultTabSize);

  return (
    <div className="w-full border rounded-lg overflow-hidden" id="editor">
      <monaco.Editor
        defaultLanguage="json"
        defaultValue={defaultContent}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: true },
          fontSize: 14,
          wordWrap: 'on',
          formatOnPaste: true,
          formatOnType: true,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: defaultTabSize,
        }}
        onMount={handleEditorDidMount}
      />

    <div id="statusBar">
            <div className="status-left">
                <span className="status-item" id="position">Ln {position.line}, Col {position.column}</span>
                <span className="status-item" id="selection">Sel {selection}</span>
            </div>
            <div className="status-right">
                <span className="status-item" id="language">{language}</span>
            </div>
        </div>
    </div>
  );
};

export default CodeEditor;