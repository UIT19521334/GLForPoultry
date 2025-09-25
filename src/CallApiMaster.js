import React from 'react';
import { useEffect } from 'react';
import '~/AppStyles.css';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchApiCurrency,
    fetchApiListAccountGroup,
    fetchApiListSubAccountType,
} from '~/Redux/FetchApi/fetchApiMaster';

export default function CallApiMaster() {
    const token = useSelector((state) => state.FetchApi.token)
    var dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchApiCurrency(token));
    }, []);

    useEffect(() => {
        dispatch(fetchApiListAccountGroup(token));
    }, []);

    useEffect(() => {
        dispatch(fetchApiListSubAccountType(token));
    }, []);
}
