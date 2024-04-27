# .htaccess file setup

array_name=(public_html account authority crew docs email links mta-sts resources sites tweaker test) 

# Go to __SHARED__ directory
P_DIR=$PWD
cd ~
cd .update-c

# Update files
for item in "${array_name[@]}"; do
    # Print folder name
    echo "Updating ~/$item ..."

    # update .htaccess file
    rm -f ~/$item/.htaccess > /dev/null 2>&1 
    cp -f -l -v .htaccess ~/$item/.htaccess > /dev/null 

    # update /.well-known/.htaccess file
    rm -f ~/$item/.well-known/.htaccess > /dev/null 2>&1 
    cp -f -l -v .well-known.htaccess ~/$item/.well-known/.htaccess  > /dev/null 

    # update index.html file
    rm -f ~/$item/index.php > /dev/null 2>&1 
    cp -f -l -v index.php ~/$item/index.php  > /dev/null 

    # update robots.txt file
    rm -f ~/$item/robots.txt > /dev/null 2>&1 
    cp -f -l -v robots.txt ~/$item/robots.txt  > /dev/null 
done

# Return to original directory
cd $P_DIR