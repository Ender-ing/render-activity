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
export function replaceStrings(xmlDocString, localeObj, globalObj, prefix = null){
    return xmlDocString.replaceAll(/\{\{(.*?)\}\[?(.*?)\]?\}/g, (match, idString, varString) => {
        let id = idString.replaceAll(/\s/g, "");
        if(prefix === null){
            return replaceLocaleStrVars(getJSONValueByPath((localeObj || globalObj), id), varString, localeObj, globalObj);
        }else{
            if(id.indexOf(prefix) == 0){
                return replaceLocaleStrVars(getJSONValueByPath((localeObj || globalObj), id.substring(prefix.length)), varString, localeObj, globalObj);
            }else{
                if(varString != null && varString.replaceAll(/\s/g, "") != ''){
                    return `{{${idString}}[${varString}]}`
                }else{
                    return `{{${idString}}}`;
                }
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
        localisedContent = replaceStrings(localisedContent, null, globalObj, "$");

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