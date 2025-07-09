import { LogLevel } from '@azure/msal-browser';
//https://godirectgl.japfa.com.vn/

export const msalConfig = {
    auth: {
        clientId: '91024f50-9a8b-4fb1-8b43-9fe7049c6eec',
        authority: 'https://login.microsoftonline.com/japfa.com',
        redirectUri: '/',
        postLogoutRedirectUri: '/',
    },
    cache: {
        cacheLocation: 'sessionStorage', // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        // console.error(message);
                        return;
                    case LogLevel.Info:
                        // console.info(message);
                        return;
                    case LogLevel.Verbose:
                        // console.debug(message);
                        return;
                    case LogLevel.Warning:
                        // console.warn(message);
                        return;
                    default:
                        return;
                }
            },
        },
    },
};

export const loginRequest = {
    scopes: ['user.read'],
};
