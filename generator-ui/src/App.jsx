// External Modules
import { useState, useEffect, useRef } from 'react';
import { Card } from "antd";

// Internal Modules
import { initializeTemplating, generateFile, clearData } from './helper';
import FloatInput from './components/FloatInput';

// Styling
import './App.css';


export default function App() {
  // Constants
  const PLACEHOLDER_FILE = { name: "Choose a File (.docx)", data: {} };
  const FILE_READER = new FileReader();

  const [currentFile, setCurrentFile] = useState(PLACEHOLDER_FILE);
  const [templateTargets, setTemplateTargets] = useState({});

  // will include 'currentlySelected' and 'numTargets' properties
  const [templateMetadata, setTemplateMetadata] = useState({});

  const fileInputRef = useRef();

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
        ref={fileInputRef}
        id="file-upload"
        type="file"
        accept=".docx"
        onClick={() => clearData(fileInputRef)}
        onChange={event => {
          event.target.files[0] ? setCurrentFile({ name: event.target.files[0].name, data: event.target.files[0] }) : 
            setCurrentFile(PLACEHOLDER_FILE);
        }}/>
      <span className="vertical-spacer" />
      {!Object.keys(templateTargets).length ?
        <button
          className={currentFile.name === PLACEHOLDER_FILE.name ?
            'hidden button confirm-button' : 'button confirm-button'}
          onClick={() => initializeTemplating(currentFile, FILE_READER)}>
            Parse
        </button> :
        <div className="secondary-container">
          <Card
            title="Targets"
            style={{ 
              textAlign: 'left',
              backgroundColor: "#1a1a1a"
            }} >
              {
                Object.entries(templateTargets).map(([target, value]) => {
                  return (
                    <FloatInput
                      target={target}
                      value={value}
                      setTemplateTargets={setTemplateTargets}
                      label={target}
                      placeholder={target}
                      type="text" />
                  );
                })
              } 
          </Card>
          <span className='vertical-spacer' />
          <div className="button-group">
            <button
              className={Object.values(templateTargets).every(value => value !== "") ? "button cancel-button split" :
                "button cancel-button single"}
              onClick={() => clearData(fileInputRef)}>
                Cancel
            </button>
            <span className="horizontal-spacer" />
            <button
              className={Object.values(templateTargets).every(value => value !== "") ? 
                "button confirm-button split" : "hidden button confirm-button"}
              onClick={() => generateFile(currentFile, templateTargets)}>
                Generate
            </button>
          </div>
        </div>
      }
    </div>
  )
}
