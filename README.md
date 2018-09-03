# REST API GUI

* REST - Representational state transfer
* API - Application programming interface
* GUI - Graphical user interface

This app allows to interact with the REST API service using the simple graphical interface. It has the ability to perform basic requests to the server by interaction with graphical elements. The query result is dynamically displayed in the app output pane.

## Installation

To run this project you should have the same **_workflow_** *(look bellow in **Workflow** section)*, also **Node.js** have to be installed.

1. clone this project into workspace
2. in the project root, type with the command line interface:
   1. `npm i` - install project dependencies
   2. `npm start` - build the bundle
3. in browser open *<http://localhost:8080/>*

## Showcase

### File Structure:
![alt text](./File_Structure.png)
[*file structure diagram link*](https://coggle.it/diagram/W4kDe-GhIs7jnfWd/t/file-structure/5777bbf249c96efe462f680be0b307af2d8d5e6943fa035353694aed858d8513)

### Bundle Structure:
![alt text](./Bundle_Structure.png)
[*bundle structure diagram link*](https://coggle.it/diagram/W4kaGOGhIlNWnlHS/t/bundle-structure/1e3c155cc2d9d901d7178086240c22902a36ae8e8f59d3ecad042766d35dcedd)


## About

This small education project aims to show basic practical usage of:

* javascript web programming
* AJAX
* CSS styling
* project structure organization
* version control system

also demonstrate:

* code style
* code documentation

This project based on tutorials and API service by Ilya Kantor:

* English tutorial: <http://javascript.info/>
* Russian tutorial: <http://learn.javascript.ru/>
* REST API: <http://test-api.javascript.ru/v1/>

Project assume building app from scratch without using any framework or libs, (except lodash for _.template usage)

Also much attention was paid to bundle. This is one of the important parts of the project demonstration

### Workflow

* Windows 10 OS
* GitBash
* Google Chrome Beta
* Visual Studio Code
* ESLint
* GIT
* NodeJS v8.11.4

### Using Technologies

* Webpack
* webpack-dev-server
* Sass
* AutoPrefixer
* NPM Script
* HTML
* CSS
* ES6
* AJAX
* Dynamic HTML generation with semantic templates (Lodash)