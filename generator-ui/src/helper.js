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
  
export async function generateFile(file, targets) {
  
    // Manually setting replacement text here for testing
    const replacementTexts = ['10/13/2024', 'McDonalds', 'Deloitte', 'We hate everything', "Human Resources", "HR Intern", "Mom and Dad", "HR Firing Squad"];
  
  
    // Mapping to the wrong targets here as objects don't preserve order
    // working version will use 'targets' itself as the replacementObj so should be ok
    const replacementObj = {};
    for (let i = 0; i < Object.keys(targets).length ; i++) {
      replacementObj[Object.keys(targets)[i]] = replacementTexts[i];
    }
  
    const response = await fetch("http://localhost:8080/generateFileHandler", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ data: replacementObj, template: file.data })
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