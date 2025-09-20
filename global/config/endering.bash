#!/bin/bash
# Web server "endering" command contents!

# Commands
cmd_server=~/endering.bash
cmd_github=~/github.bash

# Get Cloudflare secrets
CLOUDFLARE_TOKEN=$(grep CLOUDFLARE-TOKEN ~/secrets.env | cut -d '=' -f2-)
CLOUDFLARE_ZONE=$(grep CLOUDFLARE-ZONE ~/secrets.env | cut -d '=' -f2-)
CLOUDFLARE_RULESET=$(grep CLOUDFLARE-RULESET ~/secrets.env | cut -d '=' -f2-)
CLOUDFLARE_RULE_BLOCKALL=$(grep CLOUDFLARE-RULE-BLOCKALL ~/secrets.env | cut -d '=' -f2-)

# Process CloudFlare responses
function cloudflare_response() {
    local response="$1"  # Capture the response passed as an argument
    local status_code=$(echo "$response" | grep -o '"success": [a-z]*' | awk -F ':' '{print $2}')
    if [[ -z "$status_code" ]]; then
        $status_code=$(echo "$response" | grep -o '"success":[a-z]*' | awk -F ':' '{print $2}')
    fi

    if [[ "$status_code" == "true" || "$status_code" == " true" ]]; then
        echo "$2"
    else
        echo -e "Request failed!\nDetails:\n$response"
        exit 1
    fi
}

if [ "$1" == "help" ]; then
    # Show valid commands
    echo "(*) => commands that are not exposed to the external terminal (terminal.ender.ing) are marked with an asterisk!"
    printf "\t%-18s %s\n" "help" "View server commands list"
    echo -e "\n (GitHub)"
    printf "\t%-18s %s\n" "get" "Pull all 'host' GitHub Repository updates"
    printf "\t%-18s %s\n" "commit" "Commit local changes to 'host' GitHub Repository (USE CAREFULLY!)"
    printf "\t%-18s %s\n" "rollback" "Rollback local commits (USE CAREFULLY!)"
    printf "\t%-18s %s\n" "discard" "Discard local commits and changes (USE CAREFULLY!)"
    echo -e "\n (CloudFlare - ender.ing)"
    printf "\t%-18s %s\n" "test" "Check cloudflare API connection"
    printf "\t%-18s %s\n" "cache" "Purge all CloudFlare cache"
    printf "\t%-18s %s\n" "block" "Block all requests"
    printf "\t%-18s %s\n" "unblock" "Undo block action"
    echo -e "\n Maintenance commands:"
    printf "\t%-18s %s\n" "clean" "Clean up unnecessary files (e.g. logs, backups)"
    printf "\t%-18s %s\n" "*clean-records" "Clean up record files (Only use when sure!)"
    printf "\t%-18s %s\n" "fix-perms" "Fix files permissions"
    echo -e "\n Quick commands:"
    printf "\t%-18s %s\n" "full" "(get & cache)"
    echo -e "\n"
    echo "(Do not spam these commands!)"
elif [ "$1" == "get" ]; then
    # Discard local changes
    git reset --hard HEAD
    # Pull latest changes
    git pull & pid=$!  # Store the process ID of the git pull command
    wait $pid
    # Fix command permissions (keep this here, to prevent access lockout!)
    chmod +x $cmd_server
    # Fix all permissions
    $cmd_server fix-perms
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
elif [ "$1" == "test" ]; then
    # Check cloudflare API connection
    r=$(curl "https://api.cloudflare.com/client/v4/accounts/553c2cace6bddaa6ec80148fe5335bb1/tokens/verify" \
     -H "Authorization: Bearer $CLOUDFLARE_TOKEN")
    echo $r;
elif [ "$1" == "cache" ]; then
    # Purge all cloudflare cache (ender.ing)
    r=$(curl -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE/purge_cache" \
     -H "Authorization: Bearer $CLOUDFLARE_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"purge_everything":true}')
    # Check response
    cloudflare_response "$r" "Cache cleared successfully!"
elif [ "$1" == "block" ]; then
    # Block all cloudflare access (ender.ing)
    r=$(curl -X PUT "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE/rulesets/$CLOUDFLARE_RULESET" \
     -H "Authorization: Bearer $CLOUDFLARE_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
            "rules": [
                {
                    "id": "'$CLOUDFLARE_RULE_BLOCKALL'",
                    "description": "Block ALL Requests (cmd:endering block)",
                    "expression": "(ssl) or (not ssl)",
                    "action": "block",
                    "enabled": true
                }
            ]
        }')
    # Check response
    cloudflare_response "$r" "Global access block was successful!"
    # Clear cache
    $cmd_server cache
elif [ "$1" == "unblock" ]; then
    # Block all cloudflare access (ender.ing)
    r=$(curl -X PUT "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE/rulesets/$CLOUDFLARE_RULESET" \
     -H "Authorization: Bearer $CLOUDFLARE_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
            "rules": [
                {
                    "id": "'$CLOUDFLARE_RULE_BLOCKALL'",
                    "description": "Block ALL Requests (cmd:endering block)",
                    "expression": "(ssl) or (not ssl)",
                    "action": "block",
                    "enabled": false
                }
            ]
        }')
    # Check response
    cloudflare_response "$r" "Global access unblock was successful!"
    # Clear cache
    $cmd_server cache
elif [ "$1" == "clean" ]; then
    # Delete log files
    # Note: never delete *.custom_record files using this command
    echo "Deleting logs..."
    find ~/. -name "*.custom_log" -type f -delete
    find ~/. -name "error_log" -type f -delete
    # Delete backups
    echo "Deleting backups..."
    find ~/. -name "backup-*.tar.gz" -type f -delete
    # Empty temporary directory
    echo "Emptying temporary directory..."
    rm -rf ~/tmp/*
elif [ "$1" == "clean-records" ]; then
    # Delete record log files
    echo "Deleting record logs..."
    find ~/. -name "*.custom_record" -type f -delete
elif [ "$1" == "fix-perms" ]; then
    # Fix files' permissions
    echo "Fixing $cmd_server..."
    chmod +x $cmd_server
    echo "Fixing $cmd_github..."
    chmod +x $cmd_github
    echo "Fixing ~/.htpasswd..."
    chmod 644 ~/.htpasswd
    echo "Fixing loaded commands..."
    chmod +x ~/.bash_profile
    source ~/.bash_profile
elif [ "$1" == "full" ]; then
    # Update files and purge cache
    $cmd_server get
    $cmd_server cache
else
    echo "Invalid command! Use the command '(endering) help' to see valid commands."
    exit 1
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