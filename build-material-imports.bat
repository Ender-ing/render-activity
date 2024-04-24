@echo off

:: This file is meant to bundle all the material imports into web-usable resources.
:: This is done as to always get the raws for the imports as fast as possible and ship them for the web!
:: For more info about the bundling process, visit: https://github.com/material-components/material-web/blob/main/docs/quick-start.md#building

:: Specify the directory to search
set inputDir=F:\development\Ender-ing\resources\.BUILD\__node_js__\material-imports
set outputDir=F:\development\Ender-ing\resources\web\client\@material

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

:: Iterate through each file in the directory
for %%f in (*) do (
    echo Handling %%f

    :: Additional commands to process each file go here.
    :: a "CMD" command is used in order to prevent the module from messing with the "pushd" command
    :: -g lit:https://google.com/
    CMD "Running Backup" /C "npx rollup -p @rollup/plugin-node-resolve %%f -o %outputDir%\%%f"

    :: Put the generated code inside a function!
    :: Adding to beginning
    (echo ^(function^(^)^{ 
        type %outputDir%\%%f) > %outputDir%\%%f.tmp
    move /y %outputDir%\%%f.tmp %outputDir%\%%f 
    :: Adding to end
    >> %outputDir%\%%f echo ^}^)^(^)^;
    :: Remove temporary file
    del %outputDir%\%%f.tmp

    :: Remove comments from the code
    CMD "Running Backup" /C "terser --compress --comments false --keep-classnames --keep-fnames -o %outputDir%\%%f %outputDir%\%%f"
)

:: Return to the original directory
popd