// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,

    backendUrl: 'http://localhost:3000/api/',

    auth0: {
        domain: 'hakea.auth0.com',
        clientId: 'quqf2wa3U0Y6wD5xVzGIrPtM4aWLTp2C',
        callbackURL: 'http://localhost:4200/login',
    },
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
