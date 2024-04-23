/**
 * 
 * Manage the process of loading locale language files
 * 
**/

import { DIALOG, showDialog } from "../../content/dialogs";

// Get the locale file URL
function getURL(lang, base){
    let b;
    if(base[base.length - 1] != "/"){
        b = base + "/";
    }else{
        b = base;
    }
    
    return b + lang + ".locale";
}

// Get the locale content from .locale file
export function fetchLocale(url){
    console.log(`Fetching ${url}`);
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'x-locale-request': 1
            }
        }).then(response => {
            if (!response.ok) {
                showDialog(DIALOG.network.error);
                throw new Error('Network response was not ok');
            }
            return response.text();
        }).then(jsonString => {
            // Parse the JSON string
            let json;
            try{
                json = JSON.parse(jsonString);
            }catch{
                showDialog(DIALOG.content.error);
                throw new Error('JSON parse failed');
            }
    
            // Extract the values you need
            return json;
        }).then(json => {
            // Prevent callback function errors from triggering the catch function!
            try {
                resolve(json);
            }catch {}
        }).catch(error => {
            reject(error);
            // Show error page!
            console.error('Error fetching or parsing JSON:', error);
        });
    });
}

// Get locale JSON values
const laodedLocaleFiles = []
export async function getLocale(lang, pathname){
    let localeURL = getURL(lang, pathname);
    let JSON;
    try{
        if(laodedLocaleFiles[localeURL] != null){
            return laodedLocaleFiles[localeURL];
        }else{
            JSON = await fetchLocale(localeURL);
            laodedLocaleFiles[localeURL] = JSON;
        }
    }catch{
        JSON = {};
    }
    return JSON;
}
window.getLocale = getLocale;