/**
 * 
 * Replace variables inside text
 * 
**/

// Get a value from a json source by path
function getJSONValue(source, path){
    let pathParts = path.replaceAll(/\s/g, "").split('.');

    let current = source; // Start at the root object
    for (let part of pathParts) {
        if (current[part] === undefined) {
            return undefined; // Value not found
        }
        current = current[part];
    }

    return current;
}

// Replace variables inside text from JSON source
function replaceVars(source, content){
    return content.replaceAll(/\[\[(.*?)\]\]/g, function(match, path){
        return getJSONValue(source, path);
    });
}

// Replace placeholder variables
function replacePlaceholder(content, key, value){
    return content.replaceAll(/\@\@([\w\-]+)/g, function(match, placeholder){
        if(placeholder == key){
            return value;
        }else{
            return `@@${placeholder}`;
        }
    });
}

module.exports = {
    replaceVars,
    replacePlaceholder
};