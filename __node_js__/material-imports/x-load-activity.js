/**
 * 
 * Manage visual loading activity
 * 
**/

/*
    <md-linear-progress id="load-activity-bar" class="global-loading-bar" indeterminate style="display: none;"></md-linear-progress>
    <div id="load-activity" class="load" style="display: none;"></div>


*/

// Get needed elements
let loadActivity = document.getElementById("load-activity"),
    loadActivityBar = document.getElementById("load-activity-bar"),
    contentActivityContainer = document.getElementById("content-activity");

// Keep track of the current loading session
let currentID = null,
    currentGoal = null,
    currentLoaded = 0;
window.document.documentElement.contentVisible = false;

// Identify new loading sessions
function setContentResourceGoal(id, needed){
    // Update tracking variables
    currentID = id;
    currentGoal = needed;

    // Show loading screen
    loadActivity.style.display = null;
    loadActivityBar.style.display = null;
    contentActivityContainer.classList.add("dim");
    contentActivityContainer.setAttribute("tabindex", "-1");
    contentActivityContainer.setAttribute("inert", "-1");
    window.document.documentElement.contentVisible = false;
}
window.document.documentElement.setContentResourceGoal = setContentResourceGoal;

// Track the number of loaded resources
function setContentResourceLoaded(id, loaded){
    if(id === currentID){
        // Update tracking variables
        currentLoaded = loaded;

        // Check if the loading process is finished
        if(currentGoal === currentLoaded){
            // Update tracking variables
            currentID = null;
            currentGoal = null;
            currentLoaded = 0;

            // Inject new content

            // Hide loading screen
            setTimeout(() => {
                contentActivityContainer.classList.remove("dim");
                contentActivityContainer.removeAttribute("tabindex");
                contentActivityContainer.removeAttribute("inert");
                loadActivity.style.display = "none";
                loadActivityBar.style.display = "none";
                window.document.documentElement.contentVisible = true;
            }, 0);
        }
    }
}
window.document.documentElement.setContentResourceLoaded = setContentResourceLoaded;
