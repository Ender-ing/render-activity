/**
 * 
 * All functions used to manage the page before elements are loaded in
 * 
**/
// Keep track of loaded resources
document.documentElement.initialResourceCount = 1;
document.documentElement.initialResourceLoaded = 0;

// Mark loaded resources
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

// Fix pathname base
function fixBase(base){
    // Add slash to the end of the pathname
    if(base[base.length - 1] != "/"){
        base += "/";
    }
    return base;
}

// Create a fetch preload
function preloadFetch(url){
    let link = document.createElement("link");
    link.setAttribute("rel", "preload");
    link.setAttribute("as", "fetch");
    link.setAttribute("crossorigin", "use-credentials");
    // Set URL
    link.setAttribute("href", url);
    // Append element
    document.head.appendChild(link);
}

// Preload .display and .locale files
function preloadContent(){
    // Preload .display file
    preloadFetch(fixBase(window.location.pathname) + "index.display");
    // Preload .locale file
    //let locale = document.documentElement.getCookie("locale");
    //if(locale != null){
    //    // This means that locale files are not loaded on the user's first visit to the website!
    //    preloadFetch(`${window.RESOURCES}global-locale/${locale}.locale`);
    //    preloadFetch(fixBase(window.location.pathname) + `${locale}.locale`);
    //}
}
document.documentElement.preloadContent = preloadContent;