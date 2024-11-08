/**
 * 
 * Manage secrets loading and injection
 * 
**/

const { error, info } = require('./_console');
const { getContent, _p, writeContent, folderExists } = require('./_files');
const { cloneGitHubRep, cloneGitHubRepURL } = require('./_github');

// Make sure the secrets repository is cloned!
function setupSecretRep(root, userName, projectName){
    if(folderExists(_p.join(root, ".secrets"))){
        return true;
    }
    // Clone to root
    return cloneGitHubRep(root, userName, projectName, ".secrets");
}
function setupSecretRepURL(root, url){
    if(folderExists(_p.join(root, ".secrets"))){
        return true;
    }
    // Clone to root
    return cloneGitHubRepURL(root, url, ".secrets");
}

// Get a secret value
const lastSecretsValue = [false, undefined];
async function getSecretValue(root, valueName){
    // Get all values
    if(!lastSecretsValue[0]){
        lastSecretsValue[1] = await getContent(
            _p.join(root, '.secrets', 'secrets.env') // expected secrets path!
        );
        if(typeof lastSecretsValue[1] != "string"){
            error(`Failed to read secrets file! (at ${root}, '.secrets' folder)`);
        }
    }
    //valueName
    const exp = new RegExp(`^${valueName}=(.*?)$`, 'gm');
    const result = exp.exec(lastSecretsValue[1]);
    if(Array.isArray(result)){
        return result[1];
    }else{
        error(`Invalid raw secret ID was used! (${valueName})`);
        return "INVALID-VALUE";
    }
}

// Replace a secret value ID
async function insertSecretValues(root, content){
    // [U+E0DE][U+E201][U+E1DE]RAW-VALUE-ID[U+E0DE][U+E202][U+E1DE]
    return await content.replaceAll(
        /\uE0DE\uE201\uE1DE(.*?)\uE0DE\uE202\uE1DE/gm,
        async (valueName) => {
            info(`Inserting secret '${valueName}'!`);
            return await getSecretValue(root, valueName);
        }
    );
}

// Duplicate and replace values
async function duplicateAndInsertSecrets(root, fromPath, toPath){
    const redactedContent = await getContent(fromPath);
    const sensitiveContent = await insertSecretValues(root, redactedContent);
    // Create the file
    const result = writeContent(toPath, sensitiveContent);
    if(result){
        info(`Finished inserting sensitive secrets into '${toPath}'!`);
    }else{
        error(`Failed to write sensitive secrets into '${toPath}'!`);
    }
}

module.exports = {
    setupSecretRep,
    setupSecretRepURL,
    insertSecretValues,
    duplicateAndInsertSecrets
};