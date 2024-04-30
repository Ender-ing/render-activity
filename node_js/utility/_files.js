/**
 * 
 * File-management functions
 * 
**/

const fs = require('fs');
const pathM = require('path');

//var p = require('path');
// p.join <Function>

// Get input/output paths
const path = process.argv[2];
const path2 = process.argv[3];
const path3 = process.argv[4];

// Read the contents of a directory
function readDirCon(path){
    return new Promise((resolve, reject) => {
        // For some reason, I can't use `await fs.readdir(...)`
        fs.readdir(path, { withFileTypes: true }, (err, files) => { 
            if (err) { 
                reject(err);
            } else {
                resolve(files);
            } 
        });
    });
}

// Get the stats of a file
function getFileStats(path){
    return new Promise((resolve, reject) => {
        // For some reason, I can't use `await fs.stat(...)`
        fs.stat(path, (error, stats) => { 
            if (error) { 
              reject(error); 
            } else { 
                resolve(stats); 
            } 
        }); 
    });
}

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

// Get the latest modification time of all files within a directory
// Returns a timestamp
async function latestDirFileMod(path) {
    let latestModified = null;
  
    const files = await readDirCon(path);

    for (const file of files) {
        if (!file.isDirectory()) { // Skip directories
            const filePath = pathM.join(path, file.name);
            const stats = await getFileStats(filePath);
  
            if (latestModified === null || stats.mtimeMs > latestModified.getTime()) {
                latestModified = stats.mtime;
            }
        }
    }
    return latestModified;
}

module.exports = {
    _p: pathM,
    path,
    path2,
    path3,
    readDirCon,
    latestDirFileMod,
    getContent,
    writeContent,
    getJSON
    //_path: p
};