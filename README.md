# CoverLetterGenerator
- chrome extension to quickly fill out cover letter templates

# Usage
- Visit https://chromewebstore.google.com/detail/cover-letter-generator/bcbacpbjnaofjickhkhlcpemelfigipn to view features and usage instructions

# Im a Dev
- Clone this repository to a location on your computer
- Make sure you have `NodeJS` installed
- To install dependencies run `npm install` in both the `generator-server` and `generator-ui` directories
- Run `npm run build` in `generator-ui` to build the extension
- Run `npm start` in `generator-server` to start the file generation server
- To install the extension within your browser:
    - Ensure you are using Google Chrome
    - Head to `chrome://extensions`
    - Select "Load unpacked"
    - Select the directory where you cloned the project to and make sure you select the `./CoverLetterGenerator/generator-ui/build` folder

# Why not use an AI Tool?
- Most major companies have tools to automatically reject applications that have been suspected to leverage LLMs
- Due to the nature of LLMs, they are susceptible to hallucinating information that isn't real

# Note
- This tool is simply for templating sections of your cover letter - it is not meant for people who want the
entire thing written for them