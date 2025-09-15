import React from 'react';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
// import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Form from 'react-bootstrap/Form';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Enum_Status_CostAllocation } from '~/components/Enum';
import {
    ApiCostAllocationListDetail,
    ApiCostAllocationListHeader,
    ApiCreateCostAllocationHeader,
    ApiPauseCostAllocation,
    ApiProcessCostAllocation,
    ApiUpdateCostAllocationHeader,
} from '~/components/Api/CostAllocation';
import LoadingButton from '@mui/lab/LoadingButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SearchIcon from '@mui/icons-material/Search';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SaveIcon from '@mui/icons-material/Save';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import TextField from '@mui/material/TextField';
import { toast, ToastContainer } from 'react-toastify';
import AlertDialog from '~/components/AlertDialog';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import Autocomplete from '@mui/material/Autocomplete';
import * as xlsx from 'xlsx';
import { OnKeyEvent } from '~/components/Event/OnKeyEvent';
import { OnMultiKeyEvent } from '~/components/Event/OnMultiKeyEvent';
import { Excel } from 'antd-table-saveas-excel';
import { Api_Export_CostAllocation } from '~/components/Api/Report';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DialogDetailAllocation from './DialogDetailAllocation';
import { useSelector } from 'react-redux';
import { Spin } from 'antd';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useTranslation } from 'react-i18next';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    direction: 'row',
    color: theme.palette.text.secondary,
}));

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function CostAllocation({ title }) {
    const access_token = useSelector((s) => s.FetchApi.token);
    const listCostCenter = useSelector((state) => state.FetchApi.listData_CostCenter);
    const [valueIsLoading, setIsLoading] = React.useState(false);
    const { t } = useTranslation();
    const [valueSearch, setValueSearch] = React.useState('');
    const handleOnChangeValueSearch = (event) => {
        setValueSearch(event.target.value);
    };
    const [valueAllocationCode, setValueAllocationCode] = React.useState('');
    const [valueUser, setValueUser] = React.useState('');
    const [valueDocDate, setValueDocDate] = React.useState(dayjs());
    const [valueUpdateDate, setValueUpdateDate] = React.useState(dayjs());
    const [valueDescription, setValueDescription] = React.useState('');
    const [valueCostCenter, setValueCostCenter] = React.useState('');
    const [valueEditGrid, setValueEditGrid] = React.useState(false);
    const listChannel = useSelector((state) => state.FetchApi.listData_Channel);
    const [valueChannel, setValueChannel] = React.useState('');
    const [valueHideCostChannel, setValueHideCostChannel] = React.useState(true);
    const costChannel641 = 641;

    const columnsHeader = [
        {
            field: 'doc_code',
            headerName: t('allocation-code'),
            width: 150,
            headerClassName: 'super-app-theme--header',
        },

        {
            field: 'description',
            headerName: t('description'),
            minWidth: 300,
            flex: 1,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'from_date',
            headerName: t('from-date'),
            width: 120,
            headerClassName: 'super-app-theme--header',
            valueFormatter: (params) => dayjs(params.value).format('DD - MM - YYYY'),
            headerAlign: 'center',
        },
        {
            field: 'to_date',
            headerName: t('to-date'),
            width: 120,
            headerClassName: 'super-app-theme--header',
            valueFormatter: (params) => dayjs(params.value).format('DD - MM - YYYY'),
            headerAlign: 'center',
        },
        {
            field: 'process_percent',
            headerName: t('process'),
            width: 100,
            headerClassName: 'super-app-theme--header',
            valueFormatter: ({ value }) => `${value} %`,
            type: 'number',
        },
        {
            field: 'total_cost',
            headerName: t('total-cost'),
            width: 150,
            headerClassName: 'super-app-theme--header',
            type: 'number',
        },
        {
            field: 'status_display',
            headerName: t('status'),
            width: 120,
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
        },
    ];

    //! handle click account credit debit
    /* #region click account credit debit */
    const handleChangeAccCredit = (newValue) => {
        setValueCreditEntry(newValue ? newValue.account_code : '');
        setValueCreditAuto(newValue);
        if (newValue) {
            newValue.account_code.includes(costChannel641) && setValueHideCostChannel(false);
        } else if (valueDebitEntry && valueDebitEntry.includes(costChannel641)) {
            setValueHideCostChannel(false);
        } else {
            setValueHideCostChannel(true);
            setValueChannel('');
        }
    };
    /* #endregion */
    /* #region click account credit debit */
    const handleChangeAccDebit = (newValue) => {
        setValueDebitEntry(newValue ? newValue.account_code : '');
        setValueDebitAuto(newValue);
        if (valueCreditEntry && valueCreditEntry.includes(costChannel641)) {
            setValueHideCostChannel(false);
        } else if (newValue) {
            newValue.account_code.includes(costChannel641) && setValueHideCostChannel(false);
        } else {
            setValueHideCostChannel(true);
            setValueChannel('');
        }
    };
    /* #endregion */

    //! visibility column data grid
    const columnVisibilityModel = React.useMemo(() => {
        if (valueEditGrid) {
            return {
                actions: true,
            };
        }
        return {
            actions: false,
        };
    }, [valueEditGrid]);

    //! handler filter status search
    /* #region  button status */
    const status = Enum_Status_CostAllocation();
    const [valueStatus, setValueStatus] = React.useState('');
    const handleChangeStatus = (event) => {
        setValueStatus(event.target.value);
        setReloadListHeader(!reloadListHeader);
    };
    /* #endregion */

    //! get data currency from redux
    /* #region  button currency */
    const dataListCurrency = useSelector((s) => s.FetchApi.listData_Currency);
    const [valueCurrency, setValueCurrency] = useState('VND');

    /* #endregion */

    //! get data account group from redux
    /* #region  button account list */
    const [valueAccountGroup, setValueAccountGroup] = useState('');
    const dataListAccountGroup = useSelector((s) => s.FetchApi.listData_AccountGroup);
    /* #endregion */

    //! get data account from redux
    /* #region  select debit and creedit list */
    const [valueCreditEntry, setValueCreditEntry] = React.useState(0);
    const [valueCreditAuto, setValueCreditAuto] = React.useState({});
    const [valueDebitEntry, setValueDebitEntry] = React.useState(0);
    const [valueDebitAuto, setValueDebitAuto] = React.useState({});
    const dataListAccount = useSelector((s) => s.FetchApi.listData_Account);

    /* #endregion */

    //todo: call api get data header
    /* #region data list header */
    const [dataListHeader, setDataListHeader] = useState([]);
    const [reloadListHeader, setReloadListHeader] = useState([]);
    useEffect(() => {
        setIsLoading(true);
        const asyncApiListHeader = async () => {
            await ApiCostAllocationListHeader(valueStatus, setDataListHeader);
        };
        asyncApiListHeader();
        setIsLoading(false);
    }, [reloadListHeader]);

    //! select row header in datagrid
    const onHandleRowsSelectionHeader = (ids) => {
        const selectedRowsData = ids.map((id) => dataListHeader.find((row) => row.doc_code === id));
        if (selectedRowsData) {
            {
                selectedRowsData.map((key) => {
                    setValueAllocationCode(key.doc_code);
                    setValueUser(key.updated_user);
                    setValueDocDate(dayjs(key.doc_date));
                    setValueCostCenter(key.cost_center);
                    setValueDescription(key.description);
                    setValueUpdateDate(dayjs(key.updated_date));
                    setValueAccountGroup(key.acc_group);
                    setValueCurrency(key.currency);
                    setValueChannel(key.channel_code);
                    if (key.credit_entry && key.credit_entry.includes(costChannel641)) {
                        setValueHideCostChannel(false);
                    } else if (key.debit_entry && key.debit_entry.includes(costChannel641)) {
                        setValueHideCostChannel(false);
                    } else {
                        setValueHideCostChannel(true);
                    }
                    setValueDebitEntry(key.debit_entry);
                    const filterDebit = dataListAccount.filter((data) => data.account_code === key.debit_entry);
                    setValueDebitAuto(filterDebit[0]);
                    setValueCreditEntry(key.credit_entry);
                    const filterCredit = dataListAccount.filter((data) => data.account_code === key.credit_entry);
                    setValueCreditAuto(filterCredit[0]);
                    setValueReadonly(true);
                    // setValueReadonlyDocdate(true);
                    if (key.status === 2) {
                        setValueButtonProcess(true);
                        setValueButtonPause(false);
                    }
                    if (key.status === 3) {
                        setValueButtonProcess(false);
                        setValueButtonPause(true);
                    }
                    setValueEditGrid(false);
                    setValueDisabledSaveButton(true);
                    setValueButtonNew(false);
                    setValueButtonUpdate(false);
                });
                setReloadListDetail(!reloadListDetail);
            }
        }
    };
    /* #endregion */
    const [valueReadonly, setValueReadonly] = React.useState(true);
    // const [valueReadonlyDocdate, setValueReadonlyDocdate] = React.useState(true);
    const [valueDisabledSaveButton, setValueDisabledSaveButton] = React.useState(true);

    //! handler click button new
    /* #region button new header */
    const [valueButtonNew, setValueButtonNew] = React.useState(false);

    const handleClickNewHeader = () => {
        setValueDisabledSaveButton(false);
        setValueReadonly(false);
        // setValueReadonlyDocdate(false);
        setValueButtonUpdate(false);
        setValueButtonNew(true);
        setValueAllocationCode('');
        setValueUser(localStorage.getItem('UserName'));
        setValueCostCenter('');
        setValueDescription('');
        setValueDocDate(dayjs());
        setValueUpdateDate(dayjs());
        setValueAccountGroup(9000);
        setValueChannel('');
        setValueHideCostChannel(true);
        setValueDebitEntry('');
        setValueDebitAuto({});
        setValueCreditEntry('');
        setValueCreditAuto({});
        setValueButtonProcess(false);
        setValueButtonPause(false);
        setDataListDetail([]);
        setValueEditGrid(true);
    };
    /* #endregion */

    //! handler click button update
    /* #region button update header */
    const [valueButtonUpdate, setValueButtonUpdate] = React.useState(false);
    const handleClickUpdateHeader = () => {
        setValueDisabledSaveButton(false);
        setValueReadonly(false);
        // setValueReadonlyDocdate(true);
        setValueButtonNew(false);
        setValueButtonUpdate(true);
        setValueUpdateDate(dayjs());
        setValueEditGrid(true);
    };
    /* #endregion */

    //! handler click button save
    /* #region button save header */
    const handleClickSaveHeader = () => {
        if (valueDescription && valueAccountGroup) {
            if (
                (valueCreditEntry.includes(costChannel641) && !valueChannel) ||
                (valueDebitEntry.includes(costChannel641) && !valueChannel)
            ) {
                toast.warn(t('entry-channel-warn'));
            } else {
                if (valueButtonNew) {
                    setDialogIsOpenNewHeader(true);
                }
                if (valueButtonUpdate) {
                    setDialogIsOpenUpdate(true);
                }
            }
        } else {
            toast.error(t('entry-toast-error'));
        }
    };
    /* #endregion */

    //todo: call api process
    /* #region button Process */
    const [valueButtonProcess, setValueButtonProcess] = React.useState(false);
    const handleClickButtonProcess = () => {
        if (valueAllocationCode) {
            setCallApiProcess(!callApiProcess);
        } else {
            toast.error(t('entry-toast-error'));
        }
    };

    const [callApiProcess, setCallApiProcess] = React.useState(false);
    useEffect(() => {
        const apiProcess = async () => {
            setIsLoading(true);
            const statusCode = await ApiProcessCostAllocation(access_token, valueAllocationCode);
            if (statusCode) {
                setValueButtonProcess(true);
                setValueButtonPause(false);
                setReloadListHeader(!reloadListHeader);
            }
            setIsLoading(false);
        };

        apiProcess();
    }, [callApiProcess]);
    /* #endregion */

    //todo: call api pause
    /* #region button Pause */
    const [valueButtonPause, setValueButtonPause] = React.useState(false);
    const handleClickButtonPause = () => {
        if (valueAllocationCode) {
            setCallApiPause(!callApiPause);
        } else {
            toast.error(t('entry-toast-error'));
        }
    };
    const [callApiPause, setCallApiPause] = React.useState(false);
    useEffect(() => {
        const apiPause = async () => {
            setIsLoading(true);
            const statusCode = await ApiPauseCostAllocation(access_token, valueAllocationCode);
            if (statusCode) {
                setValueButtonProcess(false);
                setValueButtonPause(true);
                setReloadListHeader(!reloadListHeader);
            }
            setIsLoading(false);
        };

        apiPause();
    }, [callApiPause]);
    /* #endregion */

    //todo: call api new header
    /* #region  call api new */
    const [dialogIsOpenNewHeader, setDialogIsOpenNewHeader] = React.useState(false);
    const [callApiNewHeader, setCallApiNewHeader] = React.useState(false);
    const agreeDialogNewHeader = () => {
        setDialogIsOpenNewHeader(false);
        setCallApiNewHeader(!callApiNewHeader);
    };
    const closeDialogNewHeader = () => {
        setDialogIsOpenNewHeader(false);
        toast.warning(t('toast-cancel-new'));
    };

    useEffect(() => {
        const apiNewHeader = async () => {
            setIsLoading(true);
            const statusCode = await ApiCreateCostAllocationHeader(
                access_token,
                valueDocDate,
                valueDescription,
                valueCurrency,
                valueChannel,
                valueAccountGroup,
                valueDebitEntry,
                valueCreditEntry,
                valueCostCenter,
                valueUser,
                dataList,
            );
            if (statusCode) {
                setValueAllocationCode('');
                setValueUser('');
                setValueDescription('');
                setValueDocDate(dayjs());
                setValueUpdateDate(dayjs());
                setValueAccountGroup('');
                setValueDebitEntry('');
                setValueCreditEntry('');
                setValueButtonNew(false);
                setValueDisabledSaveButton(true);
                setValueReadonly(true);
                // setValueReadonlyDocdate(true);
                setValueEditGrid(false);
                setDataListDetail([]);
                setValueChannel('');
            }
            setIsLoading(false);
            setReloadListHeader(!reloadListHeader);
        };

        apiNewHeader();
    }, [callApiNewHeader]);
    /* #endregion */

    //todo: call api update header
    /* #region  call api update */
    const [dialogIsOpenUpdate, setDialogIsOpenUpdate] = React.useState(false);
    const [callApiUpdate, setCallApiUpdate] = React.useState(false);
    const agreeDialogUpdate = () => {
        setDialogIsOpenUpdate(false);
        setCallApiUpdate(!callApiUpdate);
    };
    const closeDialogUpdate = () => {
        setDialogIsOpenUpdate(false);
        toast.warning(t('toast-cancel-update'));
    };

    useEffect(() => {
        const apiUpdate = async () => {
            setIsLoading(true);
            const statusCode = await ApiUpdateCostAllocationHeader(
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
                dataList,
            );
            if (statusCode) {
                setValueButtonUpdate(false);
                setValueDisabledSaveButton(true);
                setValueReadonly(true);
                setValueEditGrid(false);
                setReloadListDetail(!reloadListDetail);
            }
            setIsLoading(false);
            setReloadListHeader(!reloadListHeader);
        };
        apiUpdate();
    }, [callApiUpdate]);
    /* #endregion */

    //todo: call api get data detail
    /* #region  call api detail list */
    const [dataListDetail, setDataListDetail] = useState([]);
    const [reloadListDetail, setReloadListDetail] = useState([]);
    useEffect(() => {
        const process = async () => {
            setIsLoading(true);
            if (valueAllocationCode) {
                await ApiCostAllocationListDetail(valueAllocationCode, setDataListDetail);
            }
            setIsLoading(false);
        };
        process();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadListDetail]);
    /* #endregion */

    //todo: call api export file
    /* #region  call api export list */
    const [dataListExport, setDataListExport] = useState([]);
    const [buttonExport, setButtonExport] = useState(true);
    useEffect(() => {
        const process = async () => {
            setIsLoading(true);
            setButtonExport(true);
            await Api_Export_CostAllocation(setDataListExport);
            setIsLoading(false);
            setButtonExport(false);
        };
        process();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataListHeader]);

    const columnsExport = [
        {
            title: 'Allocation Code',
            dataIndex: 'doc_code',
            key: 'doc_code',
        },
        {
            title: 'Date',
            dataIndex: 'doc_date',
            key: 'doc_date',
        },
        {
            title: 'Allocation Desc',
            width: 300,
            dataIndex: 'desc_header',
            key: 'desc_header',
        },
        {
            title: 'Acc Group',
            dataIndex: 'acc_group',
            key: 'acc_group',
        },
        {
            title: 'Cost Center',
            dataIndex: 'cost_center',
            key: 'cost_center',
        },
        {
            title: 'Debit Acc',
            dataIndex: 'debit_acc',
            key: 'debit_acc',
        },
        {
            title: 'Credit Acc',
            dataIndex: 'credit_acc',
            key: 'credit_acc',
        },
        {
            title: 'Detail Date',
            dataIndex: 'allcation_date',
            key: 'allcation_date',
        },
        {
            title: 'Detail Desc',
            width: 300,
            dataIndex: 'desc_detail',
            key: 'desc_detail',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Status',
            dataIndex: 'status_display',
            key: 'status_display',
        },
        {
            title: 'Entry Doc',
            dataIndex: 'entry_doc',
            key: 'entry_doc',
        },
    ];

    //! handler click export file
    const handleClickExport = () => {
        const data = dataListExport.map((el) => {
            let doc_date = dayjs(el.doc_date);
            let allcation_date = dayjs(el.allcation_date);
            el.doc_date = doc_date.date() + '/' + (doc_date.month() + 1) + '/' + doc_date.year();
            el.allcation_date =
                allcation_date.date() + '/' + (allcation_date.month() + 1) + '/' + allcation_date.year();
            return el;
        });

        const excel = new Excel();
        excel
            .addSheet('Allocation List')
            .addColumns(columnsExport)
            .addDataSource(
                data.sort(function (a, b) {
                    return (
                        a.doc_code.localeCompare(b.doc_code) ||
                        a.allcation_date
                            .split('/')
                            .reverse()
                            .join()
                            .localeCompare(b.allcation_date.split('/').reverse().join())
                    );
                }),

                {
                    str2Percent: true,
                },
            )
            .saveAs(`Allocation_${dayjs().format('YYYYMMDD')}.xlsx`);
        // .saveAs(`Allocation_${dayjs().year()}${dayjs().month() + 1}${dayjs().date()}.xlsx`);
    };
    /* #endregion */

    const columnsDataDetail = [
        {
            field: 'actions',
            type: 'actions',
            headerName: t('actions'),
            width: 80,
            cellClassName: 'actions',
            headerClassName: 'super-app-theme--header',
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        key={id}
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
        {
            field: 'id',
            headerName: t('no'),
            width: 50,
            headerClassName: 'super-app-theme--header',
        },

        {
            field: 'doc_date',
            headerName: t('allocation-date-date'),
            width: 150,
            // editable: valueEditGrid,
            type: 'date',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            valueFormatter: (params) => dayjs(params.value).format('DD - MM - YYYY'),
        },
        {
            field: 'description',
            headerName: t('description'),
            minWidth: 400,
            // editable: valueEditGrid,
            flex: 1,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'amount',
            headerName: t('amount'),
            width: 150,
            // editable: valueEditGrid,
            type: 'number',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'status_display',
            headerName: t('status'),
            width: 100,
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'entry_doc_code',
            headerName: t('allocation-entry-code'),
            width: 140,
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
        },
    ];
    const [dataList, setDataList] = useState([]);

    /* #region  handle click edit detail */

    //todo: set data list detail
    useEffect(() => {
        if (dataListDetail.length !== 0) {
            const newData = dataListDetail.map((data) => {
                return {
                    ...data,
                    // is_new_item: 'is_new_item' in data,
                    // is_new_item: 'is_new_item' in data,
                    is_delete_item: 'is_delete_item' in data,
                    //doc_date: dayjs(data.doc_date).utc,
                };
            });
            setDataList(newData);
        }
    }, [dataListDetail]);

    //! handler click delete detail
    const handleDeleteClick = (id) => () => {
        // setDataListAccountEntryDetail(dataListAccountEntryDetail.filter((row) => row.detail_ids !== id));
        const row = {
            ...dataListDetail.filter((row) => row.id === id),
            is_delete_item: true,
        };
        const updatedRow = {
            ...row[0],
            is_delete_item: true,
        };
        setDataListDetail(dataListDetail.map((row) => (row.id === id ? updatedRow : row)));
    };

    /* #endregion */
    //! handler click import file
    const [fileExcel, setFileExcell] = React.useState([]);
    const handleClickChoseFile = (event) => {
        setFileExcell(event.target.files);
    };
    const handleClickImportFile = () => {
        let fileType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
        if (fileExcel.length === 0) {
            toast.warn(t('toast-nofile'));
        } else {
            if (fileExcel && fileType.includes(fileExcel[0].type)) {
                let reader = new FileReader();
                reader.readAsArrayBuffer(fileExcel[0]);
                reader.onload = (e) => {
                    const data = e.target.result;
                    const workbook = xlsx.read(data, { type: 'buffer' });
                    const worksheetname = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[worksheetname];
                    const dataExcel = xlsx.utils.sheet_to_json(worksheet, { raw: false });
                    const dataExcelTransfer = dataExcel.map((data) => {
                        return {
                            id: data.No,
                            detail_ids: data.No,
                            doc_date: dayjs(data.Date).utc(true),
                            description: data.Description,
                            amount: data.Amount,
                            is_new_item: true,
                        };
                    });
                    const dataDetail = dataListDetail
                        .filter((data) => data.is_delete_item !== true)
                        .map((data) => {
                            return {
                                id: data.id,
                                detail_ids: data.detail_ids,
                                doc_date: data.doc_date,
                                description: data.description,
                                amount: data.amount,
                                is_new_item: false,
                            };
                        });
                    const test = dataExcelTransfer.concat(dataDetail);
                    setDataListDetail(dataExcelTransfer.concat(dataDetail));
                };
                setFileExcell(null);
            } else {
                setFileExcell(null);
                toast.warn(t('toast-fileexcel'));
            }
        }
    };

    //! on key event
    OnKeyEvent(() => setReloadListHeader(!reloadListHeader), 'Enter');
    OnMultiKeyEvent(handleClickNewHeader, valueButtonNew ? '' : 'n');
    OnMultiKeyEvent(handleClickUpdateHeader, valueButtonUpdate ? '' : 'u');
    OnMultiKeyEvent(handleClickSaveHeader, valueDisabledSaveButton ? '' : 's');
    OnMultiKeyEvent(handleClickButtonProcess, valueButtonProcess ? '' : 'r');
    OnMultiKeyEvent(handleClickButtonPause, valueButtonPause ? '' : 'p');
    OnMultiKeyEvent(() => handleClickOpenDialogDetail(true), !valueEditGrid ? '' : 'a');
    // OnMultiKeyEvent(handleOnClickNewAeDetail, !valueEditGrid ? '' : 'a');
    OnMultiKeyEvent(handleClickImportFile, 'f');

    const [isNew, setIsNew] = React.useState(false);
    const [dataUpdate, setDataUpdate] = React.useState([]);
    const [openDialogDetail, setOpenDialogDetail] = React.useState(false);
    const handleClickOpenDialogDetail = (isnew) => {
        setOpenDialogDetail(true);
        setIsNew(isnew);
        setValueDisabledSaveButton(true);
    };

    const handleCloseDialogDetail = () => {
        setOpenDialogDetail(false);
        setValueDisabledSaveButton(false);
    };

    //? Mobile
    //! button phan bo header
    const mobileButtonAllocation = (
        <Stack direction={'row'} justifyContent={'flex-end'} spacing={2} sx={{ display: { xs: 'flex', md: 'none' } }}>
            <LoadingButton
                startIcon={<CurrencyExchangeIcon />}
                variant="contained"
                color="secondary"
                loading={valueButtonProcess}
                loadingPosition="start"
                disabled={valueButtonProcess}
                onClick={handleClickButtonProcess}
                sx={{
                    display: valueButtonProcess ? 'none' : null,
                    whiteSpace: 'nowrap',
                }}
            >
                {t('button-process')}
            </LoadingButton>

            <LoadingButton
                startIcon={<StopCircleIcon />}
                variant="contained"
                color="error"
                disabled={valueButtonPause}
                onClick={handleClickButtonPause}
                sx={{
                    display: valueButtonPause ? 'none' : null,
                    whiteSpace: 'nowrap',
                }}
            >
                {t('button-pause')}
            </LoadingButton>
        </Stack>
    );
    //! button new update save header
    const mobileButtonheader = (
        <Stack direction={'column'} spacing={1} sx={{ display: { xs: 'flex', md: 'none' } }}>
            <Stack direction={'row'} spacing={1} justifyContent={'space-between'}>
                <LoadingButton
                    fullWidth
                    startIcon={<AddBoxIcon />}
                    variant="contained"
                    color="success"
                    onClick={handleClickNewHeader}
                    disabled={valueButtonNew}
                    loading={valueButtonNew}
                    loadingPosition="start"
                    sx={{
                        whiteSpace: 'nowrap',
                    }}
                >
                    {t('button-new')}
                </LoadingButton>

                <LoadingButton
                    fullWidth
                    startIcon={<SystemUpdateAltIcon />}
                    variant="contained"
                    color="warning"
                    onClick={handleClickUpdateHeader}
                    disabled={valueButtonUpdate}
                    loading={valueButtonUpdate}
                    loadingPosition="start"
                    sx={{
                        whiteSpace: 'nowrap',
                    }}
                >
                    {t('button-update')}
                </LoadingButton>
            </Stack>

            <LoadingButton
                startIcon={<SaveIcon />}
                variant="contained"
                color="primary"
                onClick={handleClickSaveHeader}
                disabled={valueDisabledSaveButton}
            >
                {t('button-save')}
            </LoadingButton>
        </Stack>
    );
    //! button detail
    const mobileButtonDetail = (
        <Stack
            width={'100%'}
            direction={'row'}
            spacing={2}
            alignItems={'center'}
            justifyContent={'flex-end'}
            sx={{ display: { xs: 'flex', md: 'none' } }}
        >
            <LoadingButton
                component="label"
                role={undefined}
                variant="outlined"
                tabIndex={-1}
                startIcon={<PostAddIcon />}
                sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                {fileExcel
                    ? fileExcel.length > 0
                        ? fileExcel[0].name.slice(0, 20) + '...'
                        : t('button-import')
                    : t('button-import')}
                <VisuallyHiddenInput type="file" onChange={handleClickChoseFile} />
            </LoadingButton>
            <LoadingButton
                component="label"
                role={undefined}
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={handleClickImportFile}
                disabled={!valueEditGrid}
                sx={{ whiteSpace: 'nowrap' }}
            >
                {t('button-upload')}
            </LoadingButton>
        </Stack>
    );
    return (
        <Spin size="large" tip={'Loading'} spinning={valueIsLoading}>
            <div className="main">
                <ToastContainer position='bottom-right' stacked />
                {dialogIsOpenNewHeader && (
                    <AlertDialog
                        title={t('allocation-toast-new')}
                        content={
                            <>
                                {t('description')}: {valueDescription}
                                <br /> {t('account-group')}: {valueAccountGroup}
                                <br />
                                {t('allocation-debit-entry')}: {valueDebitEntry}
                                <br /> {t('allocation-credit-entry')}: {valueCreditEntry}
                            </>
                        }
                        onOpen={dialogIsOpenNewHeader}
                        onClose={closeDialogNewHeader}
                        onAgree={agreeDialogNewHeader}
                    />
                )}
                {dialogIsOpenUpdate && (
                    <AlertDialog
                        title={t('allocation-toast-update')}
                        content={
                            <>
                                {t('allocation-code')}: {valueAllocationCode}
                                <br /> {t('description')}: {valueDescription}
                                <br /> {t('account-group')}: {valueAccountGroup}
                                <br />
                                {t('allocation-debit-entry')}: {valueDebitEntry}
                                <br /> {t('allocation-credit-entry')}: {valueCreditEntry}
                            </>
                        }
                        onOpen={dialogIsOpenUpdate}
                        onClose={closeDialogUpdate}
                        onAgree={agreeDialogUpdate}
                    />
                )}
                {openDialogDetail && (
                    <DialogDetailAllocation
                        isNew={isNew}
                        onOpen={openDialogDetail}
                        onClose={handleCloseDialogDetail}
                        dataList={dataList}
                        dataUpdate={dataUpdate}
                        setDataListDetail={setDataListDetail}
                    />
                )}
                <div role="presentation">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            underline="hover"
                            color="inherit"
                            href="/material-ui/getting-started/installation/"
                        ></Link>
                        <Typography color="text.primary">{t(title)}</Typography>
                    </Breadcrumbs>
                </div>
                <Box
                    sx={{
                        width: '100%',
                        typography: 'body',
                        '& .super-app-theme--header': {
                            backgroundColor: '#ffc696',
                        },
                    }}
                >
                    <Grid container spacing={1}>
                        <Grid xs={12} md={12} sx={{ width: '100%' }}>
                            <Item>
                                <Grid container xs={12} md={12} spacing={1}>
                                    <Grid xs={12} md={6}>
                                        <Stack
                                            direction={'row'}
                                            spacing={1}
                                            alignItems={'center'}
                                            justifyContent={'flex-start'}
                                        >
                                            <h6 style={{ whiteSpace: 'nowrap' }}>{t('status')}</h6>
                                            <FormControl
                                                sx={{
                                                    m: 1,
                                                    width: '100%',
                                                    // minWidth: 100,
                                                    // maxWidth: 200,
                                                }}
                                                size="small"
                                            >
                                                <Select
                                                    value={valueStatus}
                                                    displayEmpty
                                                    onChange={handleChangeStatus}
                                                // onChange={(e) => setValueStatus(e.target.value)}
                                                >
                                                    {status.map((data) => {
                                                        return (
                                                            <MenuItem key={data.code} value={data.code}>
                                                                {data.name}
                                                            </MenuItem>
                                                        );
                                                    })}
                                                </Select>
                                            </FormControl>
                                        </Stack>
                                    </Grid>
                                    <Grid xs={12} md={6}>
                                        <Stack
                                            direction={'row'}
                                            spacing={1}
                                            alignItems={'center'}
                                            justifyContent={'flex-start'}
                                        >
                                            <TextField
                                                id="outlined-basic"
                                                variant="outlined"
                                                fullWidth
                                                label={t('button-search')}
                                                size="small"
                                                value={valueSearch}
                                                onChange={(event) => handleOnChangeValueSearch(event)}
                                            />

                                            <div>
                                                <LoadingButton
                                                    startIcon={<SearchIcon />}
                                                    variant="contained"
                                                    color="warning"
                                                    onClick={() => setReloadListHeader(!reloadListHeader)}
                                                    sx={{ whiteSpace: 'nowrap' }}
                                                >
                                                    {t('button-search')}
                                                </LoadingButton>
                                            </div>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Item>
                        </Grid>

                        <Grid xs={12} md={12} sx={{ width: '100%' }}>
                            <Item>
                                <Grid container>
                                    <Grid xs={12} md={12}>
                                        <Stack
                                            width={'100%'}
                                            direction={'row'}
                                            spacing={2}
                                            alignItems={'center'}
                                            justifyContent={'flex-start'}
                                            height={50}
                                        >
                                            <>
                                                <h5
                                                    style={{
                                                        fontWeight: 'bold',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {t('allocation-list')}
                                                </h5>
                                                <LoadingButton
                                                    startIcon={<FileDownloadIcon />}
                                                    variant="contained"
                                                    color="info"
                                                    onClick={handleClickExport}
                                                    loading={buttonExport}
                                                    loadingPosition="start"
                                                    sx={{ whiteSpace: 'nowrap' }}
                                                >
                                                    {t('button-export')}
                                                </LoadingButton>
                                            </>
                                        </Stack>
                                    </Grid>
                                    <Grid xs={12} md={12}>
                                        <Stack spacing={0}>
                                            <div style={{ width: '100%' }}>
                                                <DataGrid
                                                    rows={dataListHeader}
                                                    columns={columnsHeader}
                                                    initialState={{
                                                        pagination: {
                                                            paginationModel: {
                                                                page: 0,
                                                                pageSize: 5,
                                                            },
                                                        },
                                                    }}
                                                    pageSizeOptions={[5, 10, 15]}
                                                    autoHeight
                                                    getRowId={(row) => row.doc_code}
                                                    loading={valueIsLoading}
                                                    onRowSelectionModelChange={(ids) =>
                                                        onHandleRowsSelectionHeader(ids)
                                                    }
                                                    showCellVerticalBorder
                                                    showColumnVerticalBorder
                                                />
                                            </div>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Item>
                        </Grid>

                        <Grid xs={12} md={12}>
                            <Item>
                                <Grid>
                                    <Grid xs={12} md={12}>
                                        {mobileButtonAllocation}
                                        <Stack
                                            width={'100%'}
                                            direction={'row'}
                                            spacing={2}
                                            alignItems={'center'}
                                            justifyContent={'flex-end'}
                                            height={50}
                                        >
                                            <>
                                                <h5
                                                    style={{
                                                        fontWeight: 'bold',
                                                        textAlign: 'left',
                                                        width: '100%',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {t('allocation-infor')}
                                                </h5>
                                            </>
                                            <Stack
                                                direction={'row'}
                                                spacing={1}
                                                sx={{ display: { xs: 'none', md: 'flex' } }}
                                            >
                                                <LoadingButton
                                                    startIcon={<AddBoxIcon />}
                                                    variant="contained"
                                                    color="success"
                                                    onClick={handleClickNewHeader}
                                                    disabled={valueButtonNew}
                                                    loading={valueButtonNew}
                                                    loadingPosition="start"
                                                    sx={{
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {t('button-new')}
                                                </LoadingButton>

                                                <LoadingButton
                                                    startIcon={<SystemUpdateAltIcon />}
                                                    variant="contained"
                                                    color="warning"
                                                    onClick={handleClickUpdateHeader}
                                                    disabled={valueButtonUpdate}
                                                    loading={valueButtonUpdate}
                                                    loadingPosition="start"
                                                    sx={{
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {t('button-update')}
                                                </LoadingButton>

                                                <LoadingButton
                                                    startIcon={<SaveIcon />}
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleClickSaveHeader}
                                                    disabled={valueDisabledSaveButton}
                                                >
                                                    {t('button-save')}
                                                </LoadingButton>

                                                <LoadingButton
                                                    startIcon={<CurrencyExchangeIcon />}
                                                    variant="contained"
                                                    color="secondary"
                                                    loading={valueButtonProcess}
                                                    loadingPosition="start"
                                                    disabled={valueButtonProcess}
                                                    onClick={handleClickButtonProcess}
                                                    sx={{
                                                        display: valueButtonProcess ? 'none' : null,
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {t('button-process')}
                                                </LoadingButton>

                                                <LoadingButton
                                                    startIcon={<StopCircleIcon />}
                                                    variant="contained"
                                                    color="error"
                                                    disabled={valueButtonPause}
                                                    onClick={handleClickButtonPause}
                                                    sx={{
                                                        display: valueButtonPause ? 'none' : null,
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {t('button-pause')}
                                                </LoadingButton>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                    <Grid xs={12} md={12} sx={{ width: '100%' }}>
                                        <Item>
                                            <Grid container xs={12} md={12} spacing={1}>
                                                <Grid xs={12} md={6}>
                                                    <Stack
                                                        direction={'row'}
                                                        spacing={2}
                                                        alignItems={'center'}
                                                        justifyContent={'flex-start'}
                                                    >
                                                        <h6 style={{ width: '40%' }}>{t('allocation-code')}</h6>
                                                        <TextField
                                                            variant="outlined"
                                                            fullWidth
                                                            size="small"
                                                            placeholder="xxxxxx"
                                                            value={valueAllocationCode}
                                                            onChange={(e) => setValueAllocationCode(e.target.value)}
                                                            disabled
                                                        // inputProps={{ readOnly: { valueDisabledText } }}
                                                        // disabled={valueDisabledText}
                                                        />
                                                    </Stack>
                                                </Grid>

                                                <Grid xs={12} md={6}>
                                                    <Stack
                                                        direction={'row'}
                                                        spacing={2}
                                                        alignItems={'center'}
                                                        justifyContent={'flex-start'}
                                                    >
                                                        <h6 style={{ width: '40%' }}>{t('entry-posting-date')}</h6>
                                                        <div style={{ width: '100%' }}>
                                                            <LocalizationProvider
                                                                dateAdapter={AdapterDayjs}
                                                                sx={{ width: '100%' }}
                                                            >
                                                                <DemoContainer
                                                                    components={['DatePicker']}
                                                                    sx={{ paddingTop: 0 }}
                                                                >
                                                                    <DatePicker
                                                                        // label={'"month" and "year"'}
                                                                        // views={['month', 'year']}
                                                                        value={valueDocDate}
                                                                        // sx={{ width: 300 }}
                                                                        slotProps={{
                                                                            textField: { size: 'small' },
                                                                        }}
                                                                        formatDensity="spacious"
                                                                        format="DD-MM-YYYY"
                                                                        onChange={(e) => setValueDocDate(e)}
                                                                        disabled={valueReadonly}
                                                                    />
                                                                </DemoContainer>
                                                            </LocalizationProvider>
                                                        </div>
                                                    </Stack>
                                                </Grid>

                                                <Grid xs={12} md={6}>
                                                    <Stack
                                                        direction={'row'}
                                                        spacing={2}
                                                        alignItems={'center'}
                                                        justifyContent={'flex-start'}
                                                    >
                                                        <h6 style={{ width: '40%' }}>{t('entry-user')}</h6>
                                                        <TextField
                                                            variant="outlined"
                                                            fullWidth
                                                            size="small"
                                                            placeholder="name"
                                                            value={valueUser}
                                                            onChange={(e) => setValueUser(e.target.value)}
                                                            disabled
                                                        />
                                                    </Stack>
                                                </Grid>

                                                <Grid xs={12} md={6}>
                                                    <Stack
                                                        direction={'row'}
                                                        spacing={2}
                                                        alignItems={'center'}
                                                        justifyContent={'flex-start'}
                                                    >
                                                        <h6 style={{ width: '40%' }}>{t('allocation-date')}</h6>
                                                        <div style={{ width: '100%' }}>
                                                            <LocalizationProvider
                                                                dateAdapter={AdapterDayjs}
                                                                sx={{ width: '100%' }}
                                                            >
                                                                <DemoContainer
                                                                    components={['DatePicker']}
                                                                    sx={{ paddingTop: 0 }}
                                                                >
                                                                    <DatePicker
                                                                        // label={'"month" and "year"'}
                                                                        // views={['month', 'year']}
                                                                        value={valueUpdateDate}
                                                                        // sx={{ width: 300 }}
                                                                        slotProps={{
                                                                            textField: { size: 'small' },
                                                                        }}
                                                                        formatDensity="spacious"
                                                                        format="DD-MM-YYYY"
                                                                        onChange={(e) => setValueUpdateDate(e)}
                                                                        disabled
                                                                    />
                                                                </DemoContainer>
                                                            </LocalizationProvider>
                                                        </div>
                                                    </Stack>
                                                </Grid>

                                                <Grid xs={12} md={6}>
                                                    <Stack
                                                        direction={'row'}
                                                        spacing={2}
                                                        alignItems={'center'}
                                                        justifyContent={'flex-start'}
                                                    >
                                                        <h6 style={{ width: '40%' }}>{t('cost-center')}</h6>
                                                        <Select
                                                            fullWidth
                                                            autoFocus
                                                            size="small"
                                                            value={valueCostCenter}
                                                            onChange={(e) => setValueCostCenter(e.target.value)}
                                                            disabled={valueReadonly}
                                                        >
                                                            {listCostCenter &&
                                                                listCostCenter.map((data) => {
                                                                    return (
                                                                        <MenuItem key={data.code} value={data.code}>
                                                                            {data.name}
                                                                        </MenuItem>
                                                                    );
                                                                })}
                                                        </Select>
                                                    </Stack>
                                                </Grid>

                                                <Grid xs={12} md={6}>
                                                    <Stack
                                                        direction={'row'}
                                                        spacing={2}
                                                        alignItems={'center'}
                                                        justifyContent={'flex-start'}
                                                    >
                                                        <h6 style={{ width: '40%' }}>{t('account-group')}</h6>
                                                        <FormControl
                                                            sx={{
                                                                m: 1,
                                                                width: '100%',
                                                                // minWidth: 100,
                                                                // maxWidth: 200,
                                                            }}
                                                            size="small"
                                                        >
                                                            <Select
                                                                value={valueAccountGroup}
                                                                displayEmpty
                                                                onChange={(e) => setValueAccountGroup(e.target.value)}
                                                                disabled={valueReadonly}
                                                            >
                                                                {dataListAccountGroup.map((data) => {
                                                                    return (
                                                                        <MenuItem
                                                                            key={data.gr_acc_code}
                                                                            value={data.gr_acc_code}
                                                                        >
                                                                            {data.gr_acc_code} - {data.gr_acc_name}
                                                                        </MenuItem>
                                                                    );
                                                                })}
                                                            </Select>
                                                        </FormControl>
                                                    </Stack>
                                                </Grid>
                                                <Grid xs={12} md={6}>
                                                    <Stack
                                                        direction={'row'}
                                                        spacing={2}
                                                        alignItems={'center'}
                                                        justifyContent={'flex-start'}
                                                    >
                                                        <h6 style={{ width: '40%' }}>{t('description')}</h6>
                                                        <Form.Control
                                                            type="text"
                                                            as="textarea"
                                                            rows={3}
                                                            placeholder="..."
                                                            value={valueDescription}
                                                            onChange={(e) => setValueDescription(e.target.value)}
                                                            disabled={valueReadonly}
                                                        />
                                                    </Stack>
                                                </Grid>
                                                <Grid xs={12} md={6}>
                                                    <Stack direction={'column'} spacing={1}>
                                                        <Stack
                                                            direction={'row'}
                                                            spacing={2}
                                                            alignItems={'center'}
                                                            justifyContent={'flex-start'}
                                                        >
                                                            <h6 style={{ width: '40%' }}>{t('currency')}</h6>
                                                            <FormControl
                                                                sx={{
                                                                    m: 1,
                                                                    width: '100%',
                                                                    // minWidth: 100,
                                                                    // maxWidth: 200,
                                                                }}
                                                                size="small"
                                                            >
                                                                <Select
                                                                    value={valueCurrency}
                                                                    displayEmpty
                                                                    onChange={(e) => setValueCurrency(e.target.value)}
                                                                    disabled={valueReadonly}
                                                                >
                                                                    {dataListCurrency.map((data) => {
                                                                        return (
                                                                            <MenuItem key={data.code} value={data.code}>
                                                                                {data.name}
                                                                            </MenuItem>
                                                                        );
                                                                    })}
                                                                </Select>
                                                            </FormControl>
                                                        </Stack>
                                                        <Stack
                                                            direction={'row'}
                                                            spacing={2}
                                                            alignItems={'center'}
                                                            justifyContent={'flex-start'}
                                                        >
                                                            <h6 style={{ width: '40%' }} hidden={valueHideCostChannel}>
                                                                {t('cost-channel')}
                                                            </h6>
                                                            <FormControl
                                                                sx={{
                                                                    m: 1,
                                                                    width: '100%',
                                                                    // minWidth: 100,
                                                                    // maxWidth: 200,
                                                                }}
                                                                size="small"
                                                            >
                                                                <Select
                                                                    autoFocus
                                                                    size="small"
                                                                    value={valueChannel}
                                                                    hidden={valueHideCostChannel}
                                                                    onChange={(e) => setValueChannel(e.target.value)}
                                                                    disabled={valueReadonly}
                                                                >
                                                                    {listChannel &&
                                                                        listChannel.map((data) => {
                                                                            return (
                                                                                <MenuItem
                                                                                    key={data.code}
                                                                                    value={data.code}
                                                                                >
                                                                                    {data.channel_name}
                                                                                </MenuItem>
                                                                            );
                                                                        })}
                                                                </Select>
                                                            </FormControl>
                                                        </Stack>
                                                    </Stack>
                                                </Grid>
                                                <Grid container xs={12} md={12}>
                                                    <Grid xs={12} md={6}>
                                                        <Stack
                                                            direction={'row'}
                                                            spacing={2}
                                                            alignItems={'center'}
                                                            justifyContent={'flex-start'}
                                                        >
                                                            <h6 style={{ width: '40%' }}>
                                                                {t('allocation-credit-entry')}
                                                            </h6>
                                                            <div style={{ width: '100%' }}>
                                                                <Autocomplete
                                                                    fullWidth
                                                                    componentsProps={{
                                                                        popper: {
                                                                            style: { width: 'fit-content' },
                                                                        },
                                                                    }}
                                                                    size="small"
                                                                    disabled={valueReadonly}
                                                                    // freeSolo
                                                                    value={valueCreditAuto}
                                                                    onChange={(event, newValue) => {
                                                                        handleChangeAccCredit(newValue);
                                                                    }}
                                                                    options={dataListAccount}
                                                                    getOptionLabel={(option) =>
                                                                        `${option.account_code_display ?? ''} - ${option.account_name ?? ''
                                                                        }`
                                                                    }
                                                                    renderInput={(params) => <TextField {...params} />}
                                                                />
                                                            </div>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid xs={12} md={6}>
                                                        <Stack
                                                            direction={'row'}
                                                            spacing={2}
                                                            alignItems={'center'}
                                                            justifyContent={'flex-start'}
                                                        >
                                                            <h6 style={{ width: '40%' }}>
                                                                {t('allocation-debit-entry')}
                                                            </h6>

                                                            <div style={{ width: '100%' }}>
                                                                <Autocomplete
                                                                    fullWidth
                                                                    componentsProps={{
                                                                        popper: {
                                                                            style: { width: 'fit-content' },
                                                                        },
                                                                    }}
                                                                    size="small"
                                                                    disabled={valueReadonly}
                                                                    // freeSolo
                                                                    value={valueDebitAuto}
                                                                    onChange={(event, newValue) => {
                                                                        handleChangeAccDebit(newValue);
                                                                    }}
                                                                    options={dataListAccount}
                                                                    getOptionLabel={(option) =>
                                                                        `${option.account_code_display ?? ''} - ${option.account_name ?? ''
                                                                        }`
                                                                    }
                                                                    renderInput={(params) => <TextField {...params} />}
                                                                />
                                                            </div>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Item>
                                    </Grid>
                                    {mobileButtonheader}
                                </Grid>
                            </Item>
                        </Grid>
                        <Grid xs={12} md={12}>
                            <Item>
                                {mobileButtonDetail}
                                <Grid container spacing={2}>
                                    <Grid xs={12} md={12}>
                                        <Stack
                                            width={'100%'}
                                            direction={'row'}
                                            spacing={2}
                                            alignItems={'center'}
                                            justifyContent={'flex-end'}
                                            height={50}
                                        >
                                            <h5
                                                style={{
                                                    fontWeight: 'bold',
                                                    textAlign: 'left',
                                                    width: '100%',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {t('entry-title-detail')}
                                            </h5>
                                            <Stack direction={'row'} spacing={1}>
                                                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                                                    <Stack direction={'row'} spacing={1}>
                                                        <LoadingButton
                                                            component="label"
                                                            role={undefined}
                                                            variant="outlined"
                                                            tabIndex={-1}
                                                            startIcon={<PostAddIcon />}
                                                            sx={{
                                                                width: 300,
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                            }}
                                                            disabled={!valueEditGrid}
                                                        >
                                                            {fileExcel
                                                                ? fileExcel.length > 0
                                                                    ? fileExcel[0].name.slice(0, 25) + '...'
                                                                    : t('button-import')
                                                                : t('button-import')}
                                                            <VisuallyHiddenInput
                                                                type="file"
                                                                onChange={handleClickChoseFile}
                                                            />
                                                        </LoadingButton>

                                                        <LoadingButton
                                                            component="label"
                                                            role={undefined}
                                                            variant="contained"
                                                            startIcon={<CloudUploadIcon />}
                                                            onClick={handleClickImportFile}
                                                            disabled={!valueEditGrid}
                                                            sx={{ whiteSpace: 'nowrap' }}
                                                        >
                                                            {t('button-upload')}
                                                        </LoadingButton>
                                                    </Stack>
                                                </Box>

                                                <LoadingButton
                                                    startIcon={<AddBoxIcon />}
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() => handleClickOpenDialogDetail(true)}
                                                    // onClick={handleOnClickNewAeDetail}
                                                    sx={{ alignItems: 'left', whiteSpace: 'nowrap' }}
                                                    disabled={!valueEditGrid}
                                                >
                                                    {t('button-detail')}
                                                </LoadingButton>
                                            </Stack>
                                        </Stack>
                                    </Grid>

                                    <Grid xs={12} md={12} sx={{ width: '100%' }}>
                                        <Item>
                                            <Stack spacing={0}>
                                                <div style={{ width: '100%', minHeight: 500 }}>
                                                    <DataGrid
                                                        columnVisibilityModel={columnVisibilityModel}
                                                        rows={dataListDetail.filter(
                                                            (data) => data.is_delete_item !== true,
                                                        )}
                                                        columns={columnsDataDetail}
                                                        autoHeight
                                                        showCellVerticalBorder
                                                        showColumnVerticalBorder
                                                        getRowId={(id) => id.id}
                                                        loading={valueIsLoading}
                                                        onRowDoubleClick={(params) => {
                                                            valueEditGrid && handleClickOpenDialogDetail(false);
                                                            setDataUpdate(params.row);
                                                        }}
                                                        // editMode="row"
                                                        // rowModesModel={rowModesModel}
                                                        // onRowModesModelChange={handleRowModesModelChange}
                                                        // onRowEditStop={handleRowEditStop}
                                                        // processRowUpdate={processRowUpdate}
                                                        slotProps={{
                                                            baseSelect: {
                                                                MenuProps: {
                                                                    PaperProps: {
                                                                        sx: {
                                                                            maxHeight: 250,
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </div>
                                            </Stack>
                                        </Item>
                                    </Grid>
                                </Grid>
                            </Item>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </Spin>
    );
}

export default CostAllocation;
