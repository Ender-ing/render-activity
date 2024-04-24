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
    return fs.readFileSync(path, 'utf-8');
}

// Overwrite file content
function writeContent(path, content){
    fs.writeFileSync(path, content);
}

// Cleanup comments
function cleanComments(content){
    return content.replaceAll(/(\/\/.*)|(\/\*[\s\S]*?\*\/)/g, "");
}

// Cleanup code!
let content = getContent(path);
let newContent = cleanComments(content);
writeContent(path, newContent);