# The `.BUILD` directory

This directory contains all files and scripts needed to build the raw resources hosted on **resources.ender.ing**, and the shared files betweem all subdomains!

> You may run the `BUILD.bat` file to build all the resources.
>
> By default, the `BUILD.bat` file copies all files from the `ROOTS_PATH` directory into the `OUTPUT_PATH` directory.
>
> If you use the argument `--no-static`, the `BUILD.bat` file will include only the generated resources in the `OUTPUT_PATH` directory.

You may use the `INSTALL-DEP.bat` file to install all the needed dependencies.

> Warning: The `INSTALL-DEP.bat` file will install local and ***global*** NodeJS dependencies

## `BUILD.env`

Contains the absolute paths to the `.BUILD` directory and the *resources* directory.

> Warning: Make sure all paths are correct before running the `BUILD.bat` command!

## /TEMPLATE

Contains a template of correct `gen.` configuration files.

## /__node_js__

Contains all NodeJS modules used to generate raw web resources and relevant files.

### /__node_js__/global-index

Contains all files used to generate the global `index.html` file.

> You may run the `build-global-index.bat` file to build all relevant resources.

### /__node_js__/material-imports

Contains all files related to material design web components and imports.

> You may run the `build-material-imports.bat` file to build all relevant resources. (makes use of [Rollup](https://rollupjs.org/))

### /__node_js__/material

Contains all custom files related to material design

> You may run the `compress-custom-material.bat` file to build all relevant resources.

## /global

Contains global configuration files used on the server on all subdomains.
