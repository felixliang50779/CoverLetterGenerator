// External Modules
import { useState, useEffect, useRef } from 'react';

// Internal Modules
import { initializeTemplating } from './scripts/helper';
import FileUpload from './components/FileUpload';
import TemplateItems from './components/TemplateItems';
import ButtonGroup from './components/ButtonGroup';

// Styling
import './App.css';


// App Component
export default function App() {
  const PLACEHOLDER_FILE = { name: "Choose a File (.docx)", data: {} };
  const FILE_READER = new FileReader();

  const [currentFile, setCurrentFile] = useState(PLACEHOLDER_FILE);
  const [templateTargets, setTemplateTargets] = useState({});
  const [currentlySelected, setCurrentlySelected] = useState("");
  const [invalidState, setInvalidState] = useState(false);

  const fileInputRef = useRef();

  useEffect(() => {
    chrome.storage.session.get(["currentFile", "templateTargets", "currentlySelected"], result => {
      result.currentFile !== undefined ? setCurrentFile(result.currentFile) : setCurrentFile(PLACEHOLDER_FILE);
      result.templateTargets !== undefined ? setTemplateTargets(result.templateTargets) : setTemplateTargets({});
      result.currentlySelected !== undefined ? setCurrentlySelected(result.currentlySelected) : setCurrentlySelected("");
    });

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
            onClick={() => initializeTemplating(currentFile, FILE_READER, setInvalidState)}>
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