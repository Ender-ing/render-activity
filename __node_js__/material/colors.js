/*
    Manage the colour-scheme of pages!
*/

(function(){
    // Save classlist
    const PAGE = document.documentElement.classList;

    // Check the value of 'prefers-color-scheme'
    const prefersDarkColorScheme = () => window && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Check the value of 'forced-colors'
    const forcedColors = () => window && window.matchMedia && window.matchMedia('(forced-colors: active)').matches;

    // Make sure all colour schemes are loaded
    const awaitColorsLoad = (callback) => {
        if(document.documentElement.colors){
            callback();
        }else{
            setTimeout(() => {
                awaitColorsLoad(callback);
            }, 50)
        }
    };

    // Manage the colour scheme!
    const schemeList = ["light", "light-high-contrast", "light-medium-contrast", "dark", "dark-high-contrast", "dark-medium-contrast", "placeholder-scheme"],
        updateColourScheme = (force = null) => {
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
        };

    // TEMP - add code to check user preferences
    awaitColorsLoad(() => {
        // Add code to check local storage for previously saved preferences!
        updateColourScheme();
    });
})();