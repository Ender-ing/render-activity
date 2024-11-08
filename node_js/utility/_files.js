/**
 * 
 * File-management functions
 * 
**/

const { error } = require('console');
const fs = require('fs');
const pathM = require('path');

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
    try{
        await fs.writeFileSync(path, content);
        return true;
    }catch(e){
        return false;
    }
}

// Write a file (when you are not sure if the directory already exists)
function _writeContent(path, content){
    return new Promise(function(resolve, reject) {
        fs.mkdir(pathM.dirname(path), { recursive: true}, async function (err) {
            if (err) {
                reject(err);
                error(err);
            }    
            let r = await fs.writeFileSync(path, content);
            resolve(r);
        });    
    });
}

// Copy a file
function copyFile(src, dest){
    return new Promise(function(resolve, reject) {
        fs.copyFile(src, dest, (err) => {
            if (err) {
                reject(err);
                error(err);
            }
            resolve(null);
        });
    });
}

// Delete a file
async function deleteFile(path){
    await fs.unlinkSync(path);
}

// Check if a file path is correct
async function fileExists(path){
    try {
        const normalizedPath = pathM.normalize(path); // Normalize path
        await fs.promises.access(normalizedPath, fs.constants.F_OK); // Check file existence
        return true;
    } catch (err) {
        return false;
    }
}

// Check if a folder path is correct
async function folderExists(path){
    try {
        const normalizedPath = pathM.normalize(path); // Normalize path
        await fs.promises.access(normalizedPath, fs.constants.F_OK | fs.constants.R_OK); // Check file existence
        return true;
    } catch (err) {
        return false;
    }
}

// Rename the name of a folder
async function renameFolder(oldPath, newPath){
    console.log("PATHS:", oldPath, newPath);
    try{
        await fs.promises.rename(oldPath, newPath);
        return true;
    }catch(err){
        error(err);
        return false;
    }
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
    readDirCon,
    latestDirFileMod,
    getContent,
    writeContent,
    _writeContent,
    copyFile,
    deleteFile,
    fileExists,
    folderExists,
    renameFolder,
    getJSON,
    _getJSON,
    deleteEmptyFolders
    //_path: p
};