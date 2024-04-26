/**
 * 
 * Generate web manifest
 * 
**/

// node manifest.js <input_path> <source_path> <output_path>

// Get file-system functions
const { path, path2, path3, getContent, writeContent, getJSON } = require('./_files');
const { replaceVars } = require('./_replace_variables');

let source = getJSON(path2);

async function generateManifest(){
    let content = await getContent(path);

    content = replaceVars(source, content);
    
    writeContent(path3, content);
}

generateManifest();