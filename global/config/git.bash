#!/bin/bash

if [ "$1" == "get-update" ]; then
    # Discard local changes
    git reset --hard HEAD
    # Pull latest changes
    git pull
elif [ "$1" == "commit" ]; then
    # Fix file ending
    git config --global core.autocrlf input
    # Add new changes
    git add --renormalize .
    # Commit changes
    git commit -m "Origin Change Commit"
else
  echo "Invalid command. Please use 'get-update', 'commit', or 'status'."
fi