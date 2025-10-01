import dayjs from 'dayjs';
import { headers } from 'next/headers';
import { toast } from 'react-toastify';
import DomainApi from '~/DomainApi';

export async function ApiCostAllocationListHeader(valueStatus, setDataListCostAllocationHeader) {
    try {
        let url = `journal/cost-allocation/unitcode/${localStorage.getItem('Unit')}?username=${localStorage.getItem(
            'UserName',
        )}`;
        if (valueStatus) {
            url += `&status=${valueStatus}`;
        }
        const response = await DomainApi.get(url);
        // const dataTotal = [{ doc_code: 'TOTAL', total_cost: getTotals(response.data, 'total_cost') }, ...response.data];
        setDataListCostAllocationHeader(response.data.sort((a, b) => a.doc_code.localeCompare(b.doc_code)));
    } catch (error) {
        console.log(error);
        if (error.response) {
            toast.error(' Error api get data CostAllocation list! \n' + error.response.data.ErrorMessage);
        } else {
            toast.error(' Error api get data CostAllocation list! \n' + error.message);
        }
    }
}

export async function ApiCreateCostAllocationHeader(
    access_token,
    valueDocsDate,
    valueDescription,
    valueCurrency,
    valueChannel,
    valueAccountGroup,
    valueDebitEntry,
    valueCreditEntry,
    valueCostCenter,
    valueUser,
    modelDetail,
) {
    if (access_token && valueUser && valueDescription) {
        try {
            var statusCode = false;
            const header = {
                Authorization: access_token,
            };
            const model = {
                doc_date: dayjs(valueDocsDate).utc(true),
                description: valueDescription,
                currency: valueCurrency,
                acc_group: valueAccountGroup,
                debit_entry: valueDebitEntry,
                credit_entry: valueCreditEntry,
                cost_center: valueCostCenter,
                channel_code: valueChannel,
                detail: modelDetail.filter((data) => data.is_delete_item !== true),
            };
            let url = `journal/cost-allocation/unitcode/${localStorage.getItem('Unit')}/new?username=${valueUser}`;
            const response = await DomainApi.post(url, model, { headers: header });
            // setDataAEListHeader(response.data);
            toast.success(' Success create new cost allocation!');
            statusCode = true;
        } catch (error) {
            console.log(error);
            if (error.response) {
                toast.error(' Error api create cost allocation! \n' + error.response.data.ErrorMessage);
            } else {
                toast.error(' Error api create cost allocation! \n' + error.message);
            }
            statusCode = false;
        }
        return statusCode;
    }
}

export async function ApiUpdateCostAllocationHeader(
    access_token,
    valueDocDate,
    valueAllocationCode,
    valueDescription,
    valueCurrency,
    valueChannel,
    valueAccountGroup,
    valueDebitEntry,
    valueCreditEntry,
    valueCostCenter,
    valueUser,
    modelDetail,
) {
    if (access_token && valueUser && valueDescription) {
        try {
            var statusCode = false;
            const header = {
                Authorization: access_token,
            };
            const model = {
                doc_date: dayjs(valueDocDate).utc(true),
                description: valueDescription,
                currency: valueCurrency,
                acc_group: valueAccountGroup,
                debit_entry: valueDebitEntry,
                credit_entry: valueCreditEntry,
                cost_center: valueCostCenter,
                channel_code: valueChannel,
                details: modelDetail,
            };

            let url = `journal/cost-allocation/unitcode/${localStorage.getItem(
                'Unit',
            )}/docno/${valueAllocationCode}/update?username=${valueUser}`;
            const response = await DomainApi.put(url, model, { headers: header });
            // setDataAEListHeader(response.data);
            toast.success(' Success update cost allocation!');
            statusCode = true;
        } catch (error) {
            console.log(error);
            if (error.response) {
                toast.error(' Error api update cost allocation! \n' + error.response.data.ErrorMessage);
            } else {
                toast.error(' Error api update cost allocation! \n' + error.message);
            }
            statusCode = false;
        }
        return statusCode;
    }
}

export async function ApiCostAllocationListDetail(valueDocCode, setDataListCostAllocationDetail) {
    try {
        let url = `journal/cost-allocation/unitcode/${localStorage.getItem(
            'Unit',
        )}/docno/${valueDocCode}/detail?username=${localStorage.getItem('UserName')}`;
        const response = await DomainApi.get(url);
        const data = response.data
            .sort((a, b) => dayjs(a.doc_date) - dayjs(b.doc_date))
            .map((data, index) => {
                return {
                    id: index + 1,
                    detail_ids: data.detail_ids,
                    unitcode: data.unitcode,
                    doc_date: data.doc_date,
                    description: data.description,
                    amount: data.amount,
                    status: data.status,
                    status_display: data.status_display,
                    updated_user: data.updated_user,
                    updated_date: data.updated_date,
                    entry_doc_code: data.entry_doc_code,
                };
            });
        setDataListCostAllocationDetail(data);
    } catch (error) {
        console.log(error);
        if (error.response) {
            toast.error(' Error api get data CostAllocation list! \n' + error.response.data.ErrorMessage);
        } else {
            toast.error(' Error api get data CostAllocation list! \n' + error.message);
        }
    }
}

export async function ApiProcessCostAllocation(access_token, valueDocCode) {
    if (valueDocCode) {
        try {
            var statusCode = false;
            const header = {
                Authorization: access_token,
            };
            let url = `journal/cost-allocation/unitcode/${localStorage.getItem(
                'Unit',
            )}/docno/${valueDocCode}/run?username=${localStorage.getItem('UserName')}`;
            const response = await DomainApi.put(url, null, { headers: header });
            toast.success(' Success process!');
            statusCode = true;
        } catch (error) {
            console.log(error);
            if (error.response) {
                toast.error(' Error api process! \n' + error.response.data.ErrorMessage);
            } else {
                toast.error(' Error api process! \n' + error.message);
            }
            statusCode = false;
        }
        return statusCode;
    }
}

export async function ApiPauseCostAllocation(access_token, valueDocCode) {
    if (valueDocCode) {
        try {
            var statusCode = false;
            const header = {
                Authorization: access_token,
            };
            let url = `journal/cost-allocation/unitcode/${localStorage.getItem(
                'Unit',
            )}/docno/${valueDocCode}/pause?username=${localStorage.getItem('UserName')}`;
            const response = await DomainApi.put(url, null, { headers: header });
            toast.success(' Success pause!');
            statusCode = true;
        } catch (error) {
            console.log(error);
            if (error.response) {
                toast.error(' Error api pause! \n' + error.response.data.ErrorMessage);
            } else {
                toast.error(' Error api pause! \n' + error.message);
            }
            statusCode = false;
        }
        return statusCode;
    }
}
