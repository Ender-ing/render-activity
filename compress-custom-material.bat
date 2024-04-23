@echo off

:: This file is meant to bundle all the material imports into web-usable resources.
:: This is done as to always get the raws for the imports as fast as possible and ship them for the web!
:: For more info about the bundling process, visit: https://github.com/material-components/material-web/blob/main/docs/quick-start.md#building

:: Specify the directory to search
set inputDir="F:\development\Ender-ing\resources\.BUILD\__node_js__\material"
set outputDir="F:\development\Ender-ing\resources\web\client\material"

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

    :: Extract the file extension
    for %%i in (%%f) do set "extension=%%~xi"

    :: Check if the file is JavaScript or CSS
    if /I "%extension%" == ".js" (
        :: Compress JavaScript code
        echo "HAHA %%f -o %outputDir%\%%f"
        CMD "Running Backup" /C "terser %%f -o %outputDir%\%%f"
    ) else if /I "%extension%" == ".css" (
        :: Minify CSS code
        CMD "Running Backup" /C "cleancss -o %outputDir%\%%f %%f"
    ) else (
        :: Just copy the unknown file
        :: echo "%extension%"
        copy %%f %outputDir%\%%f
    )
)

:: Return to the original directory
popd