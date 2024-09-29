import express from "express"
import dotenv from "dotenv";  // REMOVE FOR PROD
import { PdfToHtmlClient } from 'pdfcrowd';

// REMOVE FOR PROD
dotenv.config();

const conversionClient = new PdfToHtmlClient(process.env.USERNAME, process.env.KEY);
const app = express();

// Enable CORS for ExpressJS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Methods, Credentials')
  next()
})

app.post("/processFileHandler", (req, res) => {
    
});

app.listen(process.env.PORT, error => {
    if (!error) {
        console.log(`Server is Successfully Running, App listening on port ${process.env.PORT}`);
    }
    else {
        console.log(`Error occurred, server can't start due to ${error}`);
    }
});