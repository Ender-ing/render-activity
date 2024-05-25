/**
 * 
 * Manage language expressions
 * 
**/

const { warn, error, log } = require("./_console");
const { _p, _writeContent, deleteFile, _getJSON } = require("./_files");

// Get JSON value by string
function getJSONValueByPath(obj, path, lang) {
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
            error(`Invalid source language expression! (correct format: 'XX:...', current value: ${path})`);
        }
    }

    // Check if the source language is whitelisted!
    if(obj[expLang] == null){
        error(`Undefined language code! (${expLang})`);
    }

    let current = obj[expLang]; // Start at the root object
    for (let part of pathParts) {
        if (current[part] === undefined) {
            return undefined; // Value not found
        }
        current = current[part];
    }

    if(current == null){
        warn(`Undefined language expression value! (${path} not found!)`);
    }

    return current; 
}

// Process language expression strings
function processLocaleStrInput(varString, localeObj, globalObj, lang){
    let vars = varString.split(",").map(val => {
        if(val.indexOf("`") != -1){
            return val.match(/`(.*?)`/, "$1")[1];
        }else if(val != null && val != ''){
            let id = val.replaceAll(/\s/g, "");
            if(id.indexOf("$") == 0){
                id = id.substring(1);
                return getJSONValueByPath(globalObj, id, lang);
            }else if(id.indexOf("?") == 0){
                id = id.substring(1);
                let value = getJSONValueByPath(localeObj, id, lang);
                if(value != undefined){
                    return value;
                }else{
                    return getJSONValueByPath(globalObj, id, lang);
                }
            }else{
                return getJSONValueByPath(localeObj, id, lang);
            }
        }else{
            return val;
        }
    });
    return vars;
}

// Replace values inside language expression strings
function replaceLocaleStrVars(value, vars, localeObj, globalObj, lang){
    let newVal = value;
    if(vars != null && vars.replaceAll(/\s/g, "") != ''){
        let vs = processLocaleStrInput(vars, localeObj, globalObj, lang);
        for(let i = 0; i < vs.length; i++){
            newVal = newVal.replaceAll("$" + (i + 1), `<bdi>${vs[i]}</bdi>`);
        }
    }
    return newVal;
}

// Replace content lang
function localiseOutput(value, localeObj, globalObj, lang){
    // Check if result needs to be processed too!
    if((/\{\{|\}\}/g).test(value)){
        return replaceLangExp(value, localeObj, globalObj, lang);
    }else{
        return value;
    }
}
function replaceLangExp(content, localeObj, globalObj, lang){
    let result;
    return content.replaceAll(/\{\{(.*?)\}\[?(.*?)\]?\}/g, (match, idString, varString) => {
        let id = idString.replaceAll(/\s/g, "");
        if(id[0] === "$"){
            result = replaceLocaleStrVars(getJSONValueByPath(globalObj, id.substring(1), lang), varString, localeObj, globalObj, lang);
            return localiseOutput(result, localeObj, globalObj, lang);
        }else{
            let fallback = id[0] == "?";
            let value = getJSONValueByPath(localeObj, id.substring(fallback), lang);
            if(fallback && value != undefined){
                result = replaceLocaleStrVars(value, varString, localeObj, globalObj, lang);
                return localiseOutput(result, localeObj, globalObj, lang);
            }else if(fallback && value == undefined){
                result = replaceLocaleStrVars(getJSONValueByPath(globalObj, id.substring(fallback), lang), varString, localeObj, globalObj, lang);
                return localiseOutput(result, localeObj, globalObj, lang);
            }else{
                result = replaceLocaleStrVars(value, varString, localeObj, globalObj, lang);
                return localiseOutput(result, localeObj, globalObj, lang);
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
    newContent = replaceLangExp(newContent, localeObj, globalOBj, lang);
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