/**
 * 
 * Manage effects
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

    static styles = css`
    :host {
      display: relative;
    }
    `;
    connectedCallback() {
        super.connectedCallback();
    }

    render() {
        return html`
        <md-ripple aria-hidden="true"></md-ripple>
        <md-elevation aria-hidden="true"></md-elevation>
        <md-focus-ring aria-hidden="true"></md-focus-ring>
        <slot name="child"></slot>`;
    }
}
customElements.define('x-effect', XEffect);

// Add the element's tag to the list
window.addComponentToList("x-effect", "x-effect");

// Mark this resource as "loaded"
document.documentElement.resourceLoaded(JAVASCRIPT);
