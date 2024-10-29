// External Modules
import { Card } from "antd";
import { SelectOutlined } from "@ant-design/icons";
import FloatInput from './FloatInput';

// Styling
import '../App.css';



// TemplateItems Component
const TemplateItems = ({ templateTargets, setTemplateTargets, currentlySelected }) => {
    const MAX_LABEL_LENGTH = 45;
    
    return (
      <Card title="Templated Items">
        {
          Object.entries(templateTargets).map(([target, value]) => (
            <div className="input-group" key={target}>
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
          ))
        }
      </Card>
    );
  };

  export default TemplateItems;