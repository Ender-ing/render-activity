@echo off

:: This file is meant to delete all the files that are not needed on the internet
echo [44;45m Cleaning up .OUTPUT root base files... [0m

:: Get environment variables
FOR /F "tokens=*" %%i in (BUILD.env) do SET %%i

:: Change to the target directory 
pushd %OUTPUT_PATH%

:: Iterate through each folder in the directory
for /D %%f in (*) do (
    echo Handling %%f

    :: Delete generative files
    del /Q %OUTPUT_PATH%\%%f\gen.* > nul 2>&1

    :: Delete GitHub files
    del /Q %OUTPUT_PATH%\%%f\.gitignore > nul 2>&1

    :: Delete local $.display components
    del /Q /S %OUTPUT_PATH%\%%f\$**.display > nul 2>&1

    :: Delete .locale files
    del /Q /S %OUTPUT_PATH%\%%f\**.locale > nul 2>&1

    :: Delete empty folders
    CMD "Running Backup" /C "node %BUILD_PATH%\node_js\utility\delete_empty.js %OUTPUT_PATH%\%%f"
)

:: Return to the original directory
popd