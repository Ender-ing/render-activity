/**
 * 
 * Manage root source build actions
 * 
**/

// node source_actions.js <global_output_path> <source_path> <is_before>

const { arg1, arg2, arg3 } = require('./_args');
const { error, action } = require('./_console');
const { getJSON, _p } = require('./_files');
const { setupSecretRepURL, duplicateAndInsertSecrets } = require('./_secrets');

// Needed values
const defaultGithubUser = "Ender-ing";
const secretsAllowlist = [".redacted.php"];

// Supported source action types
const srcActions = {
    "before:add-github-dependency": async function (root, dir, obj, manifest) {
        // Get repository info
        const userName = (obj?.github?.userName || defaultGithubUser);
        const projectName = obj?.github?.projectName;
        action(`Fetching the GitHub dependency '${userName}/${projectName}' to '${obj.to}`);
        // Check data
        if(typeof projectName == "string"){
            //
        }else{
            error(`'github' value is invalid! (${dir})`);
        }
    },
    "after:strict-file-secret-insert": async function (root, dir, obj, manifest) {
        action(`Filling in secrets into '${obj.to}' (based on'${obj.from}')`);
        // Check if the source file is in the allowlist!
        if(isInSecretsAllowlist(obj.from)){
            // Check if the destination file name includes the "secret" keyword!
            if(isFileNameSecret(obj.to)){
                // Prepare the secrets directory
                if(typeof manifest["$secrets"] == "string"){
                    const setup = await setupSecretRepURL(root, manifest["$secrets"]);
                    if(setup){
                        // You are ready now, start duplication and insertion!
                        duplicateAndInsertSecrets(
                            root,
                            processActionPath(root, dir, obj.from),
                            processActionPath(root, dir, obj.to)
                        );
                    }else{
                        error(`Failed to setup the secrets directory!`);
                    }
                }else{
                    error(`Invalid '$secrets' value in the manifest!`);
                }
            }else{
                error(`Illegal action: Destination '${obj.to}' name is not valid!` +
                    `(Must include the 'secret' keyword!)`
                );
            }
        }else{
            error(`Illegal action: File '${obj.from}' is not in the secrets allowlist!`);
        }
    }
};

// Supporting source action functions
function isInSecretsAllowlist(path){
    for(let i = 0; i < secretsAllowlist.length; i++){
        if(path.endsWith(secretsAllowlist[i])){
            return true;
        }
    }
    return false;
}
function isFileNameSecret(path){
    // Get file name
    const name = _p.basename(path);
    // Allowed names: 'secret.*', '*.secret.*', and '*.secret'!
    return (name.includes(".secret.") || name.startsWith("secret.") || name.endsWith(".secret"));
}
function processActionPath(root, dir, path){
    return _p.normalize(
        path.replaceAll("%%", dir).replaceAll("%", root)
    );
}

// Check each subdomain's actions
async function checkSourceActions(outputRootPath, manifestPath, isBefore){

    // Get roots.manifest.json
    let source;

    try {
        source = await getJSON(manifestPath);
    } catch(e) {
        error(`The roots manifest file path's value is invalid! (${manifestPath})`, e);
    }

    for(let sub in source){
        const subObj = source[sub];
        if((sub.startsWith("before:") && !isBefore) || (sub.startsWith("after:") && isBefore)){
            // Skip this action!
            continue;
        }
        if(Array.isArray(subObj?.sourceActions)){
            const actionsObj = subObj?.sourceActions;
            for(let i = 0; i < actionsObj.length; i++){
                if (typeof actionsObj[i]?.type == "string" &&
                    srcActions[actionsObj[i]?.type] != undefined){
                    await srcActions[actionsObj[i].type](
                        outputRootPath,
                        _p.join(outputRootPath, sub),
                        actionsObj[i],
                        source
                    );
                }else{
                    error(`The source action type "${actionsObj[i]?.type}" is not supported!`);
                }
            }
        }else if(subObj?.sourceActions != undefined){
            error(`Expecting an array of JSON objects at "${manifestPath}"!`);
        }
    }
}

checkSourceActions(arg1, arg2);
