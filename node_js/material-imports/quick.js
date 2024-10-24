/**
 * 
 * Material design components need at time of first page print!
 * 
**/

// Check page independence!
if(!window.DEPENDENT){
    window.addComponentToList = () => {};
    document.documentElement.resourceLoaded = () => {};
    window.STYLESHEET = window.STYLESHEET_NO_MEDIA = window.JAVASCRIPT = 0;
}

import '@material/web/progress/circular-progress.js';
window.addComponentToList("circular-progress", "md-circular-progress");
import '@material/web/progress/linear-progress.js';
window.addComponentToList("linear-progress", "md-linear-progress");

// Mark this resource as "loaded"
document.documentElement.resourceLoaded(JAVASCRIPT);