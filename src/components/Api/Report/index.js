import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import DomainApi from '~/DomainApi';

const getTotals = (data, key) => {
    let total = 0;
    data.forEach((item) => {
        total += item[key];
    });
    return total;
};

export async function Api_Export_CostAllocation(setDataExport) {
    try {
        let url = `report/cost-allocation/unitcode/${localStorage.getItem('Unit')}/get?username=${localStorage.getItem(
            'UserName',
        )}`;
        const response = await DomainApi.get(url);
        const dataTotal = [
            { doc_code: 'TOTAL', desc_detail: 'TOTAL', amount: getTotals(response.data, 'amount') },
            ...response.data,
        ];
        setDataExport(dataTotal.sort((a, b) => a.doc_code.localeCompare(b.doc_code)));
    } catch (error) {
        console.log(error);
        if (error.response) {
            toast.error(' Error api export list! \n' + error.response.data.ErrorMessage);
        } else {
            toast.error(' Error api export list! \n' + error.message);
        }
    }
}

export async function Api_Report_COGS({ COSTCENTER, PERIOD_YEAR, PERIOD_MONTH, setDataExport }) {
    try {
        var dateMonth = `${PERIOD_MONTH}`;
        if (PERIOD_MONTH !== 10 && PERIOD_MONTH !== 11 && PERIOD_MONTH !== 12) {
            dateMonth = `0${PERIOD_MONTH}`;
        }
        var status_code = false;
        let url = `report/unitcode/${localStorage.getItem('Unit')}/pdf/cogs?username=${localStorage.getItem(
            'UserName',
        )}&cost_center=${COSTCENTER}&acc_period_year=${PERIOD_YEAR}&acc_period_month=${dateMonth}&export_type=3`;
        const response = await DomainApi.get(url);
        const data = response.data;

        setDataExport(data);
        // setDataExport(response.data.cogs_detail);
        status_code = true;
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data.ErrorMessage);
        } else {
            toast.error(error.message);
        }
    }
    return status_code;
}

export async function Api_Export_InOut_SH({ COSTCENTER, PERIOD_YEAR, PERIOD_MONTH, setDataExport }) {
    try {
        var dateMonth = `${PERIOD_MONTH}`;
        if (PERIOD_MONTH !== 10 && PERIOD_MONTH !== 11 && PERIOD_MONTH !== 12) {
            dateMonth = `0${PERIOD_MONTH}`;
        }
        var status_code = false;
        let url = `report/unitcode/${localStorage.getItem('Unit')}/SH/inout-ward?username=${localStorage.getItem(
            'UserName',
        )}&cost_center=${COSTCENTER}&acc_period_year=${PERIOD_YEAR}&acc_period_month=${dateMonth}`;
        const response = await DomainApi.get(url);

        setDataExport(response.data.detail);
        status_code = true;
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data.ErrorMessage);
        } else {
            toast.error(error.message);
        }
    }
    return status_code;
}

export async function Api_PDF_Report_COGS({ COSTCENTER, PERIOD_YEAR, PERIOD_MONTH, setDataUrlBase64 }) {
    try {
        var dateMonth = `${PERIOD_MONTH}`;
        if (PERIOD_MONTH !== 10 && PERIOD_MONTH !== 11 && PERIOD_MONTH !== 12) {
            dateMonth = `0${PERIOD_MONTH}`;
        }
        var status_code = false;
        let url = `report/unitcode/${localStorage.getItem('Unit')}/pdf/cogs?username=${localStorage.getItem(
            'UserName',
        )}&cost_center=${COSTCENTER}&acc_period_year=${PERIOD_YEAR}&acc_period_month=${dateMonth}&export_type=2`;
        const response = await DomainApi.get(url);

        setDataUrlBase64(response.data);
        status_code = true;
        // setDataExport(response.data.cogs_detail);
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data.ErrorMessage);
        } else {
            toast.error(error.message);
        }
    }
    return status_code;
}

export async function Api_PDF_Report_InOutWard({ COSTCENTER, PERIOD_YEAR, PERIOD_MONTH, setDataUrlBase64 }) {
    try {
        var status_code = false;
        var dateMonth = `${PERIOD_MONTH}`;
        if (PERIOD_MONTH !== 10 && PERIOD_MONTH !== 11 && PERIOD_MONTH !== 12) {
            dateMonth = `0${PERIOD_MONTH}`;
        }
        let url = `report/unitcode/${localStorage.getItem('Unit')}/pdf/inout/sh?username=${localStorage.getItem(
            'UserName',
        )}&cost_center=${COSTCENTER}&acc_period_year=${PERIOD_YEAR}&acc_period_month=${dateMonth}`;
        const response = await DomainApi.get(url);

        setDataUrlBase64(response.data);
        status_code = true;
        // setDataExport(response.data.cogs_detail);
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data.ErrorMessage);
        } else {
            toast.error(error.message);
        }
    }
    return status_code;
}

export async function Api_Report_COGM({ COSTCENTER, PERIOD_YEAR, PERIOD_MONTH, setDataExport }) {
    try {
        var dateMonth = `${PERIOD_MONTH}`;
        if (PERIOD_MONTH !== 10 && PERIOD_MONTH !== 11 && PERIOD_MONTH !== 12) {
            dateMonth = `0${PERIOD_MONTH}`;
        }
        var status_code = false;
        let url = `report/unitcode/${localStorage.getItem('Unit')}/pdf/cogm?username=${localStorage.getItem(
            'UserName',
        )}&cost_center=${COSTCENTER}&acc_period_year=${PERIOD_YEAR}&acc_period_month=${dateMonth}&export_type=3`;
        const response = await DomainApi.get(url);

        setDataExport(response.data);
        status_code = true;
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data.ErrorMessage);
        } else {
            toast.error(error.message);
        }
    }
    return status_code;
}

export async function Api_PDF_Report_COGM({ COSTCENTER, PERIOD_YEAR, PERIOD_MONTH, setDataUrlBase64 }) {
    try {
        var status_code = false;
        var dateMonth = `${PERIOD_MONTH}`;
        if (PERIOD_MONTH !== 10 && PERIOD_MONTH !== 11 && PERIOD_MONTH !== 12) {
            dateMonth = `0${PERIOD_MONTH}`;
        }
        let url = `report/unitcode/${localStorage.getItem('Unit')}/pdf/cogm?username=${localStorage.getItem(
            'UserName',
        )}&cost_center=${COSTCENTER}&acc_period_year=${PERIOD_YEAR}&acc_period_month=${dateMonth}&export_type=2`;
        const response = await DomainApi.get(url);

        setDataUrlBase64(response.data);
        status_code = true;
        // setDataExport(response.data.cogs_detail);
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data.ErrorMessage);
        } else {
            toast.error(error.message);
        }
    }
    return status_code;
}

export async function Api_PDF_Report_InOutWard_CH({ COSTCENTER, PERIOD_YEAR, PERIOD_MONTH, setDataUrlBase64 }) {
    try {
        var status_code = false;
        var dateMonth = `${PERIOD_MONTH}`;
        if (PERIOD_MONTH !== 10 && PERIOD_MONTH !== 11 && PERIOD_MONTH !== 12) {
            dateMonth = `0${PERIOD_MONTH}`;
        }
        let url = `report/unitcode/${localStorage.getItem('Unit')}/pdf/inout/ch?username=${localStorage.getItem(
            'UserName',
        )}&cost_center=${COSTCENTER}&acc_period_year=${PERIOD_YEAR}&acc_period_month=${dateMonth}&export_type=1`;
        const response = await DomainApi.get(url);

        setDataUrlBase64(response.data);
        status_code = true;
        // setDataExport(response.data.cogs_detail);
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data.ErrorMessage);
        } else {
            toast.error(error.message);
        }
    }
    return status_code;
}

export async function Api_Export_InOut_CH({ COSTCENTER, PERIOD_YEAR, PERIOD_MONTH, setDataExport }) {
    try {
        var dateMonth = `${PERIOD_MONTH}`;
        if (PERIOD_MONTH !== 10 && PERIOD_MONTH !== 11 && PERIOD_MONTH !== 12) {
            dateMonth = `0${PERIOD_MONTH}`;
        }
        var status_code = false;
        let url = `report/unitcode/${localStorage.getItem('Unit')}/pdf/inout/ch?username=${localStorage.getItem(
            'UserName',
        )}&cost_center=${COSTCENTER}&acc_period_year=${PERIOD_YEAR}&acc_period_month=${dateMonth}&export_type=3`;
        const response = await DomainApi.get(url);

        setDataExport(response.data);
        status_code = true;
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data.ErrorMessage);
        } else {
            toast.error(error.message);
        }
    }
    return status_code;
}

export async function Api_PDF_Report_COGS_Meat({ COSTCENTER, PERIOD_YEAR, PERIOD_MONTH, setDataUrlBase64 }) {
    try {
        var status_code = false;
        var dateMonth = `${PERIOD_MONTH}`;
        if (PERIOD_MONTH !== 10 && PERIOD_MONTH !== 11 && PERIOD_MONTH !== 12) {
            dateMonth = `0${PERIOD_MONTH}`;
        }
        let url = `report/unitcode/${localStorage.getItem('Unit')}/pdf/cogs/meat?username=${localStorage.getItem(
            'UserName',
        )}&cost_center=${COSTCENTER}&acc_period_year=${PERIOD_YEAR}&acc_period_month=${dateMonth}&export_type=1`;
        const response = await DomainApi.get(url);

        setDataUrlBase64(response.data);
        status_code = true;
        // setDataExport(response.data.cogs_detail);
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data.ErrorMessage);
        } else {
            toast.error(error.message);
        }
    }
    return status_code;
}

export async function Api_Export_COGS_Meat({ COSTCENTER, PERIOD_YEAR, PERIOD_MONTH, setDataExport }) {
    try {
        var dateMonth = `${PERIOD_MONTH}`;
        if (PERIOD_MONTH !== 10 && PERIOD_MONTH !== 11 && PERIOD_MONTH !== 12) {
            dateMonth = `0${PERIOD_MONTH}`;
        }
        var status_code = false;
        let url = `report/unitcode/${localStorage.getItem('Unit')}/pdf/cogs/meat?username=${localStorage.getItem(
            'UserName',
        )}&cost_center=${COSTCENTER}&acc_period_year=${PERIOD_YEAR}&acc_period_month=${dateMonth}&export_type=3`;
        const response = await DomainApi.get(url);

        setDataExport(response.data);
        status_code = true;
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data.ErrorMessage);
        } else {
            toast.error(error.message);
        }
    }
    return status_code;
}
export async function Api_PDF_Report_COGS_New({ COSTCENTER, PERIOD_YEAR, PERIOD_MONTH, setDataUrlBase64 }) {
    try {
        var status_code = false;
        var dateMonth = `${PERIOD_MONTH}`;
        if (PERIOD_MONTH !== 10 && PERIOD_MONTH !== 11 && PERIOD_MONTH !== 12) {
            dateMonth = `0${PERIOD_MONTH}`;
        }
        let url = `report/unitcode/${localStorage.getItem('Unit')}/pdf/cogs/new?username=${localStorage.getItem(
            'UserName',
        )}&acc_period_year=${PERIOD_YEAR}&acc_period_month=${dateMonth}&export_type=2`;

        if (COSTCENTER) {
            url += `&cost_center=${COSTCENTER}`;
        }
        const response = await DomainApi.get(url);

        setDataUrlBase64(response.data);
        status_code = true;
        // setDataExport(response.data.cogs_detail);
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data.ErrorMessage);
        } else {
            toast.error(error.message);
        }
    }
    return status_code;
}
export async function Api_Export_COGS_New({ COSTCENTER, PERIOD_YEAR, PERIOD_MONTH, setDataExport }) {
    try {
        var dateMonth = `${PERIOD_MONTH}`;
        if (PERIOD_MONTH !== 10 && PERIOD_MONTH !== 11 && PERIOD_MONTH !== 12) {
            dateMonth = `0${PERIOD_MONTH}`;
        }
        var status_code = false;
        let url = `report/unitcode/${localStorage.getItem('Unit')}/pdf/cogs/new?username=${localStorage.getItem(
            'UserName',
        )}&acc_period_year=${PERIOD_YEAR}&acc_period_month=${dateMonth}&export_type=3`;

        if (COSTCENTER) {
            url += `&cost_center=${COSTCENTER}`;
        }
        const response = await DomainApi.get(url);

        setDataExport(response.data);
        status_code = true;
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data.ErrorMessage);
        } else {
            toast.error(error.message);
        }
    }
    return status_code;
}
