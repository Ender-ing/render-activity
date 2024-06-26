/**
 * 
 * Manage server requests for ".display" files
 * 
**/

import { createSignal } from "solid-js";
//import { DIALOG, showDialog } from "../content/dialogs";
import { checkLocale } from "./language/preference";

// Track content status
export const [getIsErrorResult, setIsErrorResult] = createSignal(false);

// Track served content status (detailed)
export const SERVE_NORMAL = "normal", SERVE_NOT_FOUND = "not found", SERVE_INVALID_CONTENT = "invalid content";
export const [getServeStatus, setServeStatus] = createSignal(null);

//  Get display content!
export const PAGES = {
    ERROR_404: () => `https://resources.ender.ing/${checkLocale()}/web/client/global-pages/error-404/`,
    ERROR_CODE: () => `https://resources.ender.ing/${checkLocale()}/web/client/global-pages/error-code/`,
    ERROR_CONNECTION: () => `https://resources.ender.ing/${checkLocale()}/web/client/global-pages/error-connection/`,
    ERROR_SERVER: () => `https://resources.ender.ing/${checkLocale()}/web/client/global-pages/error-server/`
};
export async function getDisplay(base){
    let displayURL = getURL(base);
    let XML;
    try {
        // Normal tracking
        setIsErrorResult(false);
        setServeStatus(SERVE_NORMAL);
        // Fetch content
        XML = await fetchDisplay(displayURL, fixBase(base));
    }catch(errorServe) {
        // Fetch error page
        XML = await fetchDisplay(getURL(errorServe), fixBase(errorServe));
        // Update tracking
        setIsErrorResult(true);
        setServeStatus(SERVE_INVALID_CONTENT);
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
    console.log(`Fetching ${displayURL} (locale from ${pathname})`);
    return new Promise((resolve, reject) => {
        fetch(displayURL, {
            method: 'GET',
            credentials: 'include',
            headers: {
                // This header must be present to prevent a global HTML page from being served!
                'x-display-request': 1
            }
        }).then(async response => {
            let responseText = (await response.text() || null);
            let responseChunk = responseText?.substring(0, 20);
            // Fetch Preload breaks error codes!
            // Check if this is an HTML file
            if((response.status === 404 ||
                    (responseChunk?.indexOf('<!DOCTYPE') != -1))
                && pathname !== fixBase(PAGES.ERROR_404())){
                pathname = fixBase(PAGES.ERROR_404());
                updateContentPathname = false;
                console.warn("Display file could not be loaded!");
                setIsErrorResult(true);
                setServeStatus(SERVE_NOT_FOUND);
                return await fetchDisplay(getURL(PAGES.ERROR_404()), fixBase(PAGES.ERROR_404()), true);
            }else if (!response.ok) {
                // Catch all other server errors!
                throw PAGES.ERROR_SERVER();
                // showDialog(DIALOG.network.error);
                //throw new Error('Network response was not ok');
            }
            // Update content pathname
            if(updateContentPathname){
                setContentURL(pathname);
            }
            return responseText;
        }).then(xmlString => {
            if(!text){
                // Parse the XML string
                let xmlDoc;
                try {
                    const parser = new DOMParser();
                    xmlDoc = parser.parseFromString(xmlString, "text/xml");
                }catch{
                    throw PAGES.ERROR_CODE();
                }
    
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
        }).catch(errorURL => {
            // Check error type
            // Fetch offline errors trigger an error throw!
            if(typeof errorURL != "string"){
                reject(PAGES.ERROR_CONNECTION());
            }else{
                reject(errorURL);
            }

            console.error("FETCH ERROR OBJECT:", errorURL);
        });
    });
}