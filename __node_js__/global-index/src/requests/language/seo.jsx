/**
 * 
 * Manage language SEO optimisation
 * 
**/

import { localiseText } from "./inject";

// Create alternate link
let alternates = {
    en: null,
    he: null,
    ar: null
};
function createAlternate(lang){
    // Set alternate element
    if(alternates[lang] == null){
        let link = document.createElement('link');
        link.setAttribute("rel", "alternate");
        link.setAttribute("hreflang", lang);
        alternates[lang] = link;

        // Append element
        document.head.appendChild(alternates[lang]);
    }
    // Remove hashes from URL (in case the were used)
    let href = window.location.href;
    if(href.indexOf("#") != -1){
        href = href.substring(0, href.indexOf("#"));
    }

    // Set link
    alternates[lang].setAttribute("href", `${href}#${lang}`);
}

// Add page description
let description = null;
async function addDescription(){
    // Set meta element
    if(description == null){
        description = document.createElement('meta');
        description.setAttribute("name", "description");
        // Append element
        document.head.appendChild(description);
    }

    // Set description
    description.setAttribute("content", await localiseText("{{?_meta.description}}"));
}

// Add needed meta data for search engine language recognition 
export function languageMeta(){
    // Add alternate versions of the page
    createAlternate("en");
    createAlternate("he");
    createAlternate("ar");

    // Add page description
    addDescription();
}