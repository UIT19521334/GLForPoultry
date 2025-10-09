import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import { DataGrid, GridActionsCellItem, GridDeleteIcon, useGridApiRef } from '@mui/x-data-grid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AlertDialog from '~/components/AlertDialog';
import LoadingButton from '@mui/lab/LoadingButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SearchIcon from '@mui/icons-material/Search';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import SaveIcon from '@mui/icons-material/Save';
import '../../../Container.css';
import TextField from '@mui/material/TextField';
import { OnMultiKeyEvent } from '~/components/Event/OnMultiKeyEvent';
import { Input, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import _, { set } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Autocomplete, Button, Checkbox, FormControl, FormLabel, MenuItem, Select } from '@mui/material';
import { Check, CloudUpload, Delete, Domain, Home, PostAdd, Shop, ShoppingCart } from '@mui/icons-material';
import { fetchApiListAccountGroup, fetchApiListSubAccount } from '~/Redux/FetchApi/fetchApiMaster';
import { ApiListAccountEntry, ApiCreateAccountEntry, ApiUpdateAccountEntry, ApiListAllMemo } from '~/components/Api/AccountingEntryApi';
import { DomainPoultry } from '~/DomainApi';
import { updateDialogError } from '~/Redux/Reducer/Thunk';
import { ApiListAccountByUnit } from '~/components/Api/Account';
import { ApiListExpenseByRegion } from '~/components/Api/Expense';
import DialogEntryDetail from './DialogEntryDetail';

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



const MANUAL_ACCOUNTING_ENTRIES_TYPE_ID = 1;

function TransferMemo() {
    // ==================== HOOKS & REDUX ====================
    const { t } = useTranslation();
    const dispatch = useDispatch();

    // Redux selectors
    const username = useSelector((state) => state.FetchApi.userInfo?.userID_old);
    const listAccountGroup = useSelector((state) => state.FetchApi.listData_AccountGroup);
    const listCurrency = useSelector((state) => state.FetchApi.listData_Currency);
    const listUnit = useSelector((state) => state.FetchApi.userAccess.units);
    const token = useSelector((state) => state.FetchApi.token);
    const currentUnit = useSelector((state) => state.FetchApi.currentUnit);

    // ==================== STATE MANAGEMENT ====================
    // Loading & Data states
    const [isLoading, setIsLoading] = React.useState(false);
    const [isLoadingDetail, setIsLoadingDetail] = React.useState(false);
    const [reloadData, setReloadData] = React.useState(false);
    const [dataList, setDataList] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const [valueSearch, setValueSearch] = React.useState('');
    const [dataAccountEntryDetails, setDataAccountEntryDetails] = useState([]);
    const [listAccount, setListAccount] = useState([]);
    const [listSubAccount, setListSubAccount] = useState([]);
    const [listExpense, setListExpense] = useState([]);
    const [selectedEntryDetail, setSelectedEntryDetail] = useState();

    // Form input states
    const [valueEntryId, setValueEntryId] = useState('');
    const [valueUser, setValueUser] = useState('');
    const [valueDescription, setValueDescription] = useState('');
    const [valueDocsDate, setValueDocsDate] = useState(dayjs());
    const [valueUpdateDate, setValueUpdateDate] = useState(dayjs());
    const [valueDateAccountPeriod, setValueUpdateDateAccountPeriod] = React.useState(dayjs());
    const [valueTotalDebit, setValueTotalDebit] = useState(0);
    const [valueTotalCredit, setValueTotalCredit] = useState(0);
    const [valueAccountGroupId, setValueAccountGroupId] = useState("9000");
    const [valueAccountGroupName, setValueAccountGroupName] = useState();
    const [valueCurrencyId, setValueCurrencyId] = useState('CU001');
    const [valueCurrencyName, setValueCurrencyName] = useState('');
    const [valueUnitId, setValueUnitId] = useState('');
    const [valueUnitName, setValueUnitName] = useState('');
    const [valueUnitRegion, setValueUnitRegion] = useState('01');

    // UI control states
    const [valueReadonly, setValueReadonly] = React.useState(true);
    const [valueReadonlyPostingDate, setValueReadonlyPostingDate] = React.useState(true);
    const [valueReadonlyCode, setValueReadonlyCode] = React.useState(true);
    const [statusDialogDetail, setStatusDialogDetail] = React.useState("VIEW");
    const apiRefDetail = useGridApiRef();

    // Button states
    const [valueNewButton, setValueNewButton] = React.useState(false);
    const [valueUpdateButton, setValueUpdateButton] = React.useState(false);
    const [valueDisableSaveButton, setValueDisableSaveButton] = React.useState(true);
    const [valueDisableDeleteButton, setValueDisableDeleteButton] = React.useState(true);
    const [valueDisableUpdateButton, setValueDisableUpdateButton] = React.useState(true);
    const [valueDisableEditDetail, setValueDisableEditDetail] = React.useState(true);
    const [valueDisableUpdateDetail, setValueDisableUpdateDetail] = React.useState(true);

    // Dialog states
    const [dialogIsOpenNew, setDialogIsOpenNew] = React.useState(false);
    const [dialogIsOpenUpdate, setDialogIsOpenUpdate] = React.useState(false);
    const [dialogIsOpenDelete, setDialogIsOpenDelete] = React.useState(false);
    const [dialogIsOpenImportFile, setDialogIsOpenImportFile] = React.useState(false);
    const [openDialogDetail, setOpenDialogDetail] = React.useState(false);

    // File import states
    const [fileExcel, setFileExcell] = React.useState([]);
    const [callApiImportFile, setCallApiImportFile] = React.useState(false);

    // ==================== COLUMNS CONFIGURATION ====================
    // Header columns
    const columns = [
        {
            field: 'EntryId',
            headerName: t('entry-code'),
            minWidth: 150,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'CreatedAt',
            headerName: t('entry-posting-date'),
            minWidth: 150,
            valueFormatter: (params) => dayjs(params.value).format('DD-MM-YYYY'),
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'Description',
            headerName: t('description'),
            minWidth: 300,
            flex: 1,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'DocTypeName',
            headerName: t('memo-type'),
            minWidth: 150,
            headerClassName: 'super-app-theme--header',
        }
    ];

    // Detail columns
    const columnsDataDetail = React.useMemo(() => [
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
                        icon={<Delete />}
                        label="Delete"
                        onClick={handleDeleteDetail(id)}
                        color="inherit"
                    />,
                ];
            },
        },
        {
            field: 'EntryDetailId',
            headerName: t('no'),
            headerAlign: 'center',
            align: 'center',
            width: 50,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'AccountId',
            headerName: t('account-code'),
            width: 240,
            valueFormatter: (params) => {
                const row = params.api.getRow(params.id);
                return `${row.AccountId} - ${row.AccountName}`;
            },
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'Amount_Dr',
            headerName: t('debit'),
            width: 150,
            type: 'number',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            editable: true,
        },
        {
            field: 'Amount_Cr',
            headerName: t('credit'),
            width: 150,
            type: 'number',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            editable: true,
        },
        {
            field: 'Description',
            headerName: t('explain'),
            width: 150,
            headerClassName: 'super-app-theme--header',
            editable: true,
        },
        {
            field: 'SubAccountName',
            headerName: t('account-subcode'),
            minWidth: 130,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'CostingMethod',
            headerName: t('Costing'),
            minWidth: 150,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'Non_Deductible',
            headerName: t('non-deductible'),
            minWidth: 50,
            headerAlign: 'center',
            align: 'center',
            type: 'boolean',
            flex: 1,
            headerClassName: 'super-app-theme--header',
            editable: true,
            hide: true
        },
    ], [listAccount, listSubAccount]);

    // ==================== COMPUTED VALUES ====================
    // Visibility column in datagrid
    const columnVisibilityModel = React.useMemo(() => {
        if (valueDisableEditDetail) {
            return { actions: false, CostingMethod: true };
        }
        return { actions: true, CostingMethod: true, Non_Deductible: true };
    }, [valueDisableEditDetail]);

    // ==================== FORM HANDLERS ====================
    const handleChangeValueEntryId = (event) => {
        setValueEntryId(event.target.value);
    };

    const handleChangeValueUser = (event) => {
        setValueUser(event.target.value);
    };

    const handleChangeValueDescription = (event) => {
        setValueDescription(event.target.value);
    };

    const handleChangeValueDocsDate = (event) => {
        setValueDocsDate(event);
    };

    const handleChangeValueUpdateDate = (event) => {
        setValueUpdateDate(event);
    };

    const handleChangeCurrency = (event) => {
        setValueCurrencyId(event.target.value);
        setValueCurrencyName(listCurrency.find(c => c.CurrencyId === event.target.value)?.CurrencyName || '')
    };

    const handleChangeAccountGroup = (event) => {
        setValueAccountGroupId(event.target.value);
    };



    const handleChangeDateAccountPeriod = (event) => {
        setValueUpdateDateAccountPeriod(event);
    };

    // ==================== DATA LOADING ====================
    // Fetch accounting entry data
    useEffect(() => {
        const fetchApiGetDataAccountingEntry = async () => {
            setIsLoading(true);
            setValueUnitName(currentUnit.UnitName);
            setValueUnitId(currentUnit.UnitId);
            setValueUnitRegion(currentUnit.RegionId);
            const result = await ApiListAllMemo(
                valueDateAccountPeriod.format('MMYYYY'),
                currentUnit.UnitId
            );
            dispatch(fetchApiListAccountGroup(token));
            setDataList(result);
            setDisplayData(result);
            setIsLoading(false);
        };
        fetchApiGetDataAccountingEntry();
    }, [reloadData, currentUnit]);

    useEffect(() => {
        const fetchApiSupport = async () => {
            if (valueUnitId && listUnit.length > 0) {
                try {
                    setIsLoadingDetail(true);
                    const body = {
                        IncludeUnit: true,
                        Units: [valueUnitId]
                    }
                    const data_listAccount = await ApiListAccountByUnit(body);
                    const data_listExpense = await ApiListExpenseByRegion(valueUnitRegion);
                    setListAccount(data_listAccount);
                    setListExpense(data_listExpense);
                    setIsLoadingDetail(false);
                } catch (error) {
                    setListAccount([]);
                    dispatch(updateDialogError({ open: true, title: 'Error', content: `Error api get list account by unit!\n ${error}` }));
                    setIsLoadingDetail(false);
                }
            }
        };
        setDataAccountEntryDetails([]);
        fetchApiSupport();
    }, [valueUnitId]);

    const handleReloadData = () => {
        setReloadData(!reloadData);
    };

    const getAccountEntryDetail = async (entryId) => {
        try {
            setIsLoadingDetail(true);
            const accountEntry = await DomainPoultry.get(`journal/entry/${entryId}`, { headers: { Authorization: token } });
            const entryDetails = accountEntry.data?.Response.detail ?? [];
            setDataAccountEntryDetails(entryDetails);
            setIsLoadingDetail(false);
        } catch (error) {
            setIsLoadingDetail(false);
            dispatch(updateDialogError({ open: true, title: 'Error', content: `Error api get data account entry detail!\n ${error}` }));
        }
    }

    useEffect(() => {
        if (dataAccountEntryDetails.length > 0) {
            const totalCr = _.sumBy(dataAccountEntryDetails, "Amount_Cr");
            const totalDr = _.sumBy(dataAccountEntryDetails, "Amount_Dr");
            setValueTotalCredit(totalCr);
            setValueTotalDebit(totalDr);
        }
    }, [dataAccountEntryDetails])

    const getDepreciationEntries = async () => {
        try {
            setIsLoading(true);
            const body = {
                unitids: [currentUnit.UnitId],
                username: username,
                month: valueDateAccountPeriod.format('MM'),
                year: valueDateAccountPeriod.format('YYYY'),
            }
            const res = await DomainPoultry.post(`journal/trans-memo/depreciation`, body, { headers: { Authorization: token } });
            const data = res.data?.Response ?? [];
            setDataList(data);
            setDisplayData(data);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            dispatch(updateDialogError({ open: true, title: 'Error', content: `Error api get depreciation!\n ${error}` }));
        }
    }

    const getSalesEntries = async () => {
        try {
            setIsLoading(true);
            const body = {
                unitids: [currentUnit.UnitId],
                username: username,
                month: valueDateAccountPeriod.format('MM'),
                year: valueDateAccountPeriod.format('YYYY'),
            }
            const res = await DomainPoultry.post(`journal/trans-memo/sales`, body, { headers: { Authorization: token } });
            const data = res.data?.Response ?? [];
            setDataList(data);
            setDisplayData(data);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            dispatch(updateDialogError({ open: true, title: 'Error', content: `Error api get depreciation!\n ${error}` }));
        }
    }


    // ==================== SEARCH FUNCTIONALITY ====================
    const handleSearch = () => {
        let filteredData = dataList;
        if (valueSearch && valueSearch.trim() !== "") {
            const fieldsToSearch = ["EntryId", "DocTypeName", "AccountGroupName"];
            filteredData = _.filter(dataList, (item) => {
                const search = _.toLower(valueSearch);
                return _.some(fieldsToSearch, (field) =>
                    _.includes(_.toLower(item[field]), search)
                );
            });
        }
        setDisplayData(filteredData);
    };

    // ==================== ROW SELECTION ====================
    const onRowsSelectionHandler = (ids) => {
        const selectedRowsData = ids.map((id) =>
            displayData.find((row) => row.EntryId === id)
        );

        if (selectedRowsData) {
            selectedRowsData.map((key) => {
                setValueEntryId(key.EntryId);
                setValueDocsDate(dayjs(key.CreatedAt));
                setValueDescription(key.Description ?? '');
                setValueUpdateDate(dayjs(key.UpdateAt));
                setValueUser(key.Username ?? 'japfa system');
                setValueAccountGroupId(key.GroupAccountId ?? '');
                setValueAccountGroupName(key.DocTypeName ?? '');
                setValueCurrencyId(key.CurrencyId ?? 'CU001');
                setValueCurrencyName(key.CurrencyName ?? '');
                setValueUnitId(key.UnitId ?? '');
                setValueUnitName(key.UnitName ?? '');
                setValueNewButton(false);
                setValueUpdateButton(false);
                setValueDisableSaveButton(true);
                setValueReadonly(true);
                setValueReadonlyPostingDate(true);
                setValueDisableEditDetail(true);
                setTimeout(() =>
                    getAccountEntryDetail(key.EntryId)
                    , 0);
            });

            setValueReadonly(true);
            setValueReadonlyCode(true);
            setValueDisableSaveButton(true);
            setValueDisableDeleteButton(false);
            setValueNewButton(false);
            setValueUpdateButton(false);
            setValueDisableUpdateButton(false);
        }
    };

    // ==================== FILE IMPORT ====================
    const handleClickChoseFile = (event) => {
        setFileExcell(event.target.files);
    };

    const handleClickImportFile = () => {
        const fileType = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv'
        ];

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
            // await ApiImportAccountEntry(fileExcel);
            setFileExcell('');
            handleReloadData();
        };
        apiImportFile();
    }, [callApiImportFile]);

    // ==================== RENDER SUB UI ====================
    function AccountEditInputCell(props) {
        const { id, field, value, api, row } = props; // default []
        const handleChange = async (event, newValue) => {
            api.setEditCellValue({
                id,
                field,
                value: newValue?.AccountId || "",
            });
        };
        const selected = listAccount?.find((acc) => acc.AccountId === value) || null;

        return (
            <Autocomplete
                size="small"
                fullWidth
                value={selected}
                onChange={handleChange}
                options={listAccount || []}
                getOptionLabel={(option) =>
                    option ? `${option.AccountId} - ${option.AccountName}` : ""
                }
                renderInput={(params) => (
                    <TextField {...params} variant="outlined" size="small" />
                )}
            />
        );
    }

    function SubAccountEditInputCell(props) {
        const { id, field, value, api, row } = props; // default []
        const handleChange = (event, newValue) => {
            api.setEditCellValue({
                id,
                field,
                value: newValue?.AccountSubId || "",
            });
        };
        const selected = listSubAccount?.find((acc) => acc.AccountSubId === value) || null;

        return (
            <Autocomplete
                size="small"
                fullWidth
                value={selected}
                onChange={handleChange}
                options={listSubAccount || []}
                getOptionLabel={(option) =>
                    option ? `${option.AccountSubId} - ${option.AccountSubName}` : ""
                }
                renderInput={(params) => (
                    <TextField {...params} variant="outlined" size="small" />
                )}
            />
        );
    }

    // ==================== CRUD OPERATIONS ====================
    // Reset form to initial state
    const resetFormState = () => {
        setValueEntryId('');
        setValueDocsDate(dayjs());
        setValueUpdateDate(dayjs());
        setValueUser(username);
        setValueDescription('');
        setValueAccountGroupId('9000');
        setValueAccountGroupName('');
        setValueCurrencyId('CU001');
        setValueCurrencyName('');
        setValueUnitName('');
        setValueUnitId('');
        setValueUnitRegion('01');
        setValueTotalDebit(0);
        setValueTotalCredit(0);
        setValueNewButton(false);
        setValueDisableSaveButton(true);
        setDataAccountEntryDetails([]);
        setValueReadonly(true);
        setValueReadonlyPostingDate(true);
        setValueDisableEditDetail(true);
    };

    // NEW Operation
    const handleClickNew = () => {
        setValueEntryId('');
        setValueDocsDate(dayjs());
        setValueUpdateDate(dayjs());
        setValueUser(username);
        setValueDescription('');
        setValueAccountGroupId('9000');
        setValueAccountGroupName('');
        setValueCurrencyId('CU001');
        setValueCurrencyName('');
        setValueUnitName(currentUnit.UnitName);
        setValueUnitId(currentUnit.UnitId);
        setValueUnitRegion(currentUnit.RegionId);
        setValueTotalCredit(0);
        setValueTotalDebit(0);
        setDataAccountEntryDetails([]);
        setValueNewButton(true);
        setValueDisableSaveButton(false);
        setValueDisableDeleteButton(true);
        setValueDisableUpdateButton(true);
        setValueReadonly(false);
        setValueReadonlyCode(true);
        setValueReadonlyPostingDate(false);
        setValueDisableEditDetail(false);
    };

    const agreeDialogNew = () => {
        setDialogIsOpenNew(false);
        asyncApiCreateAccountingEntry();
    };

    const closeDialogNew = () => {
        setDialogIsOpenNew(false);
        toast.warning(t('toast-cancel-new'));
    };

    const asyncApiCreateAccountingEntry = async () => {
        setIsLoading(true);
        const body = {
            header: {
                doc_date: valueDocsDate.format('YYYY-MM-DD'), //ngay tao but toan
                desciption: valueDescription, // mo ta but toan
                currency: valueCurrencyId, // loai tien
                grp_acc: parseInt(valueAccountGroupId, 10), // luon la 9000 voi but toan thu cong
                username: username,
                unitid: valueUnitId, // unit 
                amount: valueTotalCredit
            },
            detail: dataAccountEntryDetails.map(item => {
                return {
                    accountid: item.AccountId,
                    description: item.Description,
                    credit_amount: item.Amount_Cr,
                    debit_amount: item.Amount_Dr,
                    subaccountid: item.AccountSubId,
                    costing_methodid: item.CostingMethod,
                    non_deductible: item.Non_Deductible
                };
            })
        };
        const statusCode = await ApiCreateAccountEntry(body);

        if (statusCode) {
            resetFormState();
        }

        setIsLoading(false);
        setReloadData(!reloadData);
    };

    // UPDATE Operation
    const handleClickUpdate = () => {
        setValueUser(username);
        setValueNewButton(false);
        setValueUpdateButton(true);
        setValueReadonlyCode(true);
        setValueReadonly(false);
        setValueReadonlyPostingDate(true);
        setValueDisableSaveButton(false);
        setValueDisableDeleteButton(true);
        setValueDisableEditDetail(false);
    };

    const agreeDialogUpdate = () => {
        setDialogIsOpenUpdate(false);
        asyncApiUpdateAccountingEntry();
    };

    const closeDialogUpdate = () => {
        setDialogIsOpenUpdate(false);
        toast.warning(t('toast-cancel-update'));
    };

    const asyncApiUpdateAccountingEntry = async () => {
        setIsLoading(true);

        const body = {
            header: {
                doc_date: valueDocsDate.format('YYYY-MM-DD'), //ngay tao but toan
                desciption: valueDescription, // mo ta but toan
                currency: valueCurrencyId, // loai tien
                grp_acc: parseInt(valueAccountGroupId, 10), // luon la 9000 voi but toan thu cong
                username: username,
                unitid: valueUnitId, // unit 
                amount: valueTotalCredit
            },
            detail: dataAccountEntryDetails.map(item => {
                return {
                    accountid: item.AccountId,
                    description: item.Description,
                    credit_amount: item.Amount_Cr,
                    debit_amount: item.Amount_Dr,
                    subaccountid: item.AccountSubId,
                    costing_methodid: item.CostingMethod,
                    non_deductible: item.Non_Deductible
                };
            })
        };
        const statusCode = await ApiUpdateAccountEntry(valueEntryId, body);
        if (statusCode) {
            setValueReadonly(true);
            setValueUpdateButton(false);
            setValueDisableSaveButton(true);
            setValueDisableDeleteButton(true);
        }

        setIsLoading(false);
        setReloadData(!reloadData);
    };

    // SAVE Operation
    const handleClickSave = () => {
        if (valueAccountGroupId.length === 0 || !valueCurrencyId || valueCurrencyId.length === 0 || !valueUnitId || valueUnitId.length === 0) {
            toast.error(t('toast-valid-empty'));
            return;
        }

        if (valueNewButton) {
            setDialogIsOpenNew(true);
        }
        if (valueUpdateButton) {
            setDialogIsOpenUpdate(true);
        }
    };

    // DELETE Operation
    const handleClickDelete = async () => {
        setDialogIsOpenDelete(true);
    };

    const agreeDialogDelete = () => {
        setDialogIsOpenDelete(false);
        asyncApiDeleteAccount();
    };

    const closeDialogDelete = () => {
        setDialogIsOpenDelete(false);
        toast.warning(t('toast-cancel-delete'));
    };

    const asyncApiDeleteAccount = async () => {
        setIsLoading(true);
        // const statusCode = await ApiDeleteAccount(valueId);
        const statusCode = true;

        if (statusCode) {
            resetFormState();
        }

        setIsLoading(false);
        setReloadData(!reloadData);
    };

    // ==================== DETAIL OPERATIONS ====================

    const handleRowDetailSelect = (ids) => {
        const selectedRowData = dataAccountEntryDetails.find((row) => row.EntryDetailId === ids[0]);
        setSelectedEntryDetail(selectedRowData)
        setValueDisableUpdateDetail(false)
    };

    const handleClickAddDetail = () => {
        if (valueReadonly) {
            toast.warning(t('toast-click-update'));
            return;
        }
        setStatusDialogDetail('ADD')
        setOpenDialogDetail(true);
    }

    const handleClickViewDetail = async () => {
        if (!selectedEntryDetail) {
            toast.warning(t('Please selected data !!!'));
            return;
        }
        setStatusDialogDetail('VIEW')
        setOpenDialogDetail(true);
    };

    const handleUpdateDetail = async (newRow, oldRow) => {
        if (valueDisableEditDetail) {
            toast.warning(t('toast-click-update'));
            return oldRow;
        }
        let updatedRow = { ...newRow };
        if (newRow.AccountId !== oldRow.AccountId) {
            const acc = listAccount.find(a => a.AccountId === newRow.AccountId);
            if (acc) {
                updatedRow = {
                    ...updatedRow,
                    MethodName: acc?.MethodName || "",
                };
            }
        }
        setDataAccountEntryDetails((prev) =>
            prev.map((row) => (row.EntryDetailId === oldRow.EntryDetailId ? { ...row, ...updatedRow } : row))
        );
        return updatedRow;
    };

    const handleDeleteDetail = (id) => () => {
        if (!valueDisableEditDetail) {
            setDataAccountEntryDetails((prevData) => prevData.filter((item) => item.EntryDetailId !== id));
        } else {
            toast.warning(t('toast-click-update'));
        }
    };

    const handleCloseDialogDetail = () => {
        setOpenDialogDetail(false);
    };

    // ==================== KEYBOARD SHORTCUTS ====================
    OnMultiKeyEvent(handleClickNew, valueNewButton ? '' : 'n');
    OnMultiKeyEvent(handleClickUpdate, valueDisableUpdateButton ? '' : 'u');
    OnMultiKeyEvent(handleClickSave, valueDisableSaveButton || openDialogDetail ? '' : 's');
    OnMultiKeyEvent(handleClickDelete, valueDisableDeleteButton ? '' : 'd');
    //! mobile responsive
    const mobileResponsive = (
        <Stack
            direction={'row'}
            spacing={1}
            sx={{ display: { xs: 'flex', md: 'none' } }}
            justifygroupid={'space-between'}
            marginTop={1.5}
        >
            <LoadingButton
                size="small"
                fullWidth
                startIcon={<AddBoxIcon />}
                variant="contained"
                color="success"
                onClick={handleClickNew}
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
                onClick={handleClickUpdate}
                loading={valueUpdateButton}
                loadingPosition="start"
                sx={{ whiteSpace: 'nowrap' }}
                disabled={valueDisableUpdateButton}
            >
                {t('button-update')}
            </LoadingButton>
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
                startIcon={<GridDeleteIcon />}
                variant="contained"
                color="error"
                onClick={handleClickDelete}
                disabled={valueDisableDeleteButton}
            >
                {t('button-delete')}
            </LoadingButton>
        </Stack>
    );
    return (
        <Spin size="large" tip={t('loading')} spinning={false}>
            <div className="main">
                <ToastContainer position='bottom-right' stacked />
                {dialogIsOpenImportFile && (
                    <AlertDialog
                        title={t('entry-toast-upload')}
                        content={<> Name: {fileExcel ? fileExcel[0].name : ''}</>}
                        onOpen={dialogIsOpenImportFile}
                        onClose={closeDialogImportFile}
                        onAgree={agreeDialogImportFile}
                    />
                )}
                {dialogIsOpenNew && (
                    <AlertDialog
                        title={t('entry-toast-new')}
                        content={
                            <>
                                {t('entry-code')}: {valueEntryId}
                                <br /> {t('description')}: {valueDescription}
                                <br /> {t('currency')}: {valueCurrencyId}
                                <br /> {t('account-group')}: {valueAccountGroupId}
                            </>
                        }
                        onOpen={dialogIsOpenNew}
                        onClose={closeDialogNew}
                        onAgree={agreeDialogNew}
                    />
                )}
                {dialogIsOpenUpdate && (
                    <AlertDialog
                        title={t('account-toast-update')}
                        content={
                            <>
                                {t('entry-code')}: {valueEntryId}
                                <br /> {t('description')}: {valueDescription}
                                <br /> {t('currency')}: {valueCurrencyId}
                                <br /> {t('account-group')}: {valueAccountGroupId}
                            </>
                        }
                        onOpen={dialogIsOpenUpdate}
                        onClose={closeDialogUpdate}
                        onAgree={agreeDialogUpdate}
                    />
                )}
                {dialogIsOpenDelete && (
                    <AlertDialog
                        title={t('account-toast-delete')}
                        content={
                            <>
                                {t('entry-code')}: {valueEntryId}
                                <br /> {t('description')}: {valueDescription}
                                <br /> {t('currency')}: {valueCurrencyId}
                                <br /> {t('account-group')}: {valueAccountGroupId}
                            </>
                        }
                        onOpen={dialogIsOpenDelete}
                        onClose={closeDialogDelete}
                        onAgree={agreeDialogDelete}
                    />
                )}

                <DialogEntryDetail
                    isOpenEntryDetail={openDialogDetail}
                    onCloseEntryDetail={handleCloseDialogDetail}
                    valueUnitId={valueUnitId}
                    valueUnitRegion={valueUnitRegion}
                    valueEntryId={valueEntryId}
                    statusDialogDetail={statusDialogDetail}
                    dataAccountEntryDetails={dataAccountEntryDetails}
                    setDataAccountEntryDetails={setDataAccountEntryDetails}
                    selectedEntryDetail={selectedEntryDetail}
                />

                <Box
                    sx={{
                        flexGrow: 1,
                        '& .super-app-theme--header': {
                            backgroundColor: '#ffc696',
                        },
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
                                            <FormLabel sx={{ whiteSpace: 'nowrap', mr: 1 }}>
                                                {t('entry-period')}
                                            </FormLabel>

                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    views={['month', 'year']}
                                                    sx={{ width: '100%', flex: 3 }}
                                                    value={valueDateAccountPeriod}
                                                    slotProps={{
                                                        textField: {
                                                            size: 'small',
                                                        },

                                                    }}
                                                    formatDensity="spacious"
                                                    format="MM-YYYY"
                                                    onChange={(e) =>
                                                        handleChangeDateAccountPeriod(e)
                                                    }
                                                />
                                            </LocalizationProvider>

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
                                                value={valueSearch}
                                                onChange={(event) => setValueSearch(event.target.value)}
                                                onKeyDown={(event) => {
                                                    if (event.key === 'Enter') {
                                                        handleSearch();
                                                    }
                                                }}
                                            />

                                            <LoadingButton
                                                startIcon={<SearchIcon />}
                                                variant="contained"
                                                color="warning"
                                                sx={{
                                                    whiteSpace: 'nowrap',
                                                    width: 180,
                                                }}
                                                onClick={() =>
                                                    setReloadData(
                                                        !reloadData,
                                                    )
                                                }
                                            >
                                                {t('button-search')}
                                            </LoadingButton>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Item>
                        </Grid>

                        <Grid xs={12} md={12}>
                            <Item>
                                <Stack spacing={0}>
                                    <Grid xs={12} md={12}>
                                        <Stack
                                            width={'100%'}
                                            direction={'row'}
                                            spacing={2}
                                            alignItems={'center'}
                                            justifyContent={'space-between'}
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
                                            <Stack
                                                direction={'row'}
                                                spacing={2}
                                                alignItems={'center'}
                                                justifyContent={'flex-start'}
                                            >
                                                <Button
                                                    component="label"
                                                    role={undefined}
                                                    variant="contained"
                                                    tabIndex={-1}
                                                    startIcon={<Home />}
                                                    onClick={getDepreciationEntries}
                                                    sx={{
                                                        width: 300,
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {t('load memo from depreciation')}
                                                </Button>
                                                <Button
                                                    component="label"
                                                    role={undefined}
                                                    variant="contained"
                                                    tabIndex={-1}
                                                    color="success"
                                                    startIcon={<ShoppingCart />}
                                                    onClick={getSalesEntries}
                                                    sx={{
                                                        width: 300,
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {t('load memo from sale')}
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                    <div style={{ width: '100%' }}>
                                        <DataGrid
                                            rows={displayData}
                                            columns={columns}
                                            getRowId={(row) => row.EntryId}
                                            initialState={{
                                                pagination: {
                                                    paginationModel: { page: 0, pageSize: 5 },
                                                },
                                            }}
                                            pageSizeOptions={[5, 10, 15]}
                                            autoHeight
                                            showCellVerticalBorder
                                            showColumnVerticalBorder
                                            loading={isLoading}
                                            onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
                                            // checkboxSelection
                                            slotProps={{
                                                pagination: {
                                                    sx: {
                                                        "& .MuiTablePagination-selectLabel": {
                                                            marginBottom: 0, // align label vertically
                                                        },
                                                        "& .MuiTablePagination-displayedRows": {
                                                            marginBottom: 0, // align displayed rows text
                                                        },
                                                        "& .MuiTablePagination-select": {
                                                            paddingTop: "8px",
                                                            paddingBottom: "8px",
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                </Stack>
                            </Item>
                        </Grid>

                        <Grid xs={12} md={12}>
                            <Item>
                                <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                    <Stack
                                        width={'100%'}
                                        direction={'row'}
                                        spacing={2}
                                        alignItems={'center'}
                                        justifygroupid={'flex-end'}
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
                                    </Stack>
                                    {/* <Stack direction={'row'} spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
                                        <LoadingButton
                                            startIcon={<AddBoxIcon />}
                                            variant="contained"
                                            color="success"
                                            onClick={handleClickNew}
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
                                            onClick={handleClickUpdate}
                                            loading={valueUpdateButton}
                                            loadingPosition="start"
                                            sx={{ whiteSpace: 'nowrap' }}
                                            disabled={valueDisableUpdateButton}
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
                                            startIcon={<SaveIcon />}
                                            variant="contained"
                                            color="error"
                                            onClick={handleClickDelete}
                                            disabled={valueDisableDeleteButton}
                                        >
                                            {t('button-delete')}
                                        </LoadingButton>
                                    </Stack> */}
                                </Stack>
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
                                                        size="large"
                                                        placeholder="xxxxxxxxx"
                                                        value={valueEntryId}
                                                        onChange={handleChangeValueEntryId}
                                                        disabled={valueReadonlyCode}
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
                                                                value={valueDocsDate}
                                                                sx={{ width: '100%' }}
                                                                slotProps={{
                                                                    textField: { size: 'small' },
                                                                }}
                                                                formatDensity="spacious"
                                                                format="DD-MM-YYYY"
                                                                onChange={(e) =>
                                                                    handleChangeValueDocsDate(e)
                                                                }
                                                                disabled={valueReadonlyPostingDate}
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
                                                        size="large"
                                                        placeholder="name..."
                                                        value={valueUser}
                                                        onChange={handleChangeValueUser}
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
                                                                value={valueUpdateDate}
                                                                sx={{ width: '100%' }}
                                                                slotProps={{
                                                                    textField: { size: 'small' },
                                                                }}
                                                                formatDensity="spacious"
                                                                format="DD-MM-YYYY"
                                                                onChange={(e) =>
                                                                    handleChangeValueUpdateDate(e)
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
                                                        value={valueDescription}
                                                        onChange={handleChangeValueDescription}
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
                                                                value={valueAccountGroupId}
                                                                onChange={handleChangeAccountGroup}
                                                                displayEmpty
                                                                disabled
                                                            >
                                                                {listAccountGroup.map(
                                                                    (data) => {
                                                                        return (
                                                                            <MenuItem
                                                                                key={data.GroupId}
                                                                                value={data.GroupId}
                                                                            >
                                                                                {data.GroupId} -{' '}
                                                                                {data.GroupName}
                                                                            </MenuItem>
                                                                        );
                                                                    },
                                                                )}
                                                                {/* Nếu value không rỗng và không có trong list thì render mặc định */}
                                                                {valueAccountGroupId !== "" &&
                                                                    !listAccountGroup.some((d) => d.GroupId === valueAccountGroupId) && (
                                                                        <MenuItem style={{ textAlign: 'left' }} value={valueAccountGroupId}>
                                                                            {`[${valueAccountGroupId}] - ${valueAccountGroupName}`}
                                                                        </MenuItem>
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
                                                            }}
                                                            size="small"
                                                        >
                                                            <Select
                                                                value={valueCurrencyId}
                                                                displayEmpty
                                                                onChange={handleChangeCurrency}
                                                                disabled
                                                            >
                                                                {listCurrency.map((data) => {
                                                                    return (
                                                                        <MenuItem
                                                                            key={data.CurrencyId}
                                                                            value={data.CurrencyId}
                                                                        >
                                                                            {data.CurrencyName}
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
                                                            {valueTotalDebit.toLocaleString(
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
                                                            {valueTotalCredit.toLocaleString(
                                                                undefined,
                                                                {
                                                                    maximumFractionDigits: 2,
                                                                },
                                                            )}
                                                        </h6>
                                                    </Stack>
                                                </Stack>
                                            </Grid>
                                            {/* <Grid xs={12} md={6}>
                                                <Stack spacing={1}>
                                                    <Stack
                                                        direction={'row'}
                                                        spacing={2}
                                                        alignItems={'center'}
                                                        justifyContent={'flex-start'}
                                                    >
                                                        <h6 style={{ width: '40%' }}>
                                                            {t('unit')}
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
                                                                value={valueUnitId}
                                                                onChange={handleChangeUnit}
                                                                disabled={valueReadonly}
                                                            >
                                                                {listUnit.map(
                                                                    (data) => {
                                                                        return (
                                                                            <MenuItem
                                                                                key={data.UnitId}
                                                                                value={data.UnitId}
                                                                            >
                                                                                {data.UnitId} -{' '}
                                                                                {data.UnitName}
                                                                            </MenuItem>
                                                                        );
                                                                    },
                                                                )}
                                                                {valueUnitId !== "" &&
                                                                    !listUnit.some((d) => d.UnitId === valueUnitId) && (
                                                                        <MenuItem style={{ textAlign: 'left' }} value={valueUnitId}>
                                                                            {`[${valueUnitId}] - ${valueUnitName}`}
                                                                        </MenuItem>
                                                                    )}
                                                            </Select>
                                                        </FormControl>
                                                    </Stack>
                                                </Stack>
                                            </Grid> */}
                                        </Grid>
                                    </Item>
                                </Grid>
                                {mobileResponsive}
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
                                                    size="small"
                                                    startIcon={<SystemUpdateAltIcon />}
                                                    variant="contained"
                                                    color="warning"
                                                    onClick={handleClickViewDetail}
                                                    sx={{ whiteSpace: 'nowrap' }}
                                                    disabled={valueDisableEditDetail || valueDisableUpdateDetail}
                                                >
                                                    {t('button-view')}
                                                </LoadingButton>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                    <Grid xs={12} md={12} sx={{ width: '100%' }}>
                                        <Item>
                                            <Stack spacing={0}>
                                                <div style={{ width: '100%', minHeight: 500 }}>
                                                    <DataGrid
                                                        apiRef={apiRefDetail}
                                                        columnVisibilityModel={columnVisibilityModel}
                                                        rows={dataAccountEntryDetails}
                                                        columns={columnsDataDetail}
                                                        autoHeight
                                                        showCellVerticalBorder
                                                        showColumnVerticalBorder
                                                        getRowId={(id) => id.EntryDetailId}
                                                        processRowUpdate={handleUpdateDetail}
                                                        onRowSelectionModelChange={(ids) => handleRowDetailSelect(ids)}
                                                        loading={isLoadingDetail}
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
                                                            pagination: {
                                                                sx: {
                                                                    "& .MuiTablePagination-selectLabel": {
                                                                        marginBottom: 0, // align label vertically
                                                                    },
                                                                    "& .MuiTablePagination-displayedRows": {
                                                                        marginBottom: 0, // align displayed rows text
                                                                    },
                                                                    "& .MuiTablePagination-select": {
                                                                        paddingTop: "8px",
                                                                        paddingBottom: "8px",
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

export default TransferMemo;
