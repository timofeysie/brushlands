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

## Setup

The minimum node version is 8+.  Currently using node v10.14.2 (npm v6.4.1).
```
$ npm i
...
npm WARN angular2-jwt@0.2.3 requires a peer of @angular/core@^2.0.0||^4.0.0 but none was installed.
npm WARN angular2-jwt@0.2.3 requires a peer of @angular/http@^2.0.0||^4.0.0 but none was installed.
npm WARN angular2-jwt@0.2.3 requires a peer of rxjs@^5.0.0 but none was installed.
```

In a second terminal: ```node backend/server.js```

```
npm start
...
chunk {vendor} vendor.js, vendor.js.map (vendor) 5.93 MB [initial] [rendered]
ERROR in ./src/app/pages/artist/artist.component.scss
Module build failed: Error: Missing binding /Users/tim/repos/brushlands/node_modules/node-sass/vendor/darwin-x64-64/binding.node
Node Sass could not find a binding for your current environment: OS X 64-bit with Node.js 10.x
Found bindings for the following environments:
  - OS X 64-bit with Node.js 6.x
This usually happens because your environment has changed since running `npm install`.
Run `npm rebuild node-sass` to download the binding for your current environment.
    at module.exports (/Users/tim/repos/brushlands/node_modules/node-sass/lib/binding.js:15:13)
...
This usually happens because your environment has changed since running `npm install`.
Run `npm rebuild node-sass` to download the binding for your current environment.
｢wdm｣: Failed to compile.
```

```
npm rebuild node-sass
...
npm start
...
 ｢wdm｣: Compiled successfully.
```

In the browser at http://localhost:4200/, a blank screen and the following console error:
```
vendor.js:1 Failed to load resource: net::ERR_CONTENT_LENGTH_MISMATCH
```

Eventually going to http://localhost:4200/login works.

Going to the home page with no artists causes the following error in the console and an infinite spinner:
```
(unknown) Uncaught DOMException: Blocked a frame with origin "https://hakea.auth0.com" from accessing a cross-origin frame.
    at <anonymous>:1:16
(anonymous) @ VM18:1
zone.js:2969 GET http://localhost:3000/api/check-permission?user=Timothy%20Curchod&permission=upload-and-backup-artworks 500 (Internal Server Error)
scheduleTask @ zone.js:2969
push../node_modules/zone.js/dist/zone.js.ZoneDelegate.scheduleTask @ zone.js:407
onScheduleTask @ zone.js:297
...
```

In the server console we see this:
```
server started
{ MongoNetworkError: failed to connect to server [localhost:27017] on first connect [MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017]
    at Pool.<anonymous> (/Users/tim/repos/brushlands/node_modules/mongodb-core/lib/topologies/server.js:564:11)
    at emitOne (events.js:96:13)
...
  name: 'MongoNetworkError',
  errorLabels: [ 'TransientTransactionError' ] }
{ MongoNetworkError: failed to connect to server [localhost:27017] on first connect [MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017]
    at Pool.<anonymous> (/Users/tim/repos/brushlands/node_modules/mongodb-core/lib/topologies/server.js:564:11)
    at emitOne (events.js:96:13)
... 
```    

The tests are in pretty good shape: ```32 specs, 7 failures```.
The usual error comes up first.
```
PermissionGuard should ...
Error: StaticInjectorError(DynamicTestModule)[HttpClient]: 
  StaticInjectorError(Platform: core)[HttpClient]: 
    NullInjectorError: No provider for HttpClient!
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
