# .htaccess file setup

array_name=(public_html account authority crew docs email links mta-sts resources sites tweaker test) 

# Go to __SHARED__ directory
P_DIR=$PWD
cd ~
cd .update-c

# Update files
for item in "${array_name[@]}"; do
    # Print folder name
    #echo "Updating ~/$item ..."

    # update FILE file
    #rm -f ~/$item/FILE > /dev/null 2>&1 
    #cp -f -l -v FILE ~/$item/FILE  > /dev/null 
    echo "COMMAND NOT NEEDED ANYMORE!";
done

# Return to original directory
cd $P_DIR