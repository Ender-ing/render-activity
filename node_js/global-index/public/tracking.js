/**
 * 
 * Manage Google Analytics tracking
 * 
**/

// Define dataLayer object
const GTAG = "G-5F32MWD0EQ";
const GTAG_DEFAULT = true; // Disable Google Tag By Default! (SWITCH THIS TO FALSE LATER...)
window.dataLayer = window.dataLayer || [];
function gtag(){
    dataLayer.push(arguments);
}

// Define script injection code
function injectGTag(){
    let script = document.createElement('script');
    script.setAttribute("src", "https://www.googletagmanager.com/gtag/js?id=" + GTAG);
    script.setAttribute("async", "");
    // Append script
    document.body.appendChild(script);
}

// Await ready state
function awaitReadyState(callback) {
    // Check if the document is already ready
    if(document.readyState === 'ready' || document.readyState === 'complete'){
        callback();
    }else{
        // Await ready state change
        document.onreadystatechange = function(){
            if(document.readyState == "complete"){
                callback();
            }
        }
    }
}

// Default setup
gtag('js', new Date());
gtag('config', GTAG);
gtag('send', 'pageview');
// Disable cookies
gtag('config', GTAG, { 'storage': 'none' });
// Disable Google Ads Tracking
gtag('set', 'allowAdFeatures', false);

// Check if user allowed GTag tracking
awaitReadyState(function(){
    // Use the default state if a cookie is not set!
    // (Note: always update cookie values after user login and page load!)
    let state = (document.documentElement.getCookie("allow_gtag") || GTAG_DEFAULT) == true;
    if(state){
        setTimeout(injectGTag, 1000);
    }
});