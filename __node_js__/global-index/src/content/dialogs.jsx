/**
 * 
 * Manage global dialogs doc changes (meta, RTL, etc.)
 * 
**/

import { localiseInject } from "../requests/language/inject";

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
    localiseInject(elm).then(function(){
        elm.open = true;
    });
}

// Show a dialog specific to an error
export function showDialog(id){
    showDialogElm(document.getElementById(id));
}