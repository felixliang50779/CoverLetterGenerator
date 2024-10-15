// External Modules
import { useState } from 'react';
import { Buffer } from 'buffer';
import { saveAs } from 'file-saver';
import mammoth from 'mammoth';

// Styling
import './App.css';
import './index.css';

async function processFile(file, fileReader) {
  const regex = /%t(.*?)%t/g;

  return new Promise((resolve, reject) => {
    fileReader.onload = async (e) => {
      let arrayBuffer = new Uint8Array(fileReader.result);
      
      let result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
      
      // Getting targets duplicates and all
      const rawTargets = result.value.matchAll(regex).toArray().map(match => match[0]);
  
      // Getting unique template targets
      const targets = rawTargets.filter((target, index, self) => {
  
        // checks whether target is the first instance of
        // target value
        return index == self.indexOf(target);
      });

      resolve(targets);
    }

    fileReader.onerror = () => {
      fileReader.abort();
      reject("Error with parsing input file");
    };

    fileReader.readAsArrayBuffer(file);
  })
}

async function convertBase64(file, fileReader) {
  return new Promise((resolve, reject) => {
    fileReader.onload = async (e) => {
      resolve(fileReader.result);
    }

    fileReader.onerror = () => {
      fileReader.abort();
      reject("Failed to convert file to base64 string");
    }
    
    fileReader.readAsDataURL(file);
  });
}

async function getTemplateTargets(file) {

  const fileReader = new FileReader();

  const targets = await processFile(file, fileReader);
  const base64file = await convertBase64(file, fileReader);

  // Manually setting replacement text here for testing
  const replacementTexts = ['10/13/2024', 'McDonalds', 'Deloitte', 'We hate everything', "Human Resources", "HR Intern", "Mom and Dad", "HR Firing Squad"];
  
  const replacementObj = {};
  for (let i = 0; i < targets.length; i++) {
    const processedTarget = targets[i].slice(2, -2);
    replacementObj[processedTarget] = replacementTexts[i];
  }

  const response = await fetch("http://localhost:8080/generateFileHandler", {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({ data: replacementObj, template: base64file })
  });

  const base64Response = (await response.json()).completedFile;
  const buffer = Buffer.from(base64Response, 'base64');
  const fileBlob = new Blob ([buffer], 
    { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

  await saveAs(fileBlob, `Modified ${file.name}`);
}

export default function App() {
  // Constants
  const PLACEHOLDER_FILE = { name: "Choose a File (.docx)" };

  const [currentFile, setCurrentFile] = useState(PLACEHOLDER_FILE);

  return (
    <div className="container">
      <h1>COVER LETTER GENERATOR</h1>
      <label for="file-upload" className="button">{currentFile.name}</label>
      <input id="file-upload" type="file" accept=".docx" onChange={event => {
        event.target.files[0] ? setCurrentFile(event.target.files[0]) : setCurrentFile(PLACEHOLDER_FILE);
      }}/>
      <span id="spacer" />
      <button className={Object.keys(currentFile).length === 1 ? 'hidden confirm-button' : 'confirm-button'} onClick={() => getTemplateTargets(currentFile)}>
        Parse
      </button>
    </div>
  )
}
