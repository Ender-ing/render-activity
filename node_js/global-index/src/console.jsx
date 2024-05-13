/**
 * 
 * Manage console logs
 * 
**/

// Warn the user about the risks of using the console!
function consoleWarning(){
    console.log('%cStop!',
        'color: crimson; font-size: 46px; font-weight: 800;');
    console.log('%cDo NOT paste any code or text into the console!',
        'color: orange; font-size: 24px;');
    console.log("%cYour account, data, and privacy could be compromised " +
        "should you allow other people to access your console " +
        "or paste code/text into it!",
        'font-size: 16px;');
}

export function showConsoleWarning(){
    // Show console warning on window resize
    window.addEventListener('resize', consoleWarning);

    // Show console warning
    consoleWarning();
}