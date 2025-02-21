/*
    Manage the colour-scheme of pages!
*/

// Check page independence!
if(!window.DEPENDENT){
    window.addComponentToList = () => {};
    document.documentElement.resourceLoaded = () => {};
    window.STYLESHEET = window.STYLESHEET_NO_MEDIA = window.JAVASCRIPT = 0;
}

(function(){
    // Save classlist
    const PAGE = document.documentElement.classList;

    // Check the value of 'prefers-color-scheme'
    const prefersDarkColorScheme = () => window && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Check the value of 'forced-colors'
    const forcedColors = () => window && window.matchMedia && window.matchMedia('(forced-colors: active)').matches;

    // Choose a tracking value
    const track = window.DEPENDENT ?
                        () => document.documentElement.colors :
                        () => document.documentElement.indepColors;

    // Make sure all colour schemes are loaded
    const awaitColorsLoad = (callback) => {
        if(track()){
            callback();
        }else{
            setTimeout(() => {
                awaitColorsLoad(callback);
            }, 50)
        }
    };

    // Manage the colour scheme!
    let schemeList = document.documentElement.schemeList,
        updateColourScheme = (force = null) => {
            if(window.DEPENDENT){
                // Remove colour scheme class
                PAGE.remove(...schemeList);
                // Check if the value is forced or not
                if(typeof force === 'number'){
                    PAGE.add(schemeList[force]);
                }else{
                    let contrast = forcedColors(),
                        contrastLow = 0;
                    if(prefersDarkColorScheme()){
                        if(contrast){
                            PAGE.add(schemeList[4 + contrastLow])
                        }else{
                            PAGE.add(schemeList[3])
                        }
                    }else{
                        if(contrast){
                            PAGE.add(schemeList[1 + contrastLow])
                        }else{
                            PAGE.add(schemeList[0])
                        }
                    }
                }
            }else{
                // Signal independent colour scheme manager
                if(typeof force == "number"){
                    window.indepColorSchemeUpdate(force != 0 && force != 3, force > 2);
                }else{
                    window.indepColorSchemeUpdate(forcedColors(), prefersDarkColorScheme());
                }
            }
        };

    // Check user preferences
    awaitColorsLoad(() => {
        // Check scheme cookie value
        let colorScheme = document.documentElement.getCookie("scheme");
        if(colorScheme != null && Number(colorScheme) < 6){
            updateColourScheme(Number(colorScheme));
        }else{
            // Always auto-detect
            updateColourScheme();
        }
    });
})();

document.documentElement.resourceLoaded(JAVASCRIPT);