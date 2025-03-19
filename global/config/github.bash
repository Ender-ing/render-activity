#!/bin/bash
# Web server "endering" command contents!

# Get GitHub secrets
GITHUB_TOKEN=$(grep GITHUB-TOKEN ~/secrets.env | cut -d '=' -f2-)

if [ "$1" == "help" ]; then
    # Show valid commands
    echo "(*) => commands that are not exposed to the external terminal (terminal.ender.ing) are marked with an asterisk!"
    printf "\t%-18s %s\n" "help" "View GitHub commands list"
    echo -e "\n (Releases)"
    printf "\t%-18s %s\n" "release <repo>" "Create and attach assets to the latest GitHub release draft of the chosen GitHub Repository!"
    printf "\t%-18s %s\n" "" "<repo> - must only include the name of the repository! (e.g. Ender-ing/frankie -> frankie)"
    echo -e "\n"
    echo "(Do not spam these commands!)"
elif [ "$1" == "release" ]; then
    # If you want to support the use of this command, you must create a "release_assets.yml" workflow to the repository!
    # Said workflow should take in the numerical ID value of the release!
    repo=$2
    # Check for a repository name!
    repo_length=${#repo}
    if [ $repo_length -lt 1 ]; then
        echo "Missing a valid repository name!"
        exit 1
    fi
    # Get release ID
    release_id=$(curl -L \
        -H "Accept: application/vnd.github+json" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        -H "Authorization: Bearer $GITHUB_TOKEN" \
        https://api.github.com/repos/Ender-ing/$repo/releases | \
            sed -n '/"assets_url"/,/"draft": true/p' | \
            grep '"id":' | \
            head -n 1 | \
            sed -E 's/.*"id": ([0-9]+).*/\1/')
    # Check if the release ID is valid!
    release_id_length=${#release_id}
    if [ $release_id_length -lt 8 ]; then
        echo "Couldn't find a valid release draft ID!"
        exit 1
    fi
    # Trigger the workflow!
    result=$(curl -L \
        -X POST \
        -H "Authorization: Bearer $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github+json" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        https://api.github.com/repos/Ender-ing/$repo/actions/workflows/release_assets.yml/dispatches \
        -d "{
            \"ref\": \"main\",
            \"inputs\": {
                \"release_id\": \"$release_id\"
            }
        }")
    # Check if the workflow was triggered successfully!
    good_status=$(echo $result | grep '"status": "20[0-4]"')
    good_status_length=${#good_status}
    if [ $good_status_length -lt 15 ]; then
        echo $result
        echo "Couldn't trigger the GitHub release workflow!"
        exit 1
    fi
else
    echo "Invalid command! Use the command '(github) help' to see valid commands."
    exit 1
fi
