import React from 'react';
import { useEffect } from 'react';
import '~/AppStyles.css';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchApiChannel,
    fetchApiCurrency,
    fetchPeriod,
    fetchApiToken,
    fetchApiCostCenter,
    fetchApiListAccountGroup,
    fetchApiListSubAccountType,
    fetchApiListAccount,
    fetchApiListUser,
    fetchApiAuthInfo,
    fetchApiProduct,
} from '~/Redux/FetchApi/fetchApiMaster';
import { useMsal } from '@azure/msal-react';

export default function CallApiMaster() {
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();
    var dispatch = useDispatch();
    const unitcode = useSelector((state) => state.Actions.unitcode);

    // useEffect(() => {
    //     dispatch(fetchApiChannel(unitcode));
    // }, []);
    useEffect(() => {
        dispatch(fetchApiCurrency());
    }, []);

    // useEffect(() => {
    //     dispatch(fetchPeriod(unitcode));
    // }, []);

    const [callApiToken, setCallApiToken] = React.useState(false);
    // const fetchCallApiToken = () => {
    //     if (activeAccount && !callApiToken) {
    //         setCallApiToken(true);
    //     }
    // };
    // fetchCallApiToken();
    useEffect(() => {
        if (activeAccount) {
            // dispatch(fetchApiToken(activeAccount ? activeAccount.username : '')); // this will remove
            dispatch(fetchApiAuthInfo(activeAccount ? activeAccount.username : ''));
        }
    }, [callApiToken]);

    // useEffect(() => {
    //     dispatch(fetchApiCostCenter());
    // }, []);
    useEffect(() => {
        dispatch(fetchApiListAccountGroup());
    }, []);
    useEffect(() => {
        dispatch(fetchApiListSubAccountType());
    }, []);
    // useEffect(() => {
    //     dispatch(fetchApiListAccount());
    // }, []);
    // useEffect(() => {
    //     dispatch(fetchApiListUser());
    // }, []);
    // useEffect(() => {
    //     dispatch(fetchApiProduct());
    // }, []);
}
