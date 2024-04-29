/**
 * 
 * Manage Google Analytics tracking
 * 
**/

window.dataLayer = window.dataLayer || [];
function gtag(){
    dataLayer.push(arguments);
}

// Default code
gtag('js', new Date());
gtag('config', 'G-5F32MWD0EQ');
gtag('send', 'pageview');
// Disable cookies
gtag('config', 'G-5F32MWD0EQ', { 'storage': 'none' });
// Disable Google Ads Tracking
gtag('set', 'allowAdFeatures', false);