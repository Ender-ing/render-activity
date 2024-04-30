/**
 * 
 * Manage server requests for ".display" files
 * 
**/

import { createSignal } from "solid-js";
//import { DIALOG, showDialog } from "../content/dialogs";
import { localiseContent } from "./language/process";
import { setIsErrorResult } from "./language/seo";

//  Get display content!
export const PAGES = {
    ERROR_404: "https://resources.ender.ing/web/client/global-pages/error-404/",
    ERROR_CODE: "https://resources.ender.ing/web/client/global-pages/error-code/",
    ERROR_CONNECTION: "https://resources.ender.ing/web/client/global-pages/error-connection/",
    ERROR_SERVER: "https://resources.ender.ing/web/client/global-pages/error-server/"
};
export async function getDisplay(base){
    let displayURL = getURL(base);
    let XML;
    try {
        setIsErrorResult(false);
        XML = await fetchDisplay(displayURL, fixBase(base));
    }catch(errorServe) {
        XML = await fetchDisplay(getURL(errorServe), fixBase(errorServe));
        setIsErrorResult(true);
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

// Fix <style> and <script> tags content
function fixXMLTags(xml){
    let fixedXML = xml;
    fixedXML = fixedXML.replaceAll(/<script(.*?)>(.*?)<\/script>/gis, (match, attr, content) => {
        if(content != ""){
            let fixedContent = content;
            fixedContent = fixedContent.replaceAll("&", "&amp;");
            fixedContent = fixedContent.replaceAll("<", "&lt;");
            fixedContent = fixedContent.replaceAll(">", "&gt;");
            return `<script${attr}>${fixedContent}</script>`;
        }else{
            return content;
        }
    });
    fixedXML = fixedXML.replaceAll(/<style(.*?)>(.*?)<\/style>/gis, (match, attr, content) => {
        if(content != ""){
            let fixedContent = content;
            fixedContent = fixedContent.replaceAll("&", "&amp;");
            fixedContent = fixedContent.replaceAll("<", "&lt;");
            fixedContent = fixedContent.replaceAll(">", "&gt;");
            return `<style${attr}>${fixedContent}</style>`;
        }else{
            return content;
        }
    });
    return fixedXML;
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
            // Fetch Preload breaks error codes!
            // Check if this is an HTML file
            if((response.status === 404 ||
                    (responseText?.indexOf('<!DOCTYPE') != -1 && responseText?.indexOf('<!DOCTYPE') < 10))
                && pathname !== fixBase(PAGES.ERROR_404)){
                pathname = fixBase(PAGES.ERROR_404);
                updateContentPathname = false;
                console.warn("Display file could not be loaded!");
                setIsErrorResult(true);
                return await fetchDisplay(getURL(PAGES.ERROR_404), fixBase(PAGES.ERROR_404), true);
            }else if (!response.ok) {
                // Catch all other server errors!
                throw PAGES.ERROR_SERVER;
                // showDialog(DIALOG.network.error);
                //throw new Error('Network response was not ok');
            }
            // Update content pathname
            if(updateContentPathname){
                setContentURL(pathname);
            }
            return responseText;
        }).then(async xmlString => {
            let fixedXML = fixXMLTags(xmlString);
            if(!text){
                let localisedXML = await localiseContent(fixedXML);
                return localisedXML;
            }else{
                return fixedXML;
            }
        }).then(xmlString => {
            if(!text){
                // Parse the XML string
                let xmlDoc;
                try {
                    const parser = new DOMParser();
                    xmlDoc = parser.parseFromString(xmlString, "text/xml");
                }catch{
                    throw PAGES.ERROR_CODE;
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
                reject(PAGES.ERROR_CONNECTION);
            }else{
                reject(errorURL);
            }

            console.error("FETCH ERROR OBJECT:", errorURL);
        });
    });
}