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
import { DataGrid, GridDeleteIcon } from '@mui/x-data-grid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AlertDialog from '~/components/AlertDialog';
import LoadingButton from '@mui/lab/LoadingButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SearchIcon from '@mui/icons-material/Search';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { ApiCreateSubAccountType, ApiDeleteSubAccountType, ApiUpdateSubAccountType } from '~/components/Api/SubAccountType';
import SaveIcon from '@mui/icons-material/Save';
import '../../../Container.css';
import TextField from '@mui/material/TextField';
import { OnKeyEvent } from '~/components/Event/OnKeyEvent';
import { OnMultiKeyEvent } from '~/components/Event/OnMultiKeyEvent';
import { Input, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApiListSubAccountType } from '~/Redux/FetchApi/fetchApiMaster';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    direction: 'row',
    color: theme.palette.text.secondary,
}));

function SubAccountType({ title }) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = React.useState(false);
    const [reloadListAccGroup, setReloadListAccGroup] = React.useState(false);
    const [dataList, setDataList] = useState([]);
    const listSubAccountType = useSelector((state) => state.FetchApi.listData_SubAccountType);
    const isGlobalLoading = useSelector((state) => state.FetchApi.isLoading);
    const dispatch = useDispatch();
    //! columns header
    const columns = [
        {
            field: 'SubTypeId',
            headerName: t('code'),
            minWidth: 150,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'SubTypeName',
            headerName: t('name'),
            minWidth: 300,
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
        const fetchApiGetDataAccGroup = async () => {
            // setIsLoading(true);
            // await ApiListSubAccountType(valueSearch, setDataList);
            // setIsLoading(false);
            dispatch(fetchApiListSubAccountType());
        };
        fetchApiGetDataAccGroup();
    }, [reloadListAccGroup]);

    useEffect(() => {
        let filteredData = listSubAccountType;
        if (valueSearch && valueSearch.trim() !== "") {
            const fieldsToSearch = ["SubTypeId", "SubTypeName", "Description"];
            filteredData = _.filter(dataList, (item) => {
                const search = _.toLower(valueSearch);
                return _.some(fieldsToSearch, (field) => _.includes(_.toLower(item[field]), search));
            });
        }
        setDataList(filteredData);
    }, [listSubAccountType]);

    // Handle search
    const [valueSearch, setValueSearch] = React.useState('');
    const handleSearch = () => {
        let filteredData = dataList;
        if (valueSearch && valueSearch.trim() !== "") {
            const fieldsToSearch = ["SubTypeId", "SubTypeName", "Description"];

            filteredData = _.filter(dataList, (item) => {
                const search = _.toLower(valueSearch);
                return _.some(fieldsToSearch, (field) => _.includes(_.toLower(item[field]), search));
            });
        }
        setDataList(filteredData);
    }

    const [valueCode, setValueCode] = React.useState('');
    const [valueName, setValueName] = React.useState('');
    const [valueDescription, setValueDescription] = React.useState('');

    //! select row in datagrid
    const onRowsSelectionHandler = (ids) => {
        const selectedRowsData = ids.map((id) => dataList.find((row) => row.SubTypeId === id));
        if (selectedRowsData) {
            {
                selectedRowsData.map((key) => {
                    setValueCode(key.SubTypeId ?? "XXXX");
                    setValueName(key.SubTypeName ?? '');
                    setValueDescription(key.Description ?? '');
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
        asyncApiCreateSubAccountType();
    };
    const closeDialogNew = () => {
        setDialogIsOpenNew(false);
        toast.warning(t('toast-cancel-new'));
    };

    const asyncApiCreateSubAccountType = async () => {
        setIsLoading(true);
        const statusCode = await ApiCreateSubAccountType(valueCode, valueName, valueDescription);
        if (statusCode) {
            setValueCode('');
            setValueName('');
            setValueDescription('');
            setValueNewButton(false);
            setValueDisableSaveButton(true);
            setValueDisableDeleteButton(true);
            setValueReadonly(true);
            setValueReadonlyCode(true);
        }
        setIsLoading(false);
        setReloadListAccGroup(!reloadListAccGroup);
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

    // TODO call api update
    /* #region  call api update */
    const agreeDialogUpdate = () => {
        setDialogIsOpenUpdate(false);
        asyncApiUpdateSubAccountType();
    };
    const closeDialogUpdate = () => {
        setDialogIsOpenUpdate(false);
        toast.warning(t('toast-cancel-update'));
    };

    const asyncApiUpdateSubAccountType = async () => {
        setIsLoading(true);
        const statusCode = await ApiUpdateSubAccountType(valueCode, valueName, valueDescription);
        if (statusCode) {
            setValueReadonly(true);
            setValueUpdateButton(false);
            setValueDisableSaveButton(true);
            setValueDisableDeleteButton(true);
        }
        setIsLoading(false);
        setReloadListAccGroup(!reloadListAccGroup);
    };

    /* #endregion */

    // TODO call api delete
    /* #region  call api delete */
    const agreeDialogDelete = () => {
        setDialogIsOpenDelete(false);
        asyncApiDeleteSubAccountType();
    };
    const closeDialogDelete = () => {
        setDialogIsOpenDelete(false);
        toast.warning(t('toast-cancel-delete'));
    };

    const asyncApiDeleteSubAccountType = async () => {
        setIsLoading(true);
        const statusCode = await ApiDeleteSubAccountType(valueCode);
        if (statusCode) {
            setValueCode('');
            setValueName('');
            setValueDescription('');
            setValueReadonly(true);
            setValueDisableSaveButton(true);
            setValueDisableDeleteButton(true);
        }
        setIsLoading(false);
        setReloadListAccGroup(!reloadListAccGroup);
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
        if (valueCode && valueName) {
            if (valueNewButton) {
                setDialogIsOpenNew(true);
            }
            if (valueUpdateButton) {
                setDialogIsOpenUpdate(true);
            }
        } else {
            toast.error(t('subaccount-type-toast-error'));
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
    OnKeyEvent(() => setReloadListAccGroup(!reloadListAccGroup), 'Enter');
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
        <Spin size="large" tip={t('loading')} spinning={isLoading}>
            <div className="main">
                <ToastContainer position='bottom-right' stacked />
                {dialogIsOpenNew && (
                    <AlertDialog
                        title={t('subaccount-type-toast-new')}
                        content={
                            <>
                                {t('code')}: {valueCode}
                                <br /> {t('name')}: {valueName}
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
                        title={t('subaccount-type-toast-update')}
                        content={
                            <>
                                {t('code')}: {valueCode}
                                <br /> {t('name')}: {valueName}
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
                        title={t('subaccount-type-toast-delete')}
                        content={
                            <>
                                {t('code')}: {valueCode}
                                <br /> {t('name')}: {valueName}
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
                                        {t('subaccount-type-title-list')}
                                    </h5>
                                    <div style={{ width: '100%' }}>
                                        <DataGrid
                                            rows={dataList}
                                            columns={columns}
                                            getRowId={(row) => row.SubTypeId}
                                            initialState={{
                                                pagination: {
                                                    paginationModel: { page: 0, pageSize: 5 },
                                                },
                                            }}
                                            pageSizeOptions={[5, 10, 15]}
                                            autoHeight
                                            showCellVerticalBorder
                                            showColumnVerticalBorder
                                            loading={isGlobalLoading}
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
                                            {t('subaccount-type-title-infor')}
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
                                                    <div>{t('code')}</div>
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
                                                    <div>{t('name')}</div>
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

export default SubAccountType;
