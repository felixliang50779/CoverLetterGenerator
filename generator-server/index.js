import express from "express"
import { createReport } from "docx-templates";
import fs from 'fs';
import dotenv from "dotenv";  // REMOVE FOR PROD

// REMOVE FOR PROD
dotenv.config();

const app = express();

app.use(express.json());

// Enable CORS for ExpressJS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Methods, Credentials')
  next()
})


app.post("/generateFileHandler", async (req, res) => {
    console.log(req.body.data);

    const tempDoc = fs.readFileSync(`C:/Users/flian/Downloads/${req.body.template}`);
    const buffer = await createReport({
        template: tempDoc,
        data: req.body.data,
        cmdDelimiter: ["%t", "%t"]
    });

    fs.writeFileSync('modified.docx', buffer);
});

app.listen(process.env.PORT, error => {
    if (!error) {
        console.log(`Server is Successfully Running, App listening on port ${process.env.PORT}`);
    }
    else {
        console.log(`Error occurred, server can't start due to ${error}`);
    }
});