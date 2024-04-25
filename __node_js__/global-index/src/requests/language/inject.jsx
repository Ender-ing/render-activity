/**
 * 
 * Manage "locale-content" attribute
 * 
**/

import { getPathname } from "../content";
import { getGlobalLocale } from "./global";
import { checkLocale } from "./preference";
import { replaceStrings } from "./process";

// Localise text
export async function localiseText(text){
    let localisedText = text;
    let lang = checkLocale();

    // Get locale objects
    let globalObj = await getGlobalLocale(lang);
    let localeObj = await getLocale(lang, getPathname());

    localisedText = replaceStrings(localisedText, localeObj, globalObj);

    return localisedText;
}

// Inject localised language strings
export async function localiseInject(element){
    // Check prefered language
    let lang = checkLocale();

    // Get locale objects
    let globalObj = await getGlobalLocale(lang);
    let localeObj = await getLocale(lang, getPathname());

    // Loop through all children inside element
    function injectText(elm){
        let localeAttr = elm.getAttribute("locale-content");
        if(typeof localeAttr === "string"){
            // Might need to change this!
            elm.textContent = replaceStrings(localeAttr, localeObj, globalObj);
        }
        let children = elm.children;
        for(let i = 0; i < children.length; i++){
            injectText(children[i]);
        }
    }
    injectText(element);
}