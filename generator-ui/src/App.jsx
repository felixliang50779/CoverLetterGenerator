// External Modules
import { useState } from 'react';

// Styling
import './App.css';
import './index.css';

async function getTemplateTargets(file) {

  const formData = new FormData();
  formData.set("file", file);

  try {
    await fetch("http://localhost:8080/parseFileHandler", {
      method: "POST",
      body: formData
    });
  }
  catch (e) {
    console.log(e);
  }
}

export default function App() {
  // Constants
  const PLACEHOLDER_FILE = { name: "Choose a File (.pdf)" };

  const [currentFile, setCurrentFile] = useState(PLACEHOLDER_FILE);

  return (
    <div className="container">
      <h1>COVER LETTER GENERATOR</h1>
      <label for="file-upload" className="button">{currentFile.name}</label>
      <input id="file-upload" type="file" accept="application/pdf" onChange={event => {
        event.target.files[0] ? setCurrentFile(event.target.files[0]) : setCurrentFile(PLACEHOLDER_FILE);
      }}/>
      <span id="spacer" />
      <button className={Object.keys(currentFile).length === 1 ? 'hidden confirm-button' : 'confirm-button'} onClick={() => getTemplateTargets(currentFile)}>
        Generate
      </button>
    </div>
  )
}
