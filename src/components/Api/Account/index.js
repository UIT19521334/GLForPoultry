import { toast } from 'react-toastify';
import { DomainPoultry } from '~/DomainApi';
import { updateDialogError } from '~/Redux/Reducer/Thunk';
import { store } from "~/Redux/store";

export async function ApiListAccount() {
    try {
        const header = {
            Authorization: store.getState().FetchApi.token,
        };
        const response = await DomainPoultry.get(`master/account`, { headers: header });
        const data = await response.data?.Response ?? [];
        return data
    } catch (error) {
        console.log(error);
        store.dispatch(updateDialogError({ open: true, title: 'Error', content: 'Error api get data expense list!' }));
        return []
    }
}

export async function ApiAccountDetail(valueAccountId) {
    try {
        const header = {
            Authorization: store.getState().FetchApi.token,
        };
        const encodedId = encodeURIComponent(valueAccountId);
        const response = await DomainPoultry.get(`master/account/code/${encodedId}`, { headers: header });
        const data = await response.data?.Response ?? [];
        return data
    } catch (error) {
        console.log(error);
        store.dispatch(updateDialogError({ open: true, title: 'Error', content: `Error api get ${valueAccountId}!` }));
        return []
    }
}

export async function ApiListAccountByUnit(body) {
    try {
        const header = {
            Authorization: store.getState().FetchApi.token,
        };
        const response = await DomainPoultry.post(`master/account/unit`, body, { headers: header });
        const data = await response.data?.Response ?? [];
        return data
    } catch (error) {
        console.log(error);
        store.dispatch(updateDialogError({ open: true, title: 'Error', content: 'Error api get data expense list!' }));
        return []
    }
}

export async function ApiCreateAccount(params) {
    if (params?.AccountId && params?.AccountName) {
        try {
            var statusCode = false;
            const header = {
                Authorization: store.getState().FetchApi.token,
            };

            await DomainPoultry.post(
                `master/account`,
                params,
                { headers: header }
            );
            toast.success(' Success create new expense!');
            statusCode = true;
        } catch (error) {
            console.log('>>Error: ', error);
            if (error.response) {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.response.data.ErrorMessage || 'Error api create account!' }));
            } else {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.message || 'Error api create account!' }));
            }
            statusCode = false;
        }
        return statusCode;
    }
}

export async function ApiCreateListAccount(params) {
    if (params[0]?.AccountId && params[0]?.AccountName) {
        try {
            var statusCode = false;
            const header = {
                Authorization: store.getState().FetchApi.token,
            };

            await DomainPoultry.post(
                `master/account/assign`,
                params,
                { headers: header }
            );

            toast.success(' Success create new expense!');
            statusCode = true;
        } catch (error) {
            console.log('>>Error: ', error);
            if (error.response) {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.response.data.ErrorMessage || 'Error api create list account!' }));
            } else {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.message || 'Error api create list account!' }));
            }
            statusCode = false;
        }
        return statusCode;
    }
}

export async function ApiUpdateAccount(params) {
    if (params.AccountId && params.AccountName && params.Id) {
        try {
            var statusCode = false;
            const header = {
                Authorization: store.getState().FetchApi.token,
            };
            await DomainPoultry.put(
                `master/account/${params.Id}`,
                params,
                { headers: header }
            );
            toast.success(' Success update expense!');
            statusCode = true;
        } catch (error) {
            if (error.response) {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.response.data.ErrorMessage || 'Error api update account!' }));
            } else {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.message || 'Error api update account!' }));
            }
            statusCode = false;
        }
        return statusCode;
    }
}

export async function ApiDeleteAccount(valueCode) {
    if (valueCode) {
        try {
            var statusCode = false;
            const header = {
                Authorization: store.getState().FetchApi.token,
            };
            await DomainPoultry.delete(`master/account/${valueCode}`, { headers: header });
            toast.success(' Success delete expense !');
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
