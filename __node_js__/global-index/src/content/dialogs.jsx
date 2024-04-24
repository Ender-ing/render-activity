/**
 * 
 * Manage global dialogs doc changes (meta, RTL, etc.)
 * 
**/

import { awaitVisibility } from "../requests/content";
import { localiseInject } from "../requests/language/inject";
import { augmentInject } from "../requests/process";

export const DIALOG = {
    network: {
        error: "network-connection-error"
    },
    content: {
        error: "content-files-error"
    }
};

// Localise dialogs before showing them
function showDialogElm(elm){
    // Augment dialog element
    augmentInject(elm, "dialog");
    // Localise dialog content
    localiseInject(elm).then(function(){
        elm.open = true;
    });
}

// Show a dialog specific to an error
export async function showDialog(id){
    await awaitVisibility();
    showDialogElm(document.getElementById(id));
}