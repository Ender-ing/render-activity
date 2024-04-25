/**
 * 
 * Manage HTML doc changes (meta, RTL, etc.)
 * 
**/

import { checkLocale } from "./preference"
import { languageMeta } from "./seo";

const rtlLocales = ["ar", "he"]

// Update writing direction
function updateDir(){
    document.documentElement.setAttribute("dir", (rtlLocales.includes(checkLocale())) ?  "rtl" : "ltr");
}

// Update document language
function updateLang(){
    document.documentElement.setAttribute("lang", checkLocale());
}

// Update meta tags
function updateMeta(){
    // Create meta tag
    let metaTag = document.createElement("meta");
    metaTag.setAttribute("http-equiv", "content-language");
    metaTag.setAttribute("content", checkLocale());

    // SEO meta
    languageMeta();

    // Append it to the page
    document.head.appendChild(metaTag);
}

// Update the info of the HTML page's language
export function updateDocLocaleInfo(){
    // Update document view direction
    updateDir();

    // Update document view language
    updateLang();

    // Add meta tags
    updateMeta();
}