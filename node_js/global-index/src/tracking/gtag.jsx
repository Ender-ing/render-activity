/**
 *
 * Tracking user interactions using Google Tag Manager
 *
 **/

// gtag function
export function gtag(...args){
    // Allow pushing data only if the tracking state is not set to inactive!
    // (allow pushing data when the tracker is being loaded/checked)
    if(window.pageTracking?.status != window.pageTracking?.states?.inactive){
        window.pageTracking.gtag(...args);
    }
}

// This is a list of custom events:
// - <event_name> ( <event_args>... ) -

export const EVENT_CONTENT_RENDER = "content_render";
// content_render ( user_platform, user_platform_full, user_device, content_language, content_source, content_status )

export const EVENT_USER_LOGIN = "user_login";
// user_login ( user_id_hash, user_platform, user_platform_full, user_device )