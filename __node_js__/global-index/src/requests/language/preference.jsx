/**
 * 
 * Manage language preferences
 * 
**/

// Check saved preferences
export function checkLocale(){
    return document.documentElement.getCookie("locale");
}