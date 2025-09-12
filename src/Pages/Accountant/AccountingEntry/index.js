import React from 'react';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import {
    GridRowModes,
    DataGrid,
    GridActionsCellItem,
    GridToolbarContainer,
    GridRowEditStopReasons,
} from '@mui/x-data-grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import LoadingButton from '@mui/lab/LoadingButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SearchIcon from '@mui/icons-material/Search';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { toast, ToastContainer } from 'react-toastify';
import AlertDialog from '~/components/AlertDialog';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PostAddIcon from '@mui/icons-material/PostAdd';
import {
    ApiAccountEntryListDetail,
    ApiAccountEntryListHeader,
    ApiCreateAccountEntryHeader,
    ApiDeleteAccountEntryHeader,
    ApiImportAccountEntry,
    ApiLoadMemoFromFA,
    ApiMemoListHeader,
    ApiUpdateAccountEntryHeader,
} from '~/components/Api/AccountingEntryApi';

import TextField from '@mui/material/TextField';
// import MuiTextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { useSelector } from 'react-redux';
import DialogDetail from './DialogDetail';
import DialogDetailMemo from './DialogDetailMemo';
import { OnKeyEvent } from '~/components/Event/OnKeyEvent';
import { OnMultiKeyEvent } from '~/components/Event/OnMultiKeyEvent';
import { Input, Spin } from 'antd';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useTranslation } from 'react-i18next';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';

var utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

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

function AccountingEntry({ title }) {
    const access_token = useSelector((s) => s.FetchApi.token);
    const [buttonSelectMode, setButtonSelectMode] = React.useState(false);
    const [valueReadonly, setValueReadonly] = React.useState(true);
    const [valueReadonlyPostingDate, setValueReadonlyPostingDate] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);
    const [valueSearchAccountingEntry, setValueSearchAccountingEntry] = React.useState('');
    const [reloadListAccountingEntryHeader, setReloadListAccountingEntryHeader] = React.useState(false);
    const { t } = useTranslation();
    const handleOnChangeValueSearch = (event) => {
        setValueSearchAccountingEntry(event.target.value);
    };
    const [valueEditGrid, setValueEditGrid] = React.useState(false);

    //! column header datagrid
    const columnsDataAeHeader = [
        {
            field: 'doc_code',
            headerName: t('entry-code'),
            width: 150,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'doc_date',
            headerName: t('entry-posting-date'),
            width: 150,
            valueFormatter: (params) => dayjs(params.value).format('DD - MM - YYYY'),
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'grp_acc',
            headerName: t('account-group'),
            width: 120,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'description',
            headerName: t('description'),
            minWidth: 400,
            flex: 1,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'import_code',
            headerName: t('entry-import-code'),
            width: 150,
            headerClassName: 'super-app-theme--header',
        },
    ];

    //! visibility column in datagrid
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
    /* #region  handle value */
    const [valueCodeAe, setValueCodeAe] = useState('');
    const [valueUserAe, setValueUserAe] = useState('');
    const [valueDescriptionAe, setValueDescriptionAe] = useState('');
    const [valueDocsDateAe, setValueDocsDateAe] = useState(dayjs());
    const [valueDateAe, setValueDateAe] = useState(dayjs());
    const [valueCostCenterAe, setValueCostCenterAe] = useState('');
    const [valueTotalDebitAe, setValueTotalDebitAe] = useState(0);
    const [valueTotalCreditAe, setValueTotalCreditAe] = useState(0);
    const handleChangeValueCodeAe = (event) => {
        setValueCodeAe(event.target.value);
    };
    const handleChangeValueUserAe = (event) => {
        setValueUserAe(event.target.value);
    };
    const handleChangeValueDescriptionAe = (event) => {
        setValueDescriptionAe(event.target.value);
    };
    const handleChangeValueDocsDateAe = (event) => {
        setValueDocsDateAe(event);
    };
    const handleChangeValueDateAe = (event) => {
        setValueDateAe(event);
    };
    /* #endregion */

    //! get data period from redux
    const dataPeriod_From_Redux = useSelector((state) => state.FetchApi.listData_Period.acc_date);
    const [valueDateAccountPeriod, setValueDateAccountPeriod] = React.useState(dayjs());
    useEffect(() => {
        setValueDateAccountPeriod(dayjs(dataPeriod_From_Redux));
    }, [dataPeriod_From_Redux]);
    const handleOnChangeDateAccountPeriod = (event) => {
        setValueDateAccountPeriod(event);
    };

    //todo call api get data list header entry
    const [dataListAEHeader, setDataAEListHeader] = useState([]);
    const [dataList, setDataList] = useState([]);
    useEffect(() => {
        const callApiDataListHeader = async () => {
            setIsLoading(true);
            if (dataPeriod_From_Redux) {
                await ApiAccountEntryListHeader(
                    valueDateAccountPeriod.month() + 1,
                    valueDateAccountPeriod.year(),
                    valueSearchAccountingEntry,
                    setDataAEListHeader,
                );
            }
            setIsLoading(false);
        };
        callApiDataListHeader();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadListAccountingEntryHeader, valueDateAccountPeriod]);

    //! select row datagrid header entry
    const [selectedRows, setValueSelectedRows] = useState([]);
    const onHandleRowsSelectionAeHeader = (ids) => {
        const selectedRowsData = ids.map((id) => dataListAEHeader.find((row) => row.doc_code === id));
        if (selectedRowsData) {
            {
                setValueSelectedRows(ids);
                selectedRowsData.map((key) => {
                    setValueCodeAe(key.doc_code);
                    setValueDocsDateAe(dayjs(key.doc_date));
                    setValueDescriptionAe(key.description);
                    setValueDateAe(dayjs(key.updated_date));
                    setValueUserAe(key.updated_by);
                    setValueAccountGroupAE(key.grp_acc);
                    setValueCurrency(key.currency);
                    setValueTotalDebitAe(key.total_debit);
                    setValueTotalCreditAe(key.total_credit);
                    setValueNewButton(false);
                    setValueUpdateButton(false);
                    setValueDisableSaveButton(true);
                    setValueReadonly(true);
                    setValueReadonlyPostingDate(true);
                    setValueEditGrid(false);
                });
                setReloadListAeDetail(!reloadListAeDetail);
            }
        }
    };

    //! get data acc group from redux
    /* #region  call api account group */
    const [valueAccountGroupAE, setValueAccountGroupAE] = useState(9000);
    const dataListAccountGroup = useSelector((s) => s.FetchApi.listData_AccountGroup);
    const handleChangeAccountGroupAE = (event) => {
        setValueAccountGroupAE(event.target.value);
    };
    const handleChangeAccountGroupMemo = (event) => {
        setValueAccountGroupMemo(event.target.value);
    };
    /* #endregion */

    //! get data currency from redux
    /* #region  call api currency */
    const dataListCurrency = useSelector((s) => s.FetchApi.listData_Currency);
    const [valueCurrency, setValueCurrency] = useState('VND');
    const handleChangeCurren = (event) => {
        setValueCurrency(event.target.value);
    };

    /* #endregion */

    //todo: call api new Entry
    /* #region  call api new */
    const [valueNewButton, setValueNewButton] = React.useState(false);
    const [dialogIsOpenNewAeHeader, setDialogIsOpenNewAeHeader] = React.useState(false);
    const [callApiNewAeHeader, setCallApiNewAeHeader] = React.useState(false);
    const agreeDialogNewAeHeader = () => {
        setDialogIsOpenNewAeHeader(false);
        setCallApiNewAeHeader(!callApiNewAeHeader);
    };
    const closeDialogNewAeHeader = () => {
        setDialogIsOpenNewAeHeader(false);
        toast.warning(t('toast-cancel-new'));
    };
    const handleOnClickNewAeHeader = () => {
        setValueNewButton(true);
        setValueUpdateButton(false);
        setValueDisableSaveButton(false);

        setValueCodeAe('');
        setValueUserAe(localStorage.getItem('UserName'));
        setValueDescriptionAe('');
        setValueDocsDateAe(dayjs());
        setValueDateAe(dayjs());
        setValueAccountGroupAE(9000);
        setValueTotalDebitAe(0);
        setValueTotalCreditAe(0);
        setDataListAccountEntryDetail([]);
        setDataList([]);
        setValueEditGrid(true);
        setValueReadonly(false);
        setValueReadonlyPostingDate(false);
        setValueSelectedRows([]);
    };

    const apiNewAeHeader = async () => {
        const statusCode = await ApiCreateAccountEntryHeader(
            access_token,
            valueDocsDateAe,
            valueDescriptionAe,
            valueCurrency,
            valueAccountGroupAE,
            dataList,
        );
        if (statusCode) {
            setValueCodeAe('');
            setValueDocsDateAe(dayjs());
            setValueDateAe(dayjs());
            setValueUserAe(localStorage.getItem('UserName'));
            setValueDescriptionAe('');
            setValueAccountGroupAE('');
            setValueTotalDebitAe(0);
            setValueTotalCreditAe(0);
            setValueNewButton(false);
            setValueDisableSaveButton(true);
            setDataListAccountEntryDetail([]);
            setValueReadonly(true);
            setValueReadonlyPostingDate(true);
            setValueEditGrid(false);
        }

        setReloadListAccountingEntryHeader(!reloadListAccountingEntryHeader);
    };
    useEffect(() => {
        setIsLoading(true);
        apiNewAeHeader();
        setIsLoading(false);
    }, [callApiNewAeHeader]);
    /* #endregion */

    //todo: call api update header entry
    /* #region  call api update */
    const [valueUpdateButton, setValueUpdateButton] = React.useState(false);
    const [dialogIsOpenUpdateAeHeader, setDialogIsOpenUpdateAeHeader] = React.useState(false);
    const [callApiUpdateAeHeader, setCallApiUpdateAeHeader] = React.useState(false);
    const agreeDialogUpdateAeHeader = async () => {
        setDialogIsOpenUpdateAeHeader(false);
        setCallApiUpdateAeHeader(!callApiUpdateAeHeader);
    };
    const closeDialogUpdateAeHeader = () => {
        setDialogIsOpenUpdateAeHeader(false);
        toast.warning(t('toast-cancel-update'));
    };
    const handleOnClickUpdateAeHeader = () => {
        setValueNewButton(false);
        setValueUpdateButton(true);
        setValueDisableSaveButton(false);

        setValueUserAe(localStorage.getItem('UserName'));

        setValueReadonly(false);
        setValueReadonlyPostingDate(true);
        setValueEditGrid(true);
    };
    const callApiUpdate = async () => {
        const statusCode = await ApiUpdateAccountEntryHeader(
            access_token,
            valueDocsDateAe,
            valueCodeAe,
            valueDescriptionAe,
            valueCurrency,
            valueAccountGroupAE,
            dataList,
            setValueTotalDebitAe,
            setValueTotalCreditAe,
        );
        if (statusCode) {
            setValueUpdateButton(false);
            setValueDisableSaveButton(true);
            setValueReadonly(true);
            setValueReadonlyPostingDate(true);
            setValueEditGrid(false);
        }
        // setValueUserAe(localStorage.getItem('UserName'));
        setReloadListAccountingEntryHeader(!reloadListAccountingEntryHeader);
    };
    useEffect(() => {
        setIsLoading(true);
        callApiUpdate();
        setIsLoading(false);
    }, [callApiUpdateAeHeader]);
    /* #endregion */

    //! handle click save
    const [valueDisableSaveButton, setValueDisableSaveButton] = React.useState(true);
    const handleClickSave = (event) => {
        if (valueDescriptionAe && valueAccountGroupAE) {
            if (valueNewButton) {
                setDialogIsOpenNewAeHeader(true);
            }
            if (valueUpdateButton) {
                setDialogIsOpenUpdateAeHeader(true);
            }
        } else {
            toast.warning(t('entry-toast-error'));
        }
    };

    //todo: call api delete header entry
    /* #region  call api delete */
    const [dialogIsOpenDeleteAeHeader, setDialogIsOpenDeleteAeHeader] = React.useState(false);
    const [callApiDeleteAeHeader, setCallApiDeleteAeHeader] = React.useState(false);
    const agreeDialogDeleteAeHeader = async () => {
        setDialogIsOpenDeleteAeHeader(false);
        setCallApiDeleteAeHeader(true);
    };
    const closeDialogDeleteAeHeader = () => {
        setDialogIsOpenDeleteAeHeader(false);
        toast.warning(t('toast-cancel-delete'));
    };
    const handleOnClickDeleteAeHeader = () => {
        if (valueTab === 'entry') {
            if (!access_token || selectedRows.length === 0) {
                toast.warning(t('entry-toast-chose'));
                return;
            }
        }
        if (valueTab === 'memo') {
            if (!access_token || !valueCodeMemo) {
                toast.warning(t('entry-toast-chose'));
                return;
            }
        }
        setDialogIsOpenDeleteAeHeader(true);
    };
    const apiDeleteAeHeader = async () => {
        if (valueTab === 'entry') {
            await ApiDeleteAccountEntryHeader(access_token, selectedRows);
            setValueCodeAe('');
            setValueDocsDateAe(dayjs());
            setValueUserAe('');
            setValueDateAe(dayjs());
            setValueDescriptionAe('');
            setValueAccountGroupAE('');
            setValueTotalDebitAe(0);
            setValueTotalCreditAe(0);
            setReloadListAccountingEntryHeader(!reloadListAccountingEntryHeader);
            setDataListAccountEntryDetail([]);
        }
        if (valueTab === 'memo') {
            await ApiDeleteAccountEntryHeader(access_token, selectedRowsMemo);
            setValueCodeMemo('');
            setValuePostingDateMemo(dayjs());
            setValueUserMemo('');
            setValueDateMemo(dayjs());
            setValueDescriptionMemo('');
            setValueAccountGroupMemo('');
            setValueTotalDebitMemo(0);
            setValueTotalCreditMemo(0);
            setReloadListMemoHeader(!reloadListMemoHeader);
            setDataListDetailMemo([]);
        }
    };
    useEffect(() => {
        setIsLoading(true);
        if (callApiDeleteAeHeader) {
            apiDeleteAeHeader();
        }
        setCallApiDeleteAeHeader(false);
        setIsLoading(false);
    }, [callApiDeleteAeHeader]);
    /* #endregion */

    //todo: call api get data detail
    const [dataListAccountEntryDetail, setDataListAccountEntryDetail] = useState([]);
    const [reloadListAeDetail, setReloadListAeDetail] = useState(false);
    useEffect(() => {
        const process = async () => {
            setIsLoading(true);
            if (valueCodeAe) {
                await ApiAccountEntryListDetail(valueCodeAe, valueSearchAccountingEntry, setDataListAccountEntryDetail);
            }
            setIsLoading(false);
        };
        process();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadListAeDetail]);

    const [valueTab, setValueTab] = React.useState('entry');

    const handleChangeTab = (event, newValue) => {
        setValueTab(newValue);
    };

    /* #region  select debit and creedit list */
    const dataListAccount = useSelector((s) => s.FetchApi.listData_Account);

    /* #endregion */

    /* #region  call api cost center */
    const dataListCostCenter = useSelector((s) => s.FetchApi.listData_CostCenter);

    /* #endregion */

    const columnsDataAeDetail = [
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
            field: 'cost_center',
            headerName: t('cost-center'),
            width: 150,
            // editable: valueEditGrid,
            type: 'singleSelect',
            getOptionValue: (value) => value.code,
            getOptionLabel: (value) => value.name,
            valueOptions: dataListCostCenter,
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'acc_code',
            headerName: t('account-code'),
            width: 200,
            // editable: valueEditGrid,
            type: 'singleSelect',
            getOptionValue: (value) => value.account_code,
            getOptionLabel: (value) => `${value.account_code_display} - ${value.account_name}`,
            valueOptions: dataListAccount,
            PaperProps: {
                sx: { maxHeight: 200 },
            },
            headerClassName: 'super-app-theme--header',
        },

        {
            field: 'debit_amount',
            headerName: t('debit'),
            width: 150,
            // editable: valueEditGrid,
            type: 'number',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            // valueFormatter: (params) => dayjs(params.value).format('DD/ MM/ YYYY'),
        },
        {
            field: 'credit_amount',
            headerName: t('credit'),
            width: 150,
            // editable: valueEditGrid,
            type: 'number',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            // valueFormatter: (params) => dayjs(params.value).format('DD/ MM/ YYYY'),
        },
        {
            field: 'description',
            headerName: t('description'),
            minWidth: 400,
            // editable: valueEditGrid,
            flex: 1,
            headerClassName: 'super-app-theme--header',
        },
    ];

    //! set data list detail
    useEffect(() => {
        if (dataListAccountEntryDetail.length !== 0) {
            const newData = dataListAccountEntryDetail.map((data) => {
                return { ...data, is_new_item: 'is_new_item' in data };
            });
            setDataList(newData);
        }
    }, [dataListAccountEntryDetail]);

    //! handle click delete detail
    const handleDeleteClick = (id) => () => {
        const item = dataListAccountEntryDetail.find((row) => row.detail_ids === id);

        if (!item) return; // Không tìm thấy item

        if (item.is_new_item) {
            // Nếu là item mới chưa lưu -> xóa khỏi danh sách
            setDataListAccountEntryDetail(dataListAccountEntryDetail.filter((row) => row.detail_ids !== id));
        } else {
            // Nếu là item đã lưu -> gắn cờ is_delete_item
            const updatedRow = { ...item, is_delete_item: true };
            setDataListAccountEntryDetail(
                dataListAccountEntryDetail.map((row) => (row.detail_ids === id ? updatedRow : row)),
            );
        }
    };

    //! handle lick import file
    const [fileExcel, setFileExcell] = React.useState([]);
    const handleClickChoseFile = (event) => {
        setFileExcell(event.target.files);
    };

    const [dialogIsOpenImportFile, setDialogIsOpenImportFile] = React.useState(false);
    const [callApiImportFile, setCallApiImportFile] = React.useState(false);
    const agreeDialogImportFile = async () => {
        setDialogIsOpenImportFile(false);
        setCallApiImportFile(!callApiImportFile);
    };
    const closeDialogImportFile = () => {
        setDialogIsOpenImportFile(false);
        toast.warning(t('toast-cancel-upload'));
    };

    useEffect(() => {
        const apiImportFile = async () => {
            await ApiImportAccountEntry(access_token, fileExcel);
            setFileExcell('');
            setReloadListAccountingEntryHeader(!reloadListAccountingEntryHeader);
        };
        apiImportFile();
    }, [callApiImportFile]);
    const handleClickImportFile = (event) => {
        let fileType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
        if (fileExcel.length === 0) {
            toast.warning(t('toast-nofile'));
        } else {
            if (fileExcel && fileType.includes(fileExcel[0].type)) {
                setDialogIsOpenImportFile(true);
            } else {
                setFileExcell([]);
                toast.warning(t('toast-fileexcel'));
            }
        }
    };

    const [isNew, setIsNew] = React.useState(false);
    const [dataUpdate, setDataUpdate] = React.useState([]);
    const [openDialogDetail, setOpenDialogDetail] = React.useState(false);
    const handleClickOpenDialogDetail = (isnew) => {
        setOpenDialogDetail(true);
        setIsNew(isnew);
        setValueDisableSaveButton(true);
    };

    const handleCloseDialogDetail = () => {
        setOpenDialogDetail(false);
        setValueDisableSaveButton(false);
    };

    //! on key event
    OnKeyEvent(() => setReloadListAccountingEntryHeader(!reloadListAccountingEntryHeader), 'Enter');
    OnMultiKeyEvent(handleOnClickNewAeHeader, valueNewButton ? '' : 'n');
    OnMultiKeyEvent(handleOnClickUpdateAeHeader, valueUpdateButton ? '' : 'u');
    OnMultiKeyEvent(handleClickSave, valueDisableSaveButton ? '' : 's');
    OnMultiKeyEvent(handleOnClickDeleteAeHeader, 'd');
    OnMultiKeyEvent(() => handleClickOpenDialogDetail(true), !valueEditGrid ? '' : 'a');
    OnMultiKeyEvent(handleClickImportFile, 'f');

    //? ---------------------Tab Memo------------------------------------------------
    const [valueCodeMemo, setValueCodeMemo] = useState('');
    const [valueUserMemo, setValueUserMemo] = useState('');
    const [valueDescriptionMemo, setValueDescriptionMemo] = useState('');
    const [valuePostingDateMemo, setValuePostingDateMemo] = useState(dayjs());
    const [valueDateMemo, setValueDateMemo] = useState(dayjs());
    const [valueAccountGroupMemo, setValueAccountGroupMemo] = useState(null);
    const [valueCurrencyMemo, setValueCurrencyMemo] = useState(null);
    const [valueTotalDebitMemo, setValueTotalDebitMemo] = useState(0);
    const [valueTotalCreditMemo, setValueTotalCreditMemo] = useState(0);

    const [valueReadonlyMemo, setValueReadonlyMemo] = React.useState(true);

    const [reloadListMemoHeader, setReloadListMemoHeader] = React.useState(false);
    const [valueSearchMemo, setValueSearchMemo] = React.useState('');

    const [valueEditGridMemo, setValueEditGridMemo] = React.useState(false);
    const [dataListMemo, setDataListMemo] = useState([]);

    //! visibility column in datagrid
    const columnVisibilityModelMemo = React.useMemo(() => {
        if (valueEditGridMemo) {
            return {
                actions: true,
            };
        }
        return {
            actions: false,
        };
    }, [valueEditGridMemo]);
    //todo call api get data list header entry
    const [dataListMemoHeader, setDataListMemoHeader] = useState([]);
    useEffect(() => {
        setIsLoading(true);
        const callApiDataListHeaderMemo = async () => {
            if (dataPeriod_From_Redux) {
                await ApiMemoListHeader(
                    valueDateAccountPeriod.month() + 1,
                    valueDateAccountPeriod.year(),
                    valueSearchMemo,
                    setDataListMemoHeader,
                );
            }
        };
        callApiDataListHeaderMemo();
        setIsLoading(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadListMemoHeader, valueDateAccountPeriod]);

    const columnsDataMemoHeader = [
        {
            field: 'trans_ids',
            headerName: t('memo-transfer-id'),
            width: 100,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'doc_code',
            headerName: t('entry-code'),
            width: 150,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'doc_date',
            headerName: t('entry-posting-date'),
            width: 150,
            valueFormatter: (params) => dayjs(params.value).format('DD - MM - YYYY'),
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
        },
        {
            field: 'description',
            headerName: t('description'),
            minWidth: 400,
            flex: 1,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'doc_type_display',
            headerName: t('memo-type'),
            width: 130,
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
        },
        // {
        //     field: 'cost_center',
        //     headerName: 'Cost center',
        //     width: 150,
        //     // editable: valueEditGrid,
        //     type: 'singleSelect',
        //     getOptionValue: (value) => value.code,
        //     getOptionLabel: (value) => value.name,
        //     valueOptions: dataListCostCenter,
        //     headerAlign: 'center',
        //     headerClassName: 'super-app-theme--header',
        // },
    ];
    //! select row datagrid header entry
    const [selectedRowsMemo, setValueSelectedRowsMemo] = useState([]);
    const onHandleRowsSelectionMemo = (ids) => {
        const selectedRowsData = ids.map((id) => dataListMemoHeader.find((row) => row.doc_code === id));
        if (selectedRowsData) {
            {
                setValueSelectedRowsMemo(ids);
                selectedRowsData.map((key) => {
                    setValueCodeMemo(key.doc_code);
                    setValueUserMemo(key.updated_by);
                    setValueDescriptionMemo(key.description);
                    setValuePostingDateMemo(dayjs(key.doc_date));
                    setValueDateMemo(dayjs(key.updated_date));
                    setValueAccountGroupMemo(key.grp_acc);
                    setValueCurrencyMemo(key.currency);
                    setValueTotalDebitMemo(key.total_debit);
                    setValueTotalCreditMemo(key.total_credit);
                });
                setReloadListDetailMemo(!reloadListDetailMemo);
                setValueUpdateButtonMemo(false);
                setValueDisableSaveButtonMemo(true);
                setValueEditGridMemo(false);
            }
        }
    };

    const columnsDataMemoDetail = [
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
                        onClick={handleDeleteClickMemo(id)}
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
            field: 'cost_center',
            headerName: t('cost-center'),
            width: 150,
            // editable: valueEditGrid,
            type: 'singleSelect',
            getOptionValue: (value) => value.code,
            getOptionLabel: (value) => value.name,
            valueOptions: dataListCostCenter,
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'acc_code',
            headerName: t('account-code'),
            width: 200,
            // editable: valueEditGrid,
            type: 'singleSelect',
            getOptionValue: (value) => value.account_code,
            getOptionLabel: (value) => `${value.account_code_display} - ${value.account_name}`,
            valueOptions: dataListAccount,
            PaperProps: {
                sx: { maxHeight: 200 },
            },
            headerClassName: 'super-app-theme--header',
        },

        {
            field: 'debit_amount',
            headerName: t('debit'),
            width: 150,
            // editable: valueEditGrid,
            type: 'number',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            // valueFormatter: (params) => dayjs(params.value).format('DD/ MM/ YYYY'),
        },
        {
            field: 'credit_amount',
            headerName: t('credit'),
            width: 150,
            // editable: valueEditGrid,
            type: 'number',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            // valueFormatter: (params) => dayjs(params.value).format('DD/ MM/ YYYY'),
        },
        {
            field: 'description',
            headerName: t('description'),
            minWidth: 400,
            // editable: valueEditGrid,
            flex: 1,
            headerClassName: 'super-app-theme--header',
        },
    ];

    //todo: call api get data detail memo
    const [dataListDetailMemo, setDataListDetailMemo] = useState([]);
    const [reloadListDetailMemo, setReloadListDetailMemo] = useState(false);
    useEffect(() => {
        const process = async () => {
            setIsLoading(true);
            if (valueCodeMemo) {
                await ApiAccountEntryListDetail(valueCodeMemo, valueSearchMemo, setDataListDetailMemo);
            }
            setIsLoading(false);
        };
        process();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadListDetailMemo]);

    const [dialogIsOpenLoadMemo, setDialogIsOpenLoadMemo] = React.useState(false);
    const [isLoadApiMemo, setIsLoadApiMemo] = React.useState(false);
    const agreeDialogLoadMemo = async () => {
        setDialogIsOpenLoadMemo(false);
        setIsLoadApiMemo(true);
    };
    const closeDialogLoadMemo = () => {
        setDialogIsOpenLoadMemo(false);
        toast.warning(t('toast-cancel-load-memo'));
    };

    //todo: call api load memo from FA
    useEffect(() => {
        const process = async () => {
            setIsLoading(true);
            if (isLoadApiMemo) {
                const statusCode = await ApiLoadMemoFromFA();
                if (statusCode) {
                    toast.success(t('memo-toast-success'));
                }
            }

            setIsLoadApiMemo(false);
            setReloadListMemoHeader(!reloadListMemoHeader);
            setIsLoading(false);
        };
        process();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadApiMemo]);

    //todo: update memo
    const [valueUpdateButtonMemo, setValueUpdateButtonMemo] = React.useState(false);
    const [dialogIsOpenUpdateMemo, setDialogIsOpenUpdateMemo] = React.useState(false);
    const [callApiUpdateMemo, setCallApiUpdateMemo] = React.useState(false);
    const agreeDialogUpdateMemo = async () => {
        setDialogIsOpenUpdateMemo(false);
        setCallApiUpdateMemo(true);
    };
    const closeDialogUpdateMemo = () => {
        setDialogIsOpenUpdateMemo(false);
        toast.warning(t('toast-cancel-update'));
    };
    const handleOnClickUpdateMemo = () => {
        setValueUpdateButtonMemo(true);
        setValueDisableSaveButtonMemo(false);

        setValueUserMemo(localStorage.getItem('UserName'));

        setValueReadonlyMemo(false);
        setValueEditGridMemo(true);
    };
    const ApiUpdateMemo = async () => {
        const statusCode = await ApiUpdateAccountEntryHeader(
            access_token,
            valuePostingDateMemo,
            valueCodeMemo,
            valueDescriptionMemo,
            valueCurrencyMemo,
            valueAccountGroupMemo,
            dataListMemo,
            setValueTotalDebitMemo,
            setValueTotalCreditMemo,
        );
        if (statusCode) {
            setValueUpdateButtonMemo(false);
            setValueDisableSaveButtonMemo(true);
            setValueReadonlyMemo(true);
            setValueEditGridMemo(false);
        }
        setReloadListMemoHeader(!reloadListMemoHeader);
    };
    useEffect(() => {
        setIsLoading(true);
        if (callApiUpdateMemo) {
            ApiUpdateMemo();
        }
        setCallApiUpdateMemo(false);
        setIsLoading(false);
    }, [callApiUpdateMemo]);
    /* #endregion */

    //! handle click save memo
    const [valueDisableSaveButtonMemo, setValueDisableSaveButtonMemo] = React.useState(true);
    const handleClickSaveMemo = (event) => {
        if (valueAccountGroupMemo) {
            setDialogIsOpenUpdateMemo(true);
        } else {
            toast.warning(t('entry-toast-error'));
        }
    };

    //todo: update detail
    const [isNewMemo, setIsNewMemo] = React.useState(false);
    const [dataUpdateMemo, setDataUpdateMemo] = React.useState([]);
    const [openDialogDetailMemo, setOpenDialogDetailMemo] = React.useState(false);
    const handleClickOpenDialogDetailMemo = (isnew) => {
        setOpenDialogDetailMemo(true);
        setIsNewMemo(isnew);
        setValueDisableSaveButtonMemo(true);
    };

    const handleCloseDialogDetailMemo = () => {
        setOpenDialogDetailMemo(false);
        setValueDisableSaveButtonMemo(false);
    };

    //! set data list detail memo
    useEffect(() => {
        if (dataListDetailMemo.length !== 0) {
            const newData = dataListDetailMemo.map((data) => {
                return { ...data, is_new_item: 'is_new_item' in data };
            });
            setDataListMemo(newData);
        }
    }, [dataListDetailMemo]);

    //! handle click delete detail memo
    const handleDeleteClickMemo = (id) => () => {
        const item = dataListDetailMemo.find((row) => row.detail_ids === id);

        if (!item) return; // Không tìm thấy item, không làm gì

        if (item.is_new_item) {
            // Nếu là item mới chưa lưu -> xóa khỏi danh sách
            setDataListDetailMemo(dataListDetailMemo.filter((row) => row.detail_ids !== id));
        } else {
            // Nếu là item đã lưu -> gắn cờ is_delete_item
            const updatedRow = { ...item, is_delete_item: true };
            setDataListDetailMemo(dataListDetailMemo.map((row) => (row.detail_ids === id ? updatedRow : row)));
        }
    };

    //! mobile respomsive
    const mobileButtonList = (
        <Stack
            width={'100%'}
            direction={'row'}
            spacing={2}
            alignItems={'center'}
            justifyContent={'flex-end'}
            sx={{ display: { xs: 'flex', md: 'none' } }}
        >
            <Button
                size="small"
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
            </Button>
            <Button
                size="small"
                component="label"
                sx={{
                    whiteSpace: 'nowrap',
                }}
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                onClick={handleClickImportFile}
            >
                {t('button-upload')}
            </Button>
        </Stack>
    );

    const mobileButtonInfor = (
        <Stack
            direction={'column'}
            spacing={1}
            sx={{ display: { xs: 'flex', md: 'none' } }}
            justifyContent={'space-between'}
        >
            <Stack
                direction={'row'}
                spacing={1}
                sx={{ display: { xs: 'flex', md: 'none' } }}
                justifyContent={'space-between'}
            >
                <LoadingButton
                    size="small"
                    fullWidth
                    startIcon={<AddBoxIcon />}
                    variant="contained"
                    color="success"
                    onClick={handleOnClickNewAeHeader}
                    loading={valueNewButton}
                    loadingPosition="start"
                    sx={{ whiteSpace: 'nowrap' }}
                >
                    {t('button-new')}
                </LoadingButton>
                <LoadingButton
                    size="small"
                    fullWidth
                    startIcon={<SystemUpdateAltIcon />}
                    variant="contained"
                    color="warning"
                    onClick={handleOnClickUpdateAeHeader}
                    loading={valueUpdateButton}
                    loadingPosition="start"
                    sx={{ whiteSpace: 'nowrap' }}
                >
                    {t('button-update')}
                </LoadingButton>
            </Stack>

            <LoadingButton
                size="small"
                fullWidth
                startIcon={<SaveIcon />}
                variant="contained"
                color="primary"
                onClick={handleClickSave}
                disabled={valueDisableSaveButton}
            >
                {t('button-save')}
            </LoadingButton>
            <LoadingButton
                size="small"
                fullWidth
                startIcon={<DeleteOutlineIcon />}
                variant="contained"
                color="error"
                onClick={handleOnClickDeleteAeHeader}
            >
                {t('button-delete')}
            </LoadingButton>
        </Stack>
    );
    return (
        <Spin size="large" tip={'Loading'} spinning={isLoading}>
            <div className="main">
                <ToastContainer />
                {dialogIsOpenNewAeHeader && (
                    <AlertDialog
                        title={t('entry-toast-new')}
                        content={
                            <>
                                {t('description')}: {valueDescriptionAe}
                                <br /> {t('currency')}: {valueCurrency}
                                <br /> {t('account-group')}: {valueAccountGroupAE}
                            </>
                        }
                        onOpen={dialogIsOpenNewAeHeader}
                        onClose={closeDialogNewAeHeader}
                        onAgree={agreeDialogNewAeHeader}
                    />
                )}
                {dialogIsOpenUpdateAeHeader && (
                    <AlertDialog
                        title={t('entry-toast-update')}
                        content={
                            <>
                                {t('entry-code')}: {valueCodeAe}
                                <br /> {t('description')}: {valueDescriptionAe}
                                <br /> {t('currency')}: {valueCurrency}
                                <br /> {t('account-group')}: {valueAccountGroupAE}
                            </>
                        }
                        onOpen={dialogIsOpenUpdateAeHeader}
                        onClose={closeDialogUpdateAeHeader}
                        onAgree={agreeDialogUpdateAeHeader}
                    />
                )}
                {dialogIsOpenDeleteAeHeader && (
                    <AlertDialog
                        title={valueTab === 'entry' ? t('entry-toast-delete') : t('memo-toast-delete')}
                        content={
                            valueTab === 'entry' ? (
                                <>
                                    {t('entry-code')}: {selectedRows.toString()}
                                    <br /> {t('description')}: {valueDescriptionAe}
                                    <br /> {t('currency')}: {valueCurrency}
                                    <br /> {t('account-group')}: {valueAccountGroupAE}
                                </>
                            ) : (
                                <>
                                    {t('entry-code')}: {valueCodeMemo}
                                    <br /> {t('description')}: {valueDescriptionMemo}
                                    <br /> {t('currency')}: {valueCurrencyMemo}
                                    <br /> {t('account-group')}: {valueAccountGroupMemo}
                                </>
                            )
                        }
                        onOpen={dialogIsOpenDeleteAeHeader}
                        onClose={closeDialogDeleteAeHeader}
                        onAgree={agreeDialogDeleteAeHeader}
                    />
                )}
                {dialogIsOpenImportFile && (
                    <AlertDialog
                        title={t('entry-toast-upload')}
                        content={<> Name: {fileExcel ? fileExcel[0].name : ''}</>}
                        onOpen={dialogIsOpenImportFile}
                        onClose={closeDialogImportFile}
                        onAgree={agreeDialogImportFile}
                    />
                )}
                {openDialogDetail && (
                    <DialogDetail
                        isNew={isNew}
                        onOpen={openDialogDetail}
                        onClose={handleCloseDialogDetail}
                        setDataListAccountEntryDetail={setDataListAccountEntryDetail}
                        dataList={dataList}
                        dataUpdate={dataUpdate}
                        setValueDescriptionAe={setValueDescriptionAe}
                        description={valueDescriptionAe}
                    />
                )}
                {dialogIsOpenLoadMemo && (
                    <AlertDialog
                        title={t('allocation-toast-load-memo')}
                        content={
                            <>
                                Unit: {localStorage.getItem('Unit')}.
                                <br /> {t('entry-user')}: {localStorage.getItem('UserName')}.
                            </>
                        }
                        onOpen={dialogIsOpenLoadMemo}
                        onClose={closeDialogLoadMemo}
                        onAgree={agreeDialogLoadMemo}
                    />
                )}
                {dialogIsOpenUpdateMemo && (
                    <AlertDialog
                        title={t('memo-toast-update')}
                        content={
                            <>
                                {t('entry-code')}: {valueCodeMemo}
                                <br /> {t('description')}: {valueDescriptionMemo}
                                <br /> {t('currency')}: {valueCurrencyMemo}
                                <br /> {t('account-group')}: {valueAccountGroupMemo}
                            </>
                        }
                        onOpen={dialogIsOpenUpdateMemo}
                        onClose={closeDialogUpdateMemo}
                        onAgree={agreeDialogUpdateMemo}
                    />
                )}
                {openDialogDetailMemo && (
                    <DialogDetailMemo
                        isNew={isNewMemo}
                        onOpen={openDialogDetailMemo}
                        onClose={handleCloseDialogDetailMemo}
                        setDataListMemoDetail={setDataListDetailMemo}
                        dataList={dataListMemo}
                        dataUpdate={dataUpdateMemo}
                        setValueDescriptionAe={setValueDescriptionMemo}
                        description={valueDescriptionMemo}
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
                        <Typography color="text.primary">{t(valueTab)}</Typography>
                    </Breadcrumbs>
                </div>
                <Box
                    sx={{
                        width: '100%',
                        typography: 'body1',
                        '& .super-app-theme--header': {
                            backgroundColor: '#ffc696',
                        },
                    }}
                >
                    <Item>
                        <TabContext value={valueTab}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList
                                    onChange={handleChangeTab}
                                    aria-label="lab API tabs example"
                                    TabIndicatorProps={{
                                        style: {
                                            backgroundColor: '#ed6c02',
                                        },
                                    }}
                                    textColor="inherit"
                                    sx={{
                                        '.Mui-selected': {
                                            color: '#ed6c02',
                                            backgroundColor: '#f5e1d0',
                                        },
                                    }}
                                    variant="fullWidth"
                                >
                                    <Tab label={t('entry')} value="entry" />
                                    <Tab label={t('memo')} value="memo" />
                                </TabList>
                            </Box>
                            <TabPanel value="entry" sx={{ padding: 0 }}>
                                <Box
                                    sx={{
                                        flexGrow: 1,
                                    }}
                                >
                                    <Grid container direction={'row'} spacing={1}>
                                        <Grid xs={12} md={12} sx={{ width: '100%' }}>
                                            <Item>
                                                <Grid container xs={12} md={12} spacing={1}>
                                                    <Grid xs={12} md={4}>
                                                        <Stack
                                                            direction={'row'}
                                                            spacing={2}
                                                            alignItems={'center'}
                                                            justifyContent={'flex-start'}
                                                        >
                                                            <h6 style={{ width: '40%' }}>{t('entry-period')}</h6>
                                                            <div style={{ width: '100%' }}>
                                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                    <DatePicker
                                                                        views={['month', 'year']}
                                                                        sx={{ width: '100%' }}
                                                                        value={valueDateAccountPeriod}
                                                                        slotProps={{
                                                                            textField: { size: 'small' },
                                                                        }}
                                                                        formatDensity="spacious"
                                                                        format="MM-YYYY"
                                                                        onChange={(e) =>
                                                                            handleOnChangeDateAccountPeriod(e)
                                                                        }
                                                                    />
                                                                </LocalizationProvider>
                                                            </div>
                                                        </Stack>
                                                    </Grid>

                                                    <Grid xs={12} md={8}>
                                                        <Stack
                                                            direction={'row'}
                                                            spacing={2}
                                                            alignItems={'center'}
                                                            justifyContent={'flex-start'}
                                                        >
                                                            <TextField
                                                                variant="outlined"
                                                                fullWidth
                                                                label={t('button-search')}
                                                                size="small"
                                                                value={valueSearchAccountingEntry}
                                                                onChange={(event) => handleOnChangeValueSearch(event)}
                                                            />
                                                            <div>
                                                                <LoadingButton
                                                                    startIcon={<SearchIcon />}
                                                                    variant="contained"
                                                                    color="warning"
                                                                    onClick={() =>
                                                                        setReloadListAccountingEntryHeader(
                                                                            !reloadListAccountingEntryHeader,
                                                                        )
                                                                    }
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
                                                        {mobileButtonList}
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
                                                                    }}
                                                                >
                                                                    {t('entry-title-list')}
                                                                </h5>
                                                            </>

                                                            <Button
                                                                size="small"
                                                                component="label"
                                                                role={undefined}
                                                                variant="outlined"
                                                                onClick={() => setButtonSelectMode(!buttonSelectMode)}
                                                            >
                                                                {t('button-select-mode')}
                                                            </Button>
                                                            <Stack
                                                                direction={'row'}
                                                                spacing={1}
                                                                sx={{ display: { xs: 'none', md: 'flex' } }}
                                                            >
                                                                <Button
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
                                                                </Button>
                                                                <Button
                                                                    component="label"
                                                                    role={undefined}
                                                                    variant="contained"
                                                                    tabIndex={-1}
                                                                    startIcon={<CloudUploadIcon />}
                                                                    onClick={handleClickImportFile}
                                                                >
                                                                    {t('button-upload')}
                                                                </Button>
                                                            </Stack>
                                                        </Stack>
                                                    </Grid>

                                                    <Grid xs={12} md={12}>
                                                        <Stack spacing={0}>
                                                            <div style={{ width: '100%' }}>
                                                                <DataGrid
                                                                    rows={dataListAEHeader}
                                                                    columns={columnsDataAeHeader}
                                                                    initialState={{
                                                                        pagination: {
                                                                            paginationModel: { page: 0, pageSize: 5 },
                                                                        },
                                                                    }}
                                                                    pageSizeOptions={[5, 10, 15]}
                                                                    autoHeight
                                                                    showCellVerticalBorder
                                                                    showColumnVerticalBorder
                                                                    getRowId={(id) => id.doc_code}
                                                                    loading={isLoading}
                                                                    onRowSelectionModelChange={(ids) =>
                                                                        onHandleRowsSelectionAeHeader(ids)
                                                                    }
                                                                    checkboxSelection={buttonSelectMode}
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
                                                                }}
                                                            >
                                                                {t('entry-title-infor')}
                                                            </h5>

                                                            <Stack
                                                                direction={'row'}
                                                                spacing={1}
                                                                sx={{ display: { xs: 'none', md: 'flex' } }}
                                                            >
                                                                <LoadingButton
                                                                    startIcon={<AddBoxIcon />}
                                                                    variant="contained"
                                                                    color="success"
                                                                    onClick={handleOnClickNewAeHeader}
                                                                    loading={valueNewButton}
                                                                    loadingPosition="start"
                                                                    sx={{ whiteSpace: 'nowrap' }}
                                                                >
                                                                    {t('button-new')}
                                                                </LoadingButton>
                                                                <LoadingButton
                                                                    startIcon={<SystemUpdateAltIcon />}
                                                                    variant="contained"
                                                                    color="warning"
                                                                    onClick={handleOnClickUpdateAeHeader}
                                                                    loading={valueUpdateButton}
                                                                    loadingPosition="start"
                                                                    sx={{ whiteSpace: 'nowrap' }}
                                                                >
                                                                    {t('button-update')}
                                                                </LoadingButton>
                                                                <LoadingButton
                                                                    startIcon={<SaveIcon />}
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={handleClickSave}
                                                                    disabled={valueDisableSaveButton}
                                                                >
                                                                    {t('button-save')}
                                                                </LoadingButton>
                                                                <LoadingButton
                                                                    startIcon={<DeleteOutlineIcon />}
                                                                    variant="contained"
                                                                    color="error"
                                                                    onClick={handleOnClickDeleteAeHeader}
                                                                >
                                                                    {t('button-delete')}
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
                                                                        <h6 style={{ width: '40%' }}>
                                                                            {t('entry-code')}
                                                                        </h6>
                                                                        <Input
                                                                            variant="outlined"
                                                                            fullWidth
                                                                            size="large"
                                                                            placeholder="xxxxxxxxx"
                                                                            value={valueCodeAe}
                                                                            onChange={handleChangeValueCodeAe}
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
                                                                        <h6 style={{ width: '40%' }}>
                                                                            {t('entry-posting-date')}
                                                                        </h6>
                                                                        <div style={{ width: '100%' }}>
                                                                            <LocalizationProvider
                                                                                dateAdapter={AdapterDayjs}
                                                                            >
                                                                                <DatePicker
                                                                                    // label={'"month" and "year"'}
                                                                                    // views={['month', 'year']}
                                                                                    value={valueDocsDateAe}
                                                                                    sx={{ width: '100%' }}
                                                                                    // sx={{ width: 300 }}
                                                                                    slotProps={{
                                                                                        textField: { size: 'small' },
                                                                                    }}
                                                                                    formatDensity="spacious"
                                                                                    format="DD-MM-YYYY"
                                                                                    onChange={(e) =>
                                                                                        handleChangeValueDocsDateAe(e)
                                                                                    }
                                                                                    disabled={valueReadonly}
                                                                                />
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
                                                                        <h6 style={{ width: '40%' }}>
                                                                            {t('entry-user')}
                                                                        </h6>
                                                                        <Input
                                                                            variant="outlined"
                                                                            fullWidth
                                                                            size="large"
                                                                            placeholder="name..."
                                                                            value={valueUserAe}
                                                                            onChange={handleChangeValueUserAe}
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
                                                                        <h6 style={{ width: '40%' }}>
                                                                            {t('entry-date')}
                                                                        </h6>
                                                                        <div style={{ width: '100%' }}>
                                                                            <LocalizationProvider
                                                                                dateAdapter={AdapterDayjs}
                                                                            >
                                                                                <DatePicker
                                                                                    // label={'"month" and "year"'}
                                                                                    // views={['month', 'year']}
                                                                                    value={valueDateAe}
                                                                                    sx={{ width: '100%' }}
                                                                                    slotProps={{
                                                                                        textField: { size: 'small' },
                                                                                    }}
                                                                                    formatDensity="spacious"
                                                                                    format="DD-MM-YYYY"
                                                                                    onChange={(e) =>
                                                                                        handleChangeValueDateAe(e)
                                                                                    }
                                                                                    disabled
                                                                                />
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
                                                                        <h6 style={{ width: '40%' }}>
                                                                            {t('description')}
                                                                        </h6>
                                                                        <Input.TextArea
                                                                            size="large"
                                                                            maxLength={250}
                                                                            rows={3}
                                                                            placeholder="..."
                                                                            value={valueDescriptionAe}
                                                                            onChange={handleChangeValueDescriptionAe}
                                                                            disabled={valueReadonly}
                                                                        />
                                                                    </Stack>
                                                                </Grid>
                                                                <Grid xs={12} md={6}>
                                                                    <Stack spacing={1}>
                                                                        <Stack
                                                                            direction={'row'}
                                                                            spacing={2}
                                                                            alignItems={'center'}
                                                                            justifyContent={'flex-start'}
                                                                        >
                                                                            <h6 style={{ width: '40%' }}>
                                                                                {t('account-group')}
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
                                                                                    value={valueAccountGroupAE}
                                                                                    displayEmpty
                                                                                    onChange={
                                                                                        handleChangeAccountGroupAE
                                                                                    }
                                                                                    disabled={valueReadonly}
                                                                                >
                                                                                    {dataListAccountGroup.map(
                                                                                        (data) => {
                                                                                            return (
                                                                                                <MenuItem
                                                                                                    key={
                                                                                                        data.gr_acc_code
                                                                                                    }
                                                                                                    value={
                                                                                                        data.gr_acc_code
                                                                                                    }
                                                                                                >
                                                                                                    {data.gr_acc_code} -{' '}
                                                                                                    {data.gr_acc_name}
                                                                                                </MenuItem>
                                                                                            );
                                                                                        },
                                                                                    )}
                                                                                </Select>
                                                                            </FormControl>
                                                                        </Stack>
                                                                        <Stack
                                                                            direction={'row'}
                                                                            spacing={2}
                                                                            alignItems={'center'}
                                                                            justifyContent={'flex-start'}
                                                                        >
                                                                            <h6 style={{ width: '40%' }}>
                                                                                {t('currency')}
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
                                                                                    value={valueCurrency}
                                                                                    // label="Age"
                                                                                    displayEmpty
                                                                                    onChange={handleChangeCurren}
                                                                                    disabled={valueReadonly}
                                                                                >
                                                                                    {dataListCurrency.map((data) => {
                                                                                        return (
                                                                                            <MenuItem
                                                                                                key={data.code}
                                                                                                value={data.code}
                                                                                            >
                                                                                                {data.name}
                                                                                            </MenuItem>
                                                                                        );
                                                                                    })}
                                                                                </Select>
                                                                            </FormControl>
                                                                        </Stack>
                                                                    </Stack>
                                                                </Grid>
                                                                <Grid xs={12} md={6}>
                                                                    <Stack spacing={1}>
                                                                        <Stack
                                                                            direction={'row'}
                                                                            spacing={2}
                                                                            alignItems={'center'}
                                                                            justifyContent={'flex-start'}
                                                                        >
                                                                            <h6 style={{ width: '40%' }}>
                                                                                {t('total-debit')}
                                                                            </h6>
                                                                            <h6
                                                                                style={{
                                                                                    width: '100%',
                                                                                    textAlign: 'left',
                                                                                    color: 'red',
                                                                                    fontWeight: 'bold',
                                                                                }}
                                                                            >
                                                                                {valueTotalDebitAe.toLocaleString(
                                                                                    undefined,
                                                                                    {
                                                                                        maximumFractionDigits: 2,
                                                                                    },
                                                                                )}
                                                                            </h6>
                                                                        </Stack>
                                                                        <Stack
                                                                            direction={'row'}
                                                                            spacing={2}
                                                                            alignItems={'center'}
                                                                            justifyContent={'flex-start'}
                                                                        >
                                                                            <h6 style={{ width: '40%' }}>
                                                                                {t('total-credit')}
                                                                            </h6>
                                                                            <h6
                                                                                style={{
                                                                                    width: '100%',
                                                                                    textAlign: 'left',
                                                                                    color: 'green',
                                                                                    fontWeight: 'bold',
                                                                                }}
                                                                            >
                                                                                {valueTotalCreditAe.toLocaleString(
                                                                                    undefined,
                                                                                    {
                                                                                        maximumFractionDigits: 2,
                                                                                    },
                                                                                )}
                                                                            </h6>
                                                                        </Stack>
                                                                    </Stack>
                                                                </Grid>
                                                            </Grid>
                                                        </Item>
                                                    </Grid>
                                                    {mobileButtonInfor}
                                                </Grid>
                                            </Item>
                                        </Grid>
                                        <Grid xs={12} md={12}>
                                            <Item>
                                                <Grid>
                                                    <Grid xs={12} md={12}>
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
                                                                    }}
                                                                >
                                                                    {t('entry-title-detail')}
                                                                </h5>
                                                            </>

                                                            <Stack direction={'row'} spacing={1}>
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
                                                                        rows={dataListAccountEntryDetail.filter(
                                                                            (data) =>
                                                                                data.isactive === true &&
                                                                                data.is_delete_item !== true,
                                                                        )}
                                                                        columns={columnsDataAeDetail}
                                                                        autoHeight
                                                                        showCellVerticalBorder
                                                                        showColumnVerticalBorder
                                                                        getRowId={(id) => id.detail_ids}
                                                                        loading={isLoading}
                                                                        // editMode="row"
                                                                        // rowModesModel={rowModesModel}
                                                                        // onRowModesModelChange={handleRowModesModelChange}
                                                                        // onRowEditStop={handleRowEditStop}
                                                                        // processRowUpdate={processRowUpdate}
                                                                        onRowDoubleClick={(params) => {
                                                                            valueEditGrid &&
                                                                                handleClickOpenDialogDetail(false);
                                                                            setDataUpdate(params.row);
                                                                        }}
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
                            </TabPanel>

                            <TabPanel value="memo" sx={{ padding: 0 }}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Grid container direction={'row'} spacing={1}>
                                        <Grid xs={12} md={12} sx={{ width: '100%' }}>
                                            <Item>
                                                <Grid container xs={12} md={12} spacing={1}>
                                                    <Grid xs={12} md={4}>
                                                        <Stack
                                                            direction={'row'}
                                                            spacing={2}
                                                            alignItems={'center'}
                                                            justifyContent={'flex-start'}
                                                        >
                                                            <h6 style={{ width: '40%' }}>{t('entry-period')}</h6>
                                                            <div style={{ width: '100%' }}>
                                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                    <DatePicker
                                                                        // label={'"month" and "year"'}
                                                                        views={['month', 'year']}
                                                                        sx={{ width: '100%' }}
                                                                        value={valueDateAccountPeriod}
                                                                        slotProps={{
                                                                            textField: { size: 'small' },
                                                                        }}
                                                                        formatDensity="spacious"
                                                                        format="MM-YYYY"
                                                                        onChange={(e) =>
                                                                            handleOnChangeDateAccountPeriod(e)
                                                                        }
                                                                    />
                                                                </LocalizationProvider>
                                                            </div>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid xs={12} md={5}>
                                                        <Stack
                                                            direction={'row'}
                                                            spacing={2}
                                                            alignItems={'center'}
                                                            justifyContent={'flex-start'}
                                                        >
                                                            <TextField
                                                                variant="outlined"
                                                                fullWidth
                                                                label={t('button-search')}
                                                                size="small"
                                                                value={valueSearchMemo}
                                                                onChange={(event) =>
                                                                    setValueSearchMemo(event.target.value)
                                                                }
                                                            />
                                                            <div>
                                                                <LoadingButton
                                                                    startIcon={<SearchIcon />}
                                                                    variant="contained"
                                                                    color="warning"
                                                                    onClick={() =>
                                                                        setReloadListMemoHeader(!reloadListMemoHeader)
                                                                    }
                                                                    sx={{ whiteSpace: 'nowrap' }}
                                                                >
                                                                    {t('button-search')}
                                                                </LoadingButton>
                                                            </div>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid xs={12} md={3}>
                                                        <div>
                                                            <LoadingButton
                                                                fullWidth
                                                                startIcon={<PublishedWithChangesIcon />}
                                                                variant="contained"
                                                                color="secondary"
                                                                onClick={() => setDialogIsOpenLoadMemo(true)}
                                                                sx={{ whiteSpace: 'nowrap' }}
                                                            >
                                                                {t('load-memo')}
                                                            </LoadingButton>
                                                        </div>
                                                    </Grid>

                                                    {/* <Grid xs={12} md={8}>
                                                        <Stack
                                                            direction={'row'}
                                                            spacing={2}
                                                            alignItems={'center'}
                                                            justifyContent={'flex-start'}
                                                        >
                                                            <TextField
                                                                variant="outlined"
                                                                fullWidth
                                                                label={t('button-search')}
                                                                size="small"
                                                                value={valueSearchMemo}
                                                                onChange={(event) =>
                                                                    setValueSearchMemo(event.target.value)
                                                                }
                                                            />
                                                            <div>
                                                                <LoadingButton
                                                                    startIcon={<SearchIcon />}
                                                                    variant="contained"
                                                                    color="warning"
                                                                    onClick={() =>
                                                                        setReloadListMemoHeader(!reloadListMemoHeader)
                                                                    }
                                                                    sx={{ whiteSpace: 'nowrap' }}
                                                                >
                                                                    {t('button-search')}
                                                                </LoadingButton>
                                                            </div>

                                                            <div>
                                                                <LoadingButton
                                                                    startIcon={<PublishedWithChangesIcon />}
                                                                    variant="contained"
                                                                    color="secondary"
                                                                    onClick={() => setDialogIsOpenLoadMemo(true)}
                                                                    sx={{ whiteSpace: 'nowrap' }}
                                                                >
                                                                    {t('load-memo')}
                                                                </LoadingButton>
                                                            </div>
                                                        </Stack>
                                                    </Grid> */}
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
                                                                    }}
                                                                >
                                                                    {t('memo-list')}
                                                                </h5>
                                                            </>
                                                            {/* <Button
                                                                component="label"
                                                                role={undefined}
                                                                variant="outlined"
                                                                onClick={() => setButtonSelectMode(!buttonSelectMode)}
                                                            >
                                                                Select Mode
                                                            </Button>
                                                            <Button
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
                                                            >
                                                                {fileExcel
                                                                    ? fileExcel[0].name.slice(0, 25) + '...'
                                                                    : 'Import File'}
                                                                <VisuallyHiddenInput
                                                                    type="file"
                                                                    onChange={handleClickChoseFile}
                                                                />
                                                            </Button>
                                                            <Button
                                                                component="label"
                                                                role={undefined}
                                                                variant="contained"
                                                                tabIndex={-1}
                                                                startIcon={<CloudUploadIcon />}
                                                                onClick={handleClickImportFile}
                                                            >
                                                                Upload&nbsp;
                                                                <u>f</u>
                                                                ile
                                                            </Button> */}
                                                        </Stack>
                                                    </Grid>
                                                    <Grid xs={12} md={12}>
                                                        <Stack spacing={0}>
                                                            <div style={{ width: '100%' }}>
                                                                <DataGrid
                                                                    rows={dataListMemoHeader}
                                                                    columns={columnsDataMemoHeader}
                                                                    initialState={{
                                                                        pagination: {
                                                                            paginationModel: { page: 0, pageSize: 5 },
                                                                        },
                                                                    }}
                                                                    pageSizeOptions={[5, 10, 15]}
                                                                    autoHeight
                                                                    showCellVerticalBorder
                                                                    showColumnVerticalBorder
                                                                    getRowId={(id) => id.doc_code}
                                                                    loading={isLoading}
                                                                    onRowSelectionModelChange={(ids) =>
                                                                        onHandleRowsSelectionMemo(ids)
                                                                    }
                                                                // checkboxSelection={buttonSelectMode}
                                                                />
                                                            </div>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </Item>
                                        </Grid>
                                        <Grid xs={12} md={12}>
                                            <Item>
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
                                                                    {t('memo-infor')}
                                                                </h5>
                                                            </>

                                                            <Stack direction={'row'} spacing={2}>
                                                                <LoadingButton
                                                                    startIcon={<SystemUpdateAltIcon />}
                                                                    variant="contained"
                                                                    color="warning"
                                                                    onClick={handleOnClickUpdateMemo}
                                                                    loading={valueUpdateButtonMemo}
                                                                    loadingPosition="start"
                                                                    sx={{ whiteSpace: 'nowrap' }}
                                                                >
                                                                    {t('button-update')}
                                                                </LoadingButton>
                                                                <LoadingButton
                                                                    startIcon={<SaveIcon />}
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={handleClickSaveMemo}
                                                                    disabled={valueDisableSaveButtonMemo}
                                                                >
                                                                    {t('button-save')}
                                                                </LoadingButton>
                                                                <LoadingButton
                                                                    startIcon={<DeleteOutlineIcon />}
                                                                    variant="contained"
                                                                    color="error"
                                                                    onClick={handleOnClickDeleteAeHeader}
                                                                >
                                                                    {t('button-delete')}
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
                                                                        <h6 style={{ width: '40%' }}>
                                                                            {t('entry-code')}
                                                                        </h6>
                                                                        <TextField
                                                                            variant="outlined"
                                                                            fullWidth
                                                                            size="small"
                                                                            placeholder="xxxxxxxxx"
                                                                            disabled
                                                                            value={valueCodeMemo}
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
                                                                        <h6 style={{ width: '40%' }}>
                                                                            {t('entry-posting-date')}
                                                                        </h6>
                                                                        <div style={{ width: '100%' }}>
                                                                            <LocalizationProvider
                                                                                dateAdapter={AdapterDayjs}
                                                                            >
                                                                                <DatePicker
                                                                                    slotProps={{
                                                                                        textField: { size: 'small' },
                                                                                    }}
                                                                                    sx={{ width: '100%' }}
                                                                                    formatDensity="spacious"
                                                                                    format="DD/MM/YYYY"
                                                                                    disabled={valueReadonlyMemo}
                                                                                    value={valuePostingDateMemo}
                                                                                />
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
                                                                        <h6 style={{ width: '40%' }}>
                                                                            {t('entry-user')}
                                                                        </h6>
                                                                        <TextField
                                                                            variant="outlined"
                                                                            fullWidth
                                                                            size="small"
                                                                            placeholder="name..."
                                                                            disabled
                                                                            value={valueUserMemo}
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
                                                                        <h6 style={{ width: '40%' }}>
                                                                            {t('memo-date')}
                                                                        </h6>
                                                                        <div style={{ width: '100%' }}>
                                                                            <LocalizationProvider
                                                                                dateAdapter={AdapterDayjs}
                                                                            >
                                                                                <DatePicker
                                                                                    slotProps={{
                                                                                        textField: { size: 'small' },
                                                                                    }}
                                                                                    sx={{ width: '100%' }}
                                                                                    formatDensity="spacious"
                                                                                    format="DD/MM/YYYY"
                                                                                    disabled
                                                                                    value={valueDateMemo}
                                                                                />
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
                                                                        <h6 style={{ width: '40%' }}>
                                                                            {t('description')}
                                                                        </h6>
                                                                        <Form.Control
                                                                            type="text"
                                                                            as="textarea"
                                                                            rows={3}
                                                                            placeholder="..."
                                                                            disabled={valueReadonlyMemo}
                                                                            value={valueDescriptionMemo ?? ''}
                                                                            onChange={(e) =>
                                                                                setValueDescriptionMemo(e.target.value)
                                                                            }
                                                                        />
                                                                    </Stack>
                                                                </Grid>
                                                                <Grid xs={12} md={6}>
                                                                    <Stack spacing={1}>
                                                                        <Stack
                                                                            direction={'row'}
                                                                            spacing={2}
                                                                            alignItems={'center'}
                                                                            justifyContent={'flex-start'}
                                                                        >
                                                                            <h6 style={{ width: '40%' }}>
                                                                                {t('account-group')}
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
                                                                                    value={valueAccountGroupMemo}
                                                                                    displayEmpty
                                                                                    disabled={valueReadonlyMemo}
                                                                                >
                                                                                    {dataListAccountGroup.map(
                                                                                        (data) => {
                                                                                            return (
                                                                                                <MenuItem
                                                                                                    key={
                                                                                                        data.gr_acc_code
                                                                                                    }
                                                                                                    value={
                                                                                                        data.gr_acc_code
                                                                                                    }
                                                                                                >
                                                                                                    {data.gr_acc_code} -{' '}
                                                                                                    {data.gr_acc_name}
                                                                                                </MenuItem>
                                                                                            );
                                                                                        },
                                                                                    )}
                                                                                </Select>
                                                                            </FormControl>
                                                                        </Stack>
                                                                        <Stack
                                                                            direction={'row'}
                                                                            spacing={2}
                                                                            alignItems={'center'}
                                                                            justifyContent={'flex-start'}
                                                                        >
                                                                            <h6 style={{ width: '40%' }}>
                                                                                {t('currency')}
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
                                                                                    value={valueCurrencyMemo}
                                                                                    // label="Age"
                                                                                    displayEmpty
                                                                                    disabled={valueReadonlyMemo}
                                                                                >
                                                                                    {dataListCurrency.map((data) => {
                                                                                        return (
                                                                                            <MenuItem
                                                                                                key={data.code}
                                                                                                value={data.code}
                                                                                            >
                                                                                                {data.name}
                                                                                            </MenuItem>
                                                                                        );
                                                                                    })}
                                                                                </Select>
                                                                            </FormControl>
                                                                        </Stack>
                                                                    </Stack>
                                                                </Grid>
                                                                <Grid xs={12} md={6}>
                                                                    <Stack spacing={1}>
                                                                        <Stack
                                                                            direction={'row'}
                                                                            spacing={2}
                                                                            alignItems={'center'}
                                                                            justifyContent={'flex-start'}
                                                                        >
                                                                            <h6 style={{ width: '40%' }}>
                                                                                {t('total-debit')}
                                                                            </h6>
                                                                            <h6
                                                                                style={{
                                                                                    width: '100%',
                                                                                    textAlign: 'left',
                                                                                    color: 'red',
                                                                                    fontWeight: 'bold',
                                                                                }}
                                                                            >
                                                                                {valueTotalDebitMemo.toLocaleString(
                                                                                    undefined,
                                                                                    {
                                                                                        maximumFractionDigits: 2,
                                                                                    },
                                                                                )}
                                                                            </h6>
                                                                        </Stack>
                                                                        <Stack
                                                                            direction={'row'}
                                                                            spacing={2}
                                                                            alignItems={'center'}
                                                                            justifyContent={'flex-start'}
                                                                        >
                                                                            <h6 style={{ width: '40%' }}>
                                                                                {t('total-credit')}
                                                                            </h6>
                                                                            <h6
                                                                                style={{
                                                                                    width: '100%',
                                                                                    textAlign: 'left',
                                                                                    color: 'green',
                                                                                    fontWeight: 'bold',
                                                                                }}
                                                                            >
                                                                                {valueTotalCreditMemo.toLocaleString(
                                                                                    undefined,
                                                                                    {
                                                                                        maximumFractionDigits: 2,
                                                                                    },
                                                                                )}
                                                                            </h6>
                                                                        </Stack>
                                                                    </Stack>
                                                                </Grid>
                                                            </Grid>
                                                        </Item>
                                                    </Grid>
                                                </Grid>
                                            </Item>
                                        </Grid>
                                        <Grid xs={12} md={12}>
                                            <Item>
                                                <Grid>
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
                                                                }}
                                                            >
                                                                {t('entry-title-detail')}
                                                            </h5>
                                                            <Stack direction={'row'} spacing={1}>
                                                                <LoadingButton
                                                                    startIcon={<AddBoxIcon />}
                                                                    variant="contained"
                                                                    color="success"
                                                                    onClick={() =>
                                                                        handleClickOpenDialogDetailMemo(true)
                                                                    }
                                                                    // onClick={handleOnClickNewAeDetail}
                                                                    sx={{ alignItems: 'left', whiteSpace: 'nowrap' }}
                                                                    disabled={!valueEditGridMemo}
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
                                                                        columnVisibilityModel={
                                                                            columnVisibilityModelMemo
                                                                        }
                                                                        rows={dataListDetailMemo.filter(
                                                                            (data) =>
                                                                                data.isactive === true &&
                                                                                data.is_delete_item !== true,
                                                                        )}
                                                                        columns={columnsDataMemoDetail}
                                                                        autoHeight
                                                                        showCellVerticalBorder
                                                                        showColumnVerticalBorder
                                                                        getRowId={(id) => id.detail_ids}
                                                                        loading={isLoading}
                                                                        onRowDoubleClick={(params) => {
                                                                            valueEditGridMemo &&
                                                                                handleClickOpenDialogDetailMemo(false);
                                                                            setDataUpdateMemo(params.row);
                                                                        }}
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
                            </TabPanel>
                        </TabContext>
                    </Item>
                </Box>
            </div>
        </Spin>
    );
}

export default AccountingEntry;
