/**
 * 
 * Material design components need at time of first page print!
 * 
**/

import '@material/web/progress/circular-progress.js';
window.addComponentToList("circular-progress", "md-circular-progress");
import '@material/web/progress/linear-progress.js';
window.addComponentToList("linear-progress", "md-linear-progress");

document.documentElement.resourceLoaded(JAVASCRIPT);