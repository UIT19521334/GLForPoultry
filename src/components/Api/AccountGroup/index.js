import React from 'react';
import { toast } from 'react-toastify';
import DomainApi from '~/DomainApi';

export async function ApiListAccountGroup(valueSearch, setDataList) {
    try {
        let url = `master/group-account/search?username=${localStorage.getItem('UserName')}`;
        if (valueSearch) {
            url += `&searchtxt=${valueSearch}`;
        }
        const response = await DomainApi.get(url);
        setDataList(response.data.sort((a, b) => parseFloat(a.gr_acc_code) - parseFloat(b.gr_acc_code)));
    } catch (error) {
        console.log(error);
        toast.error(' Error api get data account group list!');
    }
}

export async function ApiCreateAccountGroup(access_token, valueCode, valueName, valueDescription) {
    if (valueCode && valueName) {
        try {
            var statusCode = false;
            const header = {
                Authorization: access_token,
            };
            const model = {
                gr_acc_code: valueCode,
                gr_acc_name: valueName,
                description: valueDescription,
            };
            const response = await DomainApi.post(
                `master/group-account/new?username=${localStorage.getItem('UserName')}&unitcode=${localStorage.getItem(
                    'Unit',
                )}`,
                model,
                { headers: header },
            );
            toast.success(' Success create new account group!');
            statusCode = true;
        } catch (error) {
            console.log('>>Error: ', error);
            if (error.response) {
                toast.error(error.response.data);
            } else {
                toast.error(error.message);
            }
            statusCode = false;
        }
        return statusCode;
    }
}

export async function ApiUpdateAccountGroup(access_token, valueCode, valueName, valueDescription) {
    if (valueCode && valueName) {
        try {
            var statusCode = false;
            const header = {
                Authorization: access_token,
            };
            const model = {
                gr_acc_code: valueCode,
                gr_acc_name: valueName,
                description: valueDescription,
            };
            const response = await DomainApi.put(
                `master/group-account/update?username=${localStorage.getItem(
                    'UserName',
                )}&unitcode=${localStorage.getItem('Unit')}`,
                model,
                { headers: header },
            );
            toast.success(' Success update account group!');
            statusCode = true;
        } catch (error) {
            console.log('>>Error: ', error);
            if (error.response) {
                toast.error(error.response.data);
            } else {
                toast.error(error.message);
            }
            statusCode = false;
        }
        return statusCode;
    }
}
