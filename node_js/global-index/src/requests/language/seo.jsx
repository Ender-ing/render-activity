/**
 * 
 * Manage language SEO optimisation
 * 
**/

import { getIsErrorResult } from "../display";

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

// Prevent indexing, allow following
let robots = null;
function addMetaRobots(){
    // <meta name="robots" content="noindex, follow">
    if(robots == null){
        // Create tag
        robots = document.createElement('meta');
        robots.setAttribute('name', 'robots');
        robots.setAttribute('content', 'noindex, follow');

        // Append tag
        document.head.appendChild(robots);
    }
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
        return setTimeout(() => createAlternate(lang), window.CHECK_DOM_LOOP_DELAY);
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
        return setTimeout(createCanonical, window.CHECK_DOM_LOOP_DELAY);
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
        return setTimeout(() => addMeta(title, description), window.CHECK_DOM_LOOP_DELAY);
    }
    if(meta.title == null){
        meta.title = document.getElementById("meta-title");
        return setTimeout(() => addMeta(title, description), window.CHECK_DOM_LOOP_DELAY);
    }

    // Set title
    let t = (title != window.SERVICE_TITLE) ? `${title} | ${window.SERVICE_TITLE}` : title;
    meta.title.setAttribute("content", t);
    document.title = t;

    // Set description
    meta.description.setAttribute("content", description);
}

// Add needed meta data for search engine language recognition 
export function languageMeta(){
    // Add alternate versions of the page
    if(!IS_FIRST_LOAD){
        createAlternate("en");
        createAlternate("he");
        createAlternate("ar");
    }

    // Get canonical
    if(canonicalLink == null){
        createCanonical();
    }

    // Set page as canonical
    if(!getIsErrorResult()){
        if(!IS_FIRST_LOAD){
            createCanonical();
            // Allow indexing
            if(robots != null){
                robots.remove();
                robots = null;
            }
        }
    }else if(canonicalLink != null && !canonicalLink.detached){
        // Remove canonical
        canonicalLink.parentNode.removeChild(canonicalLink);
        canonicalLink.detached = true;
        // Prevent indexing
        addMetaRobots();
    }
}