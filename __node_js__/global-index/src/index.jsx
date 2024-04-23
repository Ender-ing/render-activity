import { render } from "solid-js/web";
import { Router } from "solid-app-router";

import { setupDisplayUpdates, getDisplayXML } from "./requests/content";
import { processDisplay } from "./requests/process";
import { updateDocLocaleInfo } from "./requests/language/doc";

// Check if the root element div is setup!
const root = document.getElementById("root");
if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
    );
}

// Wait for DOM content to load
document.addEventListener("DOMContentLoaded", function(){
    // Check content language
    updateDocLocaleInfo();

    // Start waiting for URL updated!
    setupDisplayUpdates();

    // Render content
    // <TodoList />
    render(() => <Router><h4>{processDisplay(getDisplayXML())}</h4></Router>, root);
});

// Finish loading the page!
document.documentElement.resourceLoaded(JAVASCRIPT);
