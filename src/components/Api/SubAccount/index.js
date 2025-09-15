import { toast } from 'react-toastify';
import { DomainPoultry } from '~/DomainApi';
import _ from 'lodash';

export async function ApiListSupAccount(valueSearch, setDataList) {
    try {
        const response = await DomainPoultry.get(`master/sub-account`);
        const data = await response.data?.Response ?? [];
        let filteredData = data;
        if (valueSearch && valueSearch.trim() !== "") {
            const fieldsToSearch = ["AccountSubId", "AccountSubName", "SubTypeName", "TypeId", "Description"];
            filteredData = _.filter(data, (item) => {
                const search = _.toLower(valueSearch);
                return _.some(fieldsToSearch, (field) => _.includes(_.toLower(item[field]), search));
            });
        }

        setDataList(filteredData);
    } catch (error) {
        console.log(error);
        toast.error(' Error api get data sub account list!');
    }
}

export async function ApiCreateSupAccount(valueCode, valueName, valueTypeID, valueTypeName, valueDescription) {
    if (valueCode && valueName) {
        try {
            var statusCode = false;
            const header = {
                // Authorization: access_token,
            };
            const body = {
                SubTypeName: valueTypeName,
                AccountSubId: valueCode,
                AccountSubName: valueName,
                Active: true,
                Username: localStorage.getItem('UserName'),
                CreatedAt: new Date().toISOString(),
                UpdatedAt: new Date().toISOString(),
                Description: valueDescription,
                TypeId: valueTypeID
            };

            await DomainPoultry.post(
                `master/sub-account`,
                body
            );

            toast.success(' Success create new sub account!');
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

export async function ApiUpdateSupAccount(valueCode, valueName, valueTypeID, valueTypeName, valueDescription) {
    if (valueCode && valueName) {
        try {
            var statusCode = false;
            const body = {
                SubTypeName: valueTypeName,
                AccountSubId: valueCode,
                AccountSubName: valueName,
                Active: true,
                Username: localStorage.getItem('UserName'),
                CreatedAt: new Date().toISOString(),
                UpdatedAt: new Date().toISOString(),
                Description: valueDescription,
                TypeId: valueTypeID
            };
            await DomainPoultry.put(
                `master/sub-account/${valueCode}`,
                body
            );
            toast.success(' Success update sub account!');
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

export async function ApiDeleteSupAccount(valueCode) {
    if (valueCode) {
        try {
            var statusCode = false;
            await DomainPoultry.delete(`master/sub-account/${valueCode}`);
            toast.success(' Success delete sub account !');
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
