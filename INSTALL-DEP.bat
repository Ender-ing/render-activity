@echo off

cls
echo [101;93m INSTALLING GLOBAL NODEJS DEPENDENCIES! [0m

CMD "Running Backup" /C "npm install -g terser@latest"
CMD "Running Backup" /C "npm install clean-css-cli -g"

echo [101;93m GLOBAL NODEJS DEPENDENCIES INSTALLED! [0m
