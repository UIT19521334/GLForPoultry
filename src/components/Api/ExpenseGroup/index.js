import { toast } from 'react-toastify';
import { DomainPoultry } from '~/DomainApi';
import _ from 'lodash';
import { store } from "~/Redux/store";
import { updateDialogError } from '~/Redux/Reducer/FetchApi';

export async function ApiListExpenseGroup(currentRegionId) {
    try {
        const header = {
            Authorization: store.getState().FetchApi.token,
        };
        const url = currentRegionId ? `master/expense-group?regionid=${currentRegionId}` : `master/expense-group`;
        const response = await DomainPoultry.get(url, { headers: header });
        const data = await response.data?.Response ?? [];
        // let filteredData = data;
        // if (valueSearch && valueSearch.trim() !== "") {
        //     const fieldsToSearch = ["GroupId", "GroupName_EN"];
        //     filteredData = _.filter(data, (item) => {
        //         const search = _.toLower(valueSearch);
        //         return _.some(fieldsToSearch, (field) => _.includes(_.toLower(item[field]), search));
        //     });
        // }
        return data;
    } catch (error) {
        store.dispatch(updateDialogError({ open: true, title: 'Error', content: `Error api get data expense group: ${error}` }));
        return []
    }
}

export async function ApiCreateExpenseGroup(valueCode, valueName, valueDescription, currentRegionId) {
    if (valueName) {
        try {
            var statusCode = false;
            const header = {
                Authorization: store.getState().FetchApi.token,
            };
            const body = {
                GroupId: valueCode,
                GroupName_EN: valueName,
                GroupName_VN: valueName,
                Active: true,
                Username: store.getState().FetchApi.userInfo?.userID_old ?? "",
                CreatedAt: new Date().toISOString(),
                UpdatedAt: new Date().toISOString(),
                Description: valueDescription,
                RegionId: currentRegionId
            };

            await DomainPoultry.post(
                `master/expense-group`,
                body,
                { headers: header }
            );

            toast.success(' Success create new expense!');
            statusCode = true;
        } catch (error) {
            if (error.response) {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: `Error api create new expense group:\n ${error.response.data.ErrorMessage}` }));
            } else {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: `Error api create new expense group:\n ${error.message}` }));
            }
            statusCode = false;
        }
        return statusCode;
    }
}

export async function ApiUpdateExpenseGroup(valueCode, valueName, valueDescription) {
    if (valueCode && valueName) {
        try {
            var statusCode = false;
            const header = {
                Authorization: store.getState().FetchApi.token,
            };
            const body = {
                GroupId: valueCode,
                GroupName_EN: valueName,
                GroupName_VN: valueName,
                Active: true,
                Username: store.getState().FetchApi.userInfo?.userID_old ?? "",
                CreatedAt: new Date().toISOString(),
                UpdatedAt: new Date().toISOString(),
                Description: valueDescription,
            };
            await DomainPoultry.put(
                `master/expense-group/${valueCode}`,
                body,
                { headers: header }
            );
            toast.success(' Success update expense!');
            statusCode = true;
        } catch (error) {
            if (error.response) {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: `Error api update expense group:\n ${error.response.data.ErrorMessage}` }));
            } else {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: `Error api update expense group:\n ${error.message}` }));
            }
            statusCode = false;
        }
        return statusCode;
    }
}

export async function ApiDeleteExpenseGroup(valueCode) {
    if (valueCode) {
        try {
            var statusCode = false;
            const header = {
                Authorization: store.getState().FetchApi.token,
            };
            await DomainPoultry.delete(`master/expense-group/${valueCode}`, { headers: header });
            toast.success(' Success delete expense !');
            statusCode = true;
        } catch (error) {
            if (error.response) {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: `Error api delete expense group:\n ${error.response.data.ErrorMessage}` }));
            } else {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: `Error api delete expense group:\n ${error.message}` }));
            }
            statusCode = false;
        }
        return statusCode;
    }
}
