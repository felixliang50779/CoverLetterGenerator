import { Buffer } from 'buffer';
import { saveAs } from 'file-saver';
import mammoth from 'mammoth';

export async function parseFile(file, fileReader) {
    const regex = /%t(.*?)%t/g;
  
    return new Promise((resolve, reject) => {
      fileReader.onload = async (e) => {
        let arrayBuffer = new Uint8Array(fileReader.result);
        
        let result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
        
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

export async function initializeTemplating(currentFile, fileReader) {
    const [targetArray, targetObj] = await getTemplateTargets(currentFile.data, fileReader);
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
    dbUpdates.push(chrome.storage.session.set(
      { templateMetadata: { currentlySelected: targetArray[0], numTargets: targetArray.length } }));


    // Resolve DB updates concurrently
    await Promise.all(dbUpdates);
}
  
export async function generateFile(file, targets) {
    const response = await fetch("http://localhost:8080/generateFileHandler", {
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
  
export async function getTemplateTargets(file, fileReader) {
    // Get raw targets from file template
    const targetArray = await parseFile(file, fileReader);
  
    // Strip the '%t' indicators
    const processedTargetArray = targetArray.map(target => target.slice(2, -2));
  
    // Reduce the array into an object with empty mappings
    const targetObj = processedTargetArray.reduce((obj, key) => {
      obj[key] = "";
      return obj;
    }, {});
  
    return [processedTargetArray, targetObj];
}