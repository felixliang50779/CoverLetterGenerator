import { useState } from "react";
import { Input } from "antd";

import "./FloatInput.css";

const FloatInput = (props) => {
  const [focus, setFocus] = useState(false);
  let { label, placeholder, target, value, setTemplateTargets, type, required } = props;

  if (!placeholder) placeholder = label;

  console.log(value);

  const isOccupied = focus || (value && value.length > 0);

  const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

  const requiredMark = required ? <span className="text-danger">*</span> : null;

  const handleInputChange = (target, value) => {
    setTemplateTargets(prevState => {
      const updatedObj = JSON.parse(JSON.stringify(prevState));
      updatedObj[target] = value;
      return updatedObj;
    });
  };

  return (
    <div
      className="float-label"
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      <Input
        size="large"
        value={value}
        onChange={event => handleInputChange(target, event.target.value)}
        type={type}
        style={{
          backgroundColor: "#1a1a1a"
        }}/>
      <label className={labelClass}>
        {isOccupied ? label : placeholder} {requiredMark}
      </label>
    </div>
  );
};

export default FloatInput;