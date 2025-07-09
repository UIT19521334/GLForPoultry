import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import DomainApi from '~/DomainApi';
import {
    fetchApiChannel,
    fetchApiCurrency,
    fetchPeriod,
    fetchApiToken,
    fetchApiCostCenter,
    fetchApiListAccountGroup,
    fetchApiListAccount,
    fetchApiListUser,
    fetchApiProduct,
} from '../FetchApi/fetchApiMaster';
import { toast } from 'react-toastify';

const initialState = {
    listData_Channel: [],
    listData_Currency: [],
    listData_Period: [],
    listData_CostCenter: [],
    listData_AccountGroup: [],
    listData_Account: [],
    listData_User: [],
    token: '',
    isLoading: false,
    isError: false,
    listData_Product: [],
};

export const period = createSlice({
    name: 'period',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder
            /* #region  period */
            .addCase(fetchApiChannel.pending, (state, action) => {
                // Add user to the state array
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchApiChannel.fulfilled, (state, action) => {
                // Add user to the state array
                state.listData_Channel = action.payload;
                state.isLoading = false;
                state.isError = false;
            })
            .addCase(fetchApiChannel.rejected, (state, action) => {
                // Add user to the state array
                state.isLoading = false;
                state.isError = true;
                toast.error(' Error api currency!');
            })
            /* #endregion */
            /* #region  period */
            .addCase(fetchApiCurrency.pending, (state, action) => {
                // Add user to the state array
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchApiCurrency.fulfilled, (state, action) => {
                // Add user to the state array
                state.listData_Currency = action.payload;
                state.isLoading = false;
                state.isError = false;
            })
            .addCase(fetchApiCurrency.rejected, (state, action) => {
                // Add user to the state array
                state.isLoading = false;
                state.isError = true;
                toast.error(' Error api currency!');
            })
            /* #endregion */

            /* #region  period */
            .addCase(fetchPeriod.pending, (state, action) => {
                // Add user to the state array
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchPeriod.fulfilled, (state, action) => {
                // Add user to the state array
                state.listData_Period = action.payload;
                state.isLoading = false;
                state.isError = false;
            })
            .addCase(fetchPeriod.rejected, (state, action) => {
                // Add user to the state array
                state.isLoading = false;
                state.isError = true;
                toast.error(' Error api period!');
            })
            /* #endregion */

            /* #region  access_token */
            .addCase(fetchApiToken.pending, (state, action) => {
                // Add user to the state array
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchApiToken.fulfilled, (state, action) => {
                // Add user to the state array
                state.token = action.payload;
                state.isLoading = false;
                state.isError = false;
            })
            .addCase(fetchApiToken.rejected, (state, action) => {
                // Add user to the state array
                state.isLoading = false;
                state.isError = true;
                toast.error(' Error api get token!');
            })
            /* #endregion */

            /* #region  cost center */
            .addCase(fetchApiCostCenter.pending, (state, action) => {
                // Add user to the state array
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchApiCostCenter.fulfilled, (state, action) => {
                // Add user to the state array
                state.listData_CostCenter = action.payload;
                state.isLoading = false;
                state.isError = false;
            })
            .addCase(fetchApiCostCenter.rejected, (state, action) => {
                // Add user to the state array
                state.isLoading = false;
                state.isError = true;
                toast.error(' Error api cost center!');
            })
            /* #endregion */

            /* #region  account group */
            .addCase(fetchApiListAccountGroup.pending, (state, action) => {
                // Add user to the state array
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchApiListAccountGroup.fulfilled, (state, action) => {
                // Add user to the state array
                state.listData_AccountGroup = action.payload;
                state.isLoading = false;
                state.isError = false;
            })
            .addCase(fetchApiListAccountGroup.rejected, (state, action) => {
                // Add user to the state array
                state.isLoading = false;
                state.isError = true;
                toast.error(' Error api account group!');
            })
            /* #endregion */

            /* #region  account  */
            .addCase(fetchApiListAccount.pending, (state, action) => {
                // Add user to the state array
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchApiListAccount.fulfilled, (state, action) => {
                // Add user to the state array
                state.listData_Account = action.payload;
                state.isLoading = false;
                state.isError = false;
            })
            .addCase(fetchApiListAccount.rejected, (state, action) => {
                // Add user to the state array
                state.isLoading = false;
                state.isError = true;
                toast.error(' Error api account!');
            })
            /* #endregion */

            /* #region  User  */
            .addCase(fetchApiListUser.pending, (state, action) => {
                // Add user to the state array
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchApiListUser.fulfilled, (state, action) => {
                // Add user to the state array
                state.listData_User = action.payload;
                state.isLoading = false;
                state.isError = false;
            })
            .addCase(fetchApiListUser.rejected, (state, action) => {
                // Add user to the state array
                state.isLoading = false;
                state.isError = true;
                toast.error(' Error api user!');
            })
            /* #endregion */

            /* #region  Product  */
            .addCase(fetchApiProduct.pending, (state, action) => {
                // Add Product to the state array
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchApiProduct.fulfilled, (state, action) => {
                // Add Product to the state array
                state.listData_Product = action.payload;
                state.isLoading = false;
                state.isError = false;
            })
            .addCase(fetchApiProduct.rejected, (state, action) => {
                // Add Product to the state array
                state.isLoading = false;
                state.isError = true;
                toast.error(' Error api product!');
            });
        /* #endregion */
    },
});

export default period.reducer;
