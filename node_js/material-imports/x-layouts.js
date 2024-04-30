/**
 * 
 * Manage layouts
 * 
**/

// For more, checkout https://m3.material.io/foundations/layout/applying-layout/window-size-classes#374861a7-92c0-4ba1-ae14-c7388cefefb7

// TO-DO:1

// [] - Make a *cutout slot* for phone cutouts and custom navigation bars on desktop
// https://m3.material.io/foundations/layout/understanding-layout/hardware-considerations#6c0f6cca-3019-4b4f-87d7-8d879de3ef38

// [] - Make a *fold slot* for foldable devices sold line
// https://m3.material.io/foundations/layout/understanding-layout/hardware-considerations#22276e2c-47fa-43c2-8443-bf525fbbf80f

// [] - Make a *pane slot*
// [] - Make a *nav slot*
// [] - Make a *float slot*

// [] - Make a *top-bar slot*
// [] - Make a *bottom-bar slot*
// https://m3.material.io/foundations/layout/understanding-layout/parts-of-layout#12ef4a8f-7aa2-441c-b045-ded31bcdb45d

// ??? - Detect fold state on foldable devices
// https://m3.material.io/foundations/layout/understanding-layout/hardware-considerations#6bbf6976-041a-4a10-adf8-8cbb33f36a1e

// [] - Make a *<x-pane> element* (fixed & flexible) for all layouts to work with!
// https://m3.material.io/foundations/layout/understanding-layout/parts-of-layout#73de653a-fc57-4a7c-bc3b-5b9e94207de8

/**
 * 
 * @Element <x-root>
 * 
 * @Use Use to inject code in a page that has no layouts.
 * 
 * @Warning Never use this element in a production page!
 * 
**/
window.addComponentToList("x-root", "div", "x-root-class");

/**
 * 
 * @Element <x-layout>
 * 
 * @Use Used for all layouts, can contain up to two *layout group* slots,
 * and *navigation* slots!
 * 
 * @Example
 *      <x-layout>
 *          <div slot="nav-bar">
 *              ...
 *          </div>
 *          <div slot="nav-rail">
 *              ...
 *          </div>
 *          <div slot="group">
 *              ...
 *          </div>
 *          <div slot="group">
 *              ...
 *          </div>
 *      </x-layout>
 * 
**/
import { html, LitElement } from 'lit';

class XLayout extends LitElement {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.shadowRoot.addEventListener('slotchange', (e) => ((e.target.name == "group") ? this.updateCounts(e) : null)); 
    }

    updateCounts(event) {
        const assignedElements = event.target.assignedNodes();
        const count = assignedElements.length;

        this.setAttribute("group-count", count);
    }

    render() {
        return html`<slot name="group"></slot>
            <slot name="nav-rail"></slot>
            <slot name="nav-bar"></slot>`;
    }
}
customElements.define('x-layout', XLayout);

// Add the element's tag to the list
window.addComponentToList("x-layout", "x-layout");

/**
 * 
 * @Slot group
 * 
 * @Use Used to contain layout *panes*, *floats*, *top-bars*, and *bottom-bars* slots.
 * 
 * @Example
 *      <div slot="group">
 *          <x-float>My Top Float</x-float>
 *          <x-pane slot="pane">My Pane Content!</x-pane>
 *          <x-float>My Bottom Float</x-float>
 *      </div>
 * 
**/
window.addComponentToList("x-float", "div", "x-layout-float");
window.addComponentToList("x-pane", "div", "x-layout-pane");

// Mark this resource as "loaded"
document.documentElement.resourceLoaded(JAVASCRIPT);