import { toast } from 'react-toastify';
import DomainApi, { DomainPoultry } from '~/DomainApi';
import _ from 'lodash';

export async function ApiListAccountGroup(valueSearch, setDataList) {
    try {
        let url = `master/account`;
        const response = await DomainPoultry.get(url);
        const data = await response.data?.Response ?? [];
        let filteredData = data;
        if (valueSearch && valueSearch.trim() !== "") {
            const fieldsToSearch = ["AccountName", "AccountId", "Description"];
            console.log(valueSearch);

            filteredData = _.filter(data, (item) => {
                const search = _.toLower(valueSearch);
                return _.some(fieldsToSearch, (field) => _.includes(_.toLower(item[field]), search));
            });
        }
        setDataList(filteredData);
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
