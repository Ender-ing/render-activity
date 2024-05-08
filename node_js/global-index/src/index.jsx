import { render } from "solid-js/web";
//import { Router } from "solid-app-router";

import { setupDisplayUpdates, getDisplayXML } from "./requests/content";
import { processDisplay } from "./requests/process";
import { updateDocLocaleInfo } from "./requests/language/doc";

function startSolidJS(){
    document.documentElement.startSolidJS = null;

    // Check content language
    updateDocLocaleInfo();

    // Start waiting for URL updated!
    setupDisplayUpdates();
    
    // Render content
    const root = document.getElementById("content-activity");
    render(() => <>{processDisplay(getDisplayXML())}</>, root);
}
document.documentElement.startSolidJS = startSolidJS;

// Finish loading the page!
document.documentElement.resourceLoaded(JAVASCRIPT);
