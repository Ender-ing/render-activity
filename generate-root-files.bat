@echo off

:: This file is meant to handle all brand-related assets generation
echo [44;45m Generating branding assets... [0m

:: Get environment variables
FOR /F "tokens=*" %%i in (BUILD.env) do SET %%i

:: Specify the directory to search
set inputDir=%BUILD_PATH%\roots
set outputDir=%BUILD_PATH%\roots_out

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

:: Iterate through each folder in the directory
for /D %%f in (*) do (
    echo Handling %%f

    :: Generate icons (\brands)
    mkdir %outputDir%\%%f\brand\
    mkdir %outputDir%\%%f\brand\icons\
    CMD "Running Backup" /C "node ..\__node_js__\utility\icons.js %inputDir%\%%f\logo.gen.svg %outputDir%\%%f\brand\icons\"
    copy %inputDir%\%%f\logo.svg %outputDir%\%%f\brand\icons\logo.svg
    copy %inputDir%\%%f\maskable.gen.svg %outputDir%\%%f\brand\icons\logo-maskable.svg
    del %outputDir%\%%f\brand\icons\**.icns
    del %outputDir%\%%f\brand\icons\app.ico

    :: Generate manifest
    CMD "Running Backup" /C "node ..\__node_js__\utility\manifest.js %RESOURCES_PATH%\web\client\@vite\manifest.jsonc %inputDir%\%%f\info.gen.json %outputDir%\%%f\manifest.webmanifest"

    :: Generate index file
    CMD "Running Backup" /C "node ..\__node_js__\utility\manifest.js %RESOURCES_PATH%\web\client\@vite\index.php.html %inputDir%\%%f\info.gen.json %outputDir%\%%f\index.php"

    :: Generate service worker
    CMD "Running Backup" /C "node ..\__node_js__\utility\manifest.js %RESOURCES_PATH%\web\client\@vite\sw.js %inputDir%\%%f\info.gen.json %outputDir%\%%f\sw.js"
)

:: Delete used files
del "%RESOURCES_PATH%\web\client\@vite\manifest.jsonc"
del "%RESOURCES_PATH%\web\client\@vite\index.php.html"
del "%RESOURCES_PATH%\web\client\@vite\sw.js"

:: Return to the original directory
popd