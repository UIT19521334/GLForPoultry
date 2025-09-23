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
import { ApiCreateSupAccount, ApiDeleteSupAccount, ApiListSupAccount, ApiUpdateSupAccount } from '~/components/Api/SubAccount';
import SaveIcon from '@mui/icons-material/Save';
import '../../../Container.css';
import TextField from '@mui/material/TextField';
import { OnKeyEvent } from '~/components/Event/OnKeyEvent';
import { OnMultiKeyEvent } from '~/components/Event/OnMultiKeyEvent';
import { Input, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { IconButton, InputAdornment, MenuItem, Select } from '@mui/material';
import { useSelector } from 'react-redux';
import { ClearIcon } from '@mui/x-date-pickers';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    direction: 'row',
    color: theme.palette.text.secondary,
}));

function SubAccountDetails({ title }) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = React.useState(false);
    const [reloadListSubAcc, setReloadListSubAcc] = React.useState(false);
    const [dataList, setDataList] = useState([]);
    const listSubAccountType = useSelector((state) => state.FetchApi.listData_SubAccountType);

    //! columns header
    const columns = [
        {
            field: 'AccountSubId',
            headerName: t('subaccount-code'),
            minWidth: 150,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'AccountSubName',
            headerName: t('subaccount-name'),
            minWidth: 300,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'TypeId',
            headerName: t('memo-type'),

            minWidth: 100,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'SubTypeName',
            headerName: t('subaccount-type-name'),
            minWidth: 200,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'Description',
            headerName: t('description'),
            minWidth: 300,
            flex: 1,
            headerClassName: 'super-app-theme--header',
        }
    ];

    // TODO call api get data account group
    useEffect(() => {
        fetchApiGetDataSubAcc();
    }, [reloadListSubAcc]);

    const fetchApiGetDataSubAcc = async () => {
        setIsLoading(true);
        try {
            await ApiListSupAccount(valueSearch, setDataList);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle search
    const [valueSearch, setValueSearch] = React.useState('');
    const handleSearch = () => {
        let filteredData = dataList;
        if (valueSearch && valueSearch.trim() !== "") {
            const fieldsToSearch = ["AccountSubId", "AccountSubName", "SubTypeName", "TypeId", "Description"];

            filteredData = _.filter(dataList, (item) => {
                const search = _.toLower(valueSearch);
                return _.some(fieldsToSearch, (field) => _.includes(_.toLower(item[field]), search));
            });
        }
        setDataList(filteredData);
    }

    const [valueCode, setValueCode] = React.useState('');
    const [valueName, setValueName] = React.useState('');
    const [valueTypeID, setValueTypeID] = React.useState('');
    const [valueTypeName, setValueTypeName] = React.useState('');
    const [valueDescription, setValueDescription] = React.useState('');

    //! select row in datagrid
    const onRowsSelectionHandler = (ids) => {
        const selectedRowsData = ids.map((id) => dataList.find((row) => row.AccountSubId === id));
        if (selectedRowsData) {
            {
                selectedRowsData.map((key) => {
                    setValueCode(key.AccountSubId ?? "XXXX");
                    setValueName(key.AccountSubName ?? '');
                    setValueDescription(key.Description ?? '');
                    setValueTypeID(key.TypeId ?? '');
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
        asyncApiCreateSupAccount();
    };
    const closeDialogNew = () => {
        setDialogIsOpenNew(false);
        toast.warning(t('toast-cancel-new'));
    };

    const asyncApiCreateSupAccount = async () => {
        setIsLoading(true);
        const statusCode = await ApiCreateSupAccount(valueCode, valueName, valueTypeID, valueTypeName, valueDescription);
        if (statusCode) {
            setValueCode('');
            setValueName('');
            setValueDescription('');
            setValueTypeID('');
            setValueTypeName('');
            setValueNewButton(false);
            setValueDisableSaveButton(true);
            setValueDisableDeleteButton(true);
            setValueReadonly(true);
            setValueReadonlyCode(true);
        }
        setIsLoading(false);
        setReloadListSubAcc(!reloadListSubAcc);
    };
    /* #endregion */

    const handleOnChangeValueCode = (event) => {
        const inputValue = event.target.value;
        // Regex: không cho ký tự đăc biệt, chỉ cho phép chữ cái, số và khoảng trắng
        if (/^[\p{L}0-9 ]*$/u.test(inputValue)) {
            setValueCode(inputValue);
        }
    };
    const handleOnChangeValueName = (event) => {
        setValueName(event.target.value);
    };
    const handleOnChangeValueDescription = (event) => {
        setValueDescription(event.target.value);
    };
    const handleOnChangeValueTypeID = (e) => {
        const data = e.target.value && listSubAccountType.find(item => item.SubTypeId === e.target.value);
        setValueTypeID(data.SubTypeId);
        setValueTypeName(data.SubTypeName);
    };

    // TODO call api update
    /* #region  call api update */
    const agreeDialogUpdate = () => {
        setDialogIsOpenUpdate(false);
        asyncApiUpdateSupAccount();
    };
    const closeDialogUpdate = () => {
        setDialogIsOpenUpdate(false);
        toast.warning(t('toast-cancel-update'));
    };

    const asyncApiUpdateSupAccount = async () => {
        setIsLoading(true);
        const statusCode = await ApiUpdateSupAccount(valueCode, valueName, valueTypeID, valueTypeName, valueDescription);
        if (statusCode) {
            setValueReadonly(true);
            setValueUpdateButton(false);
            setValueDisableSaveButton(true);
            setValueDisableDeleteButton(true);
        }
        setIsLoading(false);
        setReloadListSubAcc(!reloadListSubAcc);
    };

    /* #endregion */

    // TODO call api delete
    /* #region  call api delete */
    const agreeDialogDelete = () => {
        setDialogIsOpenDelete(false);
        asyncApiDeleteSupAccount();
    };
    const closeDialogDelete = () => {
        setDialogIsOpenDelete(false);
        toast.warning(t('toast-cancel-delete'));
    };

    const asyncApiDeleteSupAccount = async () => {
        setIsLoading(true);
        const statusCode = await ApiDeleteSupAccount(valueCode);
        if (statusCode) {
            setValueCode('');
            setValueName('');
            setValueDescription('');
            setValueTypeID('');
            setValueTypeName('');
            setValueReadonly(true);
            setValueDisableSaveButton(true);
            setValueDisableDeleteButton(true);
        }
        setIsLoading(false);
        setReloadListSubAcc(!reloadListSubAcc);
    };

    /* #endregion */

    const [valueReadonly, setValueReadonly] = React.useState(true);
    const [valueReadonlyCode, setValueReadonlyCode] = React.useState(true);

    /* #region  button new */

    const [valueNewButton, setValueNewButton] = React.useState(false);
    const handleClickNew = () => {
        setValueNewButton(true);
        setValueUpdateButton(false);
        setValueCode('');
        setValueName('');
        setValueDescription('');
        setValueTypeID('');
        setValueTypeName('');
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
    const handleClickUpdate = () => {
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
        if (valueCode && valueName && valueCode.length == 5) {
            if (valueNewButton) {
                setDialogIsOpenNew(true);
            }
            if (valueUpdateButton) {
                setDialogIsOpenUpdate(true);
            }
        } else {
            toast.error(t('subaccount-toast-error'));
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
    OnKeyEvent(() => setReloadListSubAcc(!reloadListSubAcc), 'Enter');
    OnMultiKeyEvent(handleClickNew, valueNewButton ? '' : 'n');
    OnMultiKeyEvent(handleClickUpdate, valueDisableUpdateButton ? '' : 'u');
    OnMultiKeyEvent(handleClickSave, valueDisableSaveButton ? '' : 's');
    OnMultiKeyEvent(handleClickDelete, valueDisableDeleteButton ? '' : 'd');

    //! mobile responsive
    const mobileResponsive = (
        <Stack
            direction={'row'}
            spacing={1}
            sx={{ display: { xs: 'flex', md: 'none' } }}
            justifyTypeID={'space-between'}
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
                {dialogIsOpenNew && (
                    <AlertDialog
                        title={t('subaccount-toast-new')}
                        content={
                            <>
                                {t('subaccount-code')}: {valueCode}
                                <br /> {t('subaccount-name')}: {valueName}
                                <br /> {t('memo-type')}:{`[${valueTypeID}] - ${valueTypeName}`}
                                <br /> {t('description')}:{valueDescription}
                            </>
                        }
                        onOpen={dialogIsOpenNew}
                        onClose={closeDialogNew}
                        onAgree={agreeDialogNew}
                    />
                )}
                {dialogIsOpenUpdate && (
                    <AlertDialog
                        title={t('subaccount-toast-update')}
                        content={
                            <>
                                {t('subaccount-code')}: {valueCode}
                                <br /> {t('subaccount-name')}: {valueName}
                                <br /> {t('memo-type')}:{`[${valueTypeID}] - ${valueTypeName}`}
                                <br /> {t('description')}:{valueDescription}
                            </>
                        }
                        onOpen={dialogIsOpenUpdate}
                        onClose={closeDialogUpdate}
                        onAgree={agreeDialogUpdate}
                    />
                )}
                {dialogIsOpenDelete && (
                    <AlertDialog
                        title={t('subaccount-toast-delete')}
                        content={
                            <>
                                {t('subaccount-code')}: {valueCode}
                                <br /> {t('subaccount-name')}: {valueName}
                                <br /> {t('memo-type')}:{`[${valueTypeID}] - ${valueTypeName}`}
                                <br /> {t('description')}:{valueDescription}
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
                                        {t('subaccount-title-list')}
                                    </h5>
                                    <div style={{ width: '100%' }}>
                                        <DataGrid
                                            rows={dataList}
                                            columns={columns}
                                            getRowId={(row) => row.AccountSubId}
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
                                        justifyTypeID={'flex-end'}
                                        height={50}
                                    >
                                        <h5
                                            style={{
                                                fontWeight: 'bold',
                                                textAlign: 'left',
                                                width: '100%',
                                            }}
                                        >
                                            {t('subaccount-title-infor')}
                                        </h5>
                                    </Stack>
                                    <Stack direction={'row'} spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
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
                                    </Stack>
                                </Stack>
                                <Grid xs={12} md={12}>
                                    <Item>
                                        <Stack spacing={3}>
                                            <Stack direction={'row'} spacing={2}>
                                                <div className="form-title">
                                                    <div>{t('subaccount-code')}</div>
                                                </div>
                                                <Input
                                                    variant="outlined"
                                                    type="text"
                                                    size="large"
                                                    status={!valueCode ? 'error' : ''}
                                                    count={{
                                                        show: !valueReadonlyCode,
                                                        max: 5,
                                                        // strategy: (txt) => txt.length,
                                                        // exceedFormatter: (txt, { max }) => txt.slice(0, max),
                                                    }}
                                                    value={valueCode}
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
                                                    <div>{t('subaccount-name')}</div>
                                                </div>
                                                <Input
                                                    variant="outlined"
                                                    size="large"
                                                    status={!valueName ? 'error' : ''}
                                                    value={valueName}
                                                    onChange={(event) => handleOnChangeValueName(event)}
                                                    placeholder="name..."
                                                    disabled={valueReadonly}
                                                    style={{ color: '#000' }}
                                                />
                                            </Stack>
                                            <Stack direction={'row'} spacing={2}>
                                                <div className="form-title">
                                                    <div>{t('memo-type')}</div>
                                                </div>
                                                <Select
                                                    autoFocus
                                                    size="small"
                                                    fullWidth
                                                    style={{ textAlign: 'left' }}
                                                    value={valueTypeID}
                                                    onChange={handleOnChangeValueTypeID}
                                                    disabled={valueReadonly}
                                                    endAdornment={
                                                        valueTypeID ? (
                                                            <InputAdornment position="start">
                                                                <IconButton
                                                                    tabIndex={-1}
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation(); // chặn mở dropdown
                                                                        setValueTypeID("");
                                                                        setValueTypeName("");
                                                                    }}
                                                                >
                                                                    <ClearIcon fontSize="small" />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ) : null
                                                    }
                                                >
                                                    {_.isArray(listSubAccountType) &&
                                                        listSubAccountType.map((data) => {
                                                            return (
                                                                <MenuItem style={{ textAlign: 'left' }} key={data.SubTypeId} value={data.SubTypeId}>
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

export default SubAccountDetails;
