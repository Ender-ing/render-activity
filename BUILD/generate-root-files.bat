@echo off

:: This file is meant to handle all brand-related assets generation and server configuration files
echo [44;45m Generating branding assets... [0m

:: Get environment variables
FOR /F "tokens=*" %%i in (../.env) do SET %%i

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
    CMD "Running Backup" /C "node %BUILD_PATH%\node_js\utility\icons.js %OUTPUT_PATH%\%%f\gen.logo.svg %OUTPUT_PATH%\%%f\brand\icons\"
    copy %OUTPUT_PATH%\%%f\gen.logo.svg %OUTPUT_PATH%\%%f\brand\icons\logo.svg
    copy %OUTPUT_PATH%\%%f\gen.maskable.svg %OUTPUT_PATH%\%%f\brand\icons\logo-maskable.svg
    del %OUTPUT_PATH%\%%f\brand\icons\**.icns
    del %OUTPUT_PATH%\%%f\brand\icons\app.ico

    :: Generate manifest
    CMD "Running Backup" /C "node %BUILD_PATH%\node_js\utility\manifest.js %RESOURCES_PATH%\web\client\@vite\manifest.jsonc %OUTPUT_PATH%\%%f\gen.info.json %OUTPUT_PATH%\%%f\manifest.webmanifest"

    :: Generate index file
    CMD "Running Backup" /C "node %BUILD_PATH%\node_js\utility\variables.js %RESOURCES_PATH%\web\client\@vite\index.php.html %OUTPUT_PATH%\%%f\gen.info.json %OUTPUT_PATH%\%%f\index.php"
    CMD "Running Backup" /C "node %BUILD_PATH%\node_js\utility\locale_expression.js %OUTPUT_PATH%\%%f\index.php %OUTPUT_PATH%\%%f %BUILD_PATH%\global\locale"

    :: Generate service worker
    CMD "Running Backup" /C "node %BUILD_PATH%\node_js\utility\variables.js %RESOURCES_PATH%\web\client\@vite\sw.js %OUTPUT_PATH%\%%f\gen.info.json %OUTPUT_PATH%\%%f\sw.js"

    :: Generate robots.txt
    CMD "Running Backup" /C "node %BUILD_PATH%\node_js\utility\variables.js %BUILD_PATH%\global\robots.txt %OUTPUT_PATH%\%%f\gen.info.json %OUTPUT_PATH%\%%f\robots.txt"

    :: Make .well-known directory
    mkdir %OUTPUT_PATH%\%%f\.well-known 2>nul

    :: Generate security.txt
    :: Check securitytxt.org for more info
    CMD "Running Backup" /C "node %BUILD_PATH%\node_js\utility\variables.js %BUILD_PATH%\global\security.txt %OUTPUT_PATH%\%%f\gen.info.json %OUTPUT_PATH%\%%f\.well-known\security.txt"

    :: copy /XX/.htaccess
    copy %BUILD_PATH%\global\locale.htaccess %OUTPUT_PATH%\%%f\.htaccess
    CMD "Running Backup" /C "node %BUILD_PATH%\node_js\utility\locale_expression.js %OUTPUT_PATH%\%%f\.htaccess %OUTPUT_PATH%\%%f %BUILD_PATH%\global\locale"

    :: Copy /.well-known/.htaccess
    copy %BUILD_PATH%\global\open.htaccess %OUTPUT_PATH%\%%f\.well-known\.htaccess

    :: Copy .htaccess
    copy %BUILD_PATH%\global\secure.htaccess %OUTPUT_PATH%\%%f\.htaccess

    :: Copy redirect.php
    copy %BUILD_PATH%\global\redirect.php %OUTPUT_PATH%\%%f\redirect.config.php

    :: Copy check-lang.html
    copy %BUILD_PATH%\global\check-lang.html %OUTPUT_PATH%\%%f\check-lang.config.html
)

:: Delete used files
del "%RESOURCES_PATH%\web\client\@vite\manifest.jsonc"
del "%RESOURCES_PATH%\web\client\@vite\index.php.html"
del "%RESOURCES_PATH%\web\client\@vite\sw.js"

:: Return to the original directory
popd