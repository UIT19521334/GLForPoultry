import dayjs from 'dayjs';
import { headers } from 'next/headers';
import { toast } from 'react-toastify';
import DomainApi from '~/DomainApi';
import apiClient from '~/DomainApi/apiClient';

export async function ApiCalCOGM({ access_token, PERIOD_MONTH, PERIOD_YEAR }) {
    try {
        var dateMonth = `${PERIOD_MONTH}`;
        if (PERIOD_MONTH !== 10 && PERIOD_MONTH !== 11 && PERIOD_MONTH !== 12) {
            dateMonth = `0${PERIOD_MONTH}`;
        }
        var statusCode = false;
        const header = {
            Authorization: access_token,
        };
        let url = `process/unitcode/${localStorage.getItem('Unit')}/COGM/cal?username=${localStorage.getItem(
            'UserName',
        )}&acc_period_month=${dateMonth}&acc_period_year=${PERIOD_YEAR}`;
        const response = await DomainApi.post(url, null, { headers: header });

        statusCode = true;
    } catch (error) {
        console.log(error);
        if (error.response) {
            toast.error(error.response.data);
        } else {
            toast.error(error.message);
        }
        statusCode = false;
    }
    return statusCode;
}

export async function ApiCalCostTransfer({ access_token, PERIOD_MONTH, PERIOD_YEAR }) {
    try {
        var dateMonth = `${PERIOD_MONTH}`;
        if (PERIOD_MONTH !== 10 && PERIOD_MONTH !== 11 && PERIOD_MONTH !== 12) {
            dateMonth = `0${PERIOD_MONTH}`;
        }
        var statusCode = false;
        const header = {
            Authorization: access_token,
        };
        let url = `process/unitcode/${localStorage.getItem('Unit')}/cost-tranfer/cal?username=${localStorage.getItem(
            'UserName',
        )}&acc_period_month=${dateMonth}&acc_period_year=${PERIOD_YEAR}`;
        const response = await DomainApi.post(url, null, { headers: header });

        statusCode = true;
    } catch (error) {
        console.log(error);
        if (error.response) {
            toast.error(error.response.data);
        } else {
            toast.error(error.message);
        }
        statusCode = false;
    }
    return statusCode;
}

export async function ApiLoadDataReport({ valueCostCenter, PERIOD_MONTH, PERIOD_YEAR, setDataReport }) {
    try {
        var dateMonth = `${PERIOD_MONTH}`;
        if (PERIOD_MONTH !== 10 && PERIOD_MONTH !== 11 && PERIOD_MONTH !== 12) {
            dateMonth = `0${PERIOD_MONTH}`;
        }
        var status_code = false;
        let url = `report/unitcode/${localStorage.getItem(
            'Unit',
        )}/expense/spread-period?username=${localStorage.getItem(
            'UserName',
        )}&cost_center=${valueCostCenter}&acc_period_month=${dateMonth}&acc_period_year=${PERIOD_YEAR}`;

        const response = await DomainApi.get(url);
        // const test = response.data.reduce((acc, x) => acc + x.amount_period_N_1, 0);
        setDataReport(response.data.sort((a, b) => a.trans_id - b.trans_id));
        status_code = true;
    } catch (error) {
        console.log(error);
    }
    return status_code;
}

/**
 * gọi api transer lost
 */
export async function ApiTransferLost({ unitcode, username, acc_period_month, acc_period_year }) {
    try {
        const response = await apiClient.post(
            `/process/unitcode/${unitcode}/transfer-profit-loss`,
            {},
            {
                params: {
                    username,
                    acc_period_month,
                    acc_period_year,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        return null;
    }
}
