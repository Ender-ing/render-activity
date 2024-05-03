/**
 * 
 * Manage Google Analytics tracking
 * 
**/

// Define dataLayer object
const GTag = "G-5F32MWD0EQ";
window.dataLayer = window.dataLayer || [];
function gtag(){
    dataLayer.push(arguments);
}

// Define script injection code
function injectGTag(){
    let script = document.createElement('script');
    script.setAttribute("src", "https://www.googletagmanager.com/gtag/js?id=" + GTag);
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
gtag('config', GTag);
gtag('send', 'pageview');
// Disable cookies
gtag('config', GTag, { 'storage': 'none' });
// Disable Google Ads Tracking
gtag('set', 'allowAdFeatures', false);

// Inject Tag
awaitReadyState(injectGTag);