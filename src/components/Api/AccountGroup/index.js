import { toast } from 'react-toastify';
import { DomainPoultry } from '~/DomainApi';
import _ from 'lodash';
import { store } from "~/Redux/store";
import { updateDialogError } from '~/Redux/Reducer/FetchApi';

export async function ApiListAccountGroup(valueSearch, setDataList) {
    try {
        const header = {
            Authorization: store.getState().FetchApi.token,
        };
        const response = await DomainPoultry.get(`master/account-group`, { headers: header });
        const data = await response.data?.Response ?? [];
        let filteredData = data;
        if (valueSearch && valueSearch.trim() !== "") {
            const fieldsToSearch = ["GroupId", "GroupName", "Description", "Content"];
            console.log(valueSearch);

            filteredData = _.filter(data, (item) => {
                const search = _.toLower(valueSearch);
                return _.some(fieldsToSearch, (field) => _.includes(_.toLower(item[field]), search));
            });
        }

        filteredData = _.sortBy(filteredData, (item) => parseFloat(item.GroupId));
        setDataList(filteredData);
    } catch (error) {
        console.log(error);
        store.dispatch(updateDialogError({ open: true, title: 'Error', content: 'Error api get data account group list!' }));
    }
}

export async function ApiCreateAccountGroup(valueCode, valueName, valueDescription, valueContent) {
    if (valueCode && valueName) {
        try {
            var statusCode = false;
            const header = {
                Authorization: store.getState().FetchApi.token,
            };
            const body = {
                GroupId: valueCode,
                GroupName: valueName,
                Active: true,
                Username: store.getState().FetchApi.userInfo?.userID_old ?? "",
                CreatedAt: new Date().toISOString(),
                UpdatedAt: new Date().toISOString(),
                Description: valueDescription,
                Content: valueContent
            };

            await DomainPoultry.post(
                `master/account-group`,
                body,
                { headers: header }
            );

            toast.success(' Success create new account group!');
            statusCode = true;
        } catch (error) {
            console.log('>>Error: ', error);
            if (error.response) {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.response.data.ErrorMessage || 'Error api create account group!' }));
            } else {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.message || 'Error api create account group!' }));
            }
            statusCode = false;
        }
        return statusCode;
    }
}

export async function ApiUpdateAccountGroup(valueCode, valueName, valueDescription, valueContent) {
    if (valueCode && valueName) {
        try {
            var statusCode = false;
            const header = {
                Authorization: store.getState().FetchApi.token,
            };
            const body = {
                GroupId: valueCode,
                GroupName: valueName,
                Active: true,
                Username: store.getState().FetchApi.userInfo?.userID_old ?? "",
                CreatedAt: new Date().toISOString(),
                UpdatedAt: new Date().toISOString(),
                Description: valueDescription,
                Content: valueContent
            };
            await DomainPoultry.put(
                `master/account-group/${valueCode}`,
                body,
                { headers: header }
            );
            toast.success(' Success update account group!');
            statusCode = true;
        } catch (error) {
            if (error.response) {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.response.data.ErrorMessage || 'Error api update account group!' }));
            } else {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.message || 'Error api update account group!' }));
            }
            statusCode = false;
        }
        return statusCode;
    }
}

export async function ApiDeleteAccountGroup(valueCode) {
    if (valueCode) {
        try {
            var statusCode = false;
            const header = {
                Authorization: store.getState().FetchApi.token,
            };
            await DomainPoultry.delete(`master/account-group/${valueCode}`, { headers: header });
            toast.success(' Success delete account group!');
            statusCode = true;
        } catch (error) {
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
