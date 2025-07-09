import { toast } from 'react-toastify';
import DomainApi from '~/DomainApi';

export async function ApiAccountList(valueSearch, setDataList) {
    try {
        let url = `master/chart-of-account/unit/${localStorage.getItem('Unit')}/list`;
        if (valueSearch) {
            url += `?acc_code=${valueSearch}`;
        }
        const response = await DomainApi.get(url);
        setDataList(response.data);
    } catch (error) {
        console.log(error);
        toast.error(' Error api get data account list!');
    }
}

export async function ApiCreateAccount(
    access_token,
    valueCodeMain,
    valueCodeSub,
    valueName,
    valueDescription,
    valueGroupCost,
    valueTypeCost,
    valueCostCenter,
) {
    if (valueCodeMain && valueName) {
        try {
            var statusCode = false;
            const header = {
                Authorization: access_token,
            };
            const model = {
                main_acc: valueCodeMain,
                sub_acc: valueCodeSub,
                acc_name: valueName,
                description: valueDescription,
                expense_acc: valueGroupCost,
                expense_type: valueTypeCost,
                sub_unit: '',
                cost_center: valueCostCenter,
            };
            const response = await DomainApi.post(
                `master/chart-of-account/new?username=${localStorage.getItem(
                    'UserName',
                )}&unitcode=${localStorage.getItem('Unit')}`,
                model,
                { headers: header },
            );
            statusCode = true;
            toast.success(' Success create new account!');
        } catch (error) {
            console.log('>>Error: ', error);
            if (error.response) {
                toast.error(error.response.data);
            } else {
                toast.error(error.message);
            }
        }
        return statusCode;
    }
}

export async function ApiUpdateAccount(
    access_token,
    valueId,
    valueCodeMain,
    valueCodeSub,
    valueName,
    valueDescription,
    valueGroupCost,
    valueTypeCost,
    valueCostCenter,
) {
    if (valueCodeMain && valueName) {
        try {
            var statusCode = false;
            const header = {
                Authorization: access_token,
            };
            const model = {
                acc_ids: valueId,
                main_acc: valueCodeMain,
                sub_acc: valueCodeSub,
                acc_name: valueName,
                description: valueDescription,
                expense_acc: valueGroupCost,
                expense_type: valueTypeCost,
                sub_unit: '',
                cost_center: valueCostCenter,
            };
            const response = await DomainApi.put(
                `/master/chart-of-account/update?username=${localStorage.getItem(
                    'UserName',
                )}&unitcode=${localStorage.getItem('Unit')}`,
                model,
                { headers: header },
            );
            toast.success(' Success update account!');
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

export async function ApiImportFileAccount(access_token, valueFile) {
    if (access_token && valueFile.length > 0) {
        try {
            var statusCode = false;
            const header = {
                Authorization: access_token,
                'Content-Type': 'multipart/form-data',
            };
            const fd = new FormData();
            fd.append('file', valueFile[0]);
            let url = `master/chart-of-account/unitcode/${localStorage.getItem(
                'Unit',
            )}/import?username=${localStorage.getItem('UserName')}`;
            const response = await DomainApi.post(url, fd, { headers: header });
            // setDataAEListHeader(response.data);
            toast.success(' Success import file!');
            statusCode = true;
        } catch (error) {
            console.log(error);
            if (error.response) {
                toast.error(error.response.data);
            } else {
                toast.error(error.message);
            }
        }
        return statusCode;
    }
}
