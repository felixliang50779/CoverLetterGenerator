import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import Draggable from "react-draggable";
import FloatInput from "../../src/components/FloatInput";

export default function App() {
    const INITIAL_POSITION = { x: 100.65, y: 200.4 };

    const [tooltipCoords, setTooltipCoords] = useState(INITIAL_POSITION);
    const [templateTargets, setTemplateTargets] = useState({});
    const [currentlySelected, setCurrentlySelected] = useState("");

    const [tooltipVisible, setTooltipVisible] = useState(true);

    // when content script is first loaded
    useEffect(() => {
        // load values for tooltip position, templatedItems, and currentlySelected from storage into state vars
        chrome.storage.local.get(["tooltipCoords"], result => {
            result.tooltipCoords !== undefined ? setTooltipCoords(result.tooltipCoords) : 
                setTooltipCoords(INITIAL_POSITION);
        });
        chrome.storage.session.get(["templateTargets", "currentlySelected", "tooltipVisible"], result => {
            result.templateTargets !== undefined ? setTemplateTargets(result.templateTargets) : setTemplateTargets({});
            result.currentlySelected !== undefined ? setCurrentlySelected(result.currentlySelected) : 
                setCurrentlySelected("");
            result.tooltipVisible !== undefined ? setTooltipVisible(result.tooltipVisible) :
                chrome.storage.session.set({ tooltipVisible: true });
        });

        // add listeners for storage changes to all of the above to propagate state
        chrome.storage.local.onChanged.addListener((changes, namespace) => {
            if ("tooltipCoords" in changes) {
                changes.tooltipCoords.newValue !== undefined ? setTooltipCoords(changes.tooltipCoords.newValue) :
                    setTooltipCoords(INITIAL_POSITION);
            }
        });
        chrome.storage.session.onChanged.addListener((changes, namespace) => {
            if ("templateTargets" in changes) {
                changes.templateTargets.newValue !== undefined ? 
                    flushSync(() => setTemplateTargets(changes.templateTargets.newValue)) : setTemplateTargets({});
            }
            if ("currentlySelected" in changes) {
                changes.currentlySelected.newValue !== undefined ? setCurrentlySelected(changes.currentlySelected.newValue) :
                    setCurrentlySelected("");
            }
            if ("tooltipVisible" in changes) {
                changes.tooltipVisible.newValue !== undefined ? setTooltipVisible(changes.tooltipVisible.newValue) :
                    setTooltipVisible(true);
            }
        });

        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message === "toggleTooltip") {
                chrome.storage.session.get(["tooltipVisible"], result => {
                    chrome.storage.session.set({ tooltipVisible: !result.tooltipVisible });
                });
            }
        });
    }, []);

    return (
        Object.keys(templateTargets).length && tooltipVisible
        ?
        <Draggable
            defaultPosition={tooltipCoords}
            bounds="html"
            cancel={"input"}
            onStop={(e, data) => chrome.storage.local.set({ tooltipCoords: { x: data.x, y: data.y } }) }>
                <div>
                    <FloatInput
                        target={currentlySelected}
                        value={templateTargets[currentlySelected]}
                        templateTargets={templateTargets}
                        isTooltip={true}
                        currentlySelected={currentlySelected} />
                </div>
        </Draggable>
        :
        <></>
    );
}