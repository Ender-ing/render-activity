/**
 * 
 * Manage GitHub operations
 * 
**/

const { executeCommand } = require('./_commands');
const { error } = require('./_console');
const { _p, renameFolder } = require('./_files');

// Make sure the secrets repository is cloned!
async function cloneGitHubRep(dir, userName, projectName, newName){
    return await cloneGitHubRepURL(
        dir,
        `https://github.com/${userName}/${projectName}.git`,
        newName,
        projectName
    );
}
async function cloneGitHubRepURL(dir, url, newName, projectName = null){
    // Clone to dir
    await executeCommand(
        'git',
        ['clone', url],
        {
            cwd: dir
        }
    );
    if(projectName == null){
        projectName = _p.basename(url).replace(".git", "");
    }
    // Rename the name of the folder to ".secrets"
    const r = renameFolder(_p.join(dir, projectName), _p.join(dir, newName));
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