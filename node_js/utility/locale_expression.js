/**
 * 
 * Manage locale language expressions
 * 
**/

// locale_expression.js <input_path> <base_path> <global_locale_path>

const { arg1, arg2, arg3 } = require("./_args");
const { getContent } = require("./_files");
const { writeContentMultiLang } = require("./_lang");

async function processFileLangExp(){
    // Get file content
    let content = await getContent(arg1);

    // Write files!
    await writeContentMultiLang(arg2, arg1, content, arg3);
}

processFileLangExp();