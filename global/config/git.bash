#!/bin/bash

# Get Cloudflare Token
CLOUDFLARE_TOKEN=$(grep CLOUDFLARE_TOKEN ~/cloudflare.secret.env | cut -d '=' -f2-)
CLOUDFLARE_ZONE=$(grep CLOUDFLARE_ZONE ~/cloudflare.secret.env | cut -d '=' -f2-)
CLOUDFLARE_RULESET=$(grep CLOUDFLARE_RULESET ~/cloudflare.secret.env | cut -d '=' -f2-)
CLOUDFLARE_RULE_BLOCKALL=$(grep CLOUDFLARE_RULE_BLOCKALL ~/cloudflare.secret.env | cut -d '=' -f2-)

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
    printf "\t%-15s %s\n" "block" "Block all requests (ender.ing)"
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
elif [ "$1" == "cache" ]; then
    # Purge all cloudflare cache (ender.ing)
    curl -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE/purge_cache" \
     -H "Authorization: Bearer $CLOUDFLARE_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"purge_everything":true}'
elif [ "$1" == "block" ]; then
    # Block all cloudflare access (ender.ing)
    curl -X PUT "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE/rulesets/$CLOUDFLARE_RULESET" \
     -H "Authorization: Bearer mRqfjhkaIyCaWqAZx_24W1LaorlsQ3riBtNFlJQp" \
     -H "Content-Type: application/json" \
     -d '{
            "rules": [
                {
                    "id": "'$CLOUDFLARE_RULE_BLOCKALL'",
                    "description": "Block ALL Requests (cmd:update block)",
                    "expression": "(http.host contains \"ender.ing\")",
                    "action": "block",
                    "enabled": true
                }
            ]
        }'
elif [ "$1" == "web" ]; then
    # Update files and purge cache
    ~/git.bash get
    ~/git.bash cache
else
  echo "Invalid command! Use the command 'update help' to see valid commands."
fi


# Create a WAP rule:
#    curl -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE/rulesets/$CLOUDFLARE_RULESET/rules" \
#     -H "Authorization: Bearer $CLOUDFLARE_TOKEN" \
#     -H "Content-Type: application/json" \
#     -d '{
#       "description": "<title>",
#       "expression": "(???)",
#       "action": "???"
#     }'