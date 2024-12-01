import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./App.css";
import CodeEditor from "./CodeEditor";
import ResizableSplitView from "./ResizableSplitView";
import FlowView from "./FlowView";
import "@xyflow/react/dist/style.css";
import { JSON_DEMO_VALUE } from "./json-utils";

function FullView(props: {
  showSplitView: boolean;
  setShowSplitView: Dispatch<SetStateAction<boolean>>;
  jsonData: string;
}) {
  const { showSplitView, setShowSplitView, jsonData } = props;
  const codeEditor = (
    <CodeEditor
      initialContent={jsonData}
      showSplitView={showSplitView}
      setShowSplitView={setShowSplitView}
    />
  );
  if (showSplitView) {
    return (
      <ResizableSplitView
        leftSide={codeEditor}
        rightSide={<FlowView jsonContent={JSON.parse(jsonData)}></FlowView>}
      />
    );
  } else {
    return codeEditor;
  }
}

function App() {
  const [jsonData, setJsonData] = useState<string | null>(null);
  const [showSplitView, setShowSplitView] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      // Replace with your API endpoint
      const response = await fetch(location.href);

      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonResponse = await response.text();
      if (response.headers.get("Content-type")?.toLowerCase() === "application/json") {
        setJsonData(jsonResponse);
      } else {
        throw "Not JSON content"
      }
    } catch (error) {
      console.error(error);
      setJsonData(JSON_DEMO_VALUE)
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {jsonData === null ? (
        <>Loading...</>
      ) : (
        <FullView
          jsonData={jsonData}
          showSplitView={showSplitView}
          setShowSplitView={setShowSplitView}
        ></FullView>
      )}
    </>
  );
}

export default App;
