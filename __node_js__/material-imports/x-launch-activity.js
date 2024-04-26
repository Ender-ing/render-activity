/**
 * 
 * All functions used to manage the page before elements are loaded in
 * 
**/
// Keep track of loaded resources
document.documentElement.initialResourceCount = 1;
document.documentElement.initialResourceLoaded = 0;

// Mark loaded resources
var STYLESHEET = 0;
var STYLESHEET_NO_MEDIA = 1;
var JAVASCRIPT = 2;
function resourceLoaded(type, elm = null){
    // Check if the element is included
    if(elm != null){
        if(type === STYLESHEET){
            elm.media = "all";
        }

        elm.onload = null;
    }
    document.documentElement.initialResourceLoaded++;
    // Check if the initial resources have been loaded
    if(typeof document.documentElement.signalResourceCount === "function"){
        document.documentElement.signalResourceCount();
    }
}
document.documentElement.resourceLoaded = resourceLoaded;


let launchActivity,
    contentActivity;

// Set the source URL of the material design resources needed for the library to work!
function startLaunchActivity(){

    // Get content and launch activity elements
    launchActivity = document.getElementById("launch-activity");
    contentActivity = document.getElementById("content-activity");

    document.documentElement.signalResourceCount = checkResourceCount;
    checkResourceCount();
}
document.documentElement.startLaunchActivity = startLaunchActivity;

// Check the status of initial resource count
function checkResourceCount(){
    //console.log(document.documentElement.initialResourceCount, document.documentElement.initialResourceLoaded);
    if(document.documentElement.initialResourceLoaded >= document.documentElement.initialResourceCount) {
        // Start SolidJS
        document.documentElement.startSolidJS();
        // Make sure the fonts have been loaded!
        awaitFontsLoad(() => {
            // Add a big of loading delay to get rid of layout shits
            contentActivity.style.display = null;
            setTimeout(() => {
                launchActivity.style.display = "none";
            }, 1);
            //
        });
    }
}

// Wait for the fonts to fully load
function awaitFontsLoad(callback){
    document.fonts.ready.then(function () {
        callback();
    });
}