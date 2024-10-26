import { createReport } from "docx-templates";
import base64 from 'base64-arraybuffer';
import express from "express";

const expected_origin = process.env.NODE_ENV === "production" ?
    "chrome-extension://bcbacpbjnaofjickhkhlcpemelfigipn"
    :
    "chrome-extension://coclhjligokibmfjkdgkiopecoldfjnl";

const app = express();

const app_port = process.env.PORT || 8080;

app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', expected_origin)
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Methods, Credentials')
  next()
});


app.post("/generateFileHandler", async (req, res) => {
    const arrayBuffer = base64.decode(req.body.template);

    // Rewriting template targets in file
    const buffer = await createReport({
        template: arrayBuffer,
        data: req.body.data,
        cmdDelimiter: ["%t", "%t"]
    });

    res.send({ completedFile: base64.encode(buffer) });
});

app.listen(app_port, error => {
    if (!error) {
        console.log(`Server is Successfully Running, App listening on port ${app_port}`);
    }
    else {
        console.log(`Server failed to start - ${error}`);
    }
});