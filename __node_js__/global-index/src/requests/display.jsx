/**
 * 
 * Manage server requests for ".display" files
 * 
**/

import { DIALOG, showDialog } from "../content/dialogs";
import { localiseContent } from "./language/process";

//  Get display content!
export async function getDisplay(base){
    let displayURL = getURL(base);
    let XML;
    try {
        XML = await fetchDisplay(displayURL, fixBase(base));
    }catch(e) {
        XML = await fetchDisplay("https://resources.ender.ing/web/client/global-pages/error.display", fixBase(base));
    }
    return XML;
}

// Fix pathname base
function fixBase(base){
    let b;
    if(base[base.length - 1] != "/"){
        b = base + "/";
    }else{
        b = base;
    }
    return b;
}

// Get the XML content URL of the .display file
function getURL(base){
    let b = fixBase(base);
    
    return b + "index.display";
}

// Get the XML content from .display file
function fetchDisplay(url, pathname){
    console.log(`Fetching ${url}`);
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers: {
                // This header must be present to prevent a global HTML page from being served!
                'x-display-request': 1
            }
        }).then(response => {
            if (!response.ok) {
                showDialog(DIALOG.network.error);
                throw new Error('Network response was not ok');
            }
            return response.text();
        }).then(async xmlString => {
            let localisedXML = await localiseContent(xmlString, pathname);
            return localisedXML;
        }).then(xmlString => {
            // Parse the XML string
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
            // Extract the values you need
            return xmlDoc;
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