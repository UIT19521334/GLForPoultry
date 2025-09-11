import React from 'react';
import { useMsal } from '@azure/msal-react';
import DomainApi from '~/DomainApi';

export default function ApiToken() {
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();
    const [valueAccessToken, setValueAccessToken] = React.useState({ token: '', status: null });
    const [callApiToken, setCallApiToken] = React.useState(false);
    const fetchCallApiToken = () => {
        if (activeAccount && !callApiToken) {
            setCallApiToken(true);
        }
    };
    fetchCallApiToken();
    React.useEffect(() => {
        async function fetchData() {
            if (activeAccount) {
                try {
                    const model = {
                        email: activeAccount.username,
                    };
                    const response = await DomainApi.post(`auth/email`, model);
                    setValueAccessToken({ token: response.data.access_token, status: true });
                } catch (error) {
                    console.log(error);
                    setValueAccessToken({ token: error.response ? error.response.data : error, status: false });
                    // await instance.logout();
                }
            }
        }
        fetchData();
    }, [callApiToken]);

    return valueAccessToken;
}
