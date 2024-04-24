/**
 * 
 * Load all material components files that may have shared components!
 * 
**/

// Utility functions
async function awaitShadowRoot(elm) {
    if (elm.shadowRoot != null) {
        return null; // ShadowRoot is ready
    }
    await new Promise((resolve) => setTimeout(resolve, window.CHECK_DOM_LOOP_DELAY)); // Check again on next cycle
    return awaitShadowRoot(elm);
}

// Buttons
import '@material/web/button/elevated-button.js';
window.addComponentToList("elevated-button", "md-elevated-button");
import '@material/web/button/filled-button.js';
window.addComponentToList("filled-button", "md-filled-button");
import '@material/web/button/filled-tonal-button.js';
window.addComponentToList("filled-tonal-button", "md-filled-tonal-button");
import '@material/web/button/outlined-button.js';
window.addComponentToList("outlined-button", "md-outlined-button");
import '@material/web/button/text-button.js';
window.addComponentToList("text-button", "md-text-button");

// Checkbox
import '@material/web/checkbox/checkbox.js';
window.addComponentToList("checkbox", "md-checkbox");

// Chips
import '@material/web/chips/chip-set.js';
window.addComponentToList("chip-set", "md-chip-set");
import '@material/web/chips/assist-chip.js';
window.addComponentToList("assist-chip", "md-assist-chip");
import '@material/web/chips/filter-chip.js';
window.addComponentToList("filter-chip", "md-filter-chip");
import '@material/web/chips/input-chip.js';
window.addComponentToList("input-chip", "md-input-chip");
import '@material/web/chips/suggestion-chip.js';
window.addComponentToList("suggestion-chip", "md-suggestion-chip");

// Dialog
import '@material/web/dialog/dialog.js';
// Fix scrollbar bug
window.addComponentToList("dialog", "md-dialog", async function(dialog) {
    await awaitShadowRoot(dialog);
    dialog.shadowRoot.adoptedStyleSheets.push(getScrollbarCSS());
});
let scrollbarStyleSheet = null;
function getScrollbarCSS(){
    // Check if the CSSStyleSheet is not defined
    if(scrollbarStyleSheet == null){
        try {
            // Get theme.css rules
            let themeRules = document.getElementById("material-theme-style").sheet.cssRules;

            // Get all scrollbar CSS rules
            let scrollbarRules = [];
            for (let i = 0; i < themeRules.length; i++) {
                // Check if the selector includes the word "scrollbar"
                if(themeRules[i].selectorText.indexOf("scrollbar") != -1){
                    scrollbarRules.push(themeRules[i].cssText);
                }
            }
            themeRules = null;

            // Make a CSSStyleSheet from the text
            scrollbarStyleSheet = new CSSStyleSheet();
            scrollbarStyleSheet.replace(scrollbarRules.join(" "));
        }catch{
            return new CSSStyleSheet();
        }
    }

    // Return the CSSStyleSheet object
    return scrollbarStyleSheet;
}

// Divider
import '@material/web/divider/divider.js';
window.addComponentToList("divider", "md-divider");

// Elevation (effect)
import '@material/web/elevation/elevation.js';
window.addComponentToList("elevation", "md-elevation");

// Fabs
import '@material/web/fab/fab.js';
window.addComponentToList("fab", "md-fab");
import '@material/web/fab/branded-fab.js';
window.addComponentToList("branded-fab", "md-branded-fab");

// Fields
// ?????
// import '@material/web/field/filled-field.js';
// window.addComponentToList("filled-field", "md-filled-field");
// import '@material/web/field/outlined-field.js';
// window.addComponentToList("outlined-field", "md-outlined-field");

// Focus (effect)
import '@material/web/focus/md-focus-ring.js';
window.addComponentToList("focus-ring", "md-focus-ring");

// Icon
import '@material/web/icon/icon.js';
window.addComponentToList("icon", "md-icon");

// Icon buttons
import '@material/web/iconbutton/filled-icon-button.js';
window.addComponentToList("filled-icon-button", "md-filled-icon-button");
import '@material/web/iconbutton/filled-tonal-icon-button.js';
window.addComponentToList("filled-tonal-icon-button", "md-filled-tonal-icon-button");
import '@material/web/iconbutton/icon-button.js';
window.addComponentToList("icon-button", "md-icon-button");
import '@material/web/iconbutton/outlined-icon-button.js';
window.addComponentToList("outlined-icon-button", "md-outlined-icon-button");

// Lists
import '@material/web/list/list.js';
window.addComponentToList("list", "md-list");
import '@material/web/list/list-item.js';
window.addComponentToList("list-item", "md-list-item");

// Menus
import '@material/web/menu/menu.js';
window.addComponentToList("menu", "md-menu");
import '@material/web/menu/sub-menu.js';
window.addComponentToList("sub-menu", "md-sub-menu");
import '@material/web/menu/menu-item.js';
window.addComponentToList("menu-item", "md-menu-item");

// Radio
import '@material/web/radio/radio.js';
window.addComponentToList("radio", "md-radio");

// Ripple
import '@material/web/ripple/ripple.js';
window.addComponentToList("ripple", "md-ripple");

// Selects
import '@material/web/select/filled-select.js';
window.addComponentToList("filled-select", "md-filled-select");
import '@material/web/select/outlined-select.js';
window.addComponentToList("outlined-select", "md-outlined-select");
import '@material/web/select/select-option.js';
window.addComponentToList("select-option", "md-select-option");

// Slider
import '@material/web/slider/slider.js';
window.addComponentToList("slider", "md-slider");

// Switch
import '@material/web/switch/switch.js';
window.addComponentToList("switch", "md-switch");

// Tabs
import '@material/web/tabs/tabs.js';
window.addComponentToList("tabs", "md-tabs");
import '@material/web/tabs/primary-tab.js';
window.addComponentToList("primary-tab", "md-primary-tab");
import '@material/web/tabs/secondary-tab.js';
window.addComponentToList("secondary-tab", "md-secondary-tab");

// Textfields
import '@material/web/textfield/filled-text-field.js';
window.addComponentToList("filled-text-field", "md-filled-text-field");
import '@material/web/textfield/outlined-text-field.js';
window.addComponentToList("outlined-text-field", "md-outlined-text-field");
