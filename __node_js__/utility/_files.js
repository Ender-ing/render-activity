/**
 * 
 * File-management functions
 * 
**/

const fs = require('fs');

var p = require('path');
// p.join <Function>

// Get input/output paths
const path = process.argv[2];
const path2 = process.argv[3];

// Get file content
async function getContent(path){
    return await fs.readFileSync(path, 'utf-8');
}

// Overwrite file content
async function writeContent(path, content){
    await fs.writeFileSync(path, content);
}

module.exports = {
    path,
    path2,
    getContent,
    writeContent,
    _path: p
};