/**
 * 
 * Manage language SEO optimisation
 * 
**/

import { createSignal } from "solid-js";
//import { localiseText } from "./inject";

// Get pure URL
function getPureURL(lang = null){
    let host = window.location.host;
    let pathname = window.location.pathname.substring(3); // /XX/...
    pathname = ((pathname[0] != '/') ? '/' : '') + pathname;

    if(lang != null){
        pathname = `/${lang}${pathname}`
    }

    return `https://${host}${pathname}`;
}

// Create alternate link
let alternates = {
    en: null,
    he: null,
    ar: null
};
function createAlternate(lang){
    // Get alternate element
    if(alternates[lang] == null){
        alternates.ar = document.getElementById("meta-alternate-ar");
        alternates.en = document.getElementById("meta-alternate-en");
        alternates.he = document.getElementById("meta-alternate-he");
        return createAlternate(lang);
    }

    // Set link
    let href = getPureURL(lang);
    alternates[lang].setAttribute("href", href);
}

// Create canonical link
let canonicalLink = null;
function createCanonical(){
    // Set alternate element
    if(canonicalLink == null){
        canonicalLink = document.getElementById("meta-canonical");
        return createCanonical();
    }
    if(canonicalLink.detached){
        document.head.appendChild(canonicalLink);
        canonicalLink.detached = false;
    }

    // Set link
    // (English is the preferred language)
    let href = getPureURL("en");
    canonicalLink.setAttribute("href", href);
}

// Add page description
let meta = {
    title: null,
    description: null
};
export async function addMeta(title, description){
    if(IS_FIRST_LOAD){
        return null;
    }
    // Set meta elements
    if(meta.description == null){
        meta.description = document.getElementById("meta-description");
        return addMeta(title, description);
    }
    if(meta.title == null){
        meta.title = document.getElementById("meta-title");
        return addMeta(title, description);
    }

    // Set title
    let t = `${title} | ${window.SERVICE_TITLE}`;
    meta.title.setAttribute("content", t);
    document.title = t;

    // Set description
    meta.description.setAttribute("content", description);
}

// Add needed meta data for search engine language recognition 
export const [getIsErrorResult, setIsErrorResult] = createSignal(false);
export function languageMeta(){
    // Add alternate versions of the page
    if(!IS_FIRST_LOAD){
        createAlternate("en");
        createAlternate("he");
        createAlternate("ar");
    }

    // Set page as canonical
    if(!getIsErrorResult()){
        if(!IS_FIRST_LOAD){
            createCanonical();
        }
    }else if(!canonicalLink.detached){
        canonicalLink.parentNode.removeChild(canonicalLink);
        canonicalLink.detached = true;
    }
}