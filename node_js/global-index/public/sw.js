/**
 * 
 * Service Worker!
 * 
**/

// Service worker info
const SERVICE_VERSION = '[[version]]'; // Don't touch this, it's updated automatically!
const WORKER_VERSION = "A5"; // Update this whenever you make changes to the service worker that may break cache!
const DEPLOY_VERSION = SERVICE_VERSION.substring(0, SERVICE_VERSION.lastIndexOf(".")) + "-" + WORKER_VERSION;
const RESOURCE_CACHE = 'resource-cache-v' + DEPLOY_VERSION; // Used to cache static files
const CALL_CACHE = 'call-cache-v' + DEPLOY_VERSION; // Used to call API calls (request must include an "x-allow-call-cache" header)
const CACHE_ALLOWLIST = [RESOURCE_CACHE, CALL_CACHE];
//const HOST = 'ender.ing';
const INSTALL_CACHE_LIST = [
    // Branding
    "/brand/icons/favicon.ico",
    "/brand/icons/logo.svg",
    "/brand/icons/logo-maskable.svg",
    "/brand/icons/logo-72.png",
    "/brand/icons/logo-96.png",
    "/brand/icons/logo-128.png",
    "/brand/icons/logo-144.png",
    "/brand/icons/logo-152.png",
    "/brand/icons/logo-192.png",
    "/brand/icons/logo-384.png",
    "/brand/icons/logo-512.png",
    // Material files
    "https://resources.ender.ing/web/client/@material/general.js",
    "https://resources.ender.ing/web/client/@material/quick.js",
    "https://resources.ender.ing/web/client/@material/x-launch-activity.js",
    "https://resources.ender.ing/web/client/@material/x-load-activity.js",
    "https://resources.ender.ing/web/client/@material/x-layouts.js",
    "https://resources.ender.ing/web/client/material/colors.css",
    "https://resources.ender.ing/web/client/material/theme.css",
    "https://resources.ender.ing/web/client/material/load.css",
    "https://resources.ender.ing/web/client/material/icons.css",
    "https://resources.ender.ing/web/client/material/font.css",
    "https://resources.ender.ing/web/client/material/layouts.css",
    "https://resources.ender.ing/web/client/material/colors.js",
    // Index JS file (SolidityJS)
    "https://resources.ender.ing/web/client/@vite/index.js",
    // Root (HTML, display, and locale)
    "/",
    "/index.display",
    "/ar.locale",
    "/en.locale",
    "/he.locale",
    // Code Error Global Page (display, and locale)
    "https://resources.ender.ing/web/client/global-pages/error-code/",
    "https://resources.ender.ing/web/client/global-pages/error-code/index.display",
    "https://resources.ender.ing/web/client/global-pages/error-code/ar.locale",
    "https://resources.ender.ing/web/client/global-pages/error-code/en.locale",
    "https://resources.ender.ing/web/client/global-pages/error-code/he.locale",
    // 404 Error Global Page (display, and locale)
    "https://resources.ender.ing/web/client/global-pages/error-404/",
    "https://resources.ender.ing/web/client/global-pages/error-404/index.display",
    "https://resources.ender.ing/web/client/global-pages/error-404/ar.locale",
    "https://resources.ender.ing/web/client/global-pages/error-404/en.locale",
    "https://resources.ender.ing/web/client/global-pages/error-404/he.locale",
    // Connection Error Global Page (display, and locale)
    "https://resources.ender.ing/web/client/global-pages/error-connection/",
    "https://resources.ender.ing/web/client/global-pages/error-connection/index.display",
    "https://resources.ender.ing/web/client/global-pages/error-connection/ar.locale",
    "https://resources.ender.ing/web/client/global-pages/error-connection/en.locale",
    "https://resources.ender.ing/web/client/global-pages/error-connection/he.locale",
    // Server Error Global Page (display, and locale)
    "https://resources.ender.ing/web/client/global-pages/error-server/",
    "https://resources.ender.ing/web/client/global-pages/error-server/index.display",
    "https://resources.ender.ing/web/client/global-pages/error-server/ar.locale",
    "https://resources.ender.ing/web/client/global-pages/error-server/en.locale",
    "https://resources.ender.ing/web/client/global-pages/error-server/he.locale",
    // Fonts and external
    // Icons
    "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0",
    "https://fonts.gstatic.com/s/materialsymbolsrounded/v177/syl0-zNym6YjUruM-QrEh7-nyTnjDwKNJ_190FjpZIvDmUSVOK7BDB_Qb9vUSzq3wzLK-P0J-V_Zs-QtQth3-jOcbTCVpeRL2w5rwZu2rIelXxc.woff2",
    // Font
    "https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Noto+Sans+Hebrew:wght@100..900&family=Noto+Sans+Arabic:wght@100..900&display=swap",
    "https://fonts.gstatic.com/s/notosans/v36/o-0ZIpQlx3QUlC5A4PNr4C5OaxRsfNNlKbCePevttHOmDyw.woff2",
    "https://fonts.gstatic.com/s/notosans/v36/o-0ZIpQlx3QUlC5A4PNr4C5OaxRsfNNlKbCePevtvXOmDyw.woff2",
    "https://fonts.gstatic.com/s/notosans/v36/o-0ZIpQlx3QUlC5A4PNr4C5OaxRsfNNlKbCePevtuHOmDyw.woff2",
    "https://fonts.gstatic.com/s/notosans/v36/o-0ZIpQlx3QUlC5A4PNr4C5OaxRsfNNlKbCePevttXOmDyw.woff2",
    "https://fonts.gstatic.com/s/notosans/v36/o-0ZIpQlx3QUlC5A4PNr4C5OaxRsfNNlKbCePevtunOmDyw.woff2",
    "https://fonts.gstatic.com/s/notosans/v36/o-0ZIpQlx3QUlC5A4PNr4C5OaxRsfNNlKbCePevttnOmDyw.woff2",
    "https://fonts.gstatic.com/s/notosans/v36/o-0ZIpQlx3QUlC5A4PNr4C5OaxRsfNNlKbCePevtt3OmDyw.woff2",
    "https://fonts.gstatic.com/s/notosans/v36/o-0ZIpQlx3QUlC5A4PNr4C5OaxRsfNNlKbCePevtuXOm.woff2",
    "https://fonts.gstatic.com/s/notosans/v36/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5aPdu2ui.woff2",
    "https://fonts.gstatic.com/s/notosans/v36/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5ardu2ui.woff2",
    "https://fonts.gstatic.com/s/notosans/v36/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5a_du2ui.woff2",
    "https://fonts.gstatic.com/s/notosans/v36/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5aLdu2ui.woff2",
    "https://fonts.gstatic.com/s/notosans/v36/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5a3du2ui.woff2",
    "https://fonts.gstatic.com/s/notosans/v36/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5aHdu2ui.woff2",
    "https://fonts.gstatic.com/s/notosans/v36/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5aDdu2ui.woff2",
    "https://fonts.gstatic.com/s/notosans/v36/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5a7duw.woff2",
    "https://fonts.gstatic.com/s/notosansarabic/v18/nwpCtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlj4wv4o.woff2",
    "https://fonts.gstatic.com/s/notosanshebrew/v43/or30Q7v33eiDljA1IufXTtVf7V6RvEEdhQlk0LlGxCyaePiWTNzENg.woff2",
    "https://fonts.gstatic.com/s/notosanshebrew/v43/or30Q7v33eiDljA1IufXTtVf7V6RvEEdhQlk0LlGxCyaePiaTNzENg.woff2",
    "https://fonts.gstatic.com/s/notosanshebrew/v43/or30Q7v33eiDljA1IufXTtVf7V6RvEEdhQlk0LlGxCyaePiUTNw.woff2",
];
// Add cache version query
for(let i in INSTALL_CACHE_LIST){
    INSTALL_CACHE_LIST[i] += (INSTALL_CACHE_LIST[i].indexOf("?") == -1) ? "?" : "&";
    INSTALL_CACHE_LIST[i] += `cache=${DEPLOY_VERSION}`;
}
// TO-DO!!
// ADD A CACHE QUERY TO ALL RESOURCES AND FETCH REQUESTS!!
const CACHE_EXTENSIONS = ['.js','.css','.html','.ico','.png','.svg','.display','.locale'];
ENABLE_DYNAMIC_CACHING = true;
ENABLE_INSTALL_CAHCE = true;

// Install Event: Cache essential files
self.addEventListener('install', event => {
    event.waitUntil(
        // Combine skipWaiting() with the cache opening process:
        Promise.all([
            caches.open(RESOURCE_CACHE)
                    .then(cache => cache.addAll(((ENABLE_INSTALL_CAHCE) ? INSTALL_CACHE_LIST : []))),
                self.skipWaiting() // Activate the new service worker immediately
            ])
    );
});

// Wait for initial activation
self.addEventListener('activate', async event => {
    // Overtake control!
    event.waitUntil(self.clients.claim());

    // Delete all old caches
    const cacheNames = await caches.keys();
    let cacheDeleted = false;
    for (let i = 0; i < cacheNames.length; i++){
        if(!CACHE_ALLOWLIST.includes(cacheNames[i])){
            await caches.delete(cacheNames[i]);
            cacheDeleted = true;
        }
    }
    // Reload all tabs (to ensure no old cache is used in the page)
    if(cacheDeleted){
        // Get all tabs
        const tabs = await self.clients.matchAll({type: 'window'})
        tabs.forEach((tab) => {
            // Refresh each one of them
            tab.navigate(tab.url);
        });    
    }
});

// Check if request should be cached
function shouldCache(url){
    return CACHE_EXTENSIONS.some(ext => url.pathname.endsWith(ext)) ||
            url.pathname.endsWith("/");
}

// Fetch Event: Dynamic Caching + Network-First Strategy
self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);

    // Make a new request with the ?cache query
    requestUrl.searchParams.append("cache", DEPLOY_VERSION);
    const newRequest = new Request(requestUrl, {
        method: event.request.method,
        headers: event.request.headers,
        body: event.request.body,
        credentials: event.request.credentials,
        cache: event.request.cache,
        redirect: event.request.redirect,
        referrer: event.request.referrer,
        duplex: (event.request.duplex || 'half')
    });

    // Check if the requested file ends with one of the desired extensions
    if (shouldCache(requestUrl)) {
        event.respondWith((async () => {
            let cacheResponse = await caches.match(newRequest, { ignoreVary: true }); // Check for the file in the cache
            if(cacheResponse){
                return cacheResponse;
            }else{
                let fetchResponse = await fetch(newRequest);
                // Prevent failed responses from being cached
                // TO-DO:
                // Responde with offline page if the fetch failed due to a network error
                if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                    return fetchResponse;
                }
                if (ENABLE_DYNAMIC_CACHING) {
                    const cache = await caches.open(RESOURCE_CACHE);
                    await cache.put(newRequest, fetchResponse.clone());
                    // Cache index.html file for .display directories
                    if(requestUrl.pathname.endsWith("index.display")){
                        let htmlURL = requestUrl.href.replace("index.display", "");
                        if(!(await caches.match(htmlURL))){
                           cache.add(requestUrl.href.replace("index.display", ""));
                        }
                    }
                }
                return fetchResponse;
            }
        })());
    } else {
        // Handle other fetch requests differently if needed
    }
});

// Service worker communication
self.addEventListener('message', (event) => {
    if (event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage(DEPLOY_VERSION);
    }
});
