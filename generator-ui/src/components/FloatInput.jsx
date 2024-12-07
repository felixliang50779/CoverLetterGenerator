// External Modules
import { useState, useRef } from "react";
import { Input } from "antd";

// Styling
import "./FloatInput.css";


const FloatInput = (props) => {
  // Constants
  const MAX_LABEL_PLACEHOLDER_LENGTH = 20;
  const MAX_LABEL_FLOATING_LENGTH = 30;
  
  // state vars and references
  const [focus, setFocus] = useState(false);
  const inputRef = useRef(null);

  const { target, value, templateTargets, currentlySelected, type, isTooltip } = props;
  const isOccupied = focus || (value && value.length > 0);
  const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

  let label;
  if (!isOccupied && target.length >= MAX_LABEL_PLACEHOLDER_LENGTH) {
    label = target.slice(0, MAX_LABEL_PLACEHOLDER_LENGTH) + "...";
  }
  else if (isOccupied && target.length >= MAX_LABEL_FLOATING_LENGTH) {
    label = target.slice(0, MAX_LABEL_FLOATING_LENGTH) + "...";
  }
  else {
    label = target;
  }

  const handleInputChange = async (event, target) => {
    const beforeStart = event.target.selectionStart;
    const beforeEnd = event.target.selectionEnd;

    templateTargets[target] = event.target.value;
    chrome.storage.session.set({ templateTargets: templateTargets }, () => {
      inputRef.current.setSelectionRange(beforeStart, beforeEnd);
    });
  };

  return (
    <div
      className={'float-label'}
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      <Input
        ref={inputRef}
        className={currentlySelected === target && "selected"}
        size="large"
        value={value}
        onChange={event => handleInputChange(event, target)}
        type={type}/>
      <label className={labelClass}>{label}</label>
    </div>
  );
};

export default FloatInput;