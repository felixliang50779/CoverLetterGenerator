import { useState } from "react";
import { Input } from "antd";

import "./FloatInput.css";


// import Modal from './Modal';

const { TextArea } = Input;

const FloatInput = (props) => {
  const [focus, setFocus] = useState(false);
  let { label, target, value, currentlySelected, type } = props;

  const isOccupied = focus || (value && value.length > 0);

  const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

    // // Modal State Variables
    // const [isModalOpen, setModalOpen] = useState(false);
    // const [modalMessage, setModalMessage] = useState('');
  
    //   // Modal Event Handler Function
    //   const handleUpdate = () => {
    //     // Perform some update logic
    //     setModalMessage('State updated successfully!');
    //     setModalOpen(true); // Open modal
    //     console.log("ran modal function");
    //   };

  const handleInputChange = async (target, value) => {
    chrome.storage.session.get(["templateTargets"], async (result) => {
      result.templateTargets[target] = value;
      chrome.storage.session.set({ templateTargets: result.templateTargets });
    })
    // handleUpdate();
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
      {/* <Modal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        message={modalMessage} 
      /> */}
    </div>
  );
};

export default FloatInput;