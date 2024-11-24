import { useState } from "react";
import { Input } from "antd";

import "./FloatInput.css";

const FloatInput = (props) => {
  const [focus, setFocus] = useState(false);
  let { label, target, value, templateTargets, currentlySelected, type } = props;

  const isOccupied = focus || (value && value.length > 0);

  const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

  const handleInputChange = async (target, value) => {
    templateTargets[target] = value;
    chrome.storage.session.set({ templateTargets: templateTargets });
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