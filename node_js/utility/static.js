/**
 * 
 * Manage static files analysis
 * 
**/

// node static.js <input_path> <original_path> <source_path>

// Get file-system functions
const { path, path2, path3, writeContent, getJSON, _p, readDirCon, latestDirFileMod } = require('./_files');
const { compressXML, compressJSON, _compressXML, replaceFileVars, compressDisplay } = require('./_compress');

// Keep track of sitemap data
// Read https://www.sitemaps.org/protocol.html for more details about sitemap.xml data structure
const sitemapWrap = (itemsArray) => {
    let xmlSitemap = `<?xml version="1.0" encoding="UTF-8"?> <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
    for (let i = 0; i < itemsArray.length; i++){
        xmlSitemap += `\n${itemsArray[i]}\n`;
    }
    xmlSitemap += "</urlset>";
    return xmlSitemap;
};
const addSitemapItem = async (file, host) => {
    // Get path (host relative)
    let fileURL = file.replace("index.display", "");
    fileURL = fileURL.replace(path, "");
    // Get original file last mod date
    let originalPath = _p.join(path2, fileURL);
    let originalLastMod = await latestDirFileMod(originalPath);
    originalLastMod = (originalLastMod || new Date()).toLocaleDateString('zh-CN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'); // YYYY-MM-DD
    // Make a sitemap item
    let item = `<url>
        <loc>https://${host}${fileURL.replaceAll("\\", "/")}</loc>
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
async function compressFileContents(fullPath, fileName, source){
    if(fileName.indexOf(".xml") != -1){
        await compressXML(fullPath, source);
    }else if(fileName.indexOf(".display") != -1){
        await compressDisplay(fullPath, source);
    }else if(fileName.indexOf(".json") != -1 || fileName.indexOf(".locale") != -1){
        await compressJSON(fullPath, source);
    }else{
        // ?? this could be quite demanding... ??
        // Just replace [[variables]]
        // await replaceFileVars(fullPath, source);
    }
}

// Check if a path is ignored by gen.info.json
function pathIgnored(path, ignore){
    let ignoreList = ignore || [];
    let pathChunks = path.split(/\\|\//g);
    for(let i = 0; i < pathChunks.length; i++){
        if(ignoreList.includes(pathChunks[i])){
            return true;
        }
    }
    return false;
}

// Scan through a directory recursively
async function scanDir(dir, source){
    const files = await readDirCon(dir);
    for (const file of files) {
        // Get absolute path
        const filePath = _p.join(dir, file.name);
        // Ignore gen.** files and directories
        if(file.name.indexOf("gen.") == -1){
            if (file.isDirectory()) {
                // Search sub-directories
                await scanDir(filePath, source);
            } else {
                // Compress file
                await compressFileContents(filePath, file.name, source);
                // Add file to sitemap
                if(file.name.indexOf("index.display") != -1 && !pathIgnored(filePath, source.web?.sitemap?.ignore)){
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
    await scanDir(path, source);

    // Generate sitemap
    await writeSitmap();
}

processStatic();