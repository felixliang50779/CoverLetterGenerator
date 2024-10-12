// External Modules
import { useState } from 'react';
import pdf2base64 from 'pdf-to-base64';

// Styling
import './App.css';
import './index.css';
import '../public/style.css';

async function getTemplateTargets(filename) {
  try {
    const base64pdf = await pdf2base64(`C:/Users/flian/Downloads/${filename}`);
    const response = await fetch("http://localhost:8080/parseFileHandler", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ fileString: base64pdf })
    });
    const htmlString = await response.json();
    console.log(htmlString);
  }
  catch (e) {
    console.log(e);
  }
}

export default function App() {
  // Constants
  const PLACEHOLDER_FILENAME = "Choose a File (.pdf)";

  const [currentFileName, setCurrentFileName] = useState(PLACEHOLDER_FILENAME);

  return (
    <div className="container">
      <h1>COVER LETTER GENERATOR</h1>
      <label for="file-upload" className="button">{currentFileName}</label>
      <input id="file-upload" type="file" accept="application/pdf" onChange={event => {
        event.target.files[0] ? setCurrentFileName(event.target.files[0].name) : setCurrentFileName(PLACEHOLDER_FILENAME);
      }}/>
      <span id="spacer" />
      <button className={currentFileName === PLACEHOLDER_FILENAME ? 'hidden confirm-button' : 'confirm-button'} onClick={() => getTemplateTargets(currentFileName)}>
        Generate
      </button>
    </div>
  )
}
