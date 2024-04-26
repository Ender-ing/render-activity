/**
 * 
 * Manage language preferences
 * 
**/

// Locale allowlist
const allowedLocales = ["en", "ar", "he"]
const defaultLocale = allowedLocales[0];

// Get browser preferred language
function getBrowserPreferred(){
    let languages = navigator.languages.map(val => val.substring(0, 2));
    for (let i = 0; i < languages.length; i++) {
        if(allowedLocales.includes(languages[i])){
            return languages[i];
        }
    }
    return defaultLocale;
}

// Set preferred language
function setLocale(lang = null){
    let language = null;
    if(lang == null || !allowedLocales.includes(lang)){
        language = getBrowserPreferred();
    }else{
        language = lang;
    }
    document.documentElement.setCookie("locale", language);
    //document.cookie = `locale=${language};path=/;domain=ender.ing`;
    return language;
}
window.setLocale = setLocale;

// Get a cookie value
function getCookie(name){    
    return document.documentElement.getCookie(name);
    /*
    // Split the cookie string, which is in the format of "name1=value1; name2=value2"
    let nameEQ = name + "=";
    let cookieParts = document.cookie.split(';');

    // Loop through the split cookies
    for (let i = 0; i < cookieParts.length; i++) {
        let cookiePart = cookieParts[i];

        // Remove leading spaces if any
        while (cookiePart.charAt(0) === ' ') { 
            cookiePart = cookiePart.substring(1, cookiePart.length);
        }

        // If the current cookie part starts with the desired name, return its value
        if (cookiePart.indexOf(nameEQ) === 0) {
            return decodeURIComponent(cookiePart.substring(nameEQ.length, cookiePart.length));
        }
    }

    // If the cookie is not found, return null
    return null;
    */
}

// Check saved preferences
let locale = null;
export function checkLocale(){
    // Check hash
    let hash = window.location.hash.substring(1);
    if(allowedLocales.includes(hash)){
        setLocale(hash);
    }

    // Check locale variable
    if(locale !== null){
        return locale;
    }else{
        locale = (getCookie("locale") || null);
        if(locale == null){
            locale = setLocale();
        }
        if(!allowedLocales.includes(locale)){
            locale = defaultLocale;
        }
        return locale;
    }
}
