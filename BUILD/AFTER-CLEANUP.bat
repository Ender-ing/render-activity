@echo off
:: This file is meant to delete all the files that are not needed on the internet

echo [44;45m Cleaning up OUTPUT root files... [0m

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
pushd %OUTPUT_PATH%

:: Iterate through each folder in the directory
for /D %%f in (*) do (
    echo Handling %%f

    :: Delete generative files
    del /Q /S %OUTPUT_PATH%\%%f\gen.* > NUL 2>&1

    :: Delete GitHub files
    del /Q /S %OUTPUT_PATH%\%%f\.gitignore > NUL 2>&1
    del /Q /S %OUTPUT_PATH%\%%f\.gitattributes > NUL 2>&1

    :: Delete markdown files
    del /Q /S %OUTPUT_PATH%\%%f\*.md > NUL 2>&1

    :: Delete local $.display components
    del /Q /S %OUTPUT_PATH%\%%f\$**.display > NUL 2>&1

    :: Delete .locale files
    del /Q /S %OUTPUT_PATH%\%%f\**.locale > NUL 2>&1

    :: Delete empty folders
    CMD "Running Backup" /C "node %BUILD_PATH%\node_js\utility\delete_empty.js %OUTPUT_PATH%\%%f"

    :: Copy .gitignore file
    copy /Y %BUILD_PATH%\global\config\git.gitignore %OUTPUT_PATH%\.gitignore > NUL 2>&1

    :: Copy command files
    copy /Y %BUILD_PATH%\global\config\.bash_profile %OUTPUT_PATH%\.bash_profile > NUL 2>&1
    copy /Y %BUILD_PATH%\global\config\endering.bash %OUTPUT_PATH%\endering.bash > NUL 2>&1
)

:: Remove cache for deleted files
for /f "tokens=1,2 delims= " %%a in ('git ls-files --deleted') do (
    CMD "Running Backup" /C "git rm --cached %%a"
)

:: Fix file ending
CMD "Running Backup" /C "git config core.autocrlf true"
CMD "Running Backup" /C "git add --renormalize ."

:: Return to the original directory
popd