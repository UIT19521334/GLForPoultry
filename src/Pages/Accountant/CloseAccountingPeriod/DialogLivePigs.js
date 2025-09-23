import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSelector, useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import AlertDialog from '~/components/AlertDialog';
import { ApiOpenPeriod, ApiReopenPeriod } from '~/components/Api/OpenAccountingPeriod';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import Autocomplete from '@mui/material/Autocomplete';
import { Input, Spin } from 'antd';
import { fetchPeriod } from '~/Redux/FetchApi/fetchApiMaster';
import { useTranslation } from 'react-i18next';
import { OnKeyEvent } from '~/components/Event/OnKeyEvent';
import OnMultiKeyEvent from '~/components/Event/OnMultiKeyEvent';
import { DownOutlined } from '@ant-design/icons';
import Select from '@mui/material/Select';
import { ApiAccountList } from '~/components/Api/Account';
import {
    ApiCreateLivePig,
    ApiDeleteLivePig,
    ApiGetListFarm,
    ApiLivePigList,
    ApiUpdateLivePig,
} from '~/components/Api/LivePig';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import SaveIcon from '@mui/icons-material/Save';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { type } from '@testing-library/user-event/dist/type';
import { InputNumber } from 'antd';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    direction: 'row',
    color: theme.palette.text.secondary,
}));

const dataType = [
    {
        id: 1,
        name: 'PIG',
    },
    {
        id: 2,
        name: 'TRANSPORTATION',
    },
];

export default function DialogLivePigs({ open, onClose }) {
    const [isLoading, setIsLoading] = React.useState(false);
    var dispatch = useDispatch();
    const { t } = useTranslation();

    const [valueReadonly, setValueReadonly] = React.useState(true);

    const [valueCode, setValueCode] = React.useState('');

    const [valueType, setValueType] = React.useState(1);
    const handleOnChangeValueType = (event) => {
        setValueType(event.target.value);
        if (event.target.value == 1) {
            setValueHidenFarm(false);
        } else {
            setValueHidenFarm(true);
            setValueFarm('');
        }
    };

    const [valueDescription, setValueDescription] = React.useState('');
    const handleOnChangeValueDescription = (event) => {
        setValueDescription(event.target.value);
    };

    const [value, setValue] = React.useState('');
    const handleOnChangeValue = (event) => {
        setValue(event);
    };

    //! get data from redux
    const access_token = useSelector((state) => state.FetchApi.token);
    const dataPeriod_From_Redux = useSelector((state) => state.FetchApi.listData_Period.acc_date);
    const unitcode = useSelector((state) => state.Actions.unitcode);
    const dataCostCenter = useSelector((state) =>
        state.FetchApi.listData_CostCenter.filter((data) => data.kind_of_location == 'SH'),
    );
    const [valueCostCenter, setValueCostCenter] = React.useState('');
    const [valueNameCostCenter, setValueNameCostCenter] = React.useState('');

    const handleCostCenter = (event) => {
        setValueCostCenter(event.target.value);
        const name = dataCostCenter.filter((data) => data.code == event.target.value);
        setValueNameCostCenter(name[0].name);
        setReloadListFarm(!reloadListFarm);
    };
    // TODO call api get list Farm
    /* #region  call api list */
    const [reloadListFarm, setReloadListFarm] = React.useState(false);
    const [dataListFarm, setDataListFarm] = useState([]);

    useEffect(() => {
        const asyncApiListAccount = async () => {
            setIsLoading(true);
            await ApiGetListFarm(
                valueCostCenter,
                dayjs(dataPeriod_From_Redux).month() + 1,
                dayjs(dataPeriod_From_Redux).year(),
                setDataListFarm,
            );
            setIsLoading(false);
        };
        asyncApiListAccount();
    }, [reloadListFarm]);
    /* #endregion */
    const [valueHidenFarm, setValueHidenFarm] = React.useState(false);
    const [valueFarm, setValueFarm] = React.useState('');

    const handleFarm = (event) => {
        setValueFarm(event.target.value);
    };

    // TODO call api get data account
    /* #region  call api list */
    const [reloadList, setReloadList] = React.useState(false);
    const [dataList, setDataList] = useState([]);

    useEffect(() => {
        const asyncApiListAccount = async () => {
            setIsLoading(true);
            await ApiLivePigList(
                dayjs(dataPeriod_From_Redux).month() + 1,
                dayjs(dataPeriod_From_Redux).year(),
                setDataList,
            );
            setIsLoading(false);
        };
        asyncApiListAccount();
    }, [reloadList]);
    /* #endregion */

    //! column datagrid header
    const columns = [
        {
            field: 'type_name',
            headerName: t('memo-type'),
            width: 160,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'cost_center_name',
            headerName: t('cost-center'),
            minWidth: 300,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'received_from_unit_name',
            headerName: t('title-farm'),
            minWidth: 200,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'trans_value',
            headerName: t('value'),
            width: 150,
            type: 'number',
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
        },
        {
            field: 'description',
            headerName: t('description'),
            width: 300,
            flex: 1,
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
        },
        // {
        //     field: 'cost_center',
        //     headerName: t('cost-center'),
        //     width: 150,
        //     headerClassName: 'super-app-theme--header',
        //     headerAlign: 'center',
        //     type: 'singleSelect',
        //     getOptionValue: (value) => value.code,
        //     getOptionLabel: (value) => value.name,
        //     valueOptions: dataCostCenter,
        // },
    ];

    //! select row in datagrid
    const onRowsSelectionHandler = (ids) => {
        const selectedRowsData = ids.map((id) => dataList.find((row) => row.trans_id === id));
        if (selectedRowsData) {
            {
                selectedRowsData.map((key) => {
                    setValueCode(key.trans_id);
                    setValueType(key.type);
                    setValueCostCenter(key.cost_center);
                    setValue(key.trans_value);
                    setValueDescription(key.description ?? '');
                    setValueFarm(key.received_from_unit_code);
                });
                setReloadListFarm(!reloadListFarm);
                setValueReadonly(true);
                setValueDisableSaveButton(true);
                setValueNewButton(false);
                setValueUpdateButton(false);
            }
        }
    };

    const [dialogIsOpenNew, setDialogIsOpenNew] = React.useState(false);
    const [dialogIsOpenUpdate, setDialogIsOpenUpdate] = React.useState(false);
    const [callApiNew, setCallApiNew] = React.useState(false);
    const [callApiUpdate, setCallApiUpdate] = React.useState(false);

    const agreeDialogNew = () => {
        setDialogIsOpenNew(false);
        setCallApiNew(true);
    };
    const closeDialogNew = () => {
        setDialogIsOpenNew(false);
        toast.warning(t('toast-cancel-new'));
    };

    /* #region  button new */

    const [valueNewButton, setValueNewButton] = React.useState(false);
    const handleClickNew = () => {
        setValueNewButton(true);
        setValueUpdateButton(false);

        setValueCode('');
        setValueType(1);
        setValueCostCenter('');
        setValue('');
        setValueDescription('');
        setDataListFarm([]);
        setValueFarm('');

        setValueReadonly(false);
        setValueDisableSaveButton(false);
    };
    /* #endregion */

    // TODO call api create
    useEffect(() => {
        if (callApiNew) {
            const asyncApiCreate = async () => {
                setIsLoading(true);
                const statusCode = await ApiCreateLivePig(
                    access_token,
                    valueType,
                    valueCostCenter,
                    value,
                    valueDescription,
                    valueFarm,
                    dayjs(dataPeriod_From_Redux).month() + 1,
                    dayjs(dataPeriod_From_Redux).year(),
                );
                if (statusCode) {
                    setValueCode('');
                    setValueType('');
                    setValueCostCenter('');
                    setValue('');
                    setValueDescription('');

                    setValueNewButton(false);
                    setValueDisableSaveButton(true);
                    setValueReadonly(true);
                    setReloadList(!reloadList);
                }
            };

            setIsLoading(false);
            asyncApiCreate();
        }

        setCallApiNew(false);
    }, [callApiNew]);

    const agreeDialogUpdate = () => {
        setDialogIsOpenUpdate(false);
        setCallApiUpdate(true);
    };
    const closeDialogUpdate = () => {
        setDialogIsOpenUpdate(false);
        toast.warning(t('toast-cancel-update'));
    };

    /* #region  button update */
    const [valueUpdateButton, setValueUpdateButton] = React.useState(false);
    const handleClickUpdate = () => {
        setValueNewButton(false);
        setValueUpdateButton(true);
        setValueReadonly(false);
        setValueDisableSaveButton(false);
    };
    /* #endregion */

    // TODO call api update
    useEffect(() => {
        if (callApiUpdate) {
            const asyncApiUpdate = async () => {
                setIsLoading(true);
                const statusCode = await ApiUpdateLivePig(
                    access_token,
                    valueCode,
                    valueType,
                    valueCostCenter,
                    value,
                    valueDescription,
                    valueFarm,
                    dayjs(dataPeriod_From_Redux).month() + 1,
                    dayjs(dataPeriod_From_Redux).year(),
                );
                if (statusCode) {
                    setValueUpdateButton(false);
                    setValueDisableSaveButton(true);
                    setValueReadonly(true);
                    setReloadList(!reloadList);
                }
            };

            setIsLoading(false);
            asyncApiUpdate();
        }

        setCallApiUpdate(false);
    }, [callApiUpdate]);

    //! handle click save
    const [valueDisableSaveButton, setValueDisableSaveButton] = React.useState(true);
    const handleClickSave = (event) => {
        if (valueCostCenter && value) {
            if (valueNewButton) {
                setDialogIsOpenNew(true);
            }
            if (valueUpdateButton) {
                setDialogIsOpenUpdate(true);
            }
        } else {
            toast.error(t('toast-error'));
        }
    };

    //todo: call api delete header entry
    /* #region  call api delete */
    const [dialogIsOpenDelete, setDialogIsOpenDelete] = React.useState(false);
    const [callApiDelete, setCallApiDelete] = React.useState(false);
    const agreeDialogDelete = async () => {
        setDialogIsOpenDelete(false);
        setCallApiDelete(true);
    };
    const closeDialogDeleteAeHeader = () => {
        setDialogIsOpenDelete(false);
        toast.warning(t('toast-cancel-delete'));
    };
    const handleClickDelete = () => {
        if (!access_token || !valueCode) {
            toast.warning(t('livepig-delete-error'));
            return;
        }
        setDialogIsOpenDelete(true);
    };
    const apiDelete = async () => {
        const status_code = await ApiDeleteLivePig(access_token, valueCode);
        if (status_code) {
            setValueCode('');

            setValueCostCenter('');
            setValue('');
            setValueDescription('');

            setReloadList(!reloadList);
        }
    };
    useEffect(() => {
        setIsLoading(true);
        if (callApiDelete) {
            apiDelete();
        }
        setCallApiDelete(false);
        setIsLoading(false);
    }, [callApiDelete]);
    /* #endregion */

    //! on key event
    // OnMultiKeyEvent(() => handleReopenPeriod(), 'r');
    OnMultiKeyEvent(handleClickNew, valueNewButton ? '' : 'n');
    OnMultiKeyEvent(handleClickUpdate, valueUpdateButton ? '' : 'u');
    OnMultiKeyEvent(handleClickSave, valueDisableSaveButton ? '' : 's');
    OnMultiKeyEvent(handleClickDelete, 'd');

    //? Mobile
    //! button infor
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
                >
                    {t('button-update')}
                </LoadingButton>
            </Stack>

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
                onClick={handleClickDelete}
            >
                {t('button-delete')}
            </LoadingButton>
        </Stack>
    );

    return (
        <Spin size="large" tip="Loading" spinning={isLoading}>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth={'xl'}>
                <DialogTitle sx={{ padding: 0 }} display={'flex'} justifyContent={'flex-end'}>
                    <IconButton sx={{ padding: 1.5 }} edge="start" color="inherit" onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {dialogIsOpenNew && (
                        <AlertDialog
                            title={t('livepig-toast-new')}
                            content={
                                <>
                                    {t('cost-center')}: {valueNameCostCenter}
                                    <br /> {t('value')}: {value}
                                    <br /> {t('description')}: {valueDescription}
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
                                    {t('transfer-id')}: {valueCode}
                                    <br />
                                    {t('cost-center')}: {valueNameCostCenter}
                                    <br /> {t('value')}: {value}
                                    <br /> {t('description')}: {valueDescription}
                                </>
                            }
                            onOpen={dialogIsOpenUpdate}
                            onClose={closeDialogUpdate}
                            onAgree={agreeDialogUpdate}
                        />
                    )}
                    {dialogIsOpenDelete && (
                        <AlertDialog
                            title={t('livepig-toast-delete')}
                            content={
                                <>
                                    {t('transfer-id')}: {valueCode}
                                    <br />
                                    {t('cost-center')}: {valueNameCostCenter}
                                    <br /> {t('value')}: {value}
                                    <br /> {t('description')}: {valueDescription}
                                </>
                            }
                            onOpen={dialogIsOpenDelete}
                            onClose={closeDialogDeleteAeHeader}
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
                        <Grid container spacing={1}>
                            <Grid xs={12} md={12}>
                                <Item>
                                    <Stack spacing={0}>
                                        <h5 style={{ textAlign: 'left', fontWeight: 'bold' }}>
                                            {t('live-pig-title-list')}
                                        </h5>
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
                                                getRowId={(row) => row.trans_id}
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
                                                    {t('info-livepig')}
                                                </h5>

                                                <Stack
                                                    width={'100%'}
                                                    direction={'row'}
                                                    spacing={1}
                                                    alignItems={'center'}
                                                    justifyContent={'flex-end'}
                                                    sx={{ display: { xs: 'none', md: 'flex' } }}
                                                >
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
                                                        onClick={handleClickDelete}
                                                    >
                                                        {t('button-delete')}
                                                    </LoadingButton>
                                                </Stack>
                                            </Stack>
                                        </Grid>

                                        <Grid container xs={12} md={12} spacing={2}>
                                            {/* <Grid xs={12} md={12}>
                                                <Stack direction={'row'} spacing={2}>
                                                    <div className="form-title">{t('transfer-id')}</div>

                                                    <Input
                                                        variant="borderless"
                                                        size="large"
                                                        value={valueCode}
                                                        placeholder="xxxxxxxx"
                                                        readOnly
                                                    />
                                                </Stack>
                                            </Grid> */}
                                            <Grid xs={12} md={12}>
                                                <Stack direction={'row'} spacing={2}>
                                                    <div className="form-title">
                                                        <div>{t('memo-type')}</div>
                                                    </div>

                                                    <Select
                                                        labelId="demo-simple-select-helper-label"
                                                        value={valueType}
                                                        displayEmpty
                                                        fullWidth
                                                        onChange={(event) => handleOnChangeValueType(event)}
                                                        // sx={{ width: 250 }}
                                                        disabled={valueReadonly}
                                                        size="small"
                                                    >
                                                        {dataType.map((data) => {
                                                            return (
                                                                <MenuItem key={data.id} value={data.id}>
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
                                                        <div>{t('cost-center')}</div>
                                                    </div>

                                                    <Select
                                                        labelId="demo-simple-select-helper-label"
                                                        id="group-cost"
                                                        value={valueCostCenter}
                                                        displayEmpty
                                                        fullWidth
                                                        onChange={(event) => handleCostCenter(event)}
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

                                            <Grid xs={12} md={12} hidden={valueHidenFarm}>
                                                <Stack direction={'row'} spacing={2}>
                                                    <div className="form-title">
                                                        <div>{t('title-farm')}</div>
                                                    </div>

                                                    <Select
                                                        id="group-farm"
                                                        value={valueFarm}
                                                        displayEmpty
                                                        fullWidth
                                                        onChange={(event) => handleFarm(event)}
                                                        // sx={{ width: 250 }}
                                                        disabled={valueReadonly}
                                                        size="small"
                                                    >
                                                        {dataListFarm.map((data) => {
                                                            return (
                                                                <MenuItem
                                                                    key={data.farm_transfer_code}
                                                                    value={data.farm_transfer_code}
                                                                >
                                                                    {data.farm_transfer_name}
                                                                </MenuItem>
                                                            );
                                                        })}
                                                    </Select>
                                                </Stack>
                                            </Grid>

                                            <Grid xs={12} md={12}>
                                                <Stack direction={'row'} spacing={2}>
                                                    <div className="form-title">
                                                        <div>{t('value')}</div>
                                                    </div>

                                                    <InputNumber
                                                        style={{ width: '100%' }}
                                                        status={value ? '' : 'error'}
                                                        size="large"
                                                        formatter={(value) =>
                                                            value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                        }
                                                        parser={(value) => value.replace(/\$-+₫\s?|(,*)/g, '')}
                                                        value={value}
                                                        onChange={(event) => handleOnChangeValue(event)}
                                                        disabled={valueReadonly}
                                                        placeholder="0"
                                                    />
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
                                                        rows={3}
                                                        placeholder="..."
                                                        disabled={valueReadonly}
                                                    />
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Item>
                                {mobileButtonInfor}
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
            </Dialog>
        </Spin>
    );
}
