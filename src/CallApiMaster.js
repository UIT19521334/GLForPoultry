import React from 'react';
import { useEffect } from 'react';
import '~/AppStyles.css';
import { useDispatch } from 'react-redux';
import {
    fetchApiCurrency,
    fetchApiListAccountGroup,
    fetchApiListSubAccountType,
} from '~/Redux/FetchApi/fetchApiMaster';

export default function CallApiMaster() {
    var dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchApiCurrency());
    }, []);

    useEffect(() => {
        dispatch(fetchApiListAccountGroup());
    }, []);

    useEffect(() => {
        dispatch(fetchApiListSubAccountType());
    }, []);
}
