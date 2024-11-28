import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import FloatInput from "../../src/components/FloatInput";

function App() {
    const [tooltipCoords, setTooltipCoords] = useState({});
    const [templateTargets, setTemplateTargets] = useState({});
    const [currentlySelected, setCurrentlySelected] = useState("");

    // LOGGING
    console.log("content script has been injected!");

    // when content script is first loaded
    useEffect(() => {
        // load values for tooltip position, isCollapsed, templatedItems,
        // and currentlySelected from storage into state vars
        chrome.storage.local.get(["tooltipCoords", "isCollapsed"], result => {
            result.tooltipCoords !== undefined ? setTooltipCoords(result.tooltipCoords) : 
                setTooltipCoords({ x: 100.65, y: 200.4 });
            result.isCollapsed !== undefined && setIsCollapsed(result.isCollapsed);
        });
        chrome.storage.session.get(["templateTargets", "currentlySelected"], result => {
            result.templateTargets !== undefined ? setTemplateTargets(result.templateTargets) : setTemplateTargets({});
            result.currentlySelected !== undefined ? setCurrentlySelected(result.currentlySelected) : 
                setCurrentlySelected("");
        });

        // add listeners for storage changes to all of the above to propagate state
        chrome.storage.local.onChanged.addListener((changes, namespace) => {
           if ("tooltipCoords" in changes) {
            changes.tooltipCoords.newValue !== undefined && setTooltipCoords(changes.tooltipCoords.newValue);
           }
        });
        chrome.storage.session.onChanged.addListener((changes, namespace) => {
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
        Object.keys(templateTargets).length
        ?
        <Draggable
            defaultPosition={tooltipCoords}
            cancel={"input"}
            onStop={(e, data) => {
                chrome.storage.local.set({ tooltipCoords: { x: data.x, y: data.y } });
            }}>
                <div>
                    <FloatInput
                        target={currentlySelected}
                        value={templateTargets[currentlySelected]}
                        templateTargets={templateTargets}
                        currentlySelected={"disabled"} />
                </div>
        </Draggable>
        :
        <></>
    );
}

export default App;