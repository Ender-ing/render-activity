#!/bin/bash

if [ "$1" == "help" ]; then
    # Show valid commands
    echo "This is a list of valid commands you are able to use on this server:"
    echo -e "\n"
    printf "\t%-15s %s\n" "help" "View commands list"
    echo -e "\n (GitHub)"
    printf "\t%-15s %s\n" "get" "Pull all 'host' GitHub Repository updates"
    printf "\t%-15s %s\n" "commit" "Commit local changes to 'host' GitHub Repository (USE CAREFULLY!)"
    printf "\t%-15s %s\n" "rollback" "Rollback local commits (USE CAREFULLY!)"
    printf "\t%-15s %s\n" "discard" "Discard local commits and changes (USE CAREFULLY!)"
    echo -e "\n (CloudFlare)"
    printf "\t%-15s %s\n" "cache" "Purge all CloudFlare cache (ender.ing)"
    echo -e "\n"
    printf "\t%-15s %s\n" "web" "(get & cache)"
    echo -e "\n"
    echo "Do not spam these commands!"
elif [ "$1" == "get" ]; then
    # Discard local changes
    git reset --hard HEAD
    # Pull latest changes
    git pull & pid=$!  # Store the process ID of the git pull command
    wait $pid
    # Fix command permissions
    chmod +x ~/git.bash
elif [ "$1" == "cache" ]; then
    # Purge all cloudflare cache (ender.ing)
    curl -X POST "https://api.cloudflare.com/client/v4/zones/93b9b28f28499469f4918c8cf1f4eb06/purge_cache" \
     -H "Authorization: Bearer mRqfjhkaIyCaWqAZx_24W1LaorlsQ3riBtNFlJQp" \
     -H "Content-Type: application/json" \
     -d '{"purge_everything":true}'
elif [ "$1" == "commit" ]; then
    # Fix file ending
    git config --global core.autocrlf input
    # Add new changes
    git add --renormalize .
    # Commit changes
    git commit -m "Origin Change Commit"
elif [ "$1" == "rollback" ]; then
    # Rollback local commits
    git reset --soft HEAD~1
elif [ "$1" == "discard" ]; then
    # Rollback local commits (discarding local changes)
    git reset --hard HEAD~1
elif [ "$1" == "web" ]; then
    # Update files and purge cache
    ~/git.bash get
    ~/git.bash cache
else
  echo "Invalid command! Use the command 'update help' to see valid commands."
fi