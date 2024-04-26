@echo off

:: This file is meant to handle all brand-related assets generation
echo [44;45m Generating branding assets... [0m

:: Specify the directory to search
set inputDir=F:\development\Ender-ing\resources\.BUILD\brands
set outputDir=F:\development\Ender-ing\resources\.BUILD\brands_out

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

    :: Generate icons
    mkdir %outputDir%\%%f\brand\
    mkdir %outputDir%\%%f\brand\icons\
    CMD "Running Backup" /C "node ..\__node_js__\utility\icons.js %inputDir%\%%f\logo.svg %outputDir%\%%f\brand\icons\"
    copy %inputDir%\%%f\logo.svg %outputDir%\%%f\brand\icons\logo.svg
    del %outputDir%\%%f\brand\icons\**.icns
    del %outputDir%\%%f\brand\icons\app.ico

    :: Generate manifest
    CMD "Running Backup" /C "node ..\__node_js__\utility\manifest.js %inputDir%\..\..\web\client\@vite\manifest.json %inputDir%\%%f\brand.json %outputDir%\%%f\brand\manifest.webmanifest"
)

:: Return to the original directory
popd