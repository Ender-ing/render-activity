@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

:: Check command arguments
set cleanUpdate=false
for /f "tokens=*" %%a in ("%*") do (
    if /i "%%a" == "--clean-update" (
        set cleanUpdate=true
        break
    )
)

:: Generate confirmation string
SET /A RANDOM=%RANDOM% * 900000 / 32767 + 100000
SET CONFIRM=CONFIRM UPLOAD !RANDOM!

cls
:: Show warnings about possible misconfigurations or security risks!
echo [40;93m You are about to upload all local changes to the online production FTP server: [0m 
echo [40;93m - Any misconfiguration of commands or setup files could break the server^^! [0m 
echo [40;93m - Any existing backdoors could compromise data and user security^^! [0m 
echo [40;93m - Any existing debug code could compromise data and user security^^! [0m 
echo [40;93m - Any code or script, broken or not, will take effect online^^! [0m 
echo [40;93m - Any exposed sensitive/secret data will be accessible online^^! [0m 
echo [40;93m - Any connection (FTP, POP, etc.) misconfigurations could hault online services or expose data and secret credentials to outside streams^^! [0m 
:: Show a warning about te website becoming inaccessible!
if "%cleanUpdate%" == "true" (
    echo [40;94m In addition, you are about to perform a clean update to the online production FTP server^^! [0m 
    echo [40;94m ALL WEBSITES will become COMPLETELY INACCESSIBLE until all files have been updated^^! [0m 
    echo [40;91m MAKE SURE TO INFORM ALL OTHER MEMBERS OF THIS ACTION ^(AT LEAST^) AN HOUR IN ADVANCE^^! [0m 
)
echo [40;93m Keep the following in mind when using this command: [0m 
echo [40;93m - Don't post any copy or screenshot of the console output online, this action may compromise secret data and credentials^^! [0m 
echo [40;93m - Inform the server administrators of any errors or warnings caused by using this command^^! ^(admin@ender.ing^) [0m 
echo [40;93m - Inform the server administrators of any possible ^(past or present^) data or credentials leaks^^! ^(admin@ender.ing, security@ender.ing^) [0m 
:PROMPT
echo [103;91m ARE YOU SURE YOU WANT TO PUBLISH YOUR LOCAL CHANGES? THIS ACTION CANNOT BE UNDONE^^! [0m
SET /P AREYOUSURE= [40;96m After reading ALL THE TEXT above, type [0m[105;96m %CONFIRM% [0m[40;96m to confirm: [0m 
IF /I "%AREYOUSURE%" NEQ "%CONFIRM%" GOTO END

:: Use this code to get environment variables
FOR /F "tokens=*" %%i in (../.secret.env) do SET %%i

cls
echo [101;93m STARTING PUBLISHING PROCESS [0m

:: You may use the `INSTALL-DEP.bat` file to install all the needed NodeJS dependencies
:: INSTALL-DEP.bat

:: ???
REM CMD "Running Backup" /C "???"

:: Check if all FTP old files should be deleted before upload!
if "%cleanUpdate%" == "true" (
    REM CMD "Running Backup" /C "???"
    echo Deleting old files... ^(NOT READY YET!^)
) else (
    REM CMD "Running Backup" /C "???"
)

:: ???
REM CMD "Running Backup" /C "???"

echo Publish command is not ready for use!

echo [103;91m Check server for any possible leaks or broken files/code! [0m 
echo [101;93m PUBLISHING PROCESS DONE! [0m

:END
endlocal