@echo off

:: This file is meant to handle all brand-related assets generation and server configuration files
echo [44;45m Generating branding assets... [0m

:: Get environment variables
FOR /F "tokens=*" %%i in (BUILD.env) do SET %%i

:: Specify the directory to search
set inputDir=%OUTPUT_PATH%
set outputDir=%OUTPUT_PATH%

:: Change to the target directory 
pushd %OUTPUT_PATH%

:: Iterate through each folder in the directory
for /D %%f in (*) do (
    echo Handling %%f

    :: Generate icons (\brands)
    mkdir %OUTPUT_PATH%\%%f\brand\
    mkdir %OUTPUT_PATH%\%%f\brand\icons\
    CMD "Running Backup" /C "node %BUILD_PATH%\__node_js__\utility\icons.js %OUTPUT_PATH%\%%f\gen.logo.svg %OUTPUT_PATH%\%%f\brand\icons\"
    copy %OUTPUT_PATH%\%%f\gen.logo.svg %OUTPUT_PATH%\%%f\brand\icons\logo.svg
    copy %OUTPUT_PATH%\%%f\gen.maskable.svg %OUTPUT_PATH%\%%f\brand\icons\logo-maskable.svg
    del %OUTPUT_PATH%\%%f\brand\icons\**.icns
    del %OUTPUT_PATH%\%%f\brand\icons\app.ico

    :: Generate manifest
    CMD "Running Backup" /C "node %BUILD_PATH%\__node_js__\utility\manifest.js %RESOURCES_PATH%\web\client\@vite\manifest.jsonc %OUTPUT_PATH%\%%f\gen.info.json %OUTPUT_PATH%\%%f\manifest.webmanifest"

    :: Generate index file
    CMD "Running Backup" /C "node %BUILD_PATH%\__node_js__\utility\variables.js %RESOURCES_PATH%\web\client\@vite\index.php.html %OUTPUT_PATH%\%%f\gen.info.json %OUTPUT_PATH%\%%f\index.php"

    :: Generate service worker
    CMD "Running Backup" /C "node %BUILD_PATH%\__node_js__\utility\variables.js %RESOURCES_PATH%\web\client\@vite\sw.js %OUTPUT_PATH%\%%f\gen.info.json %OUTPUT_PATH%\%%f\sw.js"

    :: Copy .htaccess
    copy %BUILD_PATH%\global\secure.htaccess %OUTPUT_PATH%\%%f\.htaccess

    :: Copy /.well-known/.htaccess
    mkdir %OUTPUT_PATH%\%%f\.well-known 2>nul
    copy %BUILD_PATH%\global\open.htaccess %OUTPUT_PATH%\%%f\.well-known\.htaccess

    :: Copy robots.txt
    copy %BUILD_PATH%\global\robots.txt %OUTPUT_PATH%\%%f\robots.txt
)

:: Delete used files
del "%RESOURCES_PATH%\web\client\@vite\manifest.jsonc"
del "%RESOURCES_PATH%\web\client\@vite\index.php.html"
del "%RESOURCES_PATH%\web\client\@vite\sw.js"

:: Return to the original directory
popd