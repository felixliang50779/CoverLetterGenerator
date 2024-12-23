// External Modules
import { useState, useEffect, useRef } from 'react';
import { flushSync } from "react-dom";

// Internal Modules
import { initializeTemplating } from './scripts/helper';
import FileUpload from './components/FileUpload';
import TemplateItems from './components/TemplateItems';
import ButtonGroup from './components/ButtonGroup';

// Styling
import './App.css';


// Constants
const PLACEHOLDER_FILE = { name: "Choose a File (.docx)", data: {} };
const FILE_READER = new FileReader();

// App Component
export default function App() {
  
  const [currentFile, setCurrentFile] = useState(PLACEHOLDER_FILE);
  const [templateTargets, setTemplateTargets] = useState({});
  const [currentlySelected, setCurrentlySelected] = useState("");
  const [invalidState, setInvalidState] = useState(false);

  const fileInputRef = useRef();

// Define the event handler outside of the useEffect
const handleStorageChange = (changes) => {
  if ("currentFile" in changes) {
    setCurrentFile(changes.currentFile.newValue || PLACEHOLDER_FILE);
  }
  if ("templateTargets" in changes) {
    flushSync(() => setTemplateTargets(changes.templateTargets.newValue || {}));
  }
  if ("currentlySelected" in changes) {
    setCurrentlySelected(changes.currentlySelected.newValue || "");
  }
};

useEffect(() => {
  // Initial fetch of data from chrome storage
  chrome.storage.session.get(["currentFile", "templateTargets", "currentlySelected"], result => {
    setCurrentFile(result.currentFile || PLACEHOLDER_FILE);
    setTemplateTargets(result.templateTargets || {});
    setCurrentlySelected(result.currentlySelected || "");
  });

  // Add the event listener
  chrome.storage.session.onChanged.addListener(handleStorageChange);

  // Cleanup the event listener on component unmount
  return () => {
    chrome.storage.session.onChanged.removeListener(handleStorageChange);
  };
}, []);

  return (
    <div className="container">
      <h1>COVER LETTER GENERATOR</h1>
      <FileUpload
        currentFile={currentFile}
        setCurrentFile={setCurrentFile}
        fileInputRef={fileInputRef}
        setInvalidState={setInvalidState}
        placeholderFile={PLACEHOLDER_FILE}
      />
      <span className="vertical-spacer" />
      {
        !invalidState
        ?
        (!Object.keys(templateTargets).length ?
          <button
            className={currentFile.name === PLACEHOLDER_FILE.name ?
              'hidden button confirm-button' : 'button confirm-button'}
            onClick={async () => {
              await initializeTemplating(currentFile, FILE_READER, setInvalidState);
              chrome.runtime.sendMessage("injectContentScript");
            }}>
              Parse
          </button> :
          <div className="secondary-container">
            <TemplateItems
              templateTargets={templateTargets}
              currentlySelected={currentlySelected}
            />
            <span className='vertical-spacer' />
            <ButtonGroup
              templateTargets={templateTargets}
              fileInputRef={fileInputRef}
              setInvalidState={setInvalidState}
              currentFile={currentFile}
            />
          </div>
        )
        :
        <h2 className="error-text">invalid file type or template</h2>
      }
    </div>
  );
}