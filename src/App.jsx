// External Modules
import { useState } from 'react';
import { PdfToHtmlClient } from 'pdfcrowd';
import { saveAs } from 'file-saver';

// Internal Modules
import { initTemplating } from '../public/content.mjs';
import { terminateTemplating } from '../public/content.mjs';

// Styling
import './App.css';
import './index.css';
import '../public/style.css';

async function processFile(filename) {
  const conversionClient = new PdfToHtmlClient("fliang2020", "34d197fad9224119937b054a57bf6552");
  conversionClient.convertFileToFile(
    `C:/Users/A287995/Downloads/GUIDE-DDD&Microservices.pdf`,
    "logo.html",
    function(err, fileName) {
        if (err) return console.error("Pdfcrowd Error: " + err);
        console.log("Success: the file was created " + fileName);
  });
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
      <button className={currentFileName === PLACEHOLDER_FILENAME ? 'hidden confirm-button' : 'confirm-button'} onClick={() => processFile(currentFileName)}>
        Generate
      </button>
    </div>
  )
}
