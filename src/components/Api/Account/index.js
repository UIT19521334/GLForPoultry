import { toast } from 'react-toastify';
import { DomainPoultry } from '~/DomainApi';
import _ from 'lodash';

export async function ApiListAccount(valueSearch, setDataList) {
    try {
        const response = await DomainPoultry.get(`master/account`);
        const data = await response.data?.Response ?? [];
        let filteredData = data;
        if (valueSearch && valueSearch.trim() !== "") {
            const fieldsToSearch = ["AccountName", "AccountId", "Description"];
            filteredData = _.filter(data, (item) => {
                const search = _.toLower(valueSearch);
                return _.some(fieldsToSearch, (field) => _.includes(_.toLower(item[field]), search));
            });
        }

        setDataList(filteredData);
    } catch (error) {
        console.log(error);
        toast.error(' Error api get data expense list!');
    }
}

export async function ApiCreateAccount(valueCode, valueName, valueTypeID, valueTypeName, valueDescription) {
    if (valueCode && valueName) {
        try {
            var statusCode = false;
            const header = {
                // Authorization: access_token,
            };
            const body = {
                GroupName_EN: valueTypeName,
                GroupName_VN: valueTypeName,
                AccountId: valueCode,
                AccountName: valueName,
                Description: valueDescription,
                Active: true,
                Username: localStorage.getItem('UserName'),
                CreatedAt: new Date().toISOString(),
                UpdatedAt: new Date().toISOString(),
                RegionId: localStorage.getItem('Unit'),
                IsShow: false,
                GroupId: valueTypeID,
            };


            await DomainPoultry.post(
                `master/account`,
                body
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

export async function ApiUpdateAccount(valueCode, valueName, valueTypeID, valueTypeName, valueDescription) {
    if (valueCode && valueName) {
        try {
            var statusCode = false;
            const body = {
                GroupName_EN: valueTypeName,
                GroupName_VN: valueTypeName,
                AccountId: valueCode,
                AccountName: valueName,
                Description: valueDescription,
                Active: true,
                Username: localStorage.getItem('UserName'),
                CreatedAt: new Date().toISOString(),
                UpdatedAt: new Date().toISOString(),
                RegionId: localStorage.getItem('Unit'),
                IsShow: false,
                GroupId: valueTypeID,
            };
            await DomainPoultry.put(
                `master/account/${valueCode}`,
                body
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
