/**
 * 
 * Manage display files!
 * 
**/

const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');

// Create a DOM context
const parser = new DOMParser();
const serializer = new XMLSerializer();
function createXMLDOM(xmlString){
    return xmlDoc = parser.parseFromString(xmlString, 'text/xml');
}

// Throw a local component error
function throwComponentError(text, path){
    throw new Error(`DISPLAY Local Component Error: ${text} (in ${path})`);
}

// Process attribute command
function attributeCommand(xmlDoc, path, cmd, ...args){
    // Check command name
    if(cmd == "@active"){
        // This command is used to set the "active" attribute to the element that matches the id selector
        // @ACTIVE [id_selector]
        let elm = xmlDoc.getElementById(args[0]);
        if(elm){
            elm.setAttribute("active", "");
        }else{
            throwComponentError(`Invalid ${cmd} id selector (id = ${args[0]})!`, path);
        }
    }else{
        throwComponentError(`used command ${cmd} is not a valid command!`, path);
    }
}

// Replace components (tags)
function replaceLocalComponent(components, path, tag, attributes, content = null){
    let newElm = components[tag];
    if(typeof newElm != "string"){
        throwComponentError(`used component <$${tag}> is not defined!`, path);
    }
    // Get DOM for new element
    let xmlDom = createXMLDOM(newElm);
    // Process element content
    if(content != null){
        // Replace content local elements (recursively)
        content = injectLocalComponents(path, content, components);
        //  Convert content to DOM
        // Parse the child XML string
        let childDoc = parser.parseFromString(content, 'text/xml');
        const importedChild = xmlDoc.importNode(childDoc.documentElement, true); // true for deep import
        // Inject content
        xmlDom.documentElement.appendChild(importedChild);
    }
    // Process attributes!
    let attrs = attributes.split(/\s*(\@?[\w\-]+)\s*=\s*"([^"]*)"|'([^']*)'/gis).filter(val => (val || '').replaceAll(/\s/g, "") !== '');
    for(let i = 0; i < attrs.length; i+=2){
        if(attrs[i].indexOf("@") == 0){
            // Process command attribute
            attributeCommand(xmlDom, path, attrs[i].toLowerCase(), ...(attrs[i+1].replaceAll(/\s{2,}/g, " ").split(/\s/g)));
        }else{
            // Add attribute
            xmlDom.documentElement.setAttribute(attrs[i], attrs[i + 1]);
        }
    }
    return serializer.serializeToString(xmlDom);
}
function injectLocalComponents(path, xmlString, components){
    // console.log(components);
    let newContent = xmlString;
    // Replace local <$> components tags
    newContent = newContent.replaceAll(/<(\$[\w\-]+)([^>]*?)\/>/gis, function(match, tag, attributes){
        return replaceLocalComponent(components, path, tag.substring(1), attributes);
    });
    newContent = newContent.replaceAll(/<(\$[\w\-]+)([^>]*?)>(.*?)<\/\1>/gis, function(match, tag, attributes, content){
        return replaceLocalComponent(components, path, tag.substring(1), attributes, content);
    });
    // Replace @ command attributes
    newContent = newContent.replaceAll(/\@(.*?)\=(.*?)/gi, "__cmd_$1=$2");
    return newContent;
}

// Inject root node attributes
function injectRootAttributes(xmlString, ...args){
    //
    let newContent = xmlString;
    let i = newContent.indexOf(">");

    let attrs = "";
    for (let k = 0; k < args.length; k+=2) {
        attrs += ` ${args[k]}="${args[k+1]}"`
    }

    // Inject attributes
    newContent = newContent.substring(0, i) + attrs + newContent.substring(i);
    return newContent;
}

module.exports = {
    injectRootAttributes,
    injectLocalComponents
};