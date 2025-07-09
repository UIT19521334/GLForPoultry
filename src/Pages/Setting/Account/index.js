import * as React from 'react';
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
import { DataGrid } from '@mui/x-data-grid';
import './AccountStyles.css';
import '../../../Container.css';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import LoadingButton from '@mui/lab/LoadingButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SearchIcon from '@mui/icons-material/Search';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { ToastContainer, toast } from 'react-toastify';
import AlertDialog from '~/components/AlertDialog';
import { ApiAccountList, ApiCreateAccount, ApiImportFileAccount, ApiUpdateAccount } from '~/components/Api/Account';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import { ApiGroupCost, ApiTypeCost } from '~/components/Api/Master';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useSelector, useDispatch } from 'react-redux';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { OnKeyEvent } from '~/components/Event/OnKeyEvent';
import { OnMultiKeyEvent } from '~/components/Event/OnMultiKeyEvent';
import { Form, Input, InputNumber, Space, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { fetchApiListAccount } from '~/Redux/FetchApi/fetchApiMaster';

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
function Account({ title }) {
    const { t } = useTranslation();

    // TODO call api cost center
    /* #region  call api data cost center */
    const dataCostCenter = useSelector((state) => state.FetchApi.listData_CostCenter);
    const [valueCostCenter, setValueCostCenter] = React.useState('');
    /* #endregion */

    //! column datagrid header
    const columns = [
        {
            field: 'account_code_display',
            headerName: t('account-code'),
            width: 130,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'account_name',
            headerName: t('account-name'),
            minWidth: 300,
            flex: 1,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'expense_name',
            headerName: t('account-expensegroup'),
            width: 150,
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
        },
        {
            field: 'expense_type_name',
            headerName: t('account-expense'),
            width: 150,
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
        },
        {
            field: 'cost_center',
            headerName: t('cost-center'),
            width: 150,
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
            type: 'singleSelect',
            getOptionValue: (value) => value.code,
            getOptionLabel: (value) => value.name,
            valueOptions: dataCostCenter,
        },
        {
            field: 'is_shared_expense',
            headerName: t('account-general'),
            width: 130,
            type: 'boolean',
            headerClassName: 'super-app-theme--header',
            valueGetter: (value) => {
                if (value.value === false) {
                    return null;
                }
                // Convert the decimal value to a percentage
                return value;
            },
        },
    ];

    const [isLoading, setIsLoading] = React.useState(false);
    const access_token = useSelector((state) => state.FetchApi.token);
    var dispatch = useDispatch();

    const [valueReadonly, setValueReadonly] = React.useState(true);
    const [valueReadonlyCode, setValueReadonlyCode] = React.useState(true);

    const [valueSearch, setValueSearch] = React.useState('');
    const [valueCode, setValueCode] = React.useState('');
    const [valueId, setValueId] = React.useState('');
    const [valueCodeMain, setValueCodeMain] = React.useState('');
    const [valueCodeSub, setValueCodeSub] = React.useState('');
    const [valueName, setValueName] = React.useState('');
    const [valueDescription, setValueDescription] = React.useState('');

    const handleOnChangeValueCodeMain = (event) => {
        setValueCodeMain(event.target.value);
    };
    const handleOnChangeValueCodeSub = (event) => {
        setValueCodeSub(event.target.value);
    };
    const handleOnChangeValueName = (event) => {
        setValueName(event.target.value);
    };
    const handleOnChangeValueDescription = (event) => {
        setValueDescription(event.target.value);
    };
    const handleOnChangeValueSearch = (event) => {
        setValueSearch(event.target.value);
    };

    // TODO call api get data account
    /* #region  call api list */
    const [reloadListAccount, setReloadListAccount] = React.useState(false);
    const [dataList, setDataList] = useState([]);

    useEffect(() => {
        const asyncApiListAccount = async () => {
            setIsLoading(true);
            await ApiAccountList(valueSearch, setDataList);
            dispatch(fetchApiListAccount());
            setIsLoading(false);
        };
        asyncApiListAccount();
    }, [reloadListAccount]);
    /* #endregion */

    //! select row in datagrid
    const onRowsSelectionHandler = (ids) => {
        const selectedRowsData = ids.map((id) => dataList.find((row) => row.account_code === id));
        if (selectedRowsData) {
            {
                selectedRowsData.map((key) => {
                    setValueCode(key.account_code_display);
                    setValueId(key.ids);
                    setValueCodeMain(key.account_main);
                    setValueCodeSub(key.account_sub);
                    setValueName(key.account_name);
                    setValueDescription(key.description ?? '');
                    setValueGroupCost(key.expense_acc ?? '');
                    setValueTypeCost(key.expense_type ?? '');
                    setValueCostCenter(key.cost_center);
                });
                setValueReadonly(true);
                setValueReadonlyCode(true);
                setValueDisableSaveButton(true);
                setValueNewButton(false);
                setValueUpdateButton(false);
            }
        }
    };

    // TODO call api expense group
    /* #region  call api data group cost */
    const [dataGroupCost, setDataGroupCost] = React.useState([]);
    const [valueGroupCost, setValueGroupCost] = React.useState('');
    const handleChangeGroupCost = (event) => {
        setValueGroupCost(event.target.value);
        if (!event.target.value) {
            setDataTypeCostFilter(dataTypeCost);
        } else {
            const expense = dataTypeCost.filter((data) => data.group_code_ref == event.target.value);
            const data = [{ code: null, name: 'Not selected' }, ...expense];
            setDataTypeCostFilter(data);
        }
    };
    React.useEffect(() => {
        const fetchApiExpenseGroup = async () => {
            setIsLoading(true);
            await ApiGroupCost(setDataGroupCost);
            setIsLoading(false);
        };
        fetchApiExpenseGroup();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    /* #endregion */

    // TODO call api expense
    /* #region  call api data type cost */
    const [dataTypeCost, setDataTypeCost] = React.useState([]);
    const [dataTypeCostFilter, setDataTypeCostFilter] = React.useState([]);
    const [valueTypeCost, setValueTypeCost] = React.useState('');
    const handleChangeTypeCost = (event) => {
        setValueTypeCost(event.target.value);
    };
    React.useEffect(() => {
        const fetchApiExpense = async () => {
            setIsLoading(true);
            await ApiTypeCost(setDataTypeCost, setDataTypeCostFilter);
            setIsLoading(false);
        };
        fetchApiExpense();
    }, []);
    /* #endregion */

    const [dialogIsOpenNew, setDialogIsOpenNew] = React.useState(false);
    const [dialogIsOpenUpdate, setDialogIsOpenUpdate] = React.useState(false);
    const [callApiNew, setCallApiNew] = React.useState(false);
    const [callApiUpdate, setCallApiUpdate] = React.useState(false);

    const agreeDialogNew = () => {
        setDialogIsOpenNew(false);
        setCallApiNew(!callApiNew);
    };
    const closeDialogNew = () => {
        setDialogIsOpenNew(false);
        toast.warning(t('toast-cancel-new'));
    };

    /* #region  button new */

    const [valueNewButton, setValueNewButton] = React.useState(false);
    const handleOnClickNew = () => {
        setValueNewButton(true);
        setValueUpdateButton(false);

        setValueCode('');
        setValueCodeMain('');
        setValueCodeSub('');
        setValueName('');
        setValueDescription('');
        setValueGroupCost('');
        setValueTypeCost('');
        setValueCostCenter('');

        setValueReadonly(false);
        setValueReadonlyCode(false);
        setValueDisableSaveButton(false);
    };
    /* #endregion */

    // TODO call api create
    useEffect(() => {
        const asyncApiCreateAccount = async () => {
            setIsLoading(true);
            const statusCode = await ApiCreateAccount(
                access_token,
                valueCodeMain,
                valueCodeSub,
                valueName,
                valueDescription,
                valueGroupCost,
                valueTypeCost,
                valueCostCenter,
            );
            if (statusCode) {
                setValueCodeMain('');
                setValueCodeSub('');
                setValueName('');
                setValueDescription('');
                setValueGroupCost('');
                setValueTypeCost('');
                setValueCostCenter('');
                setValueNewButton(false);
                setValueDisableSaveButton(true);
                setValueReadonly(true);
                setValueReadonlyCode(true);
            }
        };
        setIsLoading(false);
        asyncApiCreateAccount();
        setReloadListAccount(!reloadListAccount);
    }, [callApiNew]);

    const agreeDialogUpdate = () => {
        setDialogIsOpenUpdate(false);
        setCallApiUpdate(!callApiUpdate);
    };
    const closeDialogUpdate = () => {
        setDialogIsOpenUpdate(false);
        toast.warning(t('toast-cancel-update'));
    };

    /* #region  button update */
    const [valueUpdateButton, setValueUpdateButton] = React.useState(false);
    const handleOnClickUpdate = () => {
        setValueNewButton(false);
        setValueUpdateButton(true);
        setValueReadonly(false);
        setValueReadonlyCode(true);
        setValueDisableSaveButton(false);
    };
    /* #endregion */

    //TODO call api update account
    useEffect(() => {
        const asyncApiUpdateAccount = async () => {
            setIsLoading(true);
            const statusCode = await ApiUpdateAccount(
                access_token,
                valueId,
                valueCodeMain,
                valueCodeSub,
                valueName,
                valueDescription,
                valueGroupCost,
                valueTypeCost,
                valueCostCenter,
            );
            if (statusCode) {
                setValueReadonly(true);
                setValueUpdateButton(false);
                setValueDisableSaveButton(true);
            }
            setIsLoading(false);
        };
        asyncApiUpdateAccount();
        setReloadListAccount(!reloadListAccount);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callApiUpdate]);

    //! handle click save
    const [valueDisableSaveButton, setValueDisableSaveButton] = React.useState(true);
    const handleClickSave = (event) => {
        if (valueCodeMain && valueName) {
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

    //TODO call api import file excel
    useEffect(() => {
        const apiImportFile = async () => {
            setIsLoading(true);
            const statusCode = await ApiImportFileAccount(access_token, fileExcel);
            setIsLoading(false);
            setFileExcell([]);
            setReloadListAccount(!reloadListAccount);
        };
        apiImportFile();
    }, [callApiImportFile]);
    const handleClickImportFile = (event) => {
        let fileType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
        if (fileExcel.length === 0) {
            toast.error(t('toast-nofile'));
        } else {
            if (fileExcel && fileType.includes(fileExcel[0].type)) {
                setDialogIsOpenImportFile(true);
            } else {
                setFileExcell([]);
                toast.error(t('toast-fileexcel'));
            }
        }
    };

    OnKeyEvent(() => setReloadListAccount(!reloadListAccount), 'Enter');
    OnMultiKeyEvent(handleOnClickNew, valueNewButton ? '' : 'n');
    OnMultiKeyEvent(handleOnClickUpdate, valueUpdateButton ? '' : 'u');
    OnMultiKeyEvent(handleClickSave, valueDisableSaveButton ? '' : 's');
    OnMultiKeyEvent(handleClickImportFile, 'f');

    //! mobile responsive
    const mobilefile = (
        <Grid xs={12} md={12}>
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
                            ? fileExcel[0].name.slice(0, 25) + '...'
                            : t('button-import')
                        : t('button-import')}
                    <VisuallyHiddenInput type="file" onChange={handleClickChoseFile} />
                </Button>
                <Button
                    size="small"
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    onClick={handleClickImportFile}
                    sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {t('button-upload')}
                </Button>
            </Stack>
        </Grid>
    );

    const mobilebutton = (
        <Grid xs={12} md={12}>
            <Stack
                direction={'row'}
                spacing={1}
                justifyContent={'space-between'}
                sx={{ display: { xs: 'flex', md: 'none' } }}
                paddingBottom={2}
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
            </Stack>
        </Grid>
    );

    return (
        <Spin size="large" tip={t('loading')} spinning={isLoading}>
            <div className="main">
                <ToastContainer />
                {dialogIsOpenNew && (
                    <AlertDialog
                        title={t('account-toast-new')}
                        content={
                            <>
                                {t('account-maincode')}: {valueCodeMain}
                                <br /> {t('account-subcode')}: {valueCodeSub}
                                <br /> {t('account-name')}: {valueName}
                                <br />
                                {t('description')}: {valueDescription}
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
                                {t('account-maincode')}: {valueCodeMain}
                                <br /> {t('account-subcode')}: {valueCodeSub}
                                <br /> {t('account-name')}: {valueName}
                                <br />
                                {t('description')}: {valueDescription}
                            </>
                        }
                        onOpen={dialogIsOpenUpdate}
                        onClose={closeDialogUpdate}
                        onAgree={agreeDialogUpdate}
                    />
                )}

                {dialogIsOpenImportFile && (
                    <AlertDialog
                        title={t('account-toast-upload')}
                        content={<>File: {fileExcel ? fileExcel[0].name : ''}</>}
                        onOpen={dialogIsOpenImportFile}
                        onClose={closeDialogImportFile}
                        onAgree={agreeDialogImportFile}
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
                        flexGrow: 1,
                        '& .super-app-theme--header': {
                            backgroundColor: '#ffc696',
                        },
                    }}
                >
                    <Grid container spacing={1}>
                        <Grid xs={12} md={6}>
                            <Item>
                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        id="search"
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
                                            onClick={() => setReloadListAccount(!reloadListAccount)}
                                            sx={{ whiteSpace: 'nowrap' }}
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
                                    <h5 style={{ textAlign: 'left', fontWeight: 'bold' }}>{t('account-title-list')}</h5>
                                    <div style={{ width: '100%' }}>
                                        <DataGrid
                                            rows={dataList}
                                            columns={columns}
                                            initialState={{
                                                pagination: {
                                                    paginationModel: { page: 0, pageSize: 5 },
                                                },
                                            }}
                                            pageSizeOptions={[5, 10, 15]}
                                            autoHeight
                                            showCellVerticalBorder
                                            showColumnVerticalBorder
                                            getRowId={(row) => row.account_code}
                                            loading={isLoading}
                                            onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
                                        />
                                    </div>
                                </Stack>
                            </Item>
                        </Grid>
                        <Grid xs={12} md={12}>
                            <Item>
                                <Grid container spacing={1}>
                                    {mobilefile}
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
                                                {t('account-title-infor')}
                                            </h5>

                                            <Stack
                                                width={'100%'}
                                                direction={'row'}
                                                spacing={1}
                                                alignItems={'center'}
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
                                                    <VisuallyHiddenInput type="file" onChange={handleClickChoseFile} />
                                                </Button>
                                                <Button
                                                    component="label"
                                                    role={undefined}
                                                    variant="contained"
                                                    tabIndex={-1}
                                                    startIcon={<CloudUploadIcon />}
                                                    onClick={handleClickImportFile}
                                                    sx={{
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {t('button-upload')}
                                                    {/* Upload&nbsp;
                                                    <u>f</u>
                                                    ile */}
                                                </Button>
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
                                            </Stack>
                                        </Stack>
                                    </Grid>

                                    <Grid container xs={12} md={12} spacing={2}>
                                        <Grid xs={12} md={12}>
                                            <Stack direction={'row'} spacing={2}>
                                                <div className="form-title">{t('account-code')}</div>

                                                <Input
                                                    variant="borderless"
                                                    size="large"
                                                    value={valueCode}
                                                    placeholder="xxxxx xxx"
                                                    readOnly
                                                />
                                                {/* <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    size="small"
                                                    type="text"
                                                    value={valueCode}
                                                    placeholder="xxxxx xxx"
                                                    disabled
                                                /> */}
                                            </Stack>
                                        </Grid>

                                        <Grid xs={12} md={12}>
                                            <Stack direction={'row'} spacing={2}>
                                                <div className="form-title">
                                                    <div>{t('account-maincode')}</div>
                                                </div>
                                                <Input
                                                    variant="outlined"
                                                    size="large"
                                                    type="number"
                                                    status={!valueCodeMain ? 'error' : ''}
                                                    count={{
                                                        show: !valueReadonlyCode,
                                                        max: 5,
                                                        // strategy: (txt) => txt.length,
                                                        // exceedFormatter: (txt, { max }) => txt.slice(0, max),
                                                    }}
                                                    disabled={valueReadonlyCode}
                                                    placeholder="xxxxx"
                                                    value={valueCodeMain}
                                                    onChange={(event) =>
                                                        event.target.value.length <= 5 &&
                                                        handleOnChangeValueCodeMain(event)
                                                    }
                                                />
                                                {/* <TextField
                                                    id="field-code-main"
                                                    variant="outlined"
                                                    fullWidth
                                                    size="small"
                                                    type="number"
                                                    value={valueCodeMain}
                                                    onChange={(event) => handleOnChangeValueCodeMain(event)}
                                                    placeholder="xxxxx"
                                                    disabled={valueReadonlyCode}
                                                    onInput={(e) => {
                                                        e.target.value = Math.max(0, parseInt(e.target.value))
                                                            .toString()
                                                            .slice(0, 5);
                                                    }}
                                                    min={0}
                                                /> */}
                                            </Stack>
                                        </Grid>
                                        <Grid xs={12} md={12}>
                                            <Stack direction={'row'} spacing={2}>
                                                <div className="form-title">
                                                    <div>{t('account-subcode')}</div>
                                                </div>
                                                <Input
                                                    variant="outlined"
                                                    size="large"
                                                    type="number"
                                                    //status={!valueCodeSub ? 'error' : ''}
                                                    count={{
                                                        show: !valueReadonlyCode,
                                                        max: 3,
                                                        // strategy: (txt) => txt.length,
                                                        // exceedFormatter: (txt, { max }) => txt.slice(0, max),
                                                    }}
                                                    value={valueCodeSub}
                                                    onChange={(event) =>
                                                        event.target.value.length <= 3 &&
                                                        handleOnChangeValueCodeSub(event)
                                                    }
                                                    placeholder="xxx"
                                                    disabled={valueReadonlyCode}
                                                />
                                                {/* <TextField
                                                    id="field-code-sub"
                                                    variant="outlined"
                                                    fullWidth
                                                    size="small"
                                                    type="number"
                                                    value={valueCodeSub}
                                                    onChange={(event) => handleOnChangeValueCodeSub(event)}
                                                    placeholder="xxx"
                                                    disabled={valueReadonlyCode}
                                                    onInput={(e) => {
                                                        e.target.value = Math.max(0, parseInt(e.target.value))
                                                            .toString()
                                                            .slice(0, 3);
                                                    }}
                                                    min={0}
                                                /> */}
                                            </Stack>
                                        </Grid>

                                        <Grid xs={12} md={12}>
                                            <Stack direction={'row'} spacing={2}>
                                                <div className="form-title">
                                                    <div>{t('account-name')}</div>
                                                </div>
                                                <Input
                                                    variant="outlined"
                                                    size="large"
                                                    status={!valueName ? 'error' : ''}
                                                    value={valueName}
                                                    onChange={(event) => handleOnChangeValueName(event)}
                                                    placeholder="name..."
                                                    disabled={valueReadonly}
                                                />
                                                {/* <TextField
                                                    id="field-name"
                                                    variant="outlined"
                                                    fullWidth
                                                    size="medium"
                                                    type="text"
                                                    value={valueName}
                                                    onChange={(event) => handleOnChangeValueName(event)}
                                                    placeholder="name..."
                                                    disabled={valueReadonly}
                                                /> */}
                                            </Stack>
                                        </Grid>
                                        <Grid xs={12} md={12}>
                                            <Stack direction={'row'} spacing={2}>
                                                <div className="form-title">
                                                    <p>{t('description')}</p>
                                                </div>
                                                <Input.TextArea
                                                    size="large"
                                                    maxLength={250}
                                                    value={valueDescription}
                                                    onChange={(event) => handleOnChangeValueDescription(event)}
                                                    rows={2}
                                                    placeholder="..."
                                                    disabled={valueReadonly}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid xs={12} md={12}>
                                            <Stack direction={'row'} spacing={2}>
                                                <div className="form-title">
                                                    <div>{t('cost-center')}</div>
                                                </div>

                                                <Select
                                                    labelId="demo-simple-select-helper-label"
                                                    id="group-cost"
                                                    value={valueCostCenter}
                                                    displayEmpty
                                                    fullWidth
                                                    onChange={(event) => setValueCostCenter(event.target.value)}
                                                    // sx={{ width: 250 }}
                                                    disabled={valueReadonly}
                                                    size="small"
                                                >
                                                    {dataCostCenter.map((data) => {
                                                        return (
                                                            <MenuItem key={data.code} value={data.code}>
                                                                {data.name}
                                                            </MenuItem>
                                                        );
                                                    })}
                                                </Select>
                                            </Stack>
                                        </Grid>
                                        <Grid xs={12} md={12}>
                                            <Stack direction={'row'} spacing={2}>
                                                <div className="form-title">
                                                    <div>{t('account-expensegroup')}</div>
                                                </div>

                                                <Select
                                                    labelId="demo-simple-select-helper-label"
                                                    id="group-cost"
                                                    value={valueGroupCost}
                                                    displayEmpty
                                                    fullWidth
                                                    onChange={handleChangeGroupCost}
                                                    // sx={{ width: 250 }}
                                                    disabled={valueReadonly}
                                                    size="small"
                                                >
                                                    {dataGroupCost.map((data) => {
                                                        return (
                                                            <MenuItem key={data.gr_expense_ids} value={data.code}>
                                                                {data.name}
                                                            </MenuItem>
                                                        );
                                                    })}
                                                </Select>
                                            </Stack>
                                        </Grid>
                                        <Grid xs={12} md={12} paddingBottom={4}>
                                            <Stack direction={'row'} spacing={2}>
                                                <div className="form-title">
                                                    <div>{t('account-expense')}</div>
                                                </div>
                                                <Select
                                                    labelId="demo-simple-select-helper-label"
                                                    size="small"
                                                    fullWidth
                                                    value={valueTypeCost}
                                                    displayEmpty
                                                    onChange={handleChangeTypeCost}
                                                    disabled={valueReadonly}
                                                >
                                                    {dataTypeCostFilter.map((data) => {
                                                        return (
                                                            <MenuItem key={data.type_expense_id} value={data.code}>
                                                                {data.name}
                                                            </MenuItem>
                                                        );
                                                    })}
                                                </Select>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                    {mobilebutton}
                                </Grid>
                            </Item>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </Spin>
    );
}

export default Account;
