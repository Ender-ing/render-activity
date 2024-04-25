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
    description: null,
    globalTitle: null
};
async function addMeta(){
    // Check global title value
    if(meta.globalTitle == null){
        meta.globalTitle = await localiseText("{{$_meta.title}}");
    }

    // Set meta elements
    if(meta.description == null){
        meta.description = createMetaElement("description");
    }
    if(meta.title == null){
        meta.title = createMetaElement("title");
    }

    // Set title
    let title = await localiseText("{{?_meta.title}}");
    if(title !== meta.globalTitle){
        title += ` | ${meta.globalTitle}`;
    }
    meta.title.setAttribute("content", await localiseText("{{?_meta.title}}"));
    document.title = title;
    // Set description
    meta.description.setAttribute("content", await localiseText("{{?_meta.description}}"));
}

// Add needed meta data for search engine language recognition 
export function languageMeta(){
    // Add alternate versions of the page
    createAlternate("en");
    createAlternate("he");
    createAlternate("ar");

    // Add meta elements
    addMeta();
}