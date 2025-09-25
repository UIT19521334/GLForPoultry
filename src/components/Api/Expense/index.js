import { toast } from 'react-toastify';
import { DomainPoultry } from '~/DomainApi';
import _ from 'lodash';

export async function ApiListExpense(valueSearch, setDataList) {
    try {
        const currentRegionId = localStorage.getItem('Unit')?.RegionId ?? "";

        console.log(currentRegionId)
        console.log(currentRegionId)
        const response = await DomainPoultry.get(`master/expense?regionId=${currentRegionId}`);
        const data = await response.data?.Response ?? [];
        let filteredData = data;
        if (valueSearch && valueSearch.trim() !== "") {
            const fieldsToSearch = ["ExpenseName", "ExpenseId", "GroupId", "GroupName_VN", "Description"];
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

export async function ApiCreateExpense(valueCode, valueName, valueTypeID, valueTypeName, valueDescription) {
    if (valueCode && valueName) {
        try {
            var statusCode = false;
            const header = {
                // Authorization: access_token,
            };

            const body = {
                GroupName_EN: valueTypeName,
                GroupName_VN: valueTypeName,
                ExpenseId: valueCode,
                ExpenseName: valueName,
                Description: valueDescription,
                Active: true,
                Username: localStorage.getItem('UserName'),
                CreatedAt: new Date().toISOString(),
                UpdatedAt: new Date().toISOString(),
                RegionId: null,
                IsShow: false,
                GroupId: valueTypeID,
            };

            await DomainPoultry.post(
                `master/expense`,
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

export async function ApiUpdateExpense(valueCode, valueName, valueTypeID, valueTypeName, valueDescription) {
    if (valueCode && valueName) {
        try {
            var statusCode = false;
            const body = {
                GroupName_EN: valueTypeName,
                GroupName_VN: valueTypeName,
                ExpenseId: valueCode,
                ExpenseName: valueName,
                Description: valueDescription,
                Active: true,
                Username: localStorage.getItem('UserName'),
                CreatedAt: new Date().toISOString(),
                UpdatedAt: new Date().toISOString(),
                RegionId: null,
                IsShow: false,
                GroupId: valueTypeID,
            };
            await DomainPoultry.put(
                `master/expense/${valueCode}`,
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

export async function ApiDeleteExpense(valueCode) {
    if (valueCode) {
        try {
            var statusCode = false;
            await DomainPoultry.delete(`master/expense/${valueCode}`);
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
