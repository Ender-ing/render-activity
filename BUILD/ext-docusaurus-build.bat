@echo off
:: This file is meant to handle the processing of the Docusaurus project

echo [44;45m Building Docusaurus project... [0m

:: Exit
goto local_bat_file
:local_bat_error
echo [91m An error occurred white attempting to load environment variables ^(errorlevel: %errorlevel%, errorTrigger: %errorTrigger%^) [0m
exit /B 1
:local_bat_file

:: Get environment variables
FOR /F "tokens=*" %%i in (../.secret.env) do SET %%i
call ../SAFETY.bat || ( set errorTrigger="call" && goto local_bat_error )
if %errorlevel% NEQ 0 ( set errorTrigger="level" && goto local_bat_error )

:: Change to the target directory 
pushd %DOCUSAURUS_PATH%

:: Delete build files
echo "1"
rmdir /s /q "%OUTPUT_PATH%\docs\en" > NUL
rmdir /s /q "%OUTPUT_PATH%\docs\ar" > NUL
rmdir /s /q "%OUTPUT_PATH%\docs\he" > NUL
echo "2"
del "%OUTPUT_PATH%\docs\*.html" > NUL
del "%OUTPUT_PATH%\docs\*.php" > NUL
del "%OUTPUT_PATH%\docs\sw.js" > NUL
del "%OUTPUT_PATH%\docs\.htaccess" > NUL
del "%OUTPUT_PATH%\docs\manifest.webmanifest" > NUL

:: Delete cache file
rmdir /s /q "%DOCUSAURUS_PATH%\.docusaurus" > NUL
rmdir /s /q "%DOCUSAURUS_PATH%\build" > NUL

:: build the project
CMD "Running Backup" /C "npm run build"

:: Move files to the docs subdomain directory!
robocopy "%DOCUSAURUS_PATH%\build" "%OUTPUT_PATH%\docs" /s /mov /e

:: Return to the original directory
popd