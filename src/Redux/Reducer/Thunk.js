import { createSlice } from '@reduxjs/toolkit';
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
    fetchApiProduct,
    fetchApiAuthInfo,
    fetchApiListExpenseGroup,
    fetchApiListExpense,
    fetchApiListMethod,
} from '../FetchApi/fetchApiMaster';
import { toast } from 'react-toastify';

const initialState = {
    listData_Channel: [
        { code: "CHL0001", channel_name: "Traditional Trade(TT)", isactive: true },
        { code: "CHL0002", channel_name: "Modern Trade(MT)", isactive: true },
        { code: "CHL0003", channel_name: "Food Services(FS)", isactive: true },
        { code: "CHL0004", channel_name: "Meat Shop", isactive: true },
        { code: "CHL0005", channel_name: "General", isactive: true }
    ],
    listData_Currency: [{ code: "VND", name: "VND", description: null }],
    listData_Period: [{
        acc_date: "2025-08-01T00:00:00",
        acc_period_month: "08",
        acc_period_year: "2025",
        last_period_month: "08",
        last_period_year: "2025",
        next_period_month: "09",
        next_period_year: "2025",
        unitcode: "UN001"
    }],
    listData_CostCenter: [],
    listData_AccountGroup: [],
    listData_SubAccountType: [],
    listData_Account: [],
    listData_User: [],
    userAccess: { //Poultry Account
        menus: [],
        units: []
    },
    token: '',
    isLoading: false,
    isError: false,
    listData_Product: [],
    listData_ExpenseGroup: [],
    listData_Expense: [],
    listData_Method: [],
    userInfo: {}, // Master App
    menu: [], // Master App
    currentUnit: [],
};

export const period = createSlice({
    name: 'period',
    initialState: initialState,
    reducers: {
        updateToken: (state, action) => {
            state.token = `Bearer ${action.payload}`;
        },
        updateUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
        updateUserMenuFromMasterApp: (state, action) => {
            state.menu = action.payload;
        },
        updateCurrentUnit: (state, action) => {
            state.currentUnit = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder
            /* #region  period */
            .addCase(fetchApiChannel.pending, (state) => {
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
            .addCase(fetchApiChannel.rejected, (state) => {
                // Add user to the state array
                state.isLoading = false;
                state.isError = true;
                toast.error(' Error api currency!');
            })
            /* #endregion */
            /* #region  period */
            .addCase(fetchApiCurrency.pending, (state) => {
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
            .addCase(fetchApiCurrency.rejected, (state) => {
                // Add user to the state array
                state.isLoading = false;
                state.isError = true;
                toast.error(' Error api currency!');
            })
            /* #endregion */

            /* #region  period */
            .addCase(fetchPeriod.pending, (state) => {
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
            .addCase(fetchPeriod.rejected, (state) => {
                // Add user to the state array
                state.isLoading = false;
                state.isError = true;
                toast.error(' Error api period!');
            })
            /* #endregion */

            /* #region  access_token */
            .addCase(fetchApiToken.pending, (state) => {
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
            .addCase(fetchApiToken.rejected, (state) => {
                // Add user to the state array
                state.isLoading = false;
                state.isError = true;
                toast.error(' Error api get token!');
            })
            /* #endregion */

            /* #region  auth_info */
            .addCase(fetchApiAuthInfo.pending, (state) => {
                // Add user to the state array
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchApiAuthInfo.fulfilled, (state, action) => {
                // Add current unit
                const listUnit = action.payload.units;
                const data = localStorage.getItem('Unit')
                const prevUnit = JSON.parse(data);
                const exists = listUnit.some(unit => unit.UnitId === prevUnit?.UnitId);
                if (exists) {
                    state.currentUnit = prevUnit
                } else {
                    state.currentUnit = listUnit[0]
                    localStorage.setItem('Unit', JSON.stringify(listUnit[0]));
                }
                // Add user to the state array
                state.userAccess = action.payload;
                state.isLoading = false;
                state.isError = false;
            })
            .addCase(fetchApiAuthInfo.rejected, (state) => {
                // Add user to the state array
                state.isLoading = false;
                state.isError = true;
                toast.error(' Error api get token!');
            })
            /* #endregion */

            /* #region  cost center */
            .addCase(fetchApiCostCenter.pending, (state) => {
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
            .addCase(fetchApiCostCenter.rejected, (state) => {
                // Add user to the state array
                state.isLoading = false;
                state.isError = true;
                toast.error(' Error api cost center!');
            })
            /* #endregion */

            /* #region  account group */
            .addCase(fetchApiListAccountGroup.pending, (state) => {
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
            .addCase(fetchApiListAccountGroup.rejected, (state) => {
                // Add user to the state array
                state.isLoading = false;
                state.isError = true;
                toast.error(' Error api account group!');
            })
            /* #endregion */

            /* #region  expense group */
            .addCase(fetchApiListExpenseGroup.pending, (state) => {
                // Add user to the state array
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchApiListExpenseGroup.fulfilled, (state, action) => {
                // Add user to the state array
                state.listData_ExpenseGroup = action.payload;
                state.isLoading = false;
                state.isError = false;
            })
            .addCase(fetchApiListExpenseGroup.rejected, (state) => {
                // Add user to the state array
                state.isLoading = false;
                state.isError = true;
                toast.error(' Error api account group!');
            })
            /* #endregion */

            /* #region  expense */
            .addCase(fetchApiListExpense.pending, (state) => {
                // Add user to the state array
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchApiListExpense.fulfilled, (state, action) => {
                // Add user to the state array
                state.listData_Expense = action.payload;
                state.isLoading = false;
                state.isError = false;
            })
            .addCase(fetchApiListExpense.rejected, (state) => {
                // Add user to the state array
                state.isLoading = false;
                state.isError = true;
                toast.error(' Error api account group!');
            })
            /* #endregion */

            /* #region  expense */
            .addCase(fetchApiListMethod.pending, (state) => {
                // Add user to the state array
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchApiListMethod.fulfilled, (state, action) => {
                // Add user to the state array
                state.listData_Method = action.payload;
                state.isLoading = false;
                state.isError = false;
            })
            .addCase(fetchApiListMethod.rejected, (state) => {
                // Add user to the state array
                state.isLoading = false;
                state.isError = true;
                toast.error(' Error api account group!');
            })
            /* #endregion */

            /* #region  account  */
            .addCase(fetchApiListSubAccountType.pending, (state) => {
                // Add user to the state array
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchApiListSubAccountType.fulfilled, (state, action) => {
                // Add user to the state array
                state.listData_SubAccountType = action.payload;
                state.isLoading = false;
                state.isError = false;
            })
            .addCase(fetchApiListSubAccountType.rejected, (state) => {
                // Add user to the state array
                state.isLoading = false;
                state.isError = true;
                toast.error(' Error api account!');
            })
            /* #endregion */

            /* #region  account  */
            .addCase(fetchApiListAccount.pending, (state) => {
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
            .addCase(fetchApiListAccount.rejected, (state) => {
                // Add user to the state array
                state.isLoading = false;
                state.isError = true;
                toast.error(' Error api account!');
            })
            /* #endregion */

            /* #region  User  */
            .addCase(fetchApiListUser.pending, (state) => {
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
            .addCase(fetchApiListUser.rejected, (state) => {
                // Add user to the state array
                state.isLoading = false;
                state.isError = true;
                toast.error(' Error api user!');
            })
            /* #endregion */

            /* #region  Product  */
            .addCase(fetchApiProduct.pending, (state) => {
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
            .addCase(fetchApiProduct.rejected, (state) => {
                // Add Product to the state array
                state.isLoading = false;
                state.isError = true;
                toast.error(' Error api product!');
            });
        /* #endregion */
    },
});

export const { updateToken, updateUserInfo, updateUserMenuFromMasterApp, updateCurrentUnit } = period.actions;

export default period.reducer;
