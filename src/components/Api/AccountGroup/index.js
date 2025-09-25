import { toast } from 'react-toastify';
import { DomainPoultry } from '~/DomainApi';
import _ from 'lodash';

export async function ApiListAccountGroup(valueSearch, setDataList) {
    try {
        const response = await DomainPoultry.get(`master/account-group`);
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
        toast.error(' Error api get data account group list!');
    }
}

export async function ApiCreateAccountGroup(valueCode, valueName, valueDescription, valueContent) {
    if (valueCode && valueName) {
        try {
            var statusCode = false;
            const header = {
                // Authorization: access_token,
            };
            const body = {
                GroupId: valueCode,
                GroupName: valueName,
                Active: true,
                Username: localStorage.getItem('UserName'),
                CreatedAt: new Date().toISOString(),
                UpdatedAt: new Date().toISOString(),
                Description: valueDescription,
                Content: valueContent
            };

            await DomainPoultry.post(
                `master/account-group`,
                body
            );

            toast.success(' Success create new account group!');
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

export async function ApiUpdateAccountGroup(valueCode, valueName, valueDescription, valueContent) {
    if (valueCode && valueName) {
        try {
            var statusCode = false;
            const body = {
                GroupId: valueCode,
                GroupName: valueName,
                Active: true,
                Username: localStorage.getItem('UserName'),
                CreatedAt: new Date().toISOString(),
                UpdatedAt: new Date().toISOString(),
                Description: valueDescription,
                Content: valueContent
            };
            await DomainPoultry.put(
                `master/account-group/${valueCode}`,
                body
            );
            toast.success(' Success update account group!');
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

export async function ApiDeleteAccountGroup(valueCode) {
    if (valueCode) {
        try {
            var statusCode = false;
            await DomainPoultry.delete(`master/account-group/${valueCode}`);
            toast.success(' Success delete account group!');
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
