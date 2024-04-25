/**
 * 
 * Remove comments from files
 * 
**/

// node __clean_comments__.js <path>

const fs = require('fs');

// Get input (same as output) path
const path = process.argv[2];

// Get file content
async function getContent(path){
    return await fs.readFileSync(path, 'utf-8');
}

// Overwrite file content
async function writeContent(path, content){
    await fs.writeFileSync(path, content);
}

// Clean comments
function cleanComments(content){
    return content.replaceAll(/(\/\/.*)|(\/\*[\s\S]*?\*\/)/g, "");
}

// Cleanup whitespace
function cleanWhitespace(text) {
    let inQuotes = false;
    let currentQuote = null;
    let cleanedText = '';
  
    for (const char of text) {
        if ((char === '"' || char === "'" || char === '`') && (currentQuote == null || currentQuote === char)) {
            inQuotes = !inQuotes;
            if(inQuotes){
                currentQuote = char;
            }else{
                currentQuote = null;
            }
            cleanedText += char;
        } else if (char.match(/\s/) && !inQuotes) {
            if (cleanedText.length === 0 || cleanedText.slice(-1) !== ' ') {
                cleanedText += ' '; // Add only a single space as needed
            }
        } else {
            cleanedText += char;
        }
    }
  
    return cleanedText;
}

// Cleanup comments
async function cleanupContent(path){
    let content = await getContent(path);
    content = cleanComments(content);
    content = cleanWhitespace(content);
    await writeContent(path, content);
}

// Cleanup code!
cleanupContent(path);