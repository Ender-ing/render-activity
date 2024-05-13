#!/bin/bash

if [ "$1" == "get" ]; then
    # Discard local changes
    git reset --hard HEAD
    # Pull latest changes
    git pull & pid=$!  # Store the process ID of the git pull command
    wait $pid
    # Fix command permissions
    chmod +x ~/git.bash
elif [ "$1" == "commit" ]; then
    # Fix file ending
    git config --global core.autocrlf input
    # Add new changes
    git add --renormalize .
    # Commit changes
    git commit -m "Origin Change Commit"
else
  echo "Invalid command! You can use 'get' or 'commit'.."
fi