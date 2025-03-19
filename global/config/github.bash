#!/bin/bash
# Web server "endering" command contents!

# Commands
cmd_server=~/endering.bash
cmd_github=~/github.bash

# Get GitHub secrets
CLOUDFLARE_TOKEN=$(grep GITHUB-TOKEN ~/secrets.env | cut -d '=' -f2-)

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
    echo "COMMAND NOT READY YET!"
else
    echo "Invalid command! Use the command '(github) help' to see valid commands."
fi
