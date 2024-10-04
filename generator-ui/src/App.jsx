// External Modules
import { useState } from 'react';

// Styling
import './App.css';
import './index.css';
import '../public/style.css';

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
      <button className={currentFileName === PLACEHOLDER_FILENAME ? 'hidden confirm-button' : 'confirm-button'} onClick={() => {}}>
        Generate
      </button>
    </div>
  )
}
