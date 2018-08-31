# Brushlands

An art collection app.

1. [Running locally](#Running-locally)
2. [Former Readme Intro](#Former-Readme-Intro)
2. [Development server](#Development-server)
2. [Code scaffolding](#Code-scaffolding)
2. [Build](#Build)
2. [Running unit tests](#Running-unit-tests)
2. [Running end-to-end tests](#Running-end-to-end-tests)
2. [Further help](#Further-help)


#


## Running locally

Start the server in backend/server.js using NodeJS:
```
node backend/server.js
```

The server will then be listening on port 3000.  After this, you can serve the app by running:
```
npm start
```

If this error shows up in the Chrome browser console:
```
(unknown) Uncaught DOMException: Blocked a frame with origin "https://hakea.auth0.com" from accessing a cross-origin frame.
    at <anonymous>:1:16
```

The route for '/' is not yet defined.  Go to ```http://localhost:4200/login``` to get started.

You can use the Allow-Control-Allow-Origin plugin for Chrome to get around these issues locally.

When offline, running the tests will cause two errors so far:
```
AppComponent should definitely create the app
Failed: Error: An error occurred when fetching client data for Lock: https://cdn.auth0.com/client/quqf2wa3U0Y6wD5xVzGIrPtM4aWLTp2C.js?t1535676930356 could not be loaded.
Error: Error: An error occurred when fetching client data for Lock: https://cdn.auth0.com/client/quqf2wa3U0Y6wD5xVzGIrPtM4aWLTp2C.js?t1535676930356 could not be loaded.
```

And:
```
ArtworksComponent should show update button if no artworks
[object ErrorEvent] thrown
```


#

## Former Readme Intro

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
