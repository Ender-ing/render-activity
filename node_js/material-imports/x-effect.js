/**
 * 
 * Manage effects
 * 
 * (PROBLEM: THE ELEMENT KINDA BREAKS THE RIPPLE EFFECT AND THE SHADOW BOX!)
 * 
**/

// Check page independence!
if(!window.DEPENDENT){
    window.addComponentToList = () => {};
    document.documentElement.resourceLoaded = () => {};
    window.STYLESHEET = window.STYLESHEET_NO_MEDIA = window.JAVASCRIPT = 0;
}

/**
 * 
 * @Element <x-effect>
 * 
 * @Use Used to wrap elements and apply effects to them
 * 
 * @Example
 *      <x-effect list="focus elevation ripple">
 *          <div role="child">
 *              ...
 *          </div>
 *      </x-effect>
 * 
**/
import { css, html, LitElement } from 'lit';

class XEffect extends LitElement {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
    }

    enableFocus(child){
        // Make sure the element can be focused!
        if(!this.hasAttribute("tabindex")){
            this.setAttribute("tabindex", "0");
        }
        // Hide the default effect
        this.classList.add("no-default-focus");
        // Add the focus ring
        let focusRing = document.createElement('md-focus-ring');
        focusRing.setAttribute("aria-hidden", "true");
        focusRing.slot = "child";
        // Mark this element as a support element
        focusRing.dataset.support = true;
        // Attach the effect
        this.appendChild(focusRing);
        // Attach the effect to the child
        focusRing.attach(child);
    }
    enableRipple(child){
        // Add the ripple cover
        let rippleCover = document.createElement('md-ripple');
        rippleCover.setAttribute("aria-hidden", "true");
        rippleCover.slot = "child";
        // Mark this element as a support element
        rippleCover.dataset.support = true;
        // Attach the effect
        this.appendChild(rippleCover);
        // Attach the effect to the child
        rippleCover.attach(child);
    }
    enableElevation(child){
        // Add the elevation cover
        let elevationCover = document.createElement('md-elevation');
        elevationCover.setAttribute("aria-hidden", "true");
        elevationCover.slot = "child";
        // Mark this element as a support element
        elevationCover.dataset.support = true;
        // Attach the effect
        this.appendChild(elevationCover);
    }

    firstUpdated() {
        // Get the child
        let child = this.querySelector("[slot=child]:not([data-support])")
        // Check the wanted effects!
        if(this.hasAttribute("list")){
            let list = this.getAttribute("list").replace(/\s\s/g, " ").split(" ");
            if(list.includes("focus")){
                this.enableFocus(child);
            }
            if(list.includes("ripple")){
                this.enableRipple(child);
            }
            if(list.includes("elevation")){
                this.enableElevation(child);
            }
        }else{
            console.warn("It is not recommended to use an empty list for <x-effect> elements!");
        }
    }

    static styles = css`
    :host {
        display: block;
        position: relative;
        width: fit-content;
        height: fit-content;
    }
    :host([class*="no-default-focus"]),
    :host([class*="no-default-focus"]):focus {
        outline: none;
    }
    :host {
        @apply --md-ripple;
    }`;

    render() {
        return html`<slot name="child"></slot>`;
    }
}
customElements.define('x-effect', XEffect);

// Add the element's tag to the list
window.addComponentToList("x-effect", "x-effect");

// Mark this resource as "loaded"
document.documentElement.resourceLoaded(JAVASCRIPT);
