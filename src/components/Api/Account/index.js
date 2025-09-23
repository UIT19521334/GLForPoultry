import { toast } from 'react-toastify';
import { DomainPoultry } from '~/DomainApi';
import _ from 'lodash';

export async function ApiListAccount() {
    try {
        const response = await DomainPoultry.get(`master/account`);
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
                // Authorization: access_token,
            };

            await DomainPoultry.post(
                `master/account`,
                params
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
            await DomainPoultry.put(
                `master/account/${params.Id}`,
                params
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
            await DomainPoultry.delete(`master/account/${valueCode}`);
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
