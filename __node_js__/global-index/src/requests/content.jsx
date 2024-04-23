/**
 * 
 * Manage basic content loading in all pages
 * 
**/

import { createSignal, createEffect } from "solid-js";
import { getDisplay } from "./display";

export const [getDisplayXML, setDisplayXML] = createSignal();
export const [getPathname, setPathname] = createSignal(null);

// Keep checking for URL changes and update the content of the page accordingly
function updateDisplay() {

    // Watch out for any URL updates
    createEffect(() => {
        console.log(`New location: ${getPathname()}`);
        window.document.documentElement.setContentResourceGoal(getPathname(), 1);

        // Add error handling!
        getDisplay(getPathname()).then(xml => {
            setDisplayXML(xml);
            window.document.documentElement.setContentResourceLoaded(getPathname(), 1);
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
document.addEventListener('click', (event) => {
    // Check if element (or up to the 3rd parent) is a link element
    let clickedElement = event.target;
    const maxParentsToCheck = 3;
    for (let i = 0; i < maxParentsToCheck; i++) {
        if (((clickedElement || {}).tagName || "").toLowerCase() === 'a') {
            // We found a link within 3 parents!
            // clickedElement;
            break; 
        }
        clickedElement = (clickedElement || {}).parentNode;

        // Check if we have reached the top
        if (i == maxParentsToCheck - 1) {
            clickedElement = null;
        }
        if(clickedElement == null){
            break;
        }
    }
    // Manage custom MD elements
    let targetHref = getAbsURL(event.target.getAttribute("href") || null);
    if(clickedElement == null && targetHref != null){
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
        if(clickedElement.host === window.location.host){
            // Prevent the default link behavior
            event.preventDefault();

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