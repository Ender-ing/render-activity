/**
 * 
 * Manage placeholder replacement
 * 
**/

// node placeholder.js <input_path> <value_path>/<value> <placeholder_key>
// (Will change input file!)

// Get file-system functions
const { arg1, arg2, arg3 } = require('./_args');
const { getContent, writeContent, fileExists } = require('./_files');
const { replacePlaceholder } = require('./_replace_variables');

async function replace(path, placeholder, _value){
    let value = (await fileExists(_value)) ? await getContent(_value) : _value;

    let content = await getContent(path);

    content = replacePlaceholder(content, placeholder, value);

    writeContent(path, content);
}

replace(arg1, arg3, arg2);
