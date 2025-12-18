import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import DomainApi, { DomainPoultry } from '~/DomainApi';
import { updateDialogError } from '~/Redux/Reducer/FetchApi';
import { store } from '~/Redux/store';

//Mở Kỳ kế toán
export async function ApiOpenPeriod(unitcode, body) {
    try {
        const header = {
            Authorization: store.getState().FetchApi.token,
        };
        const response = await DomainPoultry.post(`/process/${unitcode}/open-period`, body, { headers: header });
        const data = await response?.data?.Response ?? null;
        return data
    } catch (error) {
        console.log(error);
        if (error.response) {
            store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.response.data.ErrorMessage || 'Lỗi mở kỳ kế toán!' }));
        } else {
            store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.message || 'Lỗi mở kỳ kế toán!' }));
        }
        return null;
    }
}

// Danh sách user
export async function ApiUsersForOpenPeriod(unitcode) {
    try {
        const header = {
            Authorization: store.getState().FetchApi.token,
        };
        const response = await DomainPoultry.get(`/${unitcode}/users`, { headers: header });
        const data = await response.data?.Response ?? null;
        return data
    } catch (error) {
        console.log(error);
        if (error.response) {
            store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.response.data.ErrorMessage || 'Lỗi lấy danh sách người dùng!' }));
        } else {
            store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.message || 'Lỗi lấy danh sách người dùng!' }));
        }
        return null;
    }
}

export async function ApiReopenPeriod(access_token, periodDate, user) {
    try {
        var statusCode = false;
        // const date = periodDate.add(1, 'month');
        const date = periodDate;
        const model = {
            acc_period_month_reopen: date.month() + 1,
            acc_period_year_reopen: date.year(),
            user_edit: user,
        };
        const header = {
            Authorization: access_token,
        };

        const response = await DomainApi.post(
            `costing/acc-period/unitcode/${localStorage.getItem('Unit')}/reopen?username=${localStorage.getItem(
                'UserName',
            )}`,
            model,
            { headers: header },
        );
        statusCode = true;
        toast.success(' Success reopen period!');
    } catch (error) {
        console.log('>>Error: ', error);
        if (error.response) {
            toast.error(error.response.data.ErrorMessage);
        } else {
            toast.error(error.message);
        }
    }
    return statusCode;
}
