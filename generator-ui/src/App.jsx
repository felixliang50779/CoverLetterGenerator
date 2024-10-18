// External Modules
import { useState, useEffect, useRef } from 'react';
import { Card } from "antd";
import { SelectOutlined } from "@ant-design/icons";
import debounce from "debounce";

// Internal Modules
import { initializeTemplating, generateFile, clearData } from './helper';
import FloatInput from './components/FloatInput';

// Styling
import './App.css';


export default function App() {
  // Constants
  const PLACEHOLDER_FILE = { name: "Choose a File (.docx)", data: {} };
  const FILE_READER = new FileReader();
  const MAX_LABEL_LENGTH = 45;

  const [currentFile, setCurrentFile] = useState(PLACEHOLDER_FILE);
  const [templateTargets, setTemplateTargets] = useState({});
  const [currentlySelected, setCurrentlySelected] = useState("");

  const [invalidState, setInvalidState] = useState(false);

  const fileInputRef = useRef();

  // Every time the extension popup is opened
  useEffect(async () => {
    // Initialize UI state using data from DB
    chrome.storage.session.get(["currentFile", "templateTargets", "currentlySelected"], result => {
      console.log(result.currentFile);
      console.log(result.templateTargets);
      console.log(result.currentlySelected);

      result.currentFile !== undefined ? setCurrentFile(result.currentFile) : setCurrentFile(PLACEHOLDER_FILE);
      result.templateTargets !== undefined ? setTemplateTargets(result.templateTargets) : setTemplateTargets({});
      result.currentlySelected !== undefined ? setCurrentlySelected(result.currentlySelected) : setCurrentlySelected("");
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
      if ("currentlySelected" in changes) {
        changes.currentlySelected.newValue !== undefined ? setCurrentlySelected(changes.currentlySelected.newValue) :
          setCurrentlySelected("");
      }
    });
  }, []);

  return (
    <div className="container">
      <h1>COVER LETTER GENERATOR</h1>
      <label for="file-upload" className="button single">{currentFile.name}</label>
      <input
        ref={fileInputRef}
        id="file-upload"
        type="file"
        accept=".docx"
        onClick={() => clearData(fileInputRef, setInvalidState)}
        onChange={event => {
          event.target.files[0] ? setCurrentFile({ name: event.target.files[0].name, data: event.target.files[0] }) : 
            setCurrentFile(PLACEHOLDER_FILE);
        }}/>
      <span className="vertical-spacer" />
      {
        !invalidState
        ?
        (!Object.keys(templateTargets).length ?
          <button
            className={currentFile.name === PLACEHOLDER_FILE.name ?
              'hidden button confirm-button' : 'button confirm-button'}
            onClick={() => initializeTemplating(currentFile, FILE_READER, setInvalidState)}>
              Parse
          </button> :
          <div className="secondary-container">
            <Card title="Templated Items">
              {
                Object.entries(templateTargets).map(([target, value]) => {
                  return (
                    <div className="input-group">
                      <FloatInput
                        target={target}
                        value={value}
                        setTemplateTargets={setTemplateTargets}
                        currentlySelected={currentlySelected}
                        label={target.length >= MAX_LABEL_LENGTH ? target.slice(0, MAX_LABEL_LENGTH) + "..." : target}
                        type="text" />
                      <button
                        className="button toggle-button"
                        onClick={() => chrome.storage.session.set({ currentlySelected: target })}>
                          <SelectOutlined />
                      </button>
                    </div>
                  );
                })
              } 
            </Card>
            <span className='vertical-spacer' />
            <div className="button-group">
              <button
                className={Object.values(templateTargets).every(value => value !== "") ? "button cancel-button split" :
                  "button cancel-button single"}
                onClick={() => clearData(fileInputRef, setInvalidState)}>
                  Cancel
              </button>
              <span className="horizontal-spacer" />
              <button
                className={Object.values(templateTargets).every(value => value !== "") ? 
                  "button confirm-button split" : "hidden button confirm-button"}
                onClick={debounce(() => generateFile(currentFile, templateTargets), 500)}>
                  Generate
              </button>
            </div>
          </div>
        )
        :
        <h2 className="error-text">invalid file type or template</h2>
      }
    </div>
  )
}
