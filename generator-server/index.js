import express from "express"
import dotenv from "dotenv";  // REMOVE FOR PROD
import base64 from "base64topdf";
import fs from "fs";
import pdftohtml from "@dsardar099/pdf-to-html";

// REMOVE FOR PROD
dotenv.config();

const app = express();

// Enable CORS for ExpressJS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Methods, Credentials')
  next()
})

app.use(express.json());

/**
 * Cover letter pdf received in "multipart/form-data" format
 * 
 * Potential flow:
 * Download pdf on server
 * Convert pdf to html
 * parse html with regex for templated words/phrases
 * 
 * returns: object with array of templated words, html doc as string
 */
app.post("/parseFileHandler", async (req, res) => {
    // Decode encoded string into pdf file and save it
    base64.base64Decode(req.body.fileString, 'result.pdf');

    // Convert pdf to html
    const converter = new pdftohtml('result.pdf', 'result.html');
    await converter.convert();
    
    // Read the HTML file
    fs.readFile('result.html', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read the HTML file' });
        }
        
        const regExp = /%t(.*?)%t/g;
        const matchedTargets = [...data.matchAll(regExp)];
        console.log(matchedTargets);
        res.send(matchedTargets);
    });
});

app.listen(process.env.PORT, error => {
    if (!error) {
        console.log(`Server is Successfully Running, App listening on port ${process.env.PORT}`);
    }
    else {
        console.log(`Error occurred, server can't start due to ${error}`);
    }
});