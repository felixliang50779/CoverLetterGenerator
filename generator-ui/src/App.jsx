// External Modules
import { useState, useEffect } from 'react';

// Internal Modules
import { initializeTemplating, generateFile } from './helper';

// Styling
import './App.css';
import './index.css';


export default function App() {
  // Constants
  const PLACEHOLDER_FILE = { name: "Choose a File (.docx)", data: {} };
  const FILE_READER = new FileReader();

  const [currentFile, setCurrentFile] = useState(PLACEHOLDER_FILE);
  const [templateTargets, setTemplateTargets] = useState({});

  // will include 'currentlySelected' and 'numTargets' properties
  const [templateMetadata, setTemplateMetadata] = useState({});

  // Every time the extension popup is opened
  useEffect(async () => {
    // Initialize UI state using data from DB
    chrome.storage.session.get(["currentFile", "templateTargets", "templateMetadata"], result => {
      console.log(result.currentFile);
      console.log(result.templateTargets);
      console.log(result.templateMetadata);

      result.currentFile !== undefined ? setCurrentFile(result.currentFile) : setCurrentFile(PLACEHOLDER_FILE);
      result.templateTargets !== undefined ? setTemplateTargets(result.templateTargets) : setTemplateTargets({});
      result.templateMetadata !== undefined ? setTemplateMetadata(result.templateMetadata) : setTemplateMetadata({});
    });

    // Attach listener for future storage onChange events
    chrome.storage.session.onChanged.addListener((changes, namespace) => {
      if ("currentFile" in changes) {
        changes.currentFile.newValue !== undefined ? setCurrentFile(changes.currentFile.newValue) :
          setCurrentFile(PLACEHOLDER_FILE);
      }
      if ("templateTargets" in changes) {
        changes.templateTargets.newValue !== undefined ? setTemplateTargets(changes.templateTargets.newValue) :
          setTemplateTargets({});
      }
      if ("templateMetadata" in changes) {
        changes.templateMetadata.newValue !== undefined ? setTemplateMetadata(changes.templateMetadata.newValue) :
          setTemplateMetadata({});
      }
    });
  }, []);

  return (
    <div className="container">
      <h1>COVER LETTER GENERATOR</h1>
      <label for="file-upload" className="button">{currentFile.name}</label>
      <input
        id="file-upload"
        type="file"
        accept=".docx"
        onClick={() => chrome.storage.session.clear()}
        onChange={event => {
          event.target.files[0] ? setCurrentFile({ name: event.target.files[0].name, data: event.target.files[0] }) : 
            setCurrentFile(PLACEHOLDER_FILE);
        }}/>
      <span id="spacer" />
      <button
        className={currentFile.name === PLACEHOLDER_FILE.name ? 'hidden confirm-button' : 'confirm-button'}
        onClick={() => initializeTemplating(currentFile, FILE_READER)}>
          Parse
      </button>
      <button onClick={() => generateFile(currentFile, templateTargets)}>
        Generate
      </button>
    </div>
  )
}
