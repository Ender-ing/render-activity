/**
 * 
 * Manage language expressions
 * 
**/

const { warn, error, CONSOLE_SOFT_ERROR } = require("./_console");
const { _p, _writeContent, deleteFile, _getJSON } = require("./_files");

// Default language
const defaultLang = "en";

// Get JSON value by string
function getJSONValueByPath(obj, path, lang, sourcePath, supress = false) {
    let pathParts = path.split('.');

    // Detect expression language
    let expLang = lang;
    if(pathParts[0].indexOf(":") != -1){
        let parts = pathParts[0].split(":");
        if(parts[0].length == 2){
            // Update language
            expLang = parts[0];
            // Update first path value
            pathParts[0] = parts[1];
        }else{
            error(`Invalid source language expression! (correct format: 'XX:...')`, `(expression path '${path}')`, `(at ${sourcePath})`, CONSOLE_SOFT_ERROR);
        }
    }

    // Check if the source language is defined!
    if(obj[expLang] == null){
        if(expLang != defaultLang){
            warn(`Undefined language code, falling back to default language! (${expLang} => ${defaultLang})`, `(expression path '${path}')`, `(at ${sourcePath})`);
            expLang = defaultLang;
        }else{
            error(`Undefined language code! (${expLang})`, `(expression path '${path}')`, `(at ${sourcePath})`, CONSOLE_SOFT_ERROR);
        }
    }

    let current = obj[expLang]; // Start at the root object
    // Catch out-of-bound paths
    try{
        for (let part of pathParts) {
            current = current[part];

            // Check value
            if (current === undefined) {
                break;
            }
        }
    }catch{
        if(!supress){
            error(`Invalid language expression path!`, `(expression path '${path}')`, `(at ${sourcePath})`, CONSOLE_SOFT_ERROR);
        }
        current = undefined;
    }

    // Check if a value was found
    if(current == undefined && !supress){
        error(`Invalid language expression path!`, `(expression path '${path}')`, `(at ${sourcePath})`, CONSOLE_SOFT_ERROR);
    }

    return current;
}

// Process language expression strings
function processLocaleStrInput(varString, localeObj, globalObj, lang, sourcePath){
    let vars = varString.split(",").map(val => {
        if(val.indexOf("`") != -1){
            return val.match(/`(.*?)`/, "$1")[1];
        }else if(val != null && val != ''){
            let id = val.replaceAll(/\s/g, "");
            if(id.indexOf("$") == 0){
                id = id.substring(1);
                return getJSONValueByPath(globalObj, id, lang, sourcePath);
            }else if(id.indexOf("?") == 0){
                id = id.substring(1);
                let value = getJSONValueByPath(localeObj, id, lang, sourcePath, true); // supress value error
                if(value != undefined){
                    return value;
                }else{
                    return getJSONValueByPath(globalObj, id, lang, sourcePath);
                }
            }else{
                return getJSONValueByPath(localeObj, id, lang, sourcePath);
            }
        }else{
            return val;
        }
    });
    return vars;
}

// Replace values inside language expression strings
function replaceLocaleStrVars(value, vars, localeObj, globalObj, lang, sourcePath){
    let newVal = value;
    if(vars != null && vars.replaceAll(/\s/g, "") != ''){
        let vs = processLocaleStrInput(vars, localeObj, globalObj, lang, sourcePath);
        for(let i = 0; i < vs.length; i++){
            newVal = newVal.replaceAll("$" + (i + 1), `<bdi>${vs[i]}</bdi>`);
        }
    }
    return newVal;
}

// Replace content lang
function localiseOutput(value, localeObj, globalObj, lang, sourcePath){
    // Check if result needs to be processed too!
    if((/\{\{|\}\}/g).test(value)){
        return replaceLangExp(value, localeObj, globalObj, lang, sourcePath);
    }else{
        return value;
    }
}
function replaceLangExp(content, localeObj, globalObj, lang, sourcePath){
    let result;
    return content.replaceAll(/\{\{(.*?)\}\[?(.*?)\]?\}/g, (match, idString, varString) => {
        let id = idString.replaceAll(/\s/g, "");
        if(id[0] === "$"){
            result = replaceLocaleStrVars(getJSONValueByPath(globalObj, id.substring(1), lang, sourcePath), varString, localeObj, globalObj, lang, sourcePath);
            return localiseOutput(result, localeObj, globalObj, lang, sourcePath);
        }else{
            let fallback = id[0] == "?";
            if(fallback){
                let value = getJSONValueByPath(localeObj, id.substring(fallback), lang, sourcePath, true);
                if(value != undefined){
                    result = replaceLocaleStrVars(value, varString, localeObj, globalObj, lang, sourcePath);
                    return localiseOutput(result, localeObj, globalObj, lang, sourcePath);
                }else{
                    result = replaceLocaleStrVars(getJSONValueByPath(globalObj, id.substring(fallback), lang, sourcePath), varString, localeObj, globalObj, lang, sourcePath);
                    return localiseOutput(result, localeObj, globalObj, lang, sourcePath);
                }
            }else{
                let value = getJSONValueByPath(localeObj, id.substring(fallback), lang, sourcePath);
                result = replaceLocaleStrVars(value, varString, localeObj, globalObj, lang, sourcePath);
                return localiseOutput(result, localeObj, globalObj, lang, sourcePath);
            }
        }
    });
}

// Get .locale files
async function getLocaleObject(path){
    // Get .locale files
    let r = {
        ar: await _getJSON(_p.join(path, "ar.locale")) || null,
        en: await _getJSON(_p.join(path, "en.locale")) || null,
        he: await _getJSON(_p.join(path, "he.locale")) || null
    };
    if(r.ar == null){
        warn(`Empty locale file detected! (in ${path} => ar.locale)`);
        r.ar = {};
    }
    if(r.he == null){
        warn(`Empty locale file detected! (in ${path} => he.locale)`);
        r.he = {};
    }
    if(r.en == null){
        warn(`Empty locale file detected! (in ${path} => en.locale)`);
        r.en = {};
    }
    return r;
}

// Generate language directory out of display files
let globalOBj = null,
    localeObj = null;
async function writeLangContent(base, path, lang, content){
    let newPath = _p.join(base, lang, path.replace(base, ""));
    let newContent = content;
    // Get locale objects
    // Replace language expressions
    newContent = replaceLangExp(newContent, localeObj, globalOBj, lang, path);
    // Write new content
    _writeContent(newPath, newContent);
}
async function writeContentMultiLang(base, path, content, globalPath, del = true){
    // Get locale objects
    globalOBj = await getLocaleObject(_p.join(globalPath, "global", "locale"));
    localeObj = await getLocaleObject(_p.dirname(path));

    // Write content for all three languages
    await writeLangContent(base, path, "en", content);
    await writeLangContent(base, path, "ar", content);
    await writeLangContent(base, path, "he", content);

    // Delete the original file
    if(del){
        await deleteFile(path);
    }
}

module.exports = {
    writeContentMultiLang,
    replaceLangExp
};