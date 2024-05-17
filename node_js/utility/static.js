/**
 * 
 * Manage static files analysis
 * 
**/

// node static.js <input_path> <original_path> <source_path> <build_path>

// Get file-system functions
const { path, path2, path3, path4, writeContent, getJSON, _p, readDirCon, latestDirFileMod, getContent, copyFile } = require('./_files');
const { compressXML, compressJSON, _compressXML, replaceFileVars, compressDisplay } = require('./_compress');

// Get relative web path
const getWebPath  = (absPath, fixSlash = true) => {
    let webPath = absPath.replace("index.display", "");
    webPath = webPath.replace(path, "");
    if(fixSlash){
        webPath = webPath.replaceAll("\\", "/");
    }
    return webPath;
};

// Keep track of sitemap data
// Read https://www.sitemaps.org/protocol.html for more details about sitemap.xml data structure
const sitemapWrap = (itemsArray) => {
    let xmlSitemap = `<?xml version="1.0" encoding="UTF-8"?> <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`
    for (let i = 0; i < itemsArray.length; i++){
        xmlSitemap += `\n${itemsArray[i]}\n`;
    }
    xmlSitemap += "</urlset>";
    return xmlSitemap;
};
const addSitemapItem = async (file, host) => {
    // Get path (host relative)
    let fileURL = getWebPath(file, false);
    // Get original file last mod date
    let originalPath = _p.join(path2, fileURL);
    let originalLastMod = await latestDirFileMod(originalPath);
    originalLastMod = (originalLastMod || new Date()).toLocaleDateString('zh-CN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'); // YYYY-MM-DD
    // Make a sitemap item
    let alternate = (host, fileURL, lang) => {
        return `<xhtml:link
            rel="alternate"
            hreflang="${lang}"
            href="https://${host}/${lang}${fileURL.replaceAll("\\", "/")}" />`;
    }
    let item = `<url>
        <loc>https://${host}/en${fileURL.replaceAll("\\", "/")}</loc>
        ${alternate(host, fileURL, "ar")}
        ${alternate(host, fileURL, "en")}
        ${alternate(host, fileURL, "he")}
        <lastmod>${originalLastMod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.5</priority>
    </url>`;
    // Add item to array
    sitemapItems.push(item);
};
const sitemapItems = [];

// Generate the final sitemap xml file
// (run after all files have been processed)
async function writeSitmap(){
    // Get xml text
    let xmlSitemap = sitemapWrap(sitemapItems);
    xmlSitemap = await _compressXML(xmlSitemap);
    // Write sitemap.xml
    await writeContent(_p.join(path, "sitemap.xml"), xmlSitemap);
}

// Check file type and comnpress its contents
async function compressFileContents(basePath, fullPath, fileName, source, components){
    if(fileName.indexOf(".xml") != -1){
        await compressXML(fullPath, source);
    }else if(fileName.indexOf(".display") != -1){
        if(fileName.indexOf("$") == 0){
            // Add local component to components list
            components[fileName.substring(1, fileName.indexOf(".display"))] = await getContent(fullPath);
        }else{
            // Compress display file
            await compressDisplay(path4, basePath, fullPath, source, components);
        }
    }else if(fileName.indexOf(".json") != -1){
        await compressJSON(fullPath, source);
    }else{
        // ?? this could be quite demanding... ??
        // Just replace [[variables]]
        // await replaceFileVars(fullPath, source);
    }
}

// Check if a path is ignored by gen.info.json
let ignoredPages = ["@catch", "@secret"];
function pathIgnored(path, ignore){
    let ignoreList = [...(ignore || []), ...ignoredPages];
    let pathChunks = path.split(/\\|\//g);
    for(let i = 0; i < pathChunks.length; i++){
        if(ignoreList.includes(pathChunks[i])){
            return true;
        }
    }
    return false;
}

// Scan through a directory recursively
async function scanDir(dir, source, base, components = {}){
    const files = await readDirCon(dir);
    const compRep = {...components};
    for (const file of files) {
        // Get absolute path
        const filePath = _p.join(dir, file.name);
        // Ignore gen.** files and directories
        if(file.name.indexOf("gen.") == -1){
            if (file.isDirectory()) {
                // Search sub-directories
                await scanDir(filePath, source, base, compRep);
            } else {
                // Compress file
                await compressFileContents(base, filePath, file.name, source, compRep);
                // Add file to sitemap
                if(file.name == "index.display" && !pathIgnored(filePath, source.web?.sitemap?.ignore)){
                    await addSitemapItem(filePath, source.web.host);
                }
            }
        }     
    }
}

// Process the static directory files
async function processStatic(){
    // Set source data
    let source = await getJSON(path3);

    // Start scan
    await scanDir(path, source, path);

    // Generate sitemap
    await writeSitmap();
}

processStatic();