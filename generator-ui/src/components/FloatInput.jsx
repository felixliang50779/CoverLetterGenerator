// External Modules
import { useState, useRef } from "react";
import { Input } from "antd";

// Styling
import "./FloatInput.css";


const FloatInput = (props) => {
  const MAX_LABEL_LENGTH = 45;
  
  // state vars and references
  const [focus, setFocus] = useState(false);
  const position = useRef({
    beforeStart: 0,
    beforeEnd: 0
  });
  const inputRef = useRef(null);

  const { target, value, templateTargets, currentlySelected, type, isTooltip } = props;
  const label = target.length >= MAX_LABEL_LENGTH ? target.slice(0, MAX_LABEL_LENGTH) + "..." : target;
  const isOccupied = focus || (value && value.length > 0);
  const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

  const handleInputChange = async (event, target) => {
    const beforeStart = event.target.selectionStart;
    const beforeEnd = event.target.selectionEnd;

    position.current = {
      beforeStart,
      beforeEnd
    };

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
      <div className={!isTooltip && "hidden"}>drag me</div>
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