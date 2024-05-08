/**
 *
 * Process display XML
 *
 **/

import { createSignal, onCleanup, onMount } from 'solid-js';
import { addMeta } from './language/seo';

// Fix HTML and XML characters in JS source code
function fixJSSource(str) {
    const symbols = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;" : "\"",
        "&apos;": "'"
    }

    let fixedStr = str;
    for (const symbol in symbols) {
        if (fixedStr.indexOf(symbol) >= 0) {
            fixedStr = fixedStr.replaceAll(symbol, symbols[symbol])
        }
    }
    return fixedStr;
}

// Augment elements
export function augmentInject(element, originalTag, augmentQueuePush = null){
    if(!element.isAugmented){
        // Process component augments (classes, onMount-like functions)
        if((window.componentsAugments[originalTag] || []).length > 0){
            for(let i = 0; i < window.componentsAugments[originalTag].length; i++){
                if(typeof window.componentsAugments[originalTag][i] == "string"){
                    // Add class
                    element.classList.add(window.componentsAugments[originalTag][i]);
                }else if(typeof window.componentsAugments[originalTag][i] == "function"){
                    // Define augment function wrapper
                    let augFunc = function(){
                        const elm = element;
                        try{
                            (window.componentsAugments[originalTag][i])(elm);
                        }catch(e){
                            console.error("Component Augment Error", e);
                        }
                    };
                    // Run function
                    if(augmentQueuePush != null){
                        augmentQueuePush(augFunc);
                    }else{
                        augFunc();
                    }
                }
            }
            element.isAugmented = true;
        }
    }
}

// Convert XML Document into HTML string
function xmlToHTML(xmlDoc){

    let scriptsQueue = [],
        scriptElements = [],
        augmentFunctionsQueue = [];

    // Check the type of the node!
    function processNode(node) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                return createElement(node);
            case Node.TEXT_NODE:
                return node.textContent;
            default:
                return null; 
        }
    }

    // Create SolidJS components
    function createElement(node) {
        let origNode = node.nodeName.toLowerCase();
        // Get component name
        let tag = window.componentsList[origNode];
        if(typeof tag !== "string"){
            tag = origNode;
        }

        if(tag != "script" && tag != null){
            let element = document.createElement(tag);

            // Properties:
            for (let i = 0; i < node.attributes.length; i++) {
                element.setAttribute(node.attributes[i].name, node.attributes[i].value);
            }

            // Process component augments (classes, onMount-like functions)
            augmentInject(element, origNode, (val) => {
                augmentFunctionsQueue.push(val);
            });
    
            // Children:
            const children = Array.from(node.childNodes).map(processNode);
            for(let i = 0; i < children.length; i++) {
                if(children[i] != null){
                    element.append(children[i]);
                }
            }

            return element;
        }else if(tag == "script"){
            scriptsQueue.push(node.innerHTML);
            return null;
        }else{
            return null;
        }
    }

    // Inject scripts
    function ContentCon(props){
        let container;
        onMount(() => {

            // Add meta tags
            addMeta(root.getAttribute("title"), root.getAttribute("description"));

            container.append(props.rootContent);
            setTimeout(() => {
                while(scriptsQueue.length > 0){
                    let script = document.createElement("script");
                    script.innerHTML = `(function(){${fixJSSource(scriptsQueue.pop())}})();`;
                    document.body.append(script);
                    scriptElements.push(script);
                }
                while(augmentFunctionsQueue.length > 0){
                    (augmentFunctionsQueue.pop())();
                }
            }, window.CHECK_DOM_DELAY);
        });
        onCleanup(() => {
            // Cleanup scripts
            while(scriptElements.length > 0){
                scriptElements.pop().remove();
            }
            // Remove root element properly
            props.rootContent.remove();
        });
        return (<div ref={container}></div>);
    }

    let root = processNode(xmlDoc.documentElement); // Start with the root element

    return (<ContentCon rootContent={root}></ContentCon>);
}

// Convert XML Document to HTML elements
export function processDisplay(xml = null) {
    const [generatedContent, setGeneratedContent] = createSignal(null);
    if (xml instanceof XMLDocument) {
        // Generate all elements
        setGeneratedContent(xmlToHTML(xml));
        return generatedContent();
        // return new XMLSerializer().serializeToString(xml.documentElement);
    } else {
        // Add error page!
        return "";
    }
}
