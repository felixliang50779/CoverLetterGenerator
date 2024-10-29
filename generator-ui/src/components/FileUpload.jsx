// Internal Modules
import { clearData } from '../scripts/helper';

// Styling
import '../App.css';

// FileUpload Component
const FileUpload = ({ currentFile, setCurrentFile, fileInputRef, setInvalidState, placeholderFile }) =>{
    return (
      <>
        <label htmlFor="file-upload" className="button single">{currentFile.name}</label>
        <input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          accept=".docx"
          onClick={() => clearData(fileInputRef, setInvalidState)}
          onChange={event => {
            event.target.files[0] ? setCurrentFile({ name: event.target.files[0].name, data: event.target.files[0] }) : 
              setCurrentFile(placeholderFile);
          }}/>
      </>
    );
  };

  export default FileUpload;