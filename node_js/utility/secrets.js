/**
 * 
 * Manage @secret@ directories
 * 
**/

// node secrets.js <input_path> <build_path>

// Get file-system functions
const { path, path2, _p, readDirCon, copyFile } = require('./_files');

// Scan through a directory recursively
async function scanDir(dir, source, base, components = {}){
    const files = await readDirCon(dir);
    const compRep = {...components};
    for (const file of files) {
        // Get absolute path
        const filePath = _p.join(dir, file.name);
        // Ignore gen.** files and directories
        if(file.name.indexOf("gen.") == -1){
            if (file.isDirectory()) {
                // secure "secret" directories!
                if(file.name.indexOf("@secret") != -1 || file.name.indexOf("secret@") != -1){
                    await copyFile(_p.join(path2, "global", "private.htaccess"), _p.join(filePath, ".htaccess"));
                }
                // Search sub-directories
                await scanDir(filePath, source, base, compRep);
            }
        }     
    }
}

// Process the @secret@ directories
async function processSecret(){
    // Start scan
    await scanDir(path, {}, path);
}

processSecret();