# The `.BUILD` directory

This directory contains all files and scripts needed to build the raw resources hosted on **resources.ender.ing**, and the shared files between all subdomains!

> You may run the `BUILD.bat` file to build all the resources.
>
> By default, the `BUILD.bat` file copies all files from the `ROOTS_PATH` directory into the `OUTPUT_PATH` directory.
>
> If you use the argument `--no-static`, the `BUILD.bat` file will include only the generated resources in the `OUTPUT_PATH` directory.

You may use the `INSTALL-DEP.bat` file to install all the needed dependencies.

> Warning: The `INSTALL-DEP.bat` file will install local and ***global*** NodeJS dependencies

## `.secret.env` & `.template.env`

The `.secret.env` file contains needed absolute paths and secret values.

> **Warning:** Make sure to **copy** and **rename** `.template.env` file **to `.secret.env`** and use ***correct absolute paths*** before running any command!
>
> ***Failure to do so can result in you losing your files!***

## /TEMPLATE

Contains a template of correct `gen.` configuration files.

## /node_js

Contains all NodeJS modules used to generate raw web resources and relevant files.

### /node_js/global-index

Contains all files used to generate the global `index.html` file.

> You may run the `build-global-index.bat` file to build all relevant resources.

### /node_js/material-imports

Contains all files related to material design web components and imports.

> You may run the `build-material-imports.bat` file to build all relevant resources. (makes use of [Rollup](https://rollupjs.org/))

### /node_js/material

Contains all custom files related to material design

> You may run the `compress-custom-material.bat` file to build all relevant resources.

## /global

Contains global configuration files used on the server on all subdomains.

## Publishing files

> Note that you need to use a GitHub account that has access to the private `host` repository in order to pull files and commit changes!

The generated output directory should include a `.git` folder. You can use your GitHub account to push your changes to the private `host` repository. After pushing the changes, ask the server staff/manager to run the `update get` command in the server's terminal.
