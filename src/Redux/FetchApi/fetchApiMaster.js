import { DomainGD } from '~/DomainApi';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchApiChannel = createAsyncThunk('master/fetchApiChannel', async (unitcode) => {
    if (unitcode) {
        const response = await DomainGD.get(`master/channel?unitcode=${unitcode}`);
        return response.data;
    }
});

export const fetchApiCurrency = createAsyncThunk('master/fetchApiCurrency', async () => {
    const response = await DomainGD.get('master/currency');
    return response.data;
});

export const fetchPeriod = createAsyncThunk('master/fetchPeriod', async (unitcode) => {
    if (unitcode) {
        const response = await DomainGD.get(`master/account-period?unitcode=${unitcode}`);
        return response.data;
    }
});

export const fetchApiToken = createAsyncThunk('master/fetchApiToken', async (email) => {
    if (email) {
        const model = {
            email: email,
        };
        const response = await DomainGD.post(`auth/email`, model);
        return response.data.access_token;
    }
});

export const fetchApiCostCenter = createAsyncThunk('master/fetchApiCostCenter', async () => {
    const response = await DomainGD.get(
        `master/cost-center?username=${localStorage.getItem('UserName')}&unitcode=${localStorage.getItem('Unit')}`,
    );
    const data = [{ code: null, name: 'General Account', unitcode: 'UN001', kind_of_location: null }, ...response.data];
    return data;
});

export const fetchApiListAccountGroup = createAsyncThunk('master/fetchApiListAccountGroup', async (valueSearch) => {
    let url = `master/group-account/search?username=${localStorage.getItem('UserName')}`;
    if (valueSearch) {
        url += `&searchtxt=${valueSearch}`;
    }
    const response = await DomainGD.get(url);
    const data = response.data.sort((a, b) => parseFloat(a.gr_acc_code) - parseFloat(b.gr_acc_code));
    return data;
});

export const fetchApiListAccount = createAsyncThunk('master/fetchApiListAccount', async (valueSearch) => {
    let url = `master/chart-of-account/unit/${localStorage.getItem('Unit')}/list`;
    if (valueSearch) {
        url += `?acc_code=${valueSearch}`;
    }
    const response = await DomainGD.get(url);
    const data = response.data.sort((a, b) => parseFloat(a.account_code) - parseFloat(b.account_code));
    return data;
});

export const fetchApiListUser = createAsyncThunk('master/fetchApiListUser', async () => {
    let url = `master/user/costing?username=${localStorage.getItem('UserName')}`;
    const response = await DomainGD.get(url);
    return response.data;
});

export const fetchApiProduct = createAsyncThunk('master/fetchApiProduct', async () => {
    let url = `master/product?unitcode=${localStorage.getItem('Unit')}`;
    const response = await DomainGD.get(url);
    const data = response.data.sort((a, b) => parseFloat(a.PRODUCT_NAME) - parseFloat(b.PRODUCT_NAME));
    return data;
});
