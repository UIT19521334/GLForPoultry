import { toast } from 'react-toastify';
import { DomainPoultry } from '~/DomainApi';
import _ from 'lodash';
import { store } from "~/Redux/store";
import { updateDialogError } from '~/Redux/Reducer/FetchApi';

export async function ApiListSupAccountByType(typeID) {
    try {
        const header = {
            Authorization: store.getState().FetchApi.token,
        };
        const response = await DomainPoultry.get(`master/sub-account-bytype?typeid=${typeID}`, { headers: header });
        const data = await response.data?.Response ?? [];
        return data;
    } catch (error) {
        store.dispatch(updateDialogError({ open: true, title: 'Error', content: `Error api get data sub account: ${error}` }));
        return [];
    }
}

export async function ApiListSupAccount(valueSearch, setDataList) {
    try {
        const header = {
            Authorization: store.getState().FetchApi.token,
        };
        const response = await DomainPoultry.get(`master/sub-account`, { headers: header });
        const data = await response.data?.Response ?? [];
        let filteredData = data;
        if (valueSearch && valueSearch.trim() !== "") {
            const fieldsToSearch = ["AccountSubId", "AccountSubName", "SubTypeName", "TypeId"];
            filteredData = _.filter(data, (item) => {
                const search = _.toLower(valueSearch);
                return _.some(fieldsToSearch, (field) => _.includes(_.toLower(item[field]), search));
            });
        }

        setDataList(filteredData);
    } catch (error) {
        store.dispatch(updateDialogError({ open: true, title: 'Error', content: `Error api get data sub account: ${error}` }));
    }
}

export async function ApiCreateSupAccount(valueCode, valueName, valueTypeID, valueTypeName, valueDescription) {
    if (valueCode && valueName) {
        try {
            var statusCode = false;
            const header = {
                Authorization: store.getState().FetchApi.token,
            };
            const body = {
                SubTypeName: valueTypeName,
                AccountSubId: valueCode,
                AccountSubName: valueName,
                Active: true,
                Username: store.getState().FetchApi.userInfo?.userID_old ?? "",
                CreatedAt: new Date().toISOString(),
                UpdatedAt: new Date().toISOString(),
                Description: valueDescription,
                TypeId: valueTypeID
            };

            await DomainPoultry.post(
                `master/sub-account`,
                body,
                { headers: header }
            );

            toast.success(' Success create new sub account!');
            statusCode = true;
        } catch (error) {
            console.log('>>Error: ', error);
            if (error.response) {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: `Error api create new sub account:\n ${error.response.data.ErrorMessage}` }));
            } else {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: `Error api create new sub account:\n ${error.message}` }));
            }
            statusCode = false;
        }
        return statusCode;
    }
}

export async function ApiUpdateSupAccount(valueCode, valueName, valueTypeID, valueTypeName, valueDescription) {
    if (valueCode && valueName) {
        try {
            var statusCode = false;
            const header = {
                Authorization: store.getState().FetchApi.token,
            };
            const body = {
                SubTypeName: valueTypeName,
                AccountSubId: valueCode,
                AccountSubName: valueName,
                Active: true,
                Username: store.getState().FetchApi.userInfo?.userID_old ?? "",
                CreatedAt: new Date().toISOString(),
                UpdatedAt: new Date().toISOString(),
                Description: valueDescription,
                TypeId: valueTypeID
            };
            await DomainPoultry.put(
                `master/sub-account/${valueCode}`,
                body,
                { headers: header }
            );
            toast.success(' Success update sub account!');
            statusCode = true;
        } catch (error) {
            if (error.response) {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: `Error api update sub account:\n ${error.response.data.ErrorMessage}` }));
            } else {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: `Error api update sub account:\n ${error.message}` }));
            }
            statusCode = false;
        }
        return statusCode;
    }
}

export async function ApiDeleteSupAccount(valueCode) {
    if (valueCode) {
        try {
            var statusCode = false;
            const header = {
                Authorization: store.getState().FetchApi.token,
            };
            await DomainPoultry.delete(`master/sub-account/${valueCode}`, { headers: header });
            toast.success(' Success delete sub account !');
            statusCode = true;
        } catch (error) {
            if (error.response) {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: `Error api delete sub account:\n ${error.response.data.ErrorMessage}` }));
            } else {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: `Error api delete sub account:\n ${error.message}` }));
            }
            statusCode = false;
        }
        return statusCode;
    }
}
