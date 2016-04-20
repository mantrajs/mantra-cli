# Mantra CLI

[![Build Status](https://travis-ci.org/sungwoncho/mantra-cli.svg?branch=master)](https://travis-ci.org/sungwoncho/mantra-cli) [![Vym](https://img.shields.io/badge/Reviewing%20with-Vym-blue.svg)](https://vym.io)

A command line interface for developing Meteor apps using [Mantra](https://github.com/kadirahq/mantra).


## Installation

    npm install -g mantra-cli

See [RELEASE NOTE](https://github.com/mantrajs/mantra-cli/blob/master/RELEASE_NOTE.md)
if you are upgrading and wondering what has changed in the latest version.

**Meteor version 1.3 or higher** needs to be present in your machine to create
and run apps with mantra-cli.


## Documentation

The available commands are:

* [create](https://github.com/mantrajs/mantra-cli#mantra-create-path)
* [generate](https://github.com/mantrajs/mantra-cli#mantra-generate-type-name)
* [destroy](https://github.com/mantrajs/mantra-cli#mantra-destroy-type-name)

Currently, CLI expects you to be in the app root directory.

---------------------------------------

### mantra create [path]
*alias: c*

Create a Meteor application using Mantra spec under `path`.

It performs the following tasks:

* Create a Meteor app
* Prepare a skeleton structure for Mantra and add `.eslintrc` and `.gitignore`
* Add Meteor and NPM dependencies
* Install NPM dependencies


#### Options

* `--verbose, -v`

Log the output of the scripts in the console, rather than silencing them.

---------------------------------------

### mantra generate [type] [name]
*alias: g*

Generate a file of `type` and name specified `name`.

#### type

Possible values are:

* `action`
* `component`

By default, a stateless component is generated. By using `--use-class` option
(alias `-c`), you can generate a ES2015 class extending `React.Component`.

    mantra g component core:user_list -c

* `container`

Generates a `container` and its corresponding `component`.

* `collection`

Use `--schema` option (alias `-s`) to specify the schema solution to use for
your Mongo collections. Currently, you can specify `collection2`.

    mantra g collection books -s collection2

* `method`
* `publication`
* `module`


#### name

If the `type` is one of `action`, `component`, or `container`, the name should
follow the format `moduleName:entityName`. This is because Mantra is modular
on the client side, and all files of those types belong to a module.

*Example*

    mantra generate component core:posts
    mantra generate publication users
    mantra generate method comments

**Automatic update to index.js**

For `action`, `collection`, `method`, and `publication`, the command automatically
inserts `import` and `export` statements to the relevant `index.js` file.

---------------------------------------

### mantra destroy [type] [name]
*alias: d*

**This command removes files.**

Destroys all files that its counterpart `mantra generate` command would generate.
You can provide all `types` supported by the `generate` command.

---------------------------------------

## Contributor Guide

* Clone this repository and run `npm install`.
* Write your code under `/lib`.
* `npm run-script compile` compiles your ES2015 code in `/lib` into `/dist`.
* `npm test` compiles the code and runs the tests.


## License

MIT
