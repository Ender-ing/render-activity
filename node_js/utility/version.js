/**
 * 
 * Manage directory versioning
 * 
**/

// node version.js <input_path> <input_key> <source_path> <gloal_increase> <should_auto_increase>

const { arg1, arg2, arg3, arg4, arg5 } = require('./_args');
const { warn, error, info, action } = require('./_console');
const { getContent, writeContent, getJSON, _p, readDirCon } = require('./_files');
const crypto = require('crypto');

// Deep-copy a JSON object
function copyJSONObj(obj){
    return JSON.parse(JSON.stringify(obj));
}

// Get directory hash
function shouldIgnore(item, ignoreList){
    for(let i = 0; i < ignoreList.length; i++){
        if(ignoreList[i][0] == "*" && ignoreList[i].endsWith("*")){
            if(item.indexOf(ignoreList[i].substring(1, ignoreList[i].length - 1)) != -1){
                return true;
            }
        }else if(ignoreList[i][0] == "*"){
            if(item.endsWith(ignoreList[i].substring(1))){
                return true;
            }
        }else if(ignoreList[i].endsWith("*")){
            if(item.startsWith(ignoreList[i].substring(0, ignoreList[i].length - 1))){
                return true;
            }
        }else{
            if(item == ignoreList[i]){
                return true;
            }
        }
    }
    return false;
}
async function dirHash(path, ignore){
    // Define hash
    const hash = crypto.createHash('sha256')

    // Start reading directory
    const directoryEntries = await readDirCon(path);

    for (const entry of directoryEntries) {
        // Respect ignore list!
        if(shouldIgnore(entry.name, ignore)){
            // Skip this item!
            continue;
        }else{
            // Check item type
            const fullPath = _p.join(path, entry.name);
            if (entry.isDirectory()) {
                // Recursively call for subdirectories
                const subDirHash = await dirHash(fullPath, ignore);
                hash.update(subDirHash);
            } else if (entry.isFile()) {
                // Read file contents and update hash
                const fileData = await getContent(fullPath);
                hash.update(fileData);
            }
        }
    }
  
    return hash.digest('hex'); // Digest as a hexadecimal string
}

// Increase version
const MAJOR_MAX = Infinity;
const MINOR_MAX = 99;
const PATCH_MAX = 99;
function updateVersion(increase, version){
    // Check version increase type
    if(increase[0] == 1){
        version.major++;
        version.minor = 0;
        version.patch = 0;
    }else if(increase[1] == 1){
        version.minor++;
        version.patch = 0;
        if(version.minor > MINOR_MAX){
            version = updateVersion([1, 0, 0], version);
        }
    }else if(increase[2] == 1){
        version.patch++;
        if(version.patch > PATCH_MAX){
            version = updateVersion([0, 1, 0], version);
        }
    }else{
        error(`Invalid version increase: ${increase.join()}!`);
    }
    return version;
}

// Check versioning
async function checkVersion(path, name){

    // Get roots.manifest.json
    let source = await getJSON(arg3);

    // Check roots.manifest.json
    if(!(name in source)){
        // Create JSON object
        warn(`Source '${name}' base versioning set to default version! (0.0.0)`);
        source[name] = copyJSONObj(source["$default"]);
        // Get last saved gen.version.txt version
        try{
            let txtVersion = await getContent(_p.join(path, "gen.version.txt"))
            // Check data
            if(txtVersion != null){
                let ver = txtVersion.split(".").map(v => Number(v));
                if(typeof ver[0] == "number" && typeof ver[1] == "number" && typeof ver[2] == "number"){
                    // Restore data
                    info(`Restoring version data for source '${name}'`);
                    source[name].version.major = ver[0];
                    source[name].version.minor = ver[1];
                    source[name].version.patch = ver[2];    
                }
            }
        }catch{}
    }

    // Check for any version increase (command-invoked)
    // <major>.<minor>.<patch> (0/1)
    let verIncrease = arg4.split(".").map((v) => Number(v));
    let verIncreaseVal = verIncrease.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    // Get current hash
    if(!(source["$global_ignore"] instanceof Array)){
        error(`Missing valid global ignore array!`);
    }
    if(!(source[name]?.ignore instanceof Array)){
        error(`Missing valid ignore array from source '${name}'!`);
    }
    let currHash = await dirHash(path, [...source[name].ignore, ...source["$global_ignore"]]);

    // Increase version
    if(verIncreaseVal == 0){
        // Check for changes
        if(currHash != source[name].hash && source[name]?.auto && arg5 == "true"){
            // Auto-increase version
            info(`Auto-updating version of source '${name}'...`);
            source[name].version = updateVersion([0, 0, 1], source[name].version);
        }
    }else{
        action(`Updating version of source '${name}'... (command-invoked)`);
        source[name].version = updateVersion(verIncrease, source[name].version);
    }

    // Update hash
    if(source[name].hash != currHash){
        info(`Updating hash of source '${name}'...`);
    }
    source[name].hash = currHash;

    // Write new version
    let version = null;
    if(source[name]?.version?.major != null && source[name]?.version?.minor != null && source[name]?.version?.patch != null){
        version = source[name].version.major + "." +
                    (source[name].version.minor + "").padStart(2, '0') + "." +
                    (source[name].version.patch + "").padStart(2, '0');
        writeContent(_p.join(arg1, "gen.version.txt"), version);
    }else{
        error(`Missing version data from source '${name}'!`);
    }

    // Update roots.manifest.json file
    writeContent(arg3, JSON.stringify(source, null, 4));
}

checkVersion(arg1, arg2);