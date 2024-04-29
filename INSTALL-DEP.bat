@echo off

:: Get environment variables
FOR /F "tokens=*" %%i in (BUILD.env) do SET %%i

cls
echo [101;93m INSTALLING NODEJS DEPENDENCIES! [0m

echo [44;45m INSTALLING GLOBAL NODEJS DEPENDENCIES... [0m

pushd %BUILD_PATH%\__node_js__\material-imports
CMD "Running Backup" /C "npm i"
popd
pushd %BUILD_PATH%\__node_js__\global-index
CMD "Running Backup" /C "npm i"
popd

echo [44;45m INSTALLING LOCAL NODEJS DEPENDENCIES... [0m

CMD "Running Backup" /C "npm install -g terser@latest"

echo [101;93m NODEJS DEPENDENCIES INSTALLED! [0m
