/**
 * 
 * Manage language string replacement requests for language files
 * 
**/

import { getGlobalLocale } from "./global";
import { getLocale } from "./load";
import { checkLocale } from "./preference";

// Get JSON value by string
function getJSONValueByPath(obj, path) {
    let pathParts = path.split('.');

    let current = obj; // Start at the root object
    for (let part of pathParts) {
        if (current[part] === undefined) {
            return undefined; // Value not found
        }
        current = current[part];
    }

    return current; 
}

// Process language expression strings
function processLocaleStrInput(varString, localeObj, globalObj){
    let vars = varString.split(",").map(val => {
        if(val.indexOf("`") != -1){
            return val.match(/`(.*?)`/, "$1")[1];
        }else if(val != null && val != ''){
            let id = val.replaceAll(/\s/g, "");
            if(id.indexOf("$") == 0){
                id = id.substring(1);
                return getJSONValueByPath(globalObj, id);
            }else if(id.indexOf("?") == 0){
                id = id.substring(1);
                let value = getJSONValueByPath(localeObj, id);
                if(value != undefined){
                    return value;
                }else{
                    return getJSONValueByPath(globalObj, id);
                }
            }else{
                return getJSONValueByPath(localeObj, id);
            }
        }else{
            return val;
        }
    });
    return vars;
}

// Replace values inside language expression strings
function replaceLocaleStrVars(value, vars, localeObj, globalObj){
    let newVal = value;
    if(vars != null && vars.replaceAll(/\s/g, "") != ''){
        let vs = processLocaleStrInput(vars, localeObj, globalObj);
        for(let i = 0; i < vs.length; i++){
            newVal = newVal.replaceAll("$" + (i + 1), `<bdi>${vs[i]}</bdi>`);
        }
    }
    return newVal;
}

// Replace placeholder strings with their values
export function replaceStrings(xmlDocString, localeObj, globalObj){
    return xmlDocString.replaceAll(/\{\{(.*?)\}\[?(.*?)\]?\}/g, (match, idString, varString) => {
        let id = idString.replaceAll(/\s/g, "");
        if(id[0] === "$"){
            return replaceLocaleStrVars(getJSONValueByPath(globalObj, id.substring(1)), varString, localeObj, globalObj);
        }else{
            let fallback = id[0] == "?";
            let value = getJSONValueByPath(localeObj, id.substring(fallback));
            if(fallback && value != undefined){
                return replaceLocaleStrVars(value, varString, localeObj, globalObj);
            }else if(fallback && value == undefined){
                return replaceLocaleStrVars(getJSONValueByPath(globalObj, id.substring(fallback)), varString, localeObj, globalObj);
            }else{
                return replaceLocaleStrVars(value, varString, localeObj, globalObj);
            }
        }
    });
}

// Do a pre-check to determine if you need to load locale files!
function precheckLocale(xmlDocString){
    return (/\{\{|\}\}/g).test(xmlDocString);
}

// Replace language strings in XML document
export async function localiseContent(xmlDocString, pathname){
    let localisedContent = xmlDocString;

    // Do a pre-check
    if(precheckLocale(localisedContent)){
        // Check prefered language
        let lang = checkLocale();

        // Change global strings
        let globalObj = await getGlobalLocale(lang);
        // Get locale string
        let localeObj = await getLocale(lang, pathname);

        // Change dir locale strings
        localisedContent = replaceStrings(localisedContent, localeObj, globalObj);
        localeObj = null;
    }else{
        localisedContent = xmlDocString;
    }

    return localisedContent;
}