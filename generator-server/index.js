import express from "express"
import request from "request";
import multer from "multer";
import dotenv from "dotenv";  // REMOVE FOR PROD

// REMOVE FOR PROD
dotenv.config();

const app = express();

const upload = multer();

// Enable CORS for ExpressJS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Methods, Credentials')
  next()
})

/**
 * Cover letter pdf received in base64 format
 * 
 * Potential flow:
 * Upload pdf as temporary file
 * Parse uploaded pdf for templated strings
 * Response - array of templated strings
 * 
 * returns: object with array of templated words, html doc as string
 */
app.post("/parseFileHandler", upload.single("file"), async (req, res) => {
    let generateUrlRawResponse, generateUrlResponse;

    try {
        // Acquire a presigned url for storing temp instance of our file
        generateUrlRawResponse = await fetch(
            `https://api.pdf.co/v1/file/upload/get-presigned-url?name=${req.file.originalname}&encrypt=false&contentType=application/pdf`, {
            headers: {
                "x-api-key": process.env.PDFKEY
            },
            method: "GET"
        });
    }
    catch (e) {
        console.log(`Failed at getting presigned url step with error ${e}`);
    }

    try {
        generateUrlResponse = await generateUrlRawResponse.json();

        await fetch(generateUrlResponse.presignedUrl, {
            headers: {
                "Content-Type": "application/pdf",
                "x-api-key": process.env.PDFKEY
            },
            method: "PUT",
            body: req.file
        });
    }
    catch (e) {
        console.log(`Failed at upload file step with error ${e}`);
    }

    try {
        // Prepare URL for PDF text search API call.
        // See documentation: https://developer.pdf.co
        var query = `https://api.pdf.co/v1/pdf/find`;
        let reqOptions = {
            uri: query,
            headers: { "x-api-key": process.env.PDFKEY },
            formData: {
                url: generateUrlResponse.url,
                searchString: "/%t(.*?)%t/g"
            }
        };

        // Send request
        request.post(reqOptions, function (error, response, body) {
            if (error) {
                return console.error("Error: ", error);
            }

            // Parse JSON response
            console.log(JSON.parse(body));
        });
    }
    catch (e) {
        console.log(`Failed at parse pdf step with error ${e}`);
    }
});

app.listen(process.env.PORT, error => {
    if (!error) {
        console.log(`Server is Successfully Running, App listening on port ${process.env.PORT}`);
    }
    else {
        console.log(`Error occurred, server can't start due to ${error}`);
    }
});