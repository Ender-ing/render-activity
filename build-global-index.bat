@echo off

:: This file is meant to bundle the global index!
echo [44;45m Generating global index assets... [0m

:: Get environment variables
FOR /F "tokens=*" %%i in (BUILD.env) do SET %%i

:: Specify the directory to search
set inputDir=%BUILD_PATH%\__node_js__\global-index
set outputDir=%RESOURCES_PATH%\web\client\@vite

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

:: Compress files
:: (these files are needed later)
CMD "Running Backup" /C "terser --compress --comments false --keep-classnames --keep-fnames -p bare_returns -o %outputDir%\sw.js %outputDir%\sw.js"
CMD "Running Backup" /C "terser --compress --comments false --keep-classnames --keep-fnames -p bare_returns -o %outputDir%\tracking.js %outputDir%\tracking.js"

:: Return to the original directory
popd