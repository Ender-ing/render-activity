/**
 * 
 * File-management functions
 * 
**/

const fs = require('fs');

//var p = require('path');
// p.join <Function>

// Get input/output paths
const path = process.argv[2];
const path2 = process.argv[3];
const path3 = process.argv[4];

// Get file content
async function getContent(path){
    return await fs.readFileSync(path, 'utf-8');
}

// Get a JSON file
async function getJSON(path){
    return JSON.parse(await getContent(path));
}

// Overwrite file content
async function writeContent(path, content){
    await fs.writeFileSync(path, content);
}

module.exports = {
    path,
    path2,
    path3,
    getContent,
    writeContent,
    getJSON
    //_path: p
};