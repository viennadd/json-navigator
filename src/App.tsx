import { useEffect, useState } from 'react'
import './App.css'
import CodeEditor from './CodeEditor'
import ResizableSplitView from './ResizableSplitView'
import FlowView from './FlowView'
import '@xyflow/react/dist/style.css';


function App() {
  const [jsonData, setJsonData] = useState<string>('{}')

  const fetchData = async () => {
    try {
      // Replace with your API endpoint
      const response = await fetch(location.href);
      
      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const jsonResponse = await response.json();
      setJsonData(JSON.stringify(jsonResponse));
    } catch (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    fetchData();

  }, []);

  return (
    <>
      <ResizableSplitView 
        leftSide={
          <CodeEditor 
            initialContent={JSON.parse(jsonData)}
          />
        } 
        // rightSide={<RightSide></RightSide>} 
        rightSide={
          <FlowView></FlowView>
        }
      />
    </>
  )
}

export default App
