<?php

/**
 * 
 * Redirect this directory to a language directory!
 * 
**/

{
    // Disable cache for this page
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");

    // Language codes
    $langs = array('en', 'ar', 'he');

    // 1. Check if the 'locale' cookie is already set
    if (!isset($_COOKIE['locale']) || !in_array($_COOKIE['locale'], $langs)) {

        // 2. Get preferred languages from the browser
        $preferredLanguages = explode(',', strtok($_SERVER['HTTP_ACCEPT_LANGUAGE'], ';'));

        // 3. Find the first matching language (en, ar, he)
        $matchedLanguage = null;
        $langs = array('en', 'ar', 'he');
        foreach ($preferredLanguages as $language) {
            $code = strtok($language, '-'); // Extract language code (ignore country code)
            if (in_array(strtolower($code), $langs)) {
                $matchedLanguage = strtolower($code);
                break; // Stop searching after first match
            }
        }

        // 4. Set the 'locale' cookie if a match is found (default to 'en')
        setcookie('locale', ($matchedLanguage) ? $matchedLanguage : 'en', time() + (86400 * 30), '/', '.ender.ing'); // Expires in 30 days, accessible across paths
    }

    // Redirect to the root language directory
    header('Location: https://'.$_SERVER['HTTP_HOST'].'/'.$_COOKIE['locale']. $_SERVER['REQUEST_URI']);
}

?>