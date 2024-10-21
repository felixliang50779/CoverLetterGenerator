import { Buffer } from 'buffer';
import { saveAs } from 'file-saver';
import mammoth from 'mammoth';

export async function parseFile(file, fileReader, setInvalidState) {
  const regex = /%t(.*?)%t/g;

  return new Promise((resolve, reject) => {
    fileReader.onload = async (e) => {
      let arrayBuffer = new Uint8Array(fileReader.result);
      
      let result;

      // Catching invalid file input
      try {
        result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
      }
      catch(e) {
        console.log(e);
        setInvalidState(true);
        return;
      }
      
      // Getting targets duplicates and all
      const rawTargets = result.value.matchAll(regex).toArray().map(match => match[0]);
  
      // Getting unique template targets
      const targets = rawTargets.filter((target, index, self) => {
  
        // checks whether target is the first instance of
        // target value
        return index == self.indexOf(target);
      });

      resolve(targets);
    }

    fileReader.onerror = () => {
      fileReader.abort();
      reject("Error with parsing input file");
    };

    fileReader.readAsArrayBuffer(file);
  })
}
  
export async function convertBase64(file, fileReader) {
  return new Promise((resolve, reject) => {
    fileReader.onload = async (e) => {
      resolve(fileReader.result);
    }

    fileReader.onerror = () => {
      fileReader.abort();
      reject("Failed to convert file to base64 string");
    }
    
    fileReader.readAsDataURL(file);
  });
}

export async function initializeTemplating(currentFile, fileReader, setInvalidState) {
  const [targetArray, targetObj] = await getTemplateTargets(currentFile.data, fileReader, setInvalidState);

  // Catching non-templates
  if (!targetArray.length) {
    setInvalidState(true);
    return;
  }

  const dbUpdates = [];

  // TO-DO: store 'Date' in an array of prefilled targets
  // for future-proofing
  if ("Date" in targetObj) {
    const currentDate = new Date();
    targetObj.Date = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
  }

  // Convert file to base64 for storage
  const base64File = await convertBase64(currentFile.data, fileReader);

  // Update DB
  dbUpdates.push(chrome.storage.session.set({ currentFile: { name: currentFile.name, data: base64File } }));
  dbUpdates.push(chrome.storage.session.set({ templateTargets: targetObj }));
  dbUpdates.push(chrome.storage.session.set({ currentlySelected: targetArray[0] }));


  // Resolve DB updates concurrently
  await Promise.all(dbUpdates);
}
  
export async function generateFile(file, targets) {
  const response = await fetch("https://generator-server-838407650486.us-central1.run.app/generateFileHandler", {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({ data: targets, template: file.data })
  });

  const base64Response = (await response.json()).completedFile;
  const buffer = Buffer.from(base64Response, 'base64');
  const fileBlob = new Blob ([buffer], 
    { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

  saveAs(fileBlob, `Modified ${file.name}`);
}
  
export async function getTemplateTargets(file, fileReader, setInvalidState) {
  // Get raw targets from file template
  const targetArray = await parseFile(file, fileReader, setInvalidState);

  // Strip the '%t' indicators
  const processedTargetArray = targetArray.map(target => target.slice(2, -2)).sort();

  // Reduce the array into an object with empty mappings
  const targetObj = processedTargetArray.reduce((obj, key) => {
    obj[key] = "";
    return obj;
  }, {});

  return [processedTargetArray, targetObj];
}

export function clearData(fileInputRef, setInvalidState) {
  chrome.storage.session.clear(() => {
      var error = chrome.runtime.lastError;
      if (error) {
          console.error(error);
      }
      // clear file input
      fileInputRef.current.value = ""
      setInvalidState(false);
  });
}