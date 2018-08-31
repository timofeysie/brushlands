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

After this, you can =[s
]

Using npm start, which then runs gn serve, this error shows up in the Chrome browser console:
```
(unknown) Uncaught DOMException: Blocked a frame with origin "https://hakea.auth0.com" from accessing a cross-origin frame.
    at <anonymous>:1:16
```

This is using the Allow-Control-Allow-Origin plugin for Chrome.  In Firefox, there is no error, but just a blank screen.

Is this the same thing as mentioned in [this post](    
https://community.auth0.com/t/cross-origin-x-frame-options-to-sameorigin/10620/2)?
It suggests updating the web server to not include that header for that specific URL.

Using the old index.js server app I get the following:
```
$ node index.js
internal/modules/cjs/loader.js:550
    throw err;
    ^
Error: Cannot find module 'officegen'
    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:548:15)
    ...
    at Function.Module._load (internal/modules/cjs/loader.js:498:3)
```

Using the new backend/server.js file:
```
$ node server.js
server started
(node:25881) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
{ MongoNetworkError: failed to connect to server [localhost:27017] on first connect [MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017]
    at Pool.<anonymous> (/Users/tim/repos/brushlands/node_modules/mongodb-core/lib/topologies/server.js:564:11)
    ...
    at process._tickCallback (internal/process/next_tick.js:178:19)
  name: 'MongoNetworkError',
  errorLabels: [ 'TransientTransactionError' ],
  [Symbol(mongoErrorContextSymbol)]: {} }
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
