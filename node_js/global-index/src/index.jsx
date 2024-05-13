import { render } from "solid-js/web";
//import { Router } from "solid-app-router";

import { setupDisplayUpdates, getDisplayXML } from "./requests/content";
import { processDisplay } from "./requests/process";
import { updateDocLocaleInfo } from "./requests/language/doc";

function startSolidJS(){
    // Prevent duplicate calls!
    document.documentElement.startSolidJS = null;

    // Check content language
    updateDocLocaleInfo();

    // Start tracking pathname!
    setupDisplayUpdates();

    // Render content
    const root = document.getElementById("content-activity");
    if(root != null){
        render(() => <>{processDisplay(getDisplayXML())}</>, root);
    }else{
        setTimeout(window.location.reload, 500);
    }
}
document.documentElement.startSolidJS = startSolidJS;

// Finish loading the page!
document.documentElement.resourceLoaded(JAVASCRIPT);
