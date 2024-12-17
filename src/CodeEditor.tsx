import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { CodeOnlyIcon, SplitViewIcon } from "./icons";
import CodeMirror, {
  EditorView,
  keymap,
  lineNumbers,
  oneDark,
  ReactCodeMirrorRef,
} from "@uiw/react-codemirror";
import {
  foldAll,
  unfoldAll,
  syntaxTree,
} from "@codemirror/language";

import { json } from "@codemirror/lang-json";

import { FEEDBACK_URL } from "./const";
import { defaultKeymap } from "@codemirror/commands";

interface CodeEditorProps {
  initialContent: string;
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
  editorRef: React.MutableRefObject<ReactCodeMirrorRef | null>;
  initialContent: string;
}

const TopMenu: React.FC<TopMenuProps> = (props: TopMenuProps) => {
  const { editorRef, initialContent } = props;
  const [folded, setFolded] = useState<boolean>(false);
  const [showFormattedContent, setShowFormattedContent] =
    useState<boolean>(false);
  const defaultTabSize = 2;

  const setFoldingState = (folded: boolean) => {
    setFolded(folded);

    const state = editorRef.current!.state;

    console.log(syntaxTree(state!))
    walkTree(syntaxTree(state!).cursor(), 0)

    if (folded) {
      foldAll(editorRef.current!.view!);
    } else {
      unfoldAll(editorRef.current!.view!);
    }
  };

  const setFormattingState = (showFormattedContent: boolean) => {
    setShowFormattedContent(showFormattedContent);
    const view = editorRef.current!.view!;
    const newContent = showFormattedContent
      ? JSON.stringify(JSON.parse(initialContent), null, defaultTabSize)
      : initialContent;
    const transaction = view.state.update({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: newContent,
      },
    });

    editorRef.current!.view!.dispatch(transaction);
  };

  return (
    <div id="topMenu">
      <div className="menu-group">
        {/* {folded ? (
          <span
            className="menu-item"
            id="menu-unfold"
            title="Unfold code."
            onClick={() => setFoldingState(!folded)}
          >
            Unfold Code
          </span>
        ) : (
          <span
            className="menu-item"
            id="menu-fold"
            title="Fold code."
            onClick={() => setFoldingState(!folded)}
          >
            Fold Code
          </span>
        )} */}

        {showFormattedContent ? (
          <span
            className="menu-item"
            id="menu-raw-content"
            title="Raw Content."
            onClick={() => setFormattingState(!showFormattedContent)}
          >
            Show Raw Content
          </span>
        ) : (
          <span
            className="menu-item"
            id="menu-prettier"
            title="Code Prettify."
            onClick={() => setFormattingState(!showFormattedContent)}
          >
            Format Code
          </span>
        )}

        <span
          className="menu-item"
          id="menu-issues"
          title={`Feature Request, Bug Report, Feedback: ${FEEDBACK_URL}`}
          onClick={() => window.open(FEEDBACK_URL, "_blank")}
        >
          ?
        </span>
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
        {/* <span className="status-item" id="position">
          Ln {position.line}, Col {position.column}
        </span>

        <span className="status-item" id="selection">
          Sel {selection}
        </span> */}
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
  const editorRef = useRef<ReactCodeMirrorRef>(null);

  return (
    <div className="w-full" id="editor">
      <TopMenu editorRef={editorRef} initialContent={initialContent}></TopMenu>

      <CodeMirror
        ref={editorRef}
        readOnly={true}
        editable={false}
        height="100%"
        value={initialContent}
        theme={oneDark}
        extensions={[
          keymap.of(defaultKeymap),
          json(),
          lineNumbers(),
          // codeFolding(),
          // jsonLevel2Folder(),
          EditorView.theme({
            "&": {
              fontSize: "12px",
            },
            ".cm-scroller": {
              fontFamily: "Code New Roman",
            },
          }),
        ]}
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
