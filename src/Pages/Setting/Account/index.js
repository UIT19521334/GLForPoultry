import * as React from 'react';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import { DataGrid, GridDeleteIcon } from '@mui/x-data-grid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AlertDialog from '~/components/AlertDialog';
import LoadingButton from '@mui/lab/LoadingButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SearchIcon from '@mui/icons-material/Search';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { ApiCreateAccount, ApiDeleteAccount, ApiListAccount, ApiUpdateAccount } from '~/components/Api/Account';
import SaveIcon from '@mui/icons-material/Save';
import '../../../Container.css';
import TextField from '@mui/material/TextField';
import { OnKeyEvent } from '~/components/Event/OnKeyEvent';
import { OnMultiKeyEvent } from '~/components/Event/OnMultiKeyEvent';
import { Input, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import _, { set } from 'lodash';
import { MenuItem, Select } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApiListExpense, fetchApiListExpenseGroup, fetchApiListMethod, fetchApiListSubAccountType } from '~/Redux/FetchApi/fetchApiMaster';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    direction: 'row',
    color: theme.palette.text.secondary,
}));

function Account() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = React.useState(false);
    const [reloadListAccount, setReloadListAccount] = React.useState(false);
    const [dataList, setDataList] = useState([]);
    const listExpenseGroup = useSelector((state) => state.FetchApi.listData_ExpenseGroup);
    const listSubAccountType = useSelector((state) => state.FetchApi.listData_SubAccountType);
    const listMethod = useSelector((state) => state.FetchApi.listData_Method);
    const listExpense = useSelector((state) => state.FetchApi.listData_Expense);
    const listUnit = useSelector((state) => state.FetchApi.userAccess.units);

    //! columns header
    const columns = [
        {
            field: 'AccountId',
            headerName: t('code'),
            minWidth: 150,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'AccountName',
            headerName: t('name'),
            minWidth: 200,
            flex: 1,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'UnitId',
            headerName: t('unit'),
            minWidth: 100,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'ExpenseGroupName',
            headerName: t('expense-group'),
            minWidth: 200,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'ExpenseName',
            headerName: t('expense'),
            minWidth: 100,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'MethodId',
            headerName: t('method'),
            minWidth: 200,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'AccountSubTypeName',
            headerName: t('menu-sub-acc-type'),
            minWidth: 200,
            flex: 1,
            headerClassName: 'super-app-theme--header',
        }
    ];

    const [valueAccountId, setValueAccountId] = React.useState('');
    const [valueAccountName, setValueAccountName] = React.useState('');
    const [valueUnitId, setValueUnitId] = React.useState('');
    const [valueUnitName, setValueUnitName] = React.useState('');
    const [valueExpenseGroupName, setValueExpenseGroupName] = React.useState('');
    const [valueExpenseGroupId, setValueExpenseGroupId] = React.useState('');
    const [valueExpenseId, setValueExpenseId] = React.useState('');
    const [valueExpenseName, setValueExpenseName] = React.useState('');
    const [valueMethodId, setValueMethodId] = React.useState('');
    const [valueMethodName, setValueMethodName] = React.useState('');
    const [valueSubAccountTypeId, setValueSubAccountTypeId] = React.useState('');
    const [valueSubAccountTypeName, setValueSubAccountTypeName] = React.useState('');
    const [valueDescription, setValueDescription] = React.useState('');

    // TODO call api get data account group
    useEffect(() => {
        const fetchApiGetDataAccount = async () => {
            setIsLoading(true);
            await ApiListAccount(valueSearch, setDataList);
            dispatch(fetchApiListExpenseGroup());
            dispatch(fetchApiListExpense());
            dispatch(fetchApiListMethod());
            dispatch(fetchApiListSubAccountType());
            setIsLoading(false);
        };
        fetchApiGetDataAccount();
    }, [reloadListAccount]);

    // Handle search
    const [valueSearch, setValueSearch] = React.useState('');
    const handleSearch = () => {
        let filteredData = dataList;
        if (valueSearch && valueSearch.trim() !== "") {
            const fieldsToSearch = ["AccountName", "AccountId", "Description"];

            filteredData = _.filter(dataList, (item) => {
                const search = _.toLower(valueSearch);
                return _.some(fieldsToSearch, (field) => _.includes(_.toLower(item[field]), search));
            });
        }
        setDataList(filteredData);
    }

    //! select row in datagrid
    const onRowsSelectionHandler = (ids) => {
        const selectedRowsData = ids.map((id) => dataList.find((row) => row.AccountId === id));
        if (selectedRowsData) {
            {
                selectedRowsData.map((key) => {
                    setValueAccountId(key.AccountId ?? "XXXX");
                    setValueAccountName(key.AccountName ?? '');
                    setValueUnitId(key.UnitId ?? '');
                    setValueExpenseGroupId(key.ExpenseGroupId ?? '');
                    setValueExpenseId(key.ExpenseId ?? '');
                    setValueMethodId(key.MethodId ?? '');
                    setValueSubAccountTypeId(key.AccountSubTypeId ?? '');
                });
                setValueReadonly(true);
                setValueReadonlyCode(true);
                setValueDisableSaveButton(true);
                setValueDisableDeleteButton(false)
                setValueNewButton(false);
                setValueUpdateButton(false);
                setValueDisableUpdateButton(false);
            }
        }
    };

    // TODO call api new
    /* #region  call api new */
    const [dialogIsOpenNew, setDialogIsOpenNew] = React.useState(false);
    const [dialogIsOpenUpdate, setDialogIsOpenUpdate] = React.useState(false);
    const [dialogIsOpenDelete, setDialogIsOpenDelete] = React.useState(false);
    const agreeDialogNew = () => {
        setDialogIsOpenNew(false);
        asyncApiCreateAccount();
    };
    const closeDialogNew = () => {
        setDialogIsOpenNew(false);
        toast.warning(t('toast-cancel-new'));
    };

    const asyncApiCreateAccount = async () => {
        setIsLoading(true);
        const body = {
            UnitName: valueUnitName,
            ExpenseName: valueExpenseName,
            ExpenseGroupName: valueExpenseGroupName,
            MethodName: valueMethodName,
            AccountSubTypeName: valueSubAccountTypeName,
            Id: "",
            AccountId: valueAccountId,
            AccountName: valueAccountName,
            Description: valueDescription,
            Active: true,
            Username: localStorage.getItem('UserName'),
            CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString(),
            UnitId: valueUnitId,
            ExpenseId: valueExpenseId,
            MethodId: valueMethodId,
            AccountSubTypeId: valueSubAccountTypeId,
        }
        const statusCode = await ApiCreateAccount(body);
        if (statusCode) {
            setValueAccountId('');
            setValueAccountName('');
            setValueUnitId('');
            setValueExpenseGroupId('');
            setValueExpenseId('');
            setValueMethodId('');
            setValueSubAccountTypeId('');
            setValueDescription('');
            setValueNewButton(false);
            setValueDisableSaveButton(true);
            setValueDisableDeleteButton(true);
            setValueReadonly(true);
            setValueReadonlyCode(true);
        }
        setIsLoading(false);
        setReloadListAccount(!reloadListAccount);
    };
    /* #endregion */

    const handleOnChangeValueCode = (event) => {
        const inputValue = event.target.value;
        // Regex: không cho ký tự đăc biệt, chỉ cho phép chữ cái, số và khoảng trắng
        if (/^[\p{L}0-9 ]*$/u.test(inputValue)) {
            setValueAccountId(inputValue);
        }
    };
    const handleOnChangeValueName = (event) => {
        setValueAccountName(event.target.value);
    };

    const handleOnChangeValueDescription = (event) => {
        setValueDescription(event.target.value);
    };

    const handleOnChangeValueUnit = (e) => {
        console.log(e.target.value);
        const data = e.target.value && listUnit.find(item => item.UnitId === e.target.value);
        setValueUnitId(data.UnitId);
        setValueUnitName(data.UnitName);
    };

    const handleOnChangeValueExpenseGroupID = (e) => {
        console.log(e.target.value);
        const data = e.target.value && listExpenseGroup.find(item => item.GroupId === e.target.value);
        setValueExpenseGroupId(data.GroupId);
        setValueExpenseGroupName(data.GroupName_EN);
    };

    const handleOnChangeValueExpenseID = (e) => {
        console.log(e.target.value);
        const data = e.target.value && listExpense.find(item => item.ExpenseId === e.target.value);
        setValueExpenseId(data.ExpenseId);
        setValueExpenseName(data.ExpenseName);
    };
    const handleOnChangeValueMethod = (e) => {
        const data = e.target.value && listMethod.find(item => item.MethodId === e.target.value);
        setValueMethodId(data.MethodId);
        setValueMethodName(data.MethodName);
    };
    const handleOnChangeValueSubAccountType = (e) => {
        console.log(e.target.value);
        const data = e.target.value && listSubAccountType.find(item => item.SubTypeId === e.target.value);
        setValueSubAccountTypeId(data.SubTypeId);
        setValueSubAccountTypeName(data.SubTypeName);
    };

    // TODO call api update
    /* #region  call api update */
    const agreeDialogUpdate = () => {
        setDialogIsOpenUpdate(false);
        asyncApiUpdateAccount();
    };
    const closeDialogUpdate = () => {
        setDialogIsOpenUpdate(false);
        toast.warning(t('toast-cancel-update'));
    };

    const asyncApiUpdateAccount = async () => {
        setIsLoading(true);
        const body = {
            UnitName: valueUnitName,
            ExpenseName: valueExpenseName,
            ExpenseGroupName: valueExpenseGroupName,
            MethodName: valueMethodName,
            AccountSubTypeName: valueSubAccountTypeName,
            Id: "",
            AccountId: valueAccountId,
            AccountName: valueAccountName,
            Description: valueDescription,
            Active: true,
            Username: localStorage.getItem('UserName'),
            CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString(),
            UnitId: valueUnitId,
            ExpenseId: valueExpenseId,
            MethodId: valueMethodId,
            AccountSubTypeId: valueSubAccountTypeId,
        }
        const statusCode = await ApiUpdateAccount(body);
        if (statusCode) {
            setValueReadonly(true);
            setValueUpdateButton(false);
            setValueDisableSaveButton(true);
            setValueDisableDeleteButton(true);
        }
        setIsLoading(false);
        setReloadListAccount(!reloadListAccount);
    };

    /* #endregion */

    // TODO call api delete
    /* #region  call api delete */
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
        const statusCode = await ApiDeleteAccount(valueAccountId);
        if (statusCode) {
            setValueAccountId('');
            setValueAccountName('');
            setValueUnitId('');
            setValueExpenseGroupId('');
            setValueExpenseId('');
            setValueMethodId('');
            setValueSubAccountTypeId('');
            setValueDescription('');
            setValueReadonly(true);
            setValueDisableSaveButton(true);
            setValueDisableDeleteButton(true);
        }
        setIsLoading(false);
        setReloadListAccount(!reloadListAccount);
    };

    /* #endregion */

    const [valueReadonly, setValueReadonly] = React.useState(true);
    const [valueReadonlyCode, setValueReadonlyCode] = React.useState(true);

    /* #region  button new */

    const [valueNewButton, setValueNewButton] = React.useState(false);
    const handleOnClickNew = () => {
        setValueNewButton(true);
        setValueUpdateButton(false);
        setValueAccountId('');
        setValueAccountName('');
        setValueUnitId('');
        setValueExpenseGroupId('');
        setValueExpenseId('');
        setValueMethodId('');
        setValueSubAccountTypeId('');
        setValueDescription('');
        setValueReadonly(false);
        setValueReadonlyCode(false);
        setValueDisableSaveButton(false);
        setValueDisableDeleteButton(true);
        setValueDisableUpdateButton(true);
    };
    /* #endregion */

    /* #region  button update */
    const [valueUpdateButton, setValueUpdateButton] = React.useState(false);
    const [valueDisableUpdateButton, setValueDisableUpdateButton] = React.useState(true);
    const handleOnClickUpdate = () => {
        setValueNewButton(false);
        setValueUpdateButton(true);
        setValueReadonlyCode(true);
        setValueReadonly(false);
        setValueDisableSaveButton(false);
        setValueDisableDeleteButton(true);
    };
    /* #endregion */

    /* #region  button save */
    const [valueDisableSaveButton, setValueDisableSaveButton] = React.useState(true);
    const handleClickSave = () => {
        if (valueAccountId && valueAccountName) {
            if (valueNewButton) {
                setDialogIsOpenNew(true);
            }
            if (valueUpdateButton) {
                setDialogIsOpenUpdate(true);
            }
        } else {
            toast.error(t('account-toast-error'));
        }
    };
    /* #endregion */

    /* #region  button delete */
    const [valueDisableDeleteButton, setValueDisableDeleteButton] = React.useState(true);
    const handleClickDelete = async () => {
        setDialogIsOpenDelete(true);
    };
    /* #endregion */

    //! on key event
    OnKeyEvent(() => setReloadListAccount(!reloadListAccount), 'Enter');
    OnMultiKeyEvent(handleOnClickNew, valueNewButton ? '' : 'n');
    OnMultiKeyEvent(handleOnClickUpdate, valueDisableUpdateButton ? '' : 'u');
    OnMultiKeyEvent(handleClickSave, valueDisableSaveButton ? '' : 's');
    OnMultiKeyEvent(handleClickDelete, valueDisableDeleteButton ? '' : 'd');

    //! mobile responsive
    const mobileResponsive = (
        <Stack
            direction={'row'}
            spacing={1}
            sx={{ display: { xs: 'flex', md: 'none' } }}
            justifyGroupID={'space-between'}
            marginTop={1.5}
        >
            <LoadingButton
                size="small"
                fullWidth
                startIcon={<AddBoxIcon />}
                variant="contained"
                color="success"
                onClick={handleOnClickNew}
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
                onClick={handleOnClickUpdate}
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
        <Spin size="large" tip={t('loading')} spinning={isLoading}>
            <div className="main">
                <ToastContainer position='bottom-right' stacked />
                {dialogIsOpenNew && (
                    <AlertDialog
                        title={t('account-toast-new')}
                        content={
                            <>
                                {t('code')}: {valueAccountId}
                                <br /> {t('name')}: {valueAccountName}
                                <br /> {t('unit')}:{`[${valueUnitId}] - ${valueUnitName}`}
                                <br /> {t('expense-group')}:{`[${valueExpenseGroupId}] - ${valueExpenseGroupName}`}
                                <br /> {t('expense')}:{`[${valueExpenseId}] - ${valueExpenseName}`}
                                <br /> {t('method')}:{`${valueMethodId}`}
                                <br /> {t('menu-sub-acc-type')}:{`[${valueSubAccountTypeId}] - ${valueSubAccountTypeName}`}
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
                                {t('code')}: {valueAccountId}
                                <br /> {t('name')}: {valueAccountName}
                                <br /> {t('unit')}:{`[${valueUnitId}] - ${valueUnitName}`}
                                <br /> {t('expense-group')}:{`[${valueExpenseGroupId}] - ${valueExpenseGroupName}`}
                                <br /> {t('expense')}:{`[${valueExpenseId}] - ${valueExpenseName}`}
                                <br /> {t('method')}:{`[${valueMethodId}] - ${valueMethodName}`}
                                <br /> {t('menu-sub-acc-type')}:{`[${valueSubAccountTypeId}] - ${valueSubAccountTypeName}`}
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
                                {t('code')}: {valueAccountId}
                                <br /> {t('name')}: {valueAccountName}
                                <br /> {t('unit')}:{`[${valueUnitId}] - ${valueUnitName}`}
                                <br /> {t('expense-group')}:{`[${valueExpenseGroupId}] - ${valueExpenseGroupName}`}
                                <br /> {t('expense')}:{`[${valueExpenseId}] - ${valueExpenseName}`}
                                <br /> {t('method')}:{`[${valueMethodId}] - ${valueMethodName}`}
                                <br /> {t('menu-sub-acc-type')}:{`[${valueSubAccountTypeId}] - ${valueSubAccountTypeName}`}
                            </>
                        }
                        onOpen={dialogIsOpenDelete}
                        onClose={closeDialogDelete}
                        onAgree={agreeDialogDelete}
                    />
                )}
                <Box
                    sx={{
                        flexGrow: 1,
                        '& .super-app-theme--header': {
                            backgroundColor: '#ffc696',
                        },
                    }}
                >
                    <Grid container direction={'row'} spacing={1}>
                        <Grid xs={12} md={6}>
                            <Item>
                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        id="outlined-basic"
                                        variant="outlined"
                                        fullWidth
                                        label={t('button-search')}
                                        size="small"
                                        // type="number"
                                        value={valueSearch}
                                        onChange={(event) => setValueSearch(event.target.value)}
                                    />
                                    <div>
                                        <LoadingButton
                                            startIcon={<SearchIcon />}
                                            variant="contained"
                                            color="warning"
                                            sx={{ whiteSpace: 'nowrap' }}
                                            onClick={() => handleSearch()}
                                        >
                                            {t('button-search')}
                                        </LoadingButton>
                                    </div>
                                </Stack>
                            </Item>
                        </Grid>
                        <Grid xs={12} md={12}>
                            <Item>
                                <Stack spacing={0}>
                                    <h5 style={{ textAlign: 'left', fontWeight: 'bold' }}>
                                        {t('account-title-list')}
                                    </h5>
                                    <div style={{ width: '100%' }}>
                                        <DataGrid
                                            rows={dataList}
                                            columns={columns}
                                            getRowId={(row) => row.AccountId}
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
                                        justifyGroupID={'flex-end'}
                                        height={50}
                                    >
                                        <h5
                                            style={{
                                                fontWeight: 'bold',
                                                textAlign: 'left',
                                                width: '100%',
                                            }}
                                        >
                                            {t('account-title-infor')}
                                        </h5>
                                    </Stack>
                                    <Stack direction={'row'} spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
                                        <LoadingButton
                                            startIcon={<AddBoxIcon />}
                                            variant="contained"
                                            color="success"
                                            onClick={handleOnClickNew}
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
                                            onClick={handleOnClickUpdate}
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
                                    </Stack>
                                </Stack>
                                <Grid xs={12} md={12}>
                                    <Item>
                                        <Stack spacing={3}>
                                            <Stack direction={'row'} spacing={2}>
                                                <div className="form-title">
                                                    <div>{t('code')}</div>
                                                </div>
                                                <Input
                                                    variant="outlined"
                                                    type="text"
                                                    size="large"
                                                    status={!valueAccountId ? 'error' : ''}
                                                    count={{
                                                        show: !valueReadonlyCode,
                                                        max: 5,
                                                        // strategy: (txt) => txt.length,
                                                        // exceedFormatter: (txt, { max }) => txt.slice(0, max),
                                                    }}
                                                    value={valueAccountId}
                                                    onChange={(event) =>
                                                        event.target.value.length <= 5 && handleOnChangeValueCode(event)
                                                    }
                                                    placeholder="xxxxx"
                                                    disabled={valueReadonlyCode}
                                                    style={{ color: '#000' }}
                                                />
                                            </Stack>
                                            <Stack direction={'row'} spacing={2}>
                                                <div className="form-title">
                                                    <div>{t('name')}</div>
                                                </div>
                                                <Input
                                                    variant="outlined"
                                                    size="large"
                                                    status={!valueAccountName ? 'error' : ''}
                                                    value={valueAccountName}
                                                    onChange={(event) => handleOnChangeValueName(event)}
                                                    placeholder="name..."
                                                    disabled={valueReadonly}
                                                    style={{ color: '#000' }}
                                                />
                                            </Stack>
                                            <Stack direction={'row'} spacing={2}>
                                                <div className="form-title">
                                                    <div>{t('unit')}</div>
                                                </div>
                                                <Select
                                                    autoFocus
                                                    size="small"
                                                    fullWidth
                                                    style={{ textAlign: 'left' }}
                                                    value={valueUnitId}
                                                    onChange={handleOnChangeValueUnit}
                                                    disabled={valueReadonly}
                                                >
                                                    {_.isArray(listUnit) &&
                                                        listUnit.map((data) => {
                                                            return (
                                                                <MenuItem style={{ textAlign: 'left' }} key={data.UnitId} value={data.UnitId}>
                                                                    {`[${data.UnitId}] - ${data.UnitName}`}
                                                                </MenuItem>
                                                            );
                                                        })}
                                                </Select>
                                            </Stack>
                                            <Stack direction={'row'} spacing={2}>
                                                <div className="form-title">
                                                    <div>{t('expense-group')}</div>
                                                </div>
                                                <Select
                                                    autoFocus
                                                    size="small"
                                                    fullWidth
                                                    style={{ textAlign: 'left' }}
                                                    value={valueExpenseGroupId}
                                                    onChange={handleOnChangeValueExpenseGroupID}
                                                    disabled={valueReadonly}
                                                >
                                                    {_.isArray(listExpenseGroup) &&
                                                        listExpenseGroup.map((data) => {
                                                            return (
                                                                <MenuItem style={{ textAlign: 'left' }} key={data.GroupId} value={data.GroupId}>
                                                                    {`[${data.GroupId}] - ${data.GroupName_EN}`}
                                                                </MenuItem>
                                                            );
                                                        })}
                                                </Select>
                                            </Stack>

                                            <Stack direction={'row'} spacing={2}>
                                                <div className="form-title">
                                                    <div>{t('expense')}</div>
                                                </div>
                                                <Select
                                                    autoFocus
                                                    size="small"
                                                    fullWidth
                                                    style={{ textAlign: 'left' }}
                                                    value={valueExpenseId}
                                                    onChange={handleOnChangeValueExpenseID}
                                                    disabled={valueReadonly}
                                                >
                                                    {_.isArray(listExpense) &&
                                                        listExpense.map((data) => {
                                                            return (
                                                                <MenuItem style={{ textAlign: 'left' }} key={data.ExpenseId} value={data.ExpenseName}>
                                                                    {`[${data.ExpenseId}] - ${data.ExpenseName}`}
                                                                </MenuItem>
                                                            );
                                                        })}
                                                </Select>
                                            </Stack>

                                            <Stack direction={'row'} spacing={2}>
                                                <div className="form-title">
                                                    <div>{t('method')}</div>
                                                </div>
                                                <Select
                                                    autoFocus
                                                    size="small"
                                                    fullWidth
                                                    style={{ textAlign: 'left' }}
                                                    value={valueMethodId}
                                                    onChange={handleOnChangeValueMethod}
                                                    disabled={valueReadonly}
                                                >
                                                    {_.isArray(listMethod) &&
                                                        listMethod.map((data) => {
                                                            return (
                                                                <MenuItem style={{ textAlign: 'left' }} key={data.MethodId} value={data.MethodId}>
                                                                    {`[${data.MethodId}] - ${data.MethodName}`}
                                                                </MenuItem>
                                                            );
                                                        })}
                                                </Select>
                                            </Stack>


                                            <Stack direction={'row'} spacing={2}>
                                                <div className="form-title">
                                                    <div>{t('menu-sub-acc-type')}</div>
                                                </div>
                                                <Select
                                                    autoFocus
                                                    size="small"
                                                    fullWidth
                                                    style={{ textAlign: 'left' }}
                                                    value={valueSubAccountTypeId}
                                                    onChange={handleOnChangeValueSubAccountType}
                                                    disabled={valueReadonly}
                                                >
                                                    {_.isArray(listSubAccountType) &&
                                                        listSubAccountType.map((data) => {
                                                            return (
                                                                <MenuItem style={{ textAlign: 'left' }} key={data.TypeId} value={data.SubTypeId}>
                                                                    {`[${data.SubTypeId}] - ${data.SubTypeName}`}
                                                                </MenuItem>
                                                            );
                                                        })}
                                                </Select>
                                            </Stack>

                                            <Stack direction={'row'} spacing={2}>
                                                <div className="form-title">
                                                    <div>{t('description')}</div>
                                                </div>
                                                <Input.TextArea
                                                    size="large"
                                                    status={!valueDescription ? 'error' : ''}
                                                    maxLength={250}
                                                    value={valueDescription}
                                                    onChange={(event) => handleOnChangeValueDescription(event)}
                                                    rows={2}
                                                    placeholder="..."
                                                    disabled={valueReadonly}
                                                    style={{ color: '#000' }}
                                                />
                                            </Stack>
                                        </Stack>
                                    </Item>
                                </Grid>
                                {mobileResponsive}
                            </Item>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </Spin>
    );
}

export default Account;
