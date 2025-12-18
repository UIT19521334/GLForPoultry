import { toast } from 'react-toastify';
import { DomainPoultry } from '~/DomainApi';
import { updateDialogError } from '~/Redux/Reducer/FetchApi';
import { store } from "~/Redux/store";

export async function ApiCreateSubAccountType(valueCode, valueName, valueDescription) {
    if (valueCode && valueName) {
        try {
            var statusCode = false;
            const header = {
                Authorization: store.getState().FetchApi.token,
            };
            const body = {
                SubTypeId: valueCode,
                SubTypeName: valueName,
                Active: true,
                Username: localStorage.getItem('UserName'),
                CreatedAt: new Date().toISOString(),
                UpdatedAt: new Date().toISOString(),
                Description: valueDescription
            };

            await DomainPoultry.post(
                `master/sub-account-type`,
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

export async function ApiUpdateSubAccountType(valueCode, valueName, valueDescription) {
    if (valueCode && valueName) {
        try {
            var statusCode = false;
            const header = {
                Authorization: store.getState().FetchApi.token,
            };
            const body = {
                SubTypeId: valueCode,
                SubTypeName: valueName,
                Active: true,
                Username: localStorage.getItem('UserName'),
                CreatedAt: new Date().toISOString(),
                UpdatedAt: new Date().toISOString(),
                Description: valueDescription
            };
            await DomainPoultry.put(
                `master/sub-account-type/${valueCode}`,
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

export async function ApiDeleteSubAccountType(valueCode) {
    if (valueCode) {
        try {
            var statusCode = false;
            const header = {
                Authorization: store.getState().FetchApi.token,
            };
            await DomainPoultry.delete(`master/sub-account-type/${valueCode}`, { headers: header });
            toast.success(' Success delete sub account !');
            statusCode = true;
        } catch (error) {
            console.log('>>Error: ', error);
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
