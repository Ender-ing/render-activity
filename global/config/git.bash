#!/bin/bash

case "$1" in
  "get-update")
    # Discard local changes
    git reset --hard HEAD
    # Pull latest changes
    git pull
    ;;
  "commit")
    # Add new changes
    git add .
    # Commit changes
    git commit -m "Origin Change Commit"
    ;;
  *)
    echo "Invalid command! Please use 'get-update' or 'commit'."
    ;;
esac
