// External Modules
import debounce from "debounce";

// Internal Modules
import { generateFile, clearData } from '../scripts/helper';

// ButtonGroup Component
const ButtonGroup = ({ templateTargets, fileInputRef, setInvalidState, currentFile }) => {
  const allowGenerate = Object.values(templateTargets).every(value => value !== "");

  return (
    <div className="button-group">
      <button
        className={Object.values(templateTargets).every(value => value !== "") ? "button cancel-button split" :
          "button cancel-button single"}
        onClick={() => clearData(fileInputRef, setInvalidState)}>
          Cancel
      </button>
      <span className="horizontal-spacer" />
      <button
        hidden={!allowGenerate}
        className={allowGenerate ? "button confirm-button split" : "button confirm-button"}
        onClick={debounce(() => generateFile(currentFile, templateTargets), 500)}>
          Generate
      </button>
    </div>
  );
};

export default ButtonGroup;