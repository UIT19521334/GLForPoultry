import React, { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';

export default function ApiToken() {
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();
    const [valueAccessToken, setValueAccessToken] = React.useState({ token: '', status: null });

    useEffect(() => {
        async function getAccessToken() {
            if (activeAccount) {
                try {
                    const tokenResponse = await instance.acquireTokenSilent({
                        scopes: ['User.Read'],
                    });
                    console.log("token  response:", tokenResponse);
                    setValueAccessToken({ token: tokenResponse.accessToken, status: true });
                } catch (error) {
                    console.error("Token acquisition failed:", error);
                    setValueAccessToken({ token: '', status: false });
                }
            }
        }
        getAccessToken();
    }, [instance, activeAccount]);

    return valueAccessToken;
}