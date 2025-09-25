import { toast } from 'react-toastify';
import { DomainPoultry } from '~/DomainApi';
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
        toast.error(' Error api get data expense list!');
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
        toast.error(' Error api get data expense list!');
        return []
    }
}

export async function ApiCreateAccount(params) {
    if (params.AccountId && params.AccountName) {
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
                toast.error(error.response.data.ErrorMessage);
            } else {
                toast.error(error.message);
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
            console.log('>>Error: ', error);
            if (error.response) {
                toast.error(error.response.data.ErrorMessage);
            } else {
                toast.error(error.message);
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
            console.log('>>Error: ', error);
            if (error.response) {
                toast.error(error.response.data.ErrorMessage);
            } else {
                toast.error(error.message);
            }
            statusCode = false;
        }
        return statusCode;
    }
}
