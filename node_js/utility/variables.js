/**
 * 
 * Manage variable replacement
 * 
**/

// node variables.js <input_path> <source_path> <output_path>

// Get file-system functions
const { arg1, arg2, arg3 } = require('./_args');
const { getContent, writeContent, getJSON } = require('./_files');
const { replaceVars } = require('./_replace_variables');

async function replaceVariables(){
    let source = await getJSON(arg2);

    let content = await getContent(arg1);

    content = replaceVars(source, content);
    
    writeContent(arg3, content);
}

replaceVariables();