/**
 * 
 * Manage index files
 * 
**/

// node serve.js <source_path> <input_path> <info_path> <build_path>

// Get file-system functions
const { path, path2, path3, path4, getJSON, _p, readDirCon, getContent, writeContent } = require('./_files');
const { writeContentMultiLang, replaceLangExp } = require('./_lang');

// Get relative web path
const getWebPath  = (absPath, fixSlash = true) => {
    let webPath = absPath.replace("index.display", "");
    webPath = webPath.replace(path, "");
    if(fixSlash){
        webPath = webPath.replaceAll("\\", "/");
    }
    return webPath;
};

// Add the index file
let content;
let globalObj = null;
async function addIndexFile(file, host){
    // Get path (host relative)
    let pathname = getWebPath(file);
    let url = (lang) => `https://${host}/${lang}${pathname}`;

    // Get language
    let lang = pathname.substring(1, 3);
    pathname = pathname.substring(3);

    // Get local language object
    let localObj;
    let localPath;
    try{
        localPath = file.replace("index.display", `${lang}.locale`);
        localPath = localPath.replaceAll(/\\(en|ar|he)\\/gi, "/");
        localObj = await getJSON(localPath);
    }catch{
        localObj = {};
    }
    console.log(localPath, localObj);

    // Get content
    let getTxt = (c) => replaceLangExp(c, localObj, globalObj[lang]);
    let newContent = getTxt(content);

    // Replace meta data
    let title = getTxt("{{?_meta.title}}");
    let globalTitle = getTxt("{{$_meta.title}}");
    newContent = newContent.replaceAll("@@title", (title != globalTitle) ? `${title} | ${globalTitle}` : title);
    newContent = newContent.replaceAll("@@description", getTxt("{{?_meta.description}}"));

    // Replace alternate links
    newContent = newContent.replaceAll("@@href-alt-ar", url("ar"));
    newContent = newContent.replaceAll("@@href-alt-en", url("en"));
    newContent = newContent.replaceAll("@@href-alt-he", url("he"));

    // Replace canonical link
    newContent = newContent.replaceAll("@@href-con", url("en"));

    // Generate index
    await writeContent(file.replace("index.display", "index.php"), newContent);
    // await writeContentMultiLang(path, path2, newContent, path4, false);
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
                // Add index file
                if(file.name == "index.display"){
                    await addIndexFile(filePath, source.web.host);
                }
            }
        }     
    }
}

// Process the static directory files
async function processStatic(){
    // Set source data
    let source = await getJSON(path3);

    // Get global langauge objects
    globalObj = {
        ar: null,
        en: null,
        he: null
    };
    globalObj.ar = await getJSON(_p.join(path4, "global", "locale", "ar.locale"));
    globalObj.en = await getJSON(_p.join(path4, "global", "locale", "en.locale"));
    globalObj.he = await getJSON(_p.join(path4, "global", "locale", "he.locale"));

    // Get index content
    content = await getContent(path2);

    // Start scan
    await scanDir(path, source);
}

processStatic();