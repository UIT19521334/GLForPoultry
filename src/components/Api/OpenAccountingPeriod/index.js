import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import DomainApi from '~/DomainApi';

export async function ApiOpenPeriod(access_token) {
    try {
        var statusCode = false;
        // const access_token = Access_token();
        const header = {
            Authorization: access_token,
        };

        const response = await DomainApi.post(
            `costing/acc-period/unitcode/${localStorage.getItem(
                'Unit',
            )}/open-next-period?username=${localStorage.getItem('UserName')}`,
            null,
            { headers: header },
        );
        statusCode = true;
        toast.success(' Success open next period!');
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
            toast.error(error.response.data);
        } else {
            toast.error(error.message);
        }
    }
    return statusCode;
}
