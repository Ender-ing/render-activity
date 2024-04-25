/**
 * 
 * Manage language SEO optimisation
 * 
**/

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

// Add needed meta data for search engine language recognition 
export function languageMeta(){
    createAlternate("en");
    createAlternate("he");
    createAlternate("ar");
}