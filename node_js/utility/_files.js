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
const path4 = process.argv[5];

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
async function _getJSON(path){
    let r;
    try{
        r = await getContent(path);
    }catch{
        r = "{}";
    }
    return JSON.parse(r);
}

// Overwrite file content
async function writeContent(path, content){
    await fs.writeFileSync(path, content);
}

// Write a file (when you are not sure if the directory already exists)
function _writeContent(path, content){
    return new Promise(function(resolve, reject) {
        fs.mkdir(pathM.dirname(path), { recursive: true}, async function (err) {
            if (err) {
                reject(err);
                throw err;
            }    
            let r = await fs.writeFileSync(path, content);
            resolve(r);
        });    
    });
}

// Delete a file
async function deleteFile(path){
    await fs.unlinkSync(path);
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

function deleteEmptyFolders(dirPath) {
    if (!fs.existsSync(dirPath)) return; // Exit if the path doesn't exist

    const files = fs.readdirSync(dirPath);

    if (!files.length) {
        // If the directory is empty, delete it
        fs.rmdirSync(dirPath);
    } else {
        // If it has files/folders, recurse into subdirectories
        files.forEach(file => {
            const filePath = pathM.join(dirPath, file);
            if (fs.statSync(filePath).isDirectory()) {
                deleteEmptyFolders(filePath); 
            }
        });

        // Recheck if the directory is now empty (it might be after recursion)
        if (!fs.readdirSync(dirPath).length) {
            fs.rmdirSync(dirPath);
        }
    }
}

module.exports = {
    _p: pathM,
    path,
    path2,
    path3,
    path4,
    readDirCon,
    latestDirFileMod,
    getContent,
    writeContent,
    _writeContent,
    deleteFile,
    getJSON,
    _getJSON,
    deleteEmptyFolders
    //_path: p
};