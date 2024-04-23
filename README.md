# The .BUILD directory

This directory contains all files and scripts needed to build the raw resources hosted on **resources.ender.ing**, and the shared files betweem all subdomains!

> You may run the `BUILD.bat` file to build all the resources.

## /__node_js__

Contains all NodeJS modules used to generate raw web resources and relevant files.

### global-index

Contains all files used to generate the global `index.html` file.

> You may run the `build-global-index.bat` file to build all relevant resources.

### /material-imports

Contains all files related to material design web components and imports.

> You may run the `build-material-imports.bat` file to build all relevant resources. (makes use of [Rollup](https://rollupjs.org/))
