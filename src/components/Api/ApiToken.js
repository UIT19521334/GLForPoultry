import React, { useState, useEffect, useCallback } from 'react';
import { useMsal } from '@azure/msal-react';
import { useDispatch } from 'react-redux';
import { updateToken } from '~/Redux/Reducer/Thunk';
import { fetchApiAuthInfo } from '~/Redux/FetchApi/fetchApiMaster';

export default function ApiToken() {
    const { instance, accounts } = useMsal();
    const dispatch = useDispatch();
    const [valueAccessToken, setValueAccessToken] = useState({
        token: '',
        status: null
    });
    const [isLoading, setIsLoading] = useState(false);

    // Memoize fetchData để tránh re-render không cần thiết
    const fetchData = useCallback(async () => {
        // Kiểm tra instance có sẵn và có accounts
        if (!instance || !accounts || accounts.length === 0) {
            console.log('MSAL instance or accounts not ready');
            return;
        }

        const activeAccount = instance.getActiveAccount() || accounts[0];

        if (!activeAccount) {
            console.log('No active account found');
            setValueAccessToken({
                token: '',
                status: false
            });
            return;
        }

        if (isLoading) {
            console.log('Already loading token...');
            return;
        }

        setIsLoading(true);

        try {
            // Kiểm tra xem đã có token hợp lệ chưa
            const tokenRequest = {
                scopes: ['User.Read'],
                account: activeAccount,
                forceRefresh: false // Chỉ refresh khi cần thiết
            };

            const response = await instance.acquireTokenSilent(tokenRequest);

            if (response && response.accessToken) {
                dispatch(updateToken(response.accessToken));
                dispatch(fetchApiAuthInfo(activeAccount ? activeAccount.username : ''));
                setValueAccessToken({
                    token: response.accessToken,
                    status: true
                });
                console.log('Token acquired successfully');
            }
        } catch (error) {
            console.error('Token acquisition failed:', error);

            // Nếu silent token acquisition thất bại, thử interactive
            try {
                const interactiveRequest = {
                    scopes: ['User.Read'],
                    account: activeAccount
                };

                const interactiveResponse = await instance.acquireTokenPopup(interactiveRequest);

                if (interactiveResponse && interactiveResponse.accessToken) {
                    dispatch(updateToken(interactiveResponse.accessToken));
                    dispatch(fetchApiAuthInfo(activeAccount ? activeAccount.username : ''));
                    setValueAccessToken({
                        token: interactiveResponse.accessToken,
                        status: true
                    });
                    console.log('Token acquired via popup successfully');
                }
            } catch (interactiveError) {
                console.error('Interactive token acquisition failed:', interactiveError);
                setValueAccessToken({
                    token: interactiveError.message || 'Authentication failed',
                    status: false
                });
            }
        } finally {
            setIsLoading(false);
        }
    }, [instance, accounts, dispatch, isLoading]);

    useEffect(() => {
        // Đợi một chút để đảm bảo MSAL đã khởi tạo hoàn toàn
        const timer = setTimeout(() => {
            fetchData();
        }, 100);

        return () => clearTimeout(timer);
    }, [fetchData]);

    // Thêm listener để theo dõi account changes
    useEffect(() => {
        if (instance) {
            const callbackId = instance.addEventCallback((event) => {
                if (event.eventType === 'msal:accountAdded' ||
                    event.eventType === 'msal:accountRemoved' ||
                    event.eventType === 'msal:activeAccountChanged') {
                    console.log('Account state changed, refetching token...');
                    fetchData();
                }
            });

            return () => {
                if (callbackId) {
                    instance.removeEventCallback(callbackId);
                }
            };
        }
    }, [instance, fetchData]);

    return valueAccessToken;
}