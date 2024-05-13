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
    // Set alternate element
    if(alternates[lang] == null){
        let link = document.createElement('link');
        link.setAttribute("rel", "alternate");
        link.setAttribute("hreflang", lang);
        alternates[lang] = link;

        // Append element
        document.head.appendChild(alternates[lang]);
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
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute("rel", "canonical");

        // Append element
        document.head.appendChild(canonicalLink);
    }

    // Set link
    // (English is the preferred language)
    let href = getPureURL("en");
    canonicalLink.setAttribute("href", href);
}

// Create a meta element
function createMetaElement(name){
    let meta = document.createElement('meta');
    meta.setAttribute("name", name);
    // Append element
    document.head.appendChild(meta);
    return meta;
}

// Add page description
let meta = {
    title: null,
    description: null
};
export async function addMeta(title, description){
    // Set meta elements
    if(meta.description == null){
        meta.description = createMetaElement("description");
    }
    if(meta.title == null){
        meta.title = createMetaElement("title");
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
    createAlternate("en");
    createAlternate("he");
    createAlternate("ar");

    // Set page as canonical
    if(!getIsErrorResult()){
        createCanonical();
    }else if(canonicalLink != null){
        canonicalLink.remove();
        canonicalLink = null;
    }
}