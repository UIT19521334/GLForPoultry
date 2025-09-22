import { toast } from 'react-toastify';
import { DomainPoultry } from '~/DomainApi';
import _ from 'lodash';

export async function ApiListExpenseGroup(valueSearch, setDataList) {
    try {
        const response = await DomainPoultry.get(`master/expense-group`);
        const data = await response.data?.Response ?? [];
        let filteredData = data;
        if (valueSearch && valueSearch.trim() !== "") {
            const fieldsToSearch = ["GroupId", "GroupName_EN", "Description"];
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

export async function ApiCreateExpenseGroup(valueCode, valueName, valueDescription) {
    if (valueCode && valueName) {
        try {
            var statusCode = false;
            const header = {
                // Authorization: access_token,
            };
            const body = {
                GroupId: valueCode,
                GroupName_EN: valueName,
                GroupName_VN: valueName,
                Active: true,
                Username: localStorage.getItem('UserName'),
                CreatedAt: new Date().toISOString(),
                UpdatedAt: new Date().toISOString(),
                Description: valueDescription,
            };

            await DomainPoultry.post(
                `master/expense-group`,
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

export async function ApiUpdateExpenseGroup(valueCode, valueName, valueDescription) {
    if (valueCode && valueName) {
        try {
            var statusCode = false;
            const body = {
                GroupId: valueCode,
                GroupName_EN: valueName,
                GroupName_VN: valueName,
                Active: true,
                Username: localStorage.getItem('UserName'),
                CreatedAt: new Date().toISOString(),
                UpdatedAt: new Date().toISOString(),
                Description: valueDescription,
            };
            await DomainPoultry.put(
                `master/expense-group/${valueCode}`,
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

export async function ApiDeleteExpenseGroup(valueCode) {
    if (valueCode) {
        try {
            var statusCode = false;
            await DomainPoultry.delete(`master/expense-group/${valueCode}`);
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
