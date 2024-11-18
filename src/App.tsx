import { useEffect, useState } from 'react'
import './App.css'
import CodeEditor from './CodeEditor'

interface UserData {
  name: string;
  age: number;
  preferences: {
    theme: string;
    notifications: boolean;
  };
  tags: string[];
}

function App() {
  const [jsonData, setJsonData] = useState<string>('{}')

  useEffect(() => {

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

    fetchData();

  }, []);

  return (
    <>
      <CodeEditor 
        initialContent={JSON.parse(jsonData)}
      />
    </>
  )
}

export default App
