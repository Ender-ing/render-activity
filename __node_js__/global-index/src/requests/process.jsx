/**
 *
 * Process display XML
 *
 **/

import { createSignal, For, onCleanup, onMount } from 'solid-js';
import { Dynamic } from 'solid-js/web';

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

// Convert XML Document into HTML string
function xmlToHTML(xmlDoc){

    let scriptsQueue = [],
        scriptElements = [];

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
            if((window.componentsClassList[origNode] || []).length > 0){
                for(let i = 0; i < window.componentsClassList[origNode].length; i++){
                    element.classList.add(window.componentsClassList[origNode][i]);
                }
            }
    
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
        onMount(() => {
            setTimeout(() => {
                while(scriptsQueue.length > 0){
                    let script = document.createElement("script");
                    script.innerHTML = `(function(){${fixJSSource(scriptsQueue.pop())}})();`;
                    document.body.append(script);
                    scriptElements.push(script);
                }
            }, 1);
        });
        onCleanup(() => {
            while(scriptElements.length > 0){
                scriptElements.pop().remove();
            }
        });
        return (<div {...props}></div>);
    }

    let root = processNode(xmlDoc.documentElement); // Start with the root element

    return (<ContentCon innerHTML={root.outerHTML}></ContentCon>);
}

// Convert XML Document into SolidJS components
// This breaks some elements! (e.g. form attribute causes render hault)
function xmlToSolid(xmlDoc){

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
        // Get component name
        let Component = window.componentsList[node.nodeName.toLowerCase()];
        if(typeof Component !== "string"){
            Component = node.nodeName.toLowerCase();
        }

        // Properties:
        const props = {};
        for (let i = 0; i < node.attributes.length; i++) {
          props[node.attributes[i].name] = node.attributes[i].value;
        }
    
        // Children:
        const children = Array.from(node.childNodes).map(processNode);

        return <Dynamic component={Component} {...props}>
            <For each={children}>{child => child}</For>
        </Dynamic>
    }

    return processNode(xmlDoc.documentElement); // Start with the root element
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
