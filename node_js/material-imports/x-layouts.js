/**
 * 
 * Manage layouts
 * 
**/

// For more, checkout https://m3.material.io/foundations/layout/applying-layout/window-size-classes#374861a7-92c0-4ba1-ae14-c7388cefefb7

// TO-DO:1

// [] - Make a *cutout slot* for phone cutouts and custom navigation bars on desktop
// https://m3.material.io/foundations/layout/understanding-layout/hardware-considerations#6c0f6cca-3019-4b4f-87d7-8d879de3ef38

// ??? - Detect fold state on foldable devices
// https://m3.material.io/foundations/layout/understanding-layout/hardware-considerations#6bbf6976-041a-4a10-adf8-8cbb33f36a1e

// ??? - Make a *fold slot* for foldable devices sold line
// https://m3.material.io/foundations/layout/understanding-layout/hardware-considerations#22276e2c-47fa-43c2-8443-bf525fbbf80f

// [x] - Make a *nav slot*
// [x] - Make a *float slot*

// [x] - Make a *bar slot*
// https://m3.material.io/foundations/layout/understanding-layout/parts-of-layout#12ef4a8f-7aa2-441c-b045-ded31bcdb45d

// [x] - Make a *pane* for all layouts to work with!
// https://m3.material.io/foundations/layout/understanding-layout/parts-of-layout#73de653a-fc57-4a7c-bc3b-5b9e94207de8

// [x] - Support RTL Layout!!

// [] - Add a custom overlay scrollbar!

/**
 * 
 * @Note attributes that start with a question mark in the example
 * code are optional attributes! (e.g. ?myAttr=1 => used as `myAttr=1` in html)
 * 
**/

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
 *      <x-layout ?view="collapse">
 *          <div slot="nav-bar">
 *              ...
 *          </div>
 *          <div slot="nav-rail">
 *              ...
 *          </div>
 *          <div slot="group" ?view="static">
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
        this.shadowRoot.addEventListener('slotchange', (e) => this.updateSlotsInfo(e)); 
    }

    setHasBar(count){
        if(count == 0){
            this.removeAttribute("has-bar");
        }else{
            this.setAttribute("has-bar", "");
        }
    }
    setHasRail(count){
        if(count == 0){
            this.removeAttribute("has-rail");
        }else{
            this.setAttribute("has-rail", "");
        }
    }

    updateSlotsInfo(event) {
        const assignedElements = event.target.assignedNodes();
        const count = assignedElements.length;
        if(event.target.name == "group") {
            this.setAttribute("group-count", count);
        }else if(event.target.name == "nav-bar"){
            this.setHasBar(count);
        }else if(event.target.name == "nav-rail"){
            this.setHasRail(count);
        }
    }
    firstUpdated() {
        const barSlot = this.shadowRoot.querySelector('slot[name="nav-bar"]')?.assignedNodes()?.length || 0;
        const railSlot = this.shadowRoot.querySelector('slot[name="nav-rail"]')?.assignedNodes()?.length || 0;
        this.setHasBar(barSlot);
        this.setHasRail(railSlot);
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
 *          <x-pane slot="pane" ?view="full">My Pane Content!</x-pane>
 *          <x-float>My Bottom Float</x-float>
 *      </div>
 * 
**/
window.addComponentToList("x-float", "div", "x-layout-float");
window.addComponentToList("x-pane", "div", "x-layout-pane");

// Mark this resource as "loaded"
document.documentElement.resourceLoaded(JAVASCRIPT);