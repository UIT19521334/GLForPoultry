import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '~/App';
import reportWebVitals from './reportWebVitals';
import './fontawesome';
import { EventType, PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './Config';
import { store } from './Redux/store';
import { Provider } from 'react-redux';

const pca = new PublicClientApplication(msalConfig);

if (!pca.getActiveAccount() && pca.getAllAccounts().length > 0) {
    pca.setActiveAccount(pca.getActiveAccount()[0]);
}

pca.addEventCallback(
    (event) => {
        if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
            const account = event.payload.account;
            pca.setActiveAccount(account);
        }
    },
    (error) => {
        console.log('error', error);
    },
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <React.StrictMode>
            <App msalInstance={pca} />
        </React.StrictMode>
    </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
