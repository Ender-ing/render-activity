/**
 * 
 * Manage "locale-content" attribute
 * 
**/

import { getGlobalLocale } from "./global";
import { checkLocale } from "./preference";
import { replaceStrings } from "./process";

// Inject localised language strings
export async function localiseInject(element){
    // Check prefered language
    let lang = checkLocale();

    // Get global object
    let globalObj = await getGlobalLocale(lang);

    // Loop through all children inside element
    function injectText(elm){
        let localeAttr = elm.getAttribute("locale-content");
        if(typeof localeAttr === "string"){
            // Might need to change this!
            elm.textContent = replaceStrings(localeAttr, null, globalObj, "$")
        }
        let children = elm.children;
        for(let i = 0; i < children.length; i++){
            injectText(children[i]);
        }
    }
    injectText(element);
}