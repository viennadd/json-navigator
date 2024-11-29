import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./App.css";
import CodeEditor from "./CodeEditor";
import ResizableSplitView from "./ResizableSplitView";
import FlowView from "./FlowView";
import "@xyflow/react/dist/style.css";
import { JsonObject } from "./Json";

function FullView(props: {
  showSplitView: boolean;
  setShowSplitView: Dispatch<SetStateAction<boolean>>;
  jsonData: JsonObject;
}) {
  const { showSplitView, setShowSplitView, jsonData } = props;
  if (showSplitView) {
    return (
      <ResizableSplitView
        leftSide={
          <CodeEditor
            initialContent={jsonData}
            setShowSplitView={setShowSplitView}
          />
        }
        rightSide={<FlowView jsonContent={jsonData}></FlowView>}
      />
    );
  } else {
    return (
      <CodeEditor
        initialContent={jsonData}
        setShowSplitView={setShowSplitView}
      />
    );
  }
}

function App() {
  const [jsonData, setJsonData] = useState<JsonObject | null>(null);
  const [showSplitView, setShowSplitView] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      // Replace with your API endpoint
      const response = await fetch(location.href);

      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonResponse = await response.json();
      setJsonData(jsonResponse);
    } catch (error) {
      console.error(error);
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
