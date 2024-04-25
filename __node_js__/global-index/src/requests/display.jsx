/**
 * 
 * Manage server requests for ".display" files
 * 
**/

import { createSignal } from "solid-js";
import { DIALOG, showDialog } from "../content/dialogs";
import { localiseContent } from "./language/process";

//  Get display content!
export const PAGES = {
    ERROR_404: "https://resources.ender.ing/web/client/global-pages/404-error/",
    ERROR_CODE: "https://resources.ender.ing/web/client/global-pages/code-error/"
};
export async function getDisplay(base){
    let displayURL = getURL(base);
    let XML;
    try {
        XML = await fetchDisplay(displayURL, fixBase(base));
    }catch(e) {
        XML = await fetchDisplay(PAGE.ERROR_CODE, fixBase(PAGE.ERROR_CODE));
    }
    return XML;
}

// Fix pathname base
function fixBase(base){
    let b;
    // Add slash to the end of the pathname
    if(base[base.length - 1] != "/"){
        b = base + "/";
    }else{
        b = base;
    }
    // Remove host from pathname
    // let index = b.indexOf(window.webDomain);
    //if(index != -1){
    //    b = b.substring(index + window.webDomain.length);
    //}
    return b;
}

// Get the XML content URL of the .display file
function getURL(base){
    let b = fixBase(base);
    
    return b + "index.display";
}

// Track content replacement
export const [getContentURL, setContentURL] = createSignal();

// Get the XML content from .display file
function fetchDisplay(displayURL, pathname, text = false, updateContentPathname = true){
    console.log(`Fetching ${displayURL}`);
    return new Promise((resolve, reject) => {
        fetch(displayURL, {
            method: 'GET',
            headers: {
                // This header must be present to prevent a global HTML page from being served!
                'x-display-request': 1
            }
        }).then(async response => {
            if(response.status === 404 && pathname !== fixBase(PAGES.ERROR_404)){
                pathname = PAGES.ERROR_404;
                updateContentPathname = false;
                return await fetchDisplay(PAGES.ERROR_404, fixBase(PAGES.ERROR_404), true);
            }else if (!response.ok) {
                showDialog(DIALOG.network.error);
                throw new Error('Network response was not ok');
            }
            // Update content pathname
            if(updateContentPathname){
                setContentURL(pathname);
            }
            return response.text();
        }).then(async xmlString => {
            if(!text){
                let localisedXML = await localiseContent(xmlString);
                return localisedXML;
            }else{
                return xmlString;
            }
        }).then(xmlString => {
            if(!text){
                // Parse the XML string
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
                // Extract the values you need
                return xmlDoc;
            }else{
                return xmlString;
            }
        }).then(xml => {
            // Prevent callback function errors from triggering the catch function!
            try {
                resolve(xml);
            }catch {}
        }).catch(error => {
            reject(error);
            // Show error page!
            console.error('Error fetching or parsing XML:', error);
        });
    });
}