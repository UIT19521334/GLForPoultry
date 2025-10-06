import { toast } from 'react-toastify';
import DomainApi, { DomainPoultry } from '~/DomainApi';
import dayjs from 'dayjs';
import { store } from "~/Redux/store";
import { updateDialogError } from '~/Redux/Reducer/Thunk';

// period format MMYYYY

export async function ApiFlockByUnit(UnitId) {
    try {
        const header = {
            Authorization: store.getState().FetchApi.token,
        };
        const response = await DomainPoultry.get(`master/flock?unitid=${UnitId}`, { headers: header });
        return response.data?.Response;
    } catch (error) {
        store.dispatch(updateDialogError({ open: true, title: 'Error', content: 'Error api get flock list!' }));
        return [];
    }
}

export async function ApiFarmByUnit(UnitId) {
    try {
        const header = {
            Authorization: store.getState().FetchApi.token,
        };
        const response = await DomainPoultry.get(`master/farm?unitid=${UnitId}`, { headers: header });
        return response.data?.Response;
    } catch (error) {
        store.dispatch(updateDialogError({ open: true, title: 'Error', content: 'Error api get flock list!' }));
        return [];
    }
}

export async function ApiAreaByUnit(UnitId) {
    try {
        const header = {
            Authorization: store.getState().FetchApi.token,
        };
        const response = await DomainPoultry.get(`master/area-byunit?unitid=${UnitId}`, { headers: header });
        return response.data?.Response;
    } catch (error) {
        store.dispatch(updateDialogError({ open: true, title: 'Error', content: 'Error api get flock list!' }));
        return [];
    }
}

export async function ApiMaterialByRegion(RegionId) {
    try {
        const header = {
            Authorization: store.getState().FetchApi.token,
        };
        const response = await DomainPoultry.get(`master/material?regionid=${RegionId}`, { headers: header });
        return response.data?.Response;
    } catch (error) {
        store.dispatch(updateDialogError({ open: true, title: 'Error', content: 'Error api get flock list!' }));
        return [];
    }
}

export async function ApiAccountEntryListHeader(period, docTypeId) {
    try {
        const UnitId = localStorage.getItem('Unit');
        const header = {
            Authorization: store.getState().FetchApi.token,
        };
        const response = await DomainPoultry.get(`journal/entry?unitid=${UnitId}&period=${period}&doctypeid=${docTypeId}`, { headers: header });
        return response.data?.Response;
    } catch (error) {
        if (error.response) {
            store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.response.data.ErrorMessage || 'Error api get data account entry list!' }));
        } else {
            store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.message || 'Error api get data account entry list!' }));
        }
        return [];
    }
}

export async function ApiListAccountEntry(period, docTypeId, currentUnitId) {
    try {

        const header = {
            Authorization: store.getState().FetchApi.token,
        };

        const listUnit = store.getState().FetchApi.userAccess.units;
        const unitIds = listUnit.map(u => u.UnitId);
        const body = {
            unitid: [currentUnitId],
            period: period,
            doctypeid: docTypeId
        }
        const response = await DomainPoultry.post(`journal/all-entry`, body, { headers: header });
        return response.data?.Response;
    } catch (error) {
        if (error.response) {
            store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.response.data.ErrorMessage || 'Error api get data account entry list!' }));
        } else {
            store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.message || 'Error api get data account entry list!' }));
        }
        return [];
    }
}

export async function ApiCreateAccountEntry(body) {
    if (body) {
        try {
            var statusCode = false;
            const header = {
                Authorization: store.getState().FetchApi.token,
            };

            let url = `journal/entry`;
            const response = await DomainPoultry.post(url, body, { headers: header });
            console.log(response.data);
            toast.success(' Success update account entry header!');
            statusCode = true;
        } catch (error) {
            if (error.response) {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.response.data.ErrorMessage || 'Error api create account entry!' }));
            } else {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.message || 'Error api create account entry!' }));
            }
            statusCode = false;
        }
        return statusCode;
    }
}

export async function ApiUpdateAccountEntry(valueCode, body) {
    if (body && valueCode) {
        try {
            var statusCode = false;
            const header = {
                Authorization: store.getState().FetchApi.token,
            };

            let url = `journal/entry/${valueCode}`;
            const response = await DomainPoultry.put(url, body, { headers: header });
            console.log(response.data);
            toast.success(' Success update account entry header!');
            statusCode = true;
        } catch (error) {
            if (error.response) {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.response.data.ErrorMessage || 'Error api update account entry!' }));
            } else {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.message || 'Error api update account entry!' }));
            }
            statusCode = false;
        }
        return statusCode;
    }
}

export async function ApiDeleteAccountEntryHeader(valueCode) {
    if (valueCode) {
        try {
            var statusCode = false;
            const header = {
                Authorization: store.getState().FetchApi.token,
            };
            let url = `journal/entry/${valueCode}`;
            const response = await DomainPoultry.delete(url, { headers: header });
            console.log(response.data);
            toast.success(' Success update account entry header!');
            statusCode = true;
        } catch (error) {
            if (error.response) {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.response.data.ErrorMessage || 'Error api delete account entry!' }));
            } else {
                store.dispatch(updateDialogError({ open: true, title: 'Error', content: error.message || 'Error api delete account entry!' }));
            }
            statusCode = false;
        }
        return statusCode;
    }
}

export async function ApiAccountEntryListDetail(valueDocNo, valueSearch, setDataAEListDetail) {
    if (valueDocNo) {
        try {
            let url = `journal/acc-entry/unitcode/${localStorage.getItem(
                'Unit',
            )}/docno/${valueDocNo}/detail?username=${localStorage.getItem('UserName')}`;
            if (valueSearch) {
                url += `?detail_ids=${valueSearch}`;
            }
            const response = await DomainApi.get(url);
            // const dataFilter = response.data;
            const data = response.data.map((data, index) => {
                return {
                    id: index + 1,
                    detail_ids: data.detail_ids,
                    doc_code: data.doc_code,
                    unitcode: data.unitcode,
                    acc_code: data.acc_code,
                    description: data.description,
                    cost_center: data.cost_center,
                    credit_amount: data.credit_amount,
                    debit_amount: data.debit_amount,
                    isactive: data.isactive,
                    updated_user: data.updated_user,
                    updated_date: data.updated_date,
                    channel_code: data.channel_code,
                    channel_name: data.channel_name,
                };
            });
            setDataAEListDetail(data);
        } catch (error) {
            console.log(error);
            if (error.response) {
                toast.error(' Error api get list account entry detail! \n' + error.response.data.ErrorMessage);
            } else {
                toast.error(' Error api get list account entry detail! \n' + error.message);
            }
        }
    } else {
        toast.error('Empty document No!');
    }
}

export async function ApiImportAccountEntry(access_token, valueFile) {
    if (access_token && valueFile.length > 0) {
        try {
            const header = {
                Authorization: access_token,
                'Content-Type': 'multipart/form-data',
            };
            const fd = new FormData();
            fd.append('file', valueFile[0]);
            let url = `journal/acc-entry/unitcode/${localStorage.getItem(
                'Unit',
            )}/import?username=${localStorage.getItem('UserName')}`;
            const response = await DomainApi.post(url, fd, { headers: header });
            // setDataAEListHeader(response.data);
            toast.success(' Success import file!');
        } catch (error) {
            console.log(error);
            console.log('>>Error: ', error);
            if (error.response) {
                toast.error(' Error import file! \n' + error.response.data.ErrorMessage);
            } else {
                toast.error('  Error import file! \n' + error.message);
            }
        }
    }
}

//? Memo
export async function ApiMemoListHeader(valueDateMonth, valueDateYear, valueSearch, setDataMemoListHeader) {
    try {
        let url = `journal/acc-entry/unitcode/${localStorage.getItem('Unit')}?username=${localStorage.getItem(
            'UserName',
        )}&acc_period_month=${valueDateMonth}&acc_period_year=${valueDateYear}&doctype=1`;
        if (valueSearch) {
            url = `journal/acc-entry/unitcode/${localStorage.getItem('Unit')}?username=${localStorage.getItem(
                'UserName',
            )}&acc_period_month=${valueDateMonth}&acc_period_year=${valueDateYear}&search_text=${valueSearch}&doctype=1`;
        }
        const response = await DomainApi.get(url);

        setDataMemoListHeader(response.data.sort((a, b) => b.trans_ids - a.trans_ids));
    } catch (error) {
        console.log(error);
        toast.error(' Error api get data account entry list!');
    }
}

export async function ApiLoadMemoFromFA() {
    try {
        var statusCode = false;
        let url = `journal/transfer-memo/depreciation?username=${localStorage.getItem(
            'UserName',
        )}&unitcode=${localStorage.getItem('Unit')}`;
        const response = await DomainApi.post(url, null);
        statusCode = response.data;
    } catch (error) {
        console.log(error);
        toast.error(' Error api load data memo from FA!');
    }
    return statusCode;
}
