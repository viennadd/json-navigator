import { useEffect, useState } from 'react'
import './App.css'
import CodeEditor from './CodeEditor'
import ResizableSplitView from './ResizableSplitView'
import FlowView from './FlowView'
import '@xyflow/react/dist/style.css';
import { JsonObject } from './Json'


function App() {
  const [jsonData, setJsonData] = useState<JsonObject | null>(null)

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
      console.error(error)
    }
  };

  useEffect(() => {
    fetchData();

  }, []);

  return (
    <>
    {
    jsonData === null ? 
    <>Loading...</> : 
    <ResizableSplitView 
        leftSide={
          <CodeEditor initialContent={jsonData} />
        } 
        rightSide={
          <FlowView jsonContent={jsonData}></FlowView>
        }
      />
    }
    </>
  )
}

export default App
