/**
 * 
 * Manage locale language expressions
 * 
**/

// locale_expression.js <input_path> <base_path> <global_locale_path>

const { path, path2, path3, getContent } = require("./_files");
const { writeContentMultiLang } = require("./_lang");

async function processFileLangExp(){
    // Get file content
    let content = await getContent(path);

    // Write files!
    await writeContentMultiLang(path2, path, content, path3);
}

processFileLangExp();