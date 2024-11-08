/**
 * 
 * Manage GitHub operations
 * 
**/

const { executeCommand } = require('./_commands');
const { error } = require('./_console');
const { _p, renameFolder } = require('./_files');

// Make sure the secrets repository is cloned!
function cloneGitHubRep(dir, userName, projectName, newName){
    return cloneGitHubRepURL(dir, `https://github.com/${userName}/${projectName}.git`, newName);
}
function cloneGitHubRepURL(dir, url, newName){
    // Clone to dir
    executeCommand(
        'git',
        ['clone', url],
        {
            cwd: dir
        }
    );
    // Rename the name of the folder to ".secrets"
    const r = renameFolder(_p.join(dir, projectName), _p.join(root, newName));
    if(!r){
        error(`Failed to rename "${projectName}" repository to "${newName}"!`);
        return false;
    }
    return true;
}

module.exports = {
    cloneGitHubRep,
    cloneGitHubRepURL
};