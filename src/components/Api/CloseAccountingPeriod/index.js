import { toast } from 'react-toastify';
import DomainApi, { DomainPoultry } from '~/DomainApi';
import apiClient from '~/DomainApi/apiClient';
import { updateDialogError } from '~/Redux/Reducer/Thunk';
import { store } from "~/Redux/store";


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
            toast.error(error.response.data.ErrorMessage);
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
            toast.error(error.response.data.ErrorMessage);
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

// Lấy kỳ đang mở, sẽ đóng
export async function ApiProcessPeriod(unitcode) {
    try {
        const header = {
            Authorization: store.getState().FetchApi.token,
        };
        const response = await DomainPoultry.get(`/process/period/${unitcode}`, { headers: header });
        const data = await response.data?.Response ?? null;
        return data
    } catch (error) {
        console.log(error);
        if (error.response) {
            store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.response.data.ErrorMessage || 'Lỗi khi lấy kỳ đang mở, sẽ đóng!' }));
        } else {
            store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.message || 'Lỗi khi lấy kỳ đang mở, sẽ đóng!' }));
        }
        return null;
    }
}

// Kết chuyển lãi lỗ
export async function ApiTransferProfitLoss(unitcode, body) {
    try {
        const header = {
            Authorization: store.getState().FetchApi.token,
        };
        const response = await DomainPoultry.post(`/process/${unitcode}/close-profit-loss`, body, { headers: header });
        const data = await response?.data?.Response ?? null;
        return data
    } catch (error) {
        console.log(error);
        if (error.response) {
            store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.response.data.ErrorMessage || 'Lỗi kết chuyển lãi lỗ!' }));
        } else {
            store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.message || 'Lỗi kết chuyển lãi lỗ!' }));
        }
        return null;
    }
}

//Đóng Kỳ kế toán
export async function ApiClosePeriod(unitcode, body) {
    try {
        const header = {
            Authorization: store.getState().FetchApi.token,
        };
        const response = await DomainPoultry.post(`/${unitcode}/close-period`, body, { headers: header });
        const data = await response?.data?.Response ?? null;
        return data
    } catch (error) {
        console.log(error);
        if (error.response) {
            store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.response.data.ErrorMessage || 'Lỗi đóng kỳ kế toán!' }));
        } else {
            store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.message || 'Lỗi đóng kỳ kế toán!' }));
        }
        return null;
    }
}