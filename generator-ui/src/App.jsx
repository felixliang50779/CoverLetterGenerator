// External Modules
import { useState, useEffect } from 'react';
import { Buffer } from 'buffer';
import { saveAs } from 'file-saver';
import mammoth from 'mammoth';

// Styling
import './App.css';
import './index.css';

async function parseFile(file, fileReader) {
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

async function generateFile(file, fileReader, targets) {

  // Manually setting replacement text here for testing
  const replacementTexts = ['10/13/2024', 'McDonalds', 'Deloitte', 'We hate everything', "Human Resources", "HR Intern", "Mom and Dad", "HR Firing Squad"];


  // Mapping to the wrong targets here as objects don't preserve order
  // working version will use 'targets' itself as the replacementObj so should be ok
  const replacementObj = {};
  for (let i = 0; i < Object.keys(targets).length ; i++) {
    replacementObj[Object.keys(targets)[i]] = replacementTexts[i];
  }

  const response = await fetch("http://localhost:8080/generateFileHandler", {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({ data: replacementObj, template: file.data })
  });

  const base64Response = (await response.json()).completedFile;
  const buffer = Buffer.from(base64Response, 'base64');
  const fileBlob = new Blob ([buffer], 
    { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

  saveAs(fileBlob, `Modified ${file.name}`);
}

async function getTemplateTargets(file, fileReader) {
  // Get raw targets from file template
  const targetArray = await parseFile(file, fileReader);

  // Strip the '%t' indicators
  const processedTargetArray = targetArray.map(target => target.slice(2, -2));

  // Reduce the array into an object with empty mappings
  const targetObj = processedTargetArray.reduce((obj, key) => {
    obj[key] = "";
    return obj;
  }, {});

  return [processedTargetArray, targetObj];
}

export default function App() {
  // Constants
  const PLACEHOLDER_FILE = { name: "Choose a File (.docx)", data: {} };
  const FILE_READER = new FileReader();

  const [currentFile, setCurrentFile] = useState(PLACEHOLDER_FILE);
  const [templateTargets, setTemplateTargets] = useState({});

  // will include 'currentlySelected' and 'numTargets' properties
  const [templateMetadata, setTemplateMetadata] = useState({});


  const initializeTemplating = async () => {
    const [targetArray, targetObj] = await getTemplateTargets(currentFile.data, FILE_READER);
    const dbUpdates = [];

    // Convert file to base64 for storage
    const base64File = await convertBase64(currentFile.data, FILE_READER);

    // Update DB
    dbUpdates.push(chrome.storage.session.set({ currentFile: { name: currentFile.name, data: base64File } }));
    dbUpdates.push(chrome.storage.session.set({ templateTargets: targetObj }));
    dbUpdates.push(chrome.storage.session.set(
      { templateMetadata: { currentlySelected: targetArray[0], numTargets: targetArray.length } }));


    // Resolve DB updates concurrently
    await Promise.all(dbUpdates);

    // TO-DO: This will no longer be needed once onChange handler
    // is set-up to update UI on DB changes
    setTemplateTargets(targetObj);
    setTemplateMetadata({ currentlySelected: targetArray[0], numTargets: targetArray.length });
  }

  // Every time the extension popup is opened
  useEffect(async () => {
    // Initialize UI state using data from DB
    chrome.storage.session.get(["currentFile", "templateTargets", "templateMetadata"], result => {
      result.currentFile !== undefined ? setCurrentFile(result.currentFile) : setCurrentFile(PLACEHOLDER_FILE);
      result.templateTargets !== undefined ? setTemplateTargets(result.templateTargets) : setTemplateTargets({});
      result.templateMetadata !== undefined ? setTemplateMetadata(result.templateMetadata) : setTemplateMetadata({});
    });

    // Attach listener for future storage onChange events
    chrome.storage.session.onChanged.addListener((changes, namespace) => {
      if ("currentFile" in changes) {

      }
      if ("templateTargets" in changes) {

      }
      if ("templateMetadata" in changes) {

      }
    });
  }, []);

  return (
    <div className="container">
      <h1>COVER LETTER GENERATOR</h1>
      <label for="file-upload" className="button">{currentFile.name}</label>

      {/*
        TO-DO: Change ternary operands to set DB values instead of state -
        onChange handler should take care of UI updates
      */}
      <input id="file-upload" type="file" accept=".docx" onChange={event => {
        event.target.files[0] ? setCurrentFile({ name: event.target.files[0].name, data: event.target.files[0] }) : 
          setCurrentFile(PLACEHOLDER_FILE);
      }}/>
      <span id="spacer" />
      <button
        className={currentFile.name === PLACEHOLDER_FILE.name ? 'hidden confirm-button' : 'confirm-button'}
        onClick={initializeTemplating}>
          Parse
      </button>
      <button onClick={() => generateFile(currentFile, FILE_READER, templateTargets)}>
        Generate
      </button>
    </div>
  )
}
