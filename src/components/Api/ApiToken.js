import React from 'react';
import { useMsal } from '@azure/msal-react';
import { useDispatch } from 'react-redux';
import { updateToken } from '~/Redux/Reducer/Thunk';
import DomainApi from '~/DomainApi';

export default function ApiToken() {
    const { instance } = useMsal();
    const dispatch = useDispatch();
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
                    // const response = await instance.acquireTokenSilent({
                    //     scopes: ['User.Read'],
                    //     account: activeAccount,
                    // });
                    const response = await DomainApi.post(`auth/email`, model);
                    dispatch(updateToken(response.accessToken));
                    setValueAccessToken({ token: response.accessToken, status: true });
                } catch (error) {
                    console.log(error);
                    setValueAccessToken({ token: error.response ? error.response.data : error, status: false });
                }
            }
        }
        fetchData();
    }, [callApiToken]);

    return valueAccessToken;
}
