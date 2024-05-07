/**
 * 
 * Manage global dialogs doc changes (meta, RTL, etc.)
 * 
**/

import { awaitVisibility } from "../requests/content";
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
    elm.open = true;
}

// Show dialog activity
let dialogActivity = null;
async function awaitDialogActivity(){
    if(dialogActivity == null){
        dialogActivity = document.getElementById("dialogs-activity");
    }
    if (dialogActivity != null) {
        // Show dialogs activity
        dialogActivity.style.display = null;
        return null;
    }
    await new Promise((resolve) => setTimeout(resolve, window.CHECK_DOM_LOOP_DELAY)); // Check again on next cycle
    return awaitDialogActivity();
}

// Show a dialog specific to an error
export async function showDialog(id){
    await awaitVisibility();
    await awaitDialogActivity();
    showDialogElm(document.getElementById(id));
}