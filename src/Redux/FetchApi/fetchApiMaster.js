import DomainApi, { DomainPoultry } from '~/DomainApi';
import { createAsyncThunk } from '@reduxjs/toolkit';
import _ from 'lodash';

export const fetchApiChannel = createAsyncThunk('master/fetchApiChannel', async (unitcode) => {
    if (unitcode) {
        const response = await DomainApi.get(`master/channel?unitcode=${unitcode}`);
        return response.data;
    }
});

export const fetchApiCurrency = createAsyncThunk('master/fetchApiCurrency', async (token) => {
    const header = {
        Authorization: token,
    };
    const response = await DomainPoultry.get('master/currency', { headers: header });
    const data = await response.data;
    return data.Response;
});

export const fetchPeriod = createAsyncThunk('master/fetchPeriod', async (unitcode) => {
    if (unitcode) {
        const response = await DomainApi.get(`master/account-period?unitcode=${unitcode}`);
        return response.data;
    }
});

export const fetchApiAuthInfo = createAsyncThunk('master/fetchApiAuthInfo', async (email, token) => {
    if (email) {
        const body = {
            email: email,
        };
        const header = {
            Authorization: token,
        };
        const response = await DomainPoultry.post(`auth/info`, body, { headers: header });
        return response.data?.Response;
    }
});

export const fetchApiToken = createAsyncThunk('master/fetchApiToken', async (email) => {
    if (email) {
        const model = {
            email: email,
        };
        const response = await DomainApi.post(`auth/email`, model);
        return response.data.access_token;
    }
});

export const fetchApiCostCenter = createAsyncThunk('master/fetchApiCostCenter', async () => {
    const response = await DomainApi.get(
        `master/cost-center?username=${localStorage.getItem('UserName')}&unitcode=${localStorage.getItem('Unit')}`,
    );
    const data = [{ code: null, name: 'General Account', unitcode: 'UN001', kind_of_location: null }, ...response.data];
    return data;
});

export const fetchApiListAccountGroup = createAsyncThunk('master/fetchApiListAccountGroup', async (token) => {
    const header = {
        Authorization: token,
    };
    const response = await DomainPoultry.get(`master/account-group`, { headers: header });
    const data = await response.data;
    return data.Response;
});

export const fetchApiListExpenseGroup = createAsyncThunk('master/fetchApiListExpenseGroup', async (token) => {
    const header = {
        Authorization: token,
    };
    const response = await DomainPoultry.get(`master/expense-group`, { headers: header });
    const data = await response.data;
    return data.Response;
});

export const fetchApiListExpense = createAsyncThunk('master/fetchApiListExpense', async (token, expenseGroupId) => {
    const header = {
        Authorization: token,
    };
    const response = await DomainPoultry.get(`master/expense`, { headers: header });
    const data = await response.data;
    if (expenseGroupId) {
        return _.filter(data.Response, { GroupId: "GE005" });
    }
    return data.Response;
});

export const fetchApiListMethod = createAsyncThunk('master/fetchApiListMethod', async (token) => {
    const header = {
        Authorization: token,
    };
    const response = await DomainPoultry.get(`master/method`, { headers: header });
    const data = await response.data;
    return data.Response;
});

export const fetchApiListSubAccountType = createAsyncThunk('master/fetchApiListSubAccountType', async (token) => {
    const header = {
        Authorization: token,
    };
    const response = await DomainPoultry.get(`master/sub-account-type`, { headers: header });
    const data = await response.data?.Response ?? [];
    return data;
});

export const fetchApiListAccount = createAsyncThunk('master/fetchApiListAccount', async (token) => {
    const header = {
        Authorization: token,
    };
    const body = {
        IncludeUnit: false,
        Units: []
    }
    const response = await DomainPoultry.post(`master/account/unit`, body, { headers: header });
    const data = await response.data?.Response ?? [];
    return data;
});

export const fetchApiListUser = createAsyncThunk('master/fetchApiListUser', async () => {
    let url = `master/user/costing?username=${localStorage.getItem('UserName')}`;
    const response = await DomainApi.get(url);
    return response.data;
});

export const fetchApiProduct = createAsyncThunk('master/fetchApiProduct', async () => {
    let url = `master/product?unitcode=${localStorage.getItem('Unit')}`;
    const response = await DomainApi.get(url);
    const data = response.data.sort((a, b) => parseFloat(a.PRODUCT_NAME) - parseFloat(b.PRODUCT_NAME));
    return data;
});
