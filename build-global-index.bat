@echo off

:: This file is meant to bundle the global index!
echo [44;45m Generating global index assets... [0m

:: Specify the directory to search
set inputDir=F:\development\Ender-ing\resources\.BUILD\__node_js__\global-index
set outputDir=F:\development\Ender-ing\resources\web\client\@vite

:: Attempt to delete the folder (with error handling)
rmdir /s /q %outputDir%

:: Check if deletion was successful
if exist %outputDir% (
    echo Folder deletion failed. Please check permissions or if the folder is in use.
    exit 1
) else (
    :: Create the folder (handle potential errors)
    mkdir %outputDir% 2>nul

    :: Check if the folder was created successfully
    if exist %outputDir% (
        echo The output folder %outputDir% has been cleaned up successfully!
    ) else (
        echo Error creating folder. Check permissions or path.
        exit 1
    )
)

:: Change to the target directory 
pushd %inputDir% 

:: Build global index
echo Building Global Index..
CMD "Running Backup" /C "npm run build %outputDir%"

:: Copy the file to the `.update-c` directory
copy /Y "%outputDir%\index.php.html" "%inputDir%\..\..\.update-c\index.php"
del "%outputDir%\index.php.html"

:: Compress files
CMD "Running Backup" /C "terser --compress --comments false --keep-classnames --keep-fnames -p bare_returns -o %outputDir%\sw.js %outputDir%\sw.js"
CMD "Running Backup" /C "terser --compress --comments false --keep-classnames --keep-fnames -p bare_returns -o %outputDir%\tracking.js %outputDir%\tracking.js"

:: Return to the original directory
popd