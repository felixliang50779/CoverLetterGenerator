# CoverLetterGenerator
- chrome extension to quickly fill out cover letter templates

# wHY NoT jUSt uSe cHaT gPT?
- Given that most major companies have tools that automatically reject applications that have been suspected to leverage LLMs, it is not worth the risk using chat gpt and other LLMs to automate the task of tailoring company/position keywords to the application you are currently filling out. Even if you directly specify to the LLM to *only* replace the keywords of your chosing, there is no gurantee that this will work 100% of the time due to the nature of LLMs and their susceptibility to "hallucinate"
- ConvertLetterGenerator offers a more reliable solution to the same problem where the user can be notified of the exact changes made to the original document as well as perform the replacements and prepare a file ready to submit to a portal in a timeframe class similar to that of using an LLM

# Dev/Usage Notes
- First clone this repository to a location on your computer
- Make sure you have `npm` installed
- To install dependencies run `npm install` in both the `generator-server` and `generator-ui` directories
- To launch the extension within your browser:
    - Ensure you are using a chromium based browser
    - Head to `chrome://extensions`
    - Select "Load unpacked"
    - Select the directory where you cloned the project to and make sure you select the `./CoverLetterGenerator/generator-ui/build` folder
    - To test if extension has loaded successfully, open the extension and you should see a pop with "Cover Letter Generator" displayed obnoxiously