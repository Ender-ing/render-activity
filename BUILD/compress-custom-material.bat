@echo off
:: This file is meant to comrpess and minify the raw files used in the material folder

echo [44;45m Compressing raw Material Design assets... [0m

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

:: Specify the directory to search
set inputDir=%BUILD_PATH%\node_js\material
set outputDir=%RESOURCES_PATH%\web\client\material

:: Attempt to delete the folder (with error handling)
rmdir /s /q %outputDir%

:: Check if deletion was successful
if exist %outputDir% (
    echo Folder deletion failed. Please check permissions or if the folder is in use.
    exit 1
) else (
    :: Create the folder (handle potential errors)
    mkdir %outputDir% > NUL 2>&1

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

    :: Check if the file is JavaScript or CSS
    if /I "%%~xf" == ".js" (
        :: Compress JavaScript code
        CMD "Running Backup" /C "terser --compress --comments false --keep-classnames --keep-fnames -p bare_returns -o %outputDir%\%%f %%f"
    ) else if /I "%%~xf" == ".css" (
        :: Minify CSS code
        CMD "Running Backup" /C "cleancss -o %outputDir%\%%f %%f"
    ) else (
        :: Just copy the unknown file
        copy %%f %outputDir%\%%f
    )
    set "extension="
)

:: Return to the original directory
popd