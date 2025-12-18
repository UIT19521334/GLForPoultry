import { toast } from 'react-toastify';
import { DomainPoultry } from '~/DomainApi';
import _ from 'lodash';
import { store } from "~/Redux/store";
import { updateDialogError } from '~/Redux/Reducer/FetchApi';

export async function ApiListExpenseByRegion(regionId) {
    try {
        const header = {
            Authorization: store.getState().FetchApi.token,
        };
        const url = regionId ? `master/expense?regionId=${regionId}` : `master/expense`;
        const response = await DomainPoultry.get(url, { headers: header });
        const data = await response.data?.Response ?? [];
        return data;
    } catch (error) {
        store.dispatch(updateDialogError({ open: true, title: 'Error', content: 'Error api get data expense list!' }));
        return [];
    }
}

export async function ApiCreateExpense(valueCode, valueName, valueTypeID, valueTypeName, valueDescription) {
    if (valueName) {
        try {
            var statusCode = false;
            const header = {
                Authorization: store.getState().FetchApi.token,
            };
            const currentRegionId = store.getState().FetchApi.currentUnit.RegionId ?? "";

            const body = {
                GroupName_EN: valueTypeName,
                GroupName_VN: valueTypeName,
                ExpenseId: valueCode,
                ExpenseName: valueName,
                Description: valueDescription,
                Active: true,
                Username: store.getState().FetchApi.userInfo?.userID_old ?? "",
                CreatedAt: new Date().toISOString(),
                UpdatedAt: new Date().toISOString(),
                RegionId: currentRegionId,
                IsShow: false,
                GroupId: valueTypeID,
            };

            await DomainPoultry.post(
                `master/expense`,
                body,
                { headers: header }
            );

            toast.success(' Success create new expense!');
            statusCode = true;
        } catch (error) {
            console.log('>>Error: ', error);
            if (error.response) {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.response.data.ErrorMessage || 'Error api create expense!' }));
            } else {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.message || 'Error api create expense!' }));
            }
            statusCode = false;
        }
        return statusCode;
    }
}

export async function ApiUpdateExpense(valueCode, valueName, valueTypeID, valueTypeName, valueDescription) {
    if (valueCode && valueName) {
        try {
            var statusCode = false;
            const header = {
                Authorization: store.getState().FetchApi.token,
            };
            const currentRegionId = store.getState().FetchApi.currentUnit.RegionId ?? "";
            const body = {
                GroupName_EN: valueTypeName,
                GroupName_VN: valueTypeName,
                ExpenseId: valueCode,
                ExpenseName: valueName,
                Description: valueDescription,
                Active: true,
                Username: store.getState().FetchApi.userInfo?.userID_old ?? "",
                CreatedAt: new Date().toISOString(),
                UpdatedAt: new Date().toISOString(),
                RegionId: currentRegionId,
                IsShow: false,
                GroupId: valueTypeID,
            };
            await DomainPoultry.put(
                `master/expense/${valueCode}`,
                body,
                { headers: header }
            );
            toast.success(' Success update expense!');
            statusCode = true;
        } catch (error) {
            console.log('>>Error: ', error);
            if (error.response) {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.response.data.ErrorMessage || 'Error api update expense!' }));
            } else {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.message || 'Error api update expense!' }));
            }
            statusCode = false;
        }
        return statusCode;
    }
}

export async function ApiDeleteExpense(valueCode) {
    if (valueCode) {
        try {
            var statusCode = false;
            const header = {
                Authorization: store.getState().FetchApi.token,
            };
            await DomainPoultry.delete(`master/expense/${valueCode}`, { headers: header });
            toast.success(' Success delete expense !');
            statusCode = true;
        } catch (error) {
            console.log('>>Error: ', error);
            if (error.response) {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.response.data.ErrorMessage }));
            } else {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.message }));
            }
            statusCode = false;
        }
        return statusCode;
    }
}
