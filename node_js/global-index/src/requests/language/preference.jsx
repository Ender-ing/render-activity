/**
 * 
 * Manage language preferences
 * 
**/

// Locale allowlist
const allowedLocales = ["en", "ar", "he"];

// Check browser language preference
function getBrowserPreferred(){
    let languages = navigator.languages.map(val => val.substring(0, 2));
    for (let i = 0; i < languages.length; i++) {
        if(allowedLocales.includes(languages[i])){
            return languages[i];
        }
    }
    return allowedLocales[0];
}

// Check saved preferences
export function firstLocale(){
    // Check hash
    let urlLang = checkLocale();
    let cookie = document.documentElement.getCookie("locale");
    if(cookie != null){
        if(!allowedLocales.includes(cookie)){
            document.documentElement.setCookie("locale", urlLang);
        }
        // No need to do anything!
    } else {
        document.documentElement.setCookie("locale", urlLang);
    }
}
document.documentElement.checkLocale = checkLocale;

// Check saved preferences
export function checkLocale(){
    let urlLang = window.location.pathname.substring(1, 3);
    return (allowedLocales.includes(urlLang)) ? urlLang : getBrowserPreferred();
}