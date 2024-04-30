/**
 * 
 * Manage file contents compression!
 * 
**/

const { getContent, writeContent } = require('./_files');
const jsonMinify = require('node-json-minify');
const CleanCSS = require('clean-css');
const terser = require("terser");
const { replaceVars } = require('./_replace_variables');

// Compress XML file
let minifyXMLM = null;
async function _compressXML(content){
    // This library uses the new module imports system
    let minifyXML = minifyXMLM || (minifyXMLM = (await import("minify-xml")).minify);
    let newContent = content;
    // Minify XML
    newContent = minifyXML(content);
    return newContent;
}
async function compressXML(path, source){
    // Get content and replace [[variables]]
    let content = await getContent(path);
    content = replaceVars(source, content);

    // Minify XML
    content = await _compressXML(content);

    // Write new content
    writeContent(path, content);
}

// Compress .display file
// (XML && JavaScript)
async function replaceAllAsync(str, regex, asyncFn) {
    const promises = [];
    str.replaceAll(regex, (full, ...args) => {
        promises.push(asyncFn(full, ...args));
        return full;
    });
    const data = await Promise.all(promises);
    return str.replace(regex, () => data.shift());
}
async function _compressTags(content){
    let newContent = content;
    // Compress JS
    newContent = await replaceAllAsync(newContent, /<script(.*?)>(.*?)<\/script>/gis, async (match, attr, jsContent) => {
        const newJS = (await terser.minify(jsContent)).code;
        return `<script${attr}>${newJS}</script>`
    });
    // Compress CSS
    newContent = newContent.replaceAll(/<style(.*?)>(.*?)<\/style>/gis, (match, attr, cssContent) => {
        const newCSS = (new CleanCSS()).minify(cssContent).styles;
        return `<style${attr}>${newCSS}</style>`
    });
    return newContent;
} 
async function compressDisplay(path, source){
    // Get content and replace [[variables]]
    let content = await getContent(path);
    content = replaceVars(source, content);

    // Minify XML
    content = await _compressXML(content);
    content = await _compressTags(content);

    // Write new content
    writeContent(path, content);
}

// Compress JSON file
async function compressJSON(path, source){
    // Get content and replace [[variables]]
    let content = await getContent(path);
    content = replaceVars(source, content);

    // Minify JSON
    content = jsonMinify(content);

    // Write new content
    writeContent(path, content);
}


// Just replace file [[variables]]
async function replaceFileVars(path, source){
    // Get content and replace [[variables]]
    let content = await getContent(path);
    content = replaceVars(source, content);

    // Write new content
    writeContent(path, content);
}
module.exports = {
    compressXML,
    _compressXML,
    compressJSON,
    compressDisplay,
    replaceFileVars
};