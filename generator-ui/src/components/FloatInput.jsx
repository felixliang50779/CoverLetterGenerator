import { useState } from "react";
import { Input } from "antd";

import "./FloatInput.css";

// const { TextArea } = Input;

const FloatInput = (props) => {
  const [focus, setFocus] = useState(false);
  let { label, target, value, currentlySelected, type } = props;

  const isOccupied = focus || (value && value.length > 0);

  const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

  const handleInputChange = async (target, value) => {
    chrome.storage.session.get(["templateTargets"], async (result) => {
      result.templateTargets[target] = value;
      chrome.storage.session.set({ "templateTargets": result.templateTargets });
    })
  };

  return (
    <div
      className='float-label'
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      <Input
        className={currentlySelected === target && "selected"}
        size="large"
        value={value}
        onChange={event => handleInputChange(target, event.target.value)}
        type={type}/>
      <label className={labelClass}>{label}</label>
    </div>
  );
};

export default FloatInput;