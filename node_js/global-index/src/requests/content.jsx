/**
 * 
 * Manage basic content loading in all pages
 * 
**/

import { createSignal, createEffect } from "solid-js";
import { getDisplay } from "./display";
import { languageMeta } from "./language/seo";
import { checkLocale } from "./language/preference";
import { EVENT_CONTENT_RENDER, gtag } from "../tracking/gtag";

export const [getDisplayXML, setDisplayXML] = createSignal();
export const [getPathname, setPathname] = createSignal(null);

// Keep checking for URL changes and update the content of the page accordingly
function updateDisplay() {

    // Watch out for any URL updates
    createEffect(() => {
        console.log(`New location: ${getPathname()}`);
        window.document.documentElement.setContentResourceGoal(getPathname(), 1);

        // Check if this is the first load
        if(window.IS_FIRST_LOAD && window.FIRST_LOAD != getPathname()){
            window.IS_FIRST_LOAD = false;
        }

        // Add error handling!
        getDisplay(getPathname()).then(xml => {
            // Change page content
            setDisplayXML(xml);

            // Update SEO meta data
            languageMeta();

            // Show content
            window.document.documentElement.setContentResourceLoaded(getPathname(), 1);

            // Trigger page_render event
            gtag('event', EVENT_CONTENT_RENDER, { 'language': checkLocale(), 'value': getPathname() });
        });

        return getPathname();
    });
}

// Get pathname value
function extractPathname(){
    if(typeof window.location.pathname === "string"){
        return window.location.pathname;
    }else{
        let url = new URL(window.location.href);
        let pathname = url.pathname;
        url = null;
        return pathname;
    }
}

// Track pathname
function trackPathname() {
    // Set the initial pathname
    setPathname(extractPathname());

    // Keep tracking URL changes
    window.addEventListener('popstate', function(event) {
        setPathname(extractPathname());
    });
}

// Convert all href values into absolute paths
let absLinkElm = document.createElement("a");
function getAbsURL(href = null){
    if(href != null && typeof href == "string"){
        absLinkElm.href = href;
        return absLinkElm.href;
    }
    return null;
}

// Prevent links from redirecting the page
// YOU NEED TO RE-WORK THIS CODE!
document.addEventListener('click', (event) => {
    // Check if element (or up to the 3rd parent) is a link element
    let clickedElement = event.target;
    let getAttr = (elm, attr) => {
        try{
            return elm?.getAttribute(attr);
        }catch{
            return null;
        }
    };
    const maxParentsToCheck = 4;
    for (let i = 0; i < maxParentsToCheck; i++) {
        if ((clickedElement?.tagName || "").toLowerCase() === 'a' || getAttr(clickedElement, "href")) {
            // We found a link within 3 parents!
            // clickedElement;
            break; 
        }
        clickedElement = clickedElement?.parentNode;

        // Check if we have reached the top
        if (i == maxParentsToCheck - 1) {
            clickedElement = null;
        }
        if(clickedElement == null){
            break;
        }
    }
    // Manage custom MD elements
    let targetHref = getAbsURL(event.target.getAttribute("href") || getAttr(clickedElement, "href") || null);
    if((clickedElement == null || clickedElement.tagName.toLowerCase() !== 'a') && targetHref != null){
        let url;
        try{
            url = new URL(targetHref);
            clickedElement = url;
        }catch{
        }
    }
    // Check if this is a link element
    if (clickedElement != null && clickedElement.target != "_blank") {
        // Check if the href is valid
        if((clickedElement.host === window.location.host) && (clickedElement.pathname.lastIndexOf(".") <= clickedElement.pathname.lastIndexOf("/"))){
            // Prevent the default link behavior
            event.preventDefault();

            // Add language directory
            clickedElement.pathname = '/' + checkLocale() + clickedElement.pathname;

            // Get the new URL
            let newURL = clickedElement.href;

            // Update the history state
            history.pushState({urlSrc: newURL}, "", newURL); 
            setPathname(extractPathname());
        }
    }
});

export function setupDisplayUpdates(){
    // Keep track of URL
    trackPathname();

    // Update display content
    updateDisplay();
} 

// Wait for content to become visible
// (wait for launch activity and loading activity to disappear)
export async function awaitVisibility(){
    if (window.document.documentElement.contentVisible) {
        return null; // ShadowRoot is ready
    }
    await new Promise((resolve) => setTimeout(resolve, window.CHECK_DOM_LOOP_DELAY)); // Check again on next cycle
    return awaitVisibility();
}