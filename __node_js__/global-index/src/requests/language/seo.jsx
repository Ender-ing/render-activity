/**
 * 
 * Manage language SEO optimisation
 * 
**/

import { localiseText } from "./inject";

// Create alternate link
function createAlternate(lang){
    let link = document.createElement('link');
    link.setAttribute("rel", "alternate");
    link.setAttribute("hreflang", lang);
    let href = window.location.href;
    if(href.indexOf("#") != -1){
        href = href.substring(0, href.indexOf("#"));
    }
    link.setAttribute("href", `${href}#${lang}`);

    // Append element
    document.head.appendChild(link);
}

// Add page description
async function addDescription(){
    let meta = document.createElement('meta');
    meta.setAttribute("name", "description");

    // Set description
    meta.setAttribute("content", await localiseText("{{?_meta.description}}"));

    // Append element
    document.head.appendChild(meta);
}

// Add needed meta data for search engine language recognition 
export function languageMeta(){
    // Add alternate versions of the page
    createAlternate("en");
    createAlternate("he");
    createAlternate("ar");
    // Add page description
    addDescription(0);
}