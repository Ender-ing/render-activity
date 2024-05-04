/**
 * 
 * Manage HTML doc changes (meta, RTL, etc.)
 * 
**/

import { firstLocale } from "./preference"

// Update the info of the HTML page's language
export function updateDocLocaleInfo(){
    // Update locale cookie
    firstLocale();
}