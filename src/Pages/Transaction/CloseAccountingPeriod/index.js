import AddBoxIcon from '@mui/icons-material/AddBox';
import CalculateIcon from '@mui/icons-material/Calculate';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import LockIcon from '@mui/icons-material/Lock';
import MoveUpIcon from '@mui/icons-material/MoveUp';
import SearchIcon from '@mui/icons-material/Search';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { DataGrid } from '@mui/x-data-grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Spin } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import dayjs from '~/utils/dayjs'
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import AlertDialog from '~/components/AlertDialog';
import {
    ApiCalCOGM,
    ApiCalCostTransfer,
    ApiClosePeriod,
    ApiLoadDataReport,
    ApiProcessPeriod,
    ApiTransferProfitLoss,
} from '~/components/Api/CloseAccountingPeriod';
import { ApiOpenPeriod } from '~/components/Api/OpenAccountingPeriod';
import OnMultiKeyEvent from '~/components/Event/OnMultiKeyEvent';
import { fetchPeriod } from '~/Redux/FetchApi/fetchApiMaster';
import DialogLivePigs from './DialogLivePigs';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import { FormHelperText, TextField } from '@mui/material';
import { updateDialogError } from '~/Redux/Reducer/FetchApi';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    direction: 'row',
    color: theme.palette.text.secondary,
}));

const getTotals = (data, key) => {
    let total = 0;
    data.forEach((item) => {
        total += item[key];
    });
    return total;
};

function CloseAccountingPeriod({ title }) {
    var dispatch = useDispatch();
    const currentUnit = useSelector((state) => state.FetchApi.currentUnit);
    const userInfo = useSelector(state => state.FetchApi.userInfo);
    const [isLoading, setIsLoading] = React.useState(false);
    const [confirmText, setConfirmText] = React.useState("");
    const [errorConfirmText, setErrorConfirmText] = React.useState("");
    const [valueNextPeriod, setValueNextPeriod] = React.useState(dayjs(new Date()));
    const [valueClosedPeriod, setValueClosedPeriod] = React.useState(dayjs(new Date()));
    const { t } = useTranslation();
    const dataCostCenter = useSelector((state) =>
        state.FetchApi.listData_CostCenter.filter((data) => data.kind_of_location !== null),
    );

    const [valueDateAccountPeriod, setValueDateAccountPeriod] = React.useState(dayjs(valueClosedPeriod));
    const [valueCostCenter, setValueCostCenter] = React.useState('');

    //todo: reload next month
    useEffect(() => {
        getPeriodForUnit();
    }, []);

    const getPeriodForUnit = async () => {
        setIsLoading(true)
        const result = await ApiProcessPeriod(currentUnit.UnitId)
        setIsLoading(false)
        if (result) {
            setValueClosedPeriod(dayjs(result.period_locked, "MMYYYY"))
            setValueNextPeriod(dayjs(result.period_nextlock, "MMYYYY"))
        }
    }

    const transferProfitLoss = async () => {
        setIsLoading(true)
        const body = {
            Month: valueNextPeriod.format("M"),
            Year: valueNextPeriod.format("YYYY"),
            UserName: userInfo?.userName,
            Currency: "VND",
        }
        const result = await ApiTransferProfitLoss(currentUnit.UnitId, body)
        setIsLoading(false)
        if (result) {
            toast.success(t('transfer-lost-success'));
        }
    }

    const closePeriod = async () => {
        setIsLoading(true)
        const body = {
            Month: valueNextPeriod.format("M"),
            Year: valueNextPeriod.format("YYYY"),
            UserName: userInfo?.userID_old,
            Currency: "VND",
        }
        const result = await ApiClosePeriod(currentUnit.UnitId, body)
        setIsLoading(false)
        if (result) {
            toast.success('Đóng kỳ thành công');
        }
    }

    const [dialogIsOpen, setDialogIsOpen] = React.useState(false);
    const [callApiOpen, setCallApiOpen] = React.useState(false);
    const agreeDialogr = () => {
        if (confirmText !== 'Thiên An bắt nhập') {
            setErrorConfirmText('Nhập sai mã, không thể đóng kỳ !!!')
            return
        }
        setConfirmText('');
        setErrorConfirmText('');
        setDialogIsOpen(false);
        closePeriod();
    };
    const closeDialog = () => {
        setDialogIsOpen(false);
        setConfirmText('');
        toast.warning(t('close-toast-cancel'));
    };

    const handleClosePeriod = () => {
        setDialogIsOpen(true);
    };


    const [buttonExport, setButtonExport] = useState(false);
    const handleViewReport = (event) => {
        setReloadData(true);
    };
    const [buttonCalCOGM, setButtonCalCOGM] = useState(false);
    const [dialogIsOpenCalCOGM, setDialogIsOpenCalCOGM] = React.useState(false);
    const agreeDialogCalCOGM = () => {
        setDialogIsOpenCalCOGM(false);
        setButtonCalCOGM(true);
    };
    const closeDialogCalCOGM = () => {
        setDialogIsOpenCalCOGM(false);
        toast.warning(t('toast-cancel-cogm'));
    };


    const [buttonCalCostTransfer, setButtonCalCostTransfer] = useState(false);

    const [dialogIsOpenCalCost, setDialogIsOpenCalCost] = React.useState(false);
    const agreeDialogCalCost = () => {
        setDialogIsOpenCalCost(false);
        setButtonCalCostTransfer(true);
    };
    const closeDialogCalCost = () => {
        setDialogIsOpenCalCost(false);
        toast.warning(t('toast-cancel-cost-transfer'));
    };

    const [dialogIsOpenTransferProfitLoss, setDialogIsOpenTransferProfitLoss] = React.useState(false);
    const agreeDialogTransferProfitLoss = () => {
        setDialogIsOpenTransferProfitLoss(false);
        transferProfitLoss();
    };
    const closeDialogTransferProfitLoss = () => {
        setDialogIsOpenTransferProfitLoss(false);
        toast.warning(`Hủy ${t('transfer-lost')}`);
    };
    //! handler change
    const handleChangePeriod = (event) => {
        setValueDateAccountPeriod(event);
    };
    const handleChangeCostCenter = (event) => {
        setValueCostCenter(event.target.value);
    };

    //! handler click export file
    const handleClickExport = () => {
        if (dataList.length > 0) {
            const data = dataList.map((el) => {
                // let doc_date = dayjs(el.doc_date);
                // let allcation_date = dayjs(el.allcation_date);
                // el.doc_date = doc_date.date() + '/' + (doc_date.month() + 1) + '/' + doc_date.year();
                // el.allcation_date =
                //     allcation_date.date() + '/' + (allcation_date.month() + 1) + '/' + allcation_date.year();

                // el.amount_period_N = el.amount_period_N.toLocaleString();
                // el.amount_period_N_1 = el.amount_period_N_1.toLocaleString();
                // el.amount_period_N_2 = el.amount_period_N_2.toLocaleString();
                return el;
            });

            const dataExcel = [
                {
                    expense_code: '0',
                    amount_period_N_2: dataList
                        .reduce(function (s, a) {
                            return s + parseInt(a.amount_period_N_2);
                        }, 0)
                        .toLocaleString(),
                    amount_period_N_1: dataList
                        .reduce(function (s, a) {
                            return s + parseInt(a.amount_period_N_1);
                        }, 0)
                        .toLocaleString(),
                    amount_period_N: dataList
                        .reduce(function (s, a) {
                            return s + parseInt(a.amount_period_N);
                        }, 0)
                        .toLocaleString(),
                },
                ...data,
            ];

            const excel = new Excel();
            excel
                .addSheet('Spread Period')
                .addColumns(columnsExport)
                .addDataSource(
                    dataExcel.sort(function (a, b) {
                        return a.expense_code.localeCompare(b.expense_code);
                    }),

                    {
                        str2Percent: true,
                    },
                )
                .saveAs(`SpreadPeriod_${valueDateAccountPeriod.format('YYYYMM')}_${dayjs().format('YYYYMMDD')}.xlsx`);
        } else {
            toast.warn(t('toast-nodata'));
        }
    };
    /* #endregion */

    const columnsExport = [
        {
            title: 'Mã tài khoản',
            dataIndex: 'acc_code',
            key: 'Mã tài khoản',
        },
        {
            title: 'Tên tài khoản',
            dataIndex: 'acc_name',
            key: 'Tên tài khoản',
        },
        {
            title: 'Mã nhóm chi phí',
            dataIndex: 'grp_expense_code',
            key: 'Mã nhóm chi phí',
        },
        {
            title: 'Nhóm chi phí',
            dataIndex: 'grp_expense_name',
            key: 'Nhóm chi phí',
        },
        {
            title: 'Mã chi phí',
            dataIndex: 'expense_code',
            key: 'Mã chi phí',
        },
        {
            title: 'Chi phí',
            dataIndex: 'expense_name',
            width: 400,
            key: 'Chi phí',
        },
        {
            title: 'Kỳ N-2',
            dataIndex: 'amount_period_N_2',
            key: 'Period N2',
        },
        {
            title: 'Kỳ N-1',
            dataIndex: 'amount_period_N_1',
            key: 'Period N1',
        },
        {
            title: 'Kỳ N',
            dataIndex: 'amount_period_N',
            key: 'Period N',
        },
    ];

    /* #region  call api list */
    const [reloadData, setReloadData] = React.useState(false);
    const [dataList, setDataList] = useState([]);

    // useEffect(() => {
    //     const asyncApiList = async () => {
    //         setIsLoading(true);
    //         if (reloadData) {
    //             if (valueCostCenter) {
    //                 const status_code = await ApiLoadDataReport({
    //                     valueCostCenter: valueCostCenter,
    //                     PERIOD_MONTH: valueDateAccountPeriod.month() + 1,
    //                     PERIOD_YEAR: valueDateAccountPeriod.year(),
    //                     setDataReport: setDataList,
    //                 });
    //             } else {
    //                 toast.warn(t('toast-nodata'));
    //             }
    //         }
    //         setIsLoading(false);
    //     };

    //     asyncApiList();
    //     setReloadData(false);
    // }, [reloadData]);
    /* #endregion */

    const CustomFooter = (props) => {
        return (
            <Box sx={{ p: 1, display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
                <Stack direction={'row'} spacing={2}>
                    <Box>Total</Box>
                    <Box>(N-2) {getTotals(dataList, 'amount_period_N_2').toLocaleString()}</Box>
                    <Box>(N-1) {getTotals(dataList, 'amount_period_N_1').toLocaleString()}</Box>
                    <Box>(N) {getTotals(dataList, 'amount_period_N').toLocaleString()}</Box>
                </Stack>
            </Box>
        );
    };

    //! column datagrid
    const columns = [
        {
            field: 'acc_code',
            headerName: t('account-code'),
            width: 100,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'acc_name',
            headerName: t('account-name'),
            width: 200,
            flex: 1,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'expense_name',
            headerName: t('account-expense'),
            minWidth: 300,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'amount_period_N_2',
            headerName: t('close-n2'),
            type: 'number',
            width: 130,
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
        },
        {
            field: 'amount_period_N_1',
            headerName: t('close-n1'),
            type: 'number',
            width: 130,
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
        },

        {
            field: 'amount_period_N',
            headerName: t('close-n'),
            type: 'number',
            width: 130,
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
        },
    ];

    //! handler open dialog
    const [openDialogCost, setOpenDialogCost] = React.useState(false);
    const handleClickOpenDialogDetail = () => {
        setOpenDialogCost(true);
    };

    const handleCloseDialogDetail = () => {
        setOpenDialogCost(false);
    };

    //! on key event
    OnMultiKeyEvent(() => handleClosePeriod(), 'l');

    //? Mobile
    //! button phan bo header
    const mobileButtonCalculated = (
        <Stack
            direction={'column'}
            spacing={1}
            alignItems={'center'}
            justifyContent={'flex-start'}
            sx={{ display: { xs: 'flex', md: 'none' } }}
        >
            <LoadingButton
                fullWidth
                startIcon={<AddBoxIcon />}
                variant="contained"
                color="primary"
                onClick={handleClickOpenDialogDetail}
                loadingPosition="start"
                sx={{ whiteSpace: 'nowrap' }}
            >
                {t('button-material-cost')}
            </LoadingButton>

            <LoadingButton
                fullWidth
                startIcon={<CalculateIcon />}
                variant="contained"
                color="warning"
                onClick={() => setDialogIsOpenCalCOGM(true)}
                loadingPosition="start"
                sx={{ whiteSpace: 'nowrap' }}
            >
                {t('button-calculate-cogm')}
            </LoadingButton>
            <LoadingButton
                fullWidth
                startIcon={<MoveUpIcon />}
                variant="contained"
                color="secondary"
                onClick={() => setDialogIsOpenCalCost(true)}
                loadingPosition="start"
                sx={{ whiteSpace: 'nowrap' }}
            >
                {t('button-calculate-cost-transfer')}
            </LoadingButton>
        </Stack>
    );
    return (
        <Spin size="large" tip="Loading" spinning={isLoading}>
            <div className="main">
                <ToastContainer position='bottom-right' stacked />
                {dialogIsOpen && (
                    <AlertDialog
                        title={`${t('close-toast-new')}: ${dayjs(valueNextPeriod).utc(true).format('MM - YYYY')}`}
                        content={
                            <>
                                <Box mb={2}>
                                    {t('close-period-confirm')}
                                </Box>
                                <TextField fullWidth
                                    value={confirmText}
                                    error={errorConfirmText}
                                    helperText={errorConfirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                />

                            </>
                        }
                        onOpen={dialogIsOpen}
                        onClose={closeDialog}
                        onAgree={agreeDialogr}
                    />
                )}
                {dialogIsOpenCalCOGM && (
                    <AlertDialog
                        title={t('button-calculate-cogm')}
                        content={
                            <>
                                {t('button-calculate-cogm')}:{' '}
                                {dayjs(valueClosedPeriod).utc(true).format('MM - YYYY')}
                            </>
                        }
                        onOpen={dialogIsOpenCalCOGM}
                        onClose={closeDialogCalCOGM}
                        onAgree={agreeDialogCalCOGM}
                    />
                )}
                {dialogIsOpenCalCost && (
                    <AlertDialog
                        title={t('button-calculate-cost-transfer')}
                        content={
                            <>
                                {t('button-calculate-cost-transfer')}:{' '}
                                {dayjs(valueClosedPeriod).utc(true).format('MM - YYYY')}
                            </>
                        }
                        onOpen={dialogIsOpenCalCost}
                        onClose={closeDialogCalCost}
                        onAgree={agreeDialogCalCost}
                    />
                )}
                {dialogIsOpenTransferProfitLoss && (
                    <AlertDialog
                        title={t('transfer-lost')}
                        content={
                            <>
                                {t('transfer-lost')}: {dayjs(valueNextPeriod).utc(true).format('MM - YYYY')}/
                            </>
                        }
                        onOpen={dialogIsOpenTransferProfitLoss}
                        onClose={closeDialogTransferProfitLoss}
                        onAgree={agreeDialogTransferProfitLoss}
                    />
                )}
                {openDialogCost && <DialogLivePigs open={openDialogCost} onClose={handleCloseDialogDetail} />}
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
                        flexGrow: 1,
                        '& .super-app-theme--header': {
                            backgroundColor: '#ffc696',
                        },
                    }}
                >
                    <Grid container spacing={1}>
                        <Grid xs={12} md={12}>
                            <Item>
                                <Grid container spacing={1}>
                                    <Grid xs={12} md={5}>
                                        <Stack
                                            direction={'row'}
                                            spacing={2}
                                            alignItems={'flex-start'}
                                            justifyContent={'flex-start'}
                                        >
                                            <h6 style={{ width: '50%', textAlign: 'right' }}>{t('close-period')}</h6>
                                            <div style={{ width: '100%' }}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ width: '100%' }}>
                                                    <DatePicker
                                                        // label={'"month" and "year"'}
                                                        views={['month', 'year']}
                                                        value={dayjs(valueClosedPeriod)}
                                                        // sx={{ width: 300 }}
                                                        slotProps={{
                                                            textField: { size: 'small' },
                                                        }}
                                                        formatDensity="spacious"
                                                        format="MM - YYYY"
                                                        disabled
                                                    />
                                                </LocalizationProvider>
                                            </div>
                                        </Stack>
                                    </Grid>
                                    <Grid xs={12} md={5}>
                                        <Stack
                                            direction={'row'}
                                            spacing={2}
                                            alignItems={'flex-start'}
                                            justifyContent={'flex-start'}
                                        >
                                            <h6 style={{ width: '50%', textAlign: 'right' }}>{t('new-period')}</h6>
                                            <div style={{ width: '100%' }}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        // label={'"month" and "year"'}
                                                        views={['month', 'year']}
                                                        value={valueNextPeriod}
                                                        // sx={{ width: 300 }}
                                                        slotProps={{
                                                            textField: { size: 'small' },
                                                        }}
                                                        formatDensity="spacious"
                                                        format="MM/YYYY"
                                                        disabled
                                                    />
                                                </LocalizationProvider>
                                            </div>
                                        </Stack>
                                    </Grid>
                                    <Grid xs={12} md={2}>
                                        <LoadingButton
                                            fullWidth
                                            // loading
                                            variant="contained"
                                            color="primary"
                                            startIcon={<LockIcon />}
                                            onClick={handleClosePeriod}
                                        >
                                            {t('button-lock')}
                                        </LoadingButton>
                                    </Grid>
                                </Grid>
                            </Item>
                        </Grid>
                        <Grid xs={12} md={12} sx={{ width: '100%' }}>
                            <Item>
                                {mobileButtonCalculated}
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
                                            {/* <h5
                                                style={{
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {t('expenses-period')}
                                            </h5> */}

                                            <Stack
                                                direction={'row'}
                                                spacing={2}
                                                alignItems={'center'}
                                                justifyContent={'flex-start'}
                                                sx={{ display: { xs: 'none', md: 'flex' } }}
                                            >
                                                <LoadingButton
                                                    sx={{
                                                        backgroundColor: '#FF8F00',
                                                        color: '#fff',
                                                        '&:hover': {
                                                            backgroundColor: '#F57F17', // vàng đất khi hover
                                                        },
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                    startIcon={<SyncAltIcon />}
                                                    variant="contained"
                                                    onClick={() => setDialogIsOpenTransferProfitLoss(true)}
                                                    loadingPosition="start"
                                                >
                                                    {t('transfer-lost')}
                                                </LoadingButton>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                    <Grid xs={12} md={12}>
                                        <Box
                                            sx={{
                                                flexGrow: 1,
                                            }}
                                        >
                                            <Grid container direction={'row'} spacing={1}>
                                                {/* <Grid xs={12} md={12} sx={{ width: '100%' }}>
                                                    <Item>
                                                        <Grid container xs={12} md={12} spacing={1}>
                                                            <Grid xs={12} md={4}>
                                                                <Stack
                                                                    direction={'row'}
                                                                    spacing={2}
                                                                    alignItems={'center'}
                                                                    justifyContent={'flex-start'}
                                                                >
                                                                    <div className="form-title">
                                                                        {t('entry-period')}
                                                                    </div>
                                                                    <div style={{ width: '100%' }}>
                                                                        <LocalizationProvider
                                                                            dateAdapter={AdapterDayjs}
                                                                        >
                                                                            <DatePicker
                                                                                views={['month', 'year']}
                                                                                sx={{ width: '100%' }}
                                                                                value={valueDateAccountPeriod}
                                                                                slotProps={{
                                                                                    textField: { size: 'small' },
                                                                                }}
                                                                                formatDensity="spacious"
                                                                                format="MM-YYYY"
                                                                                onChange={handleChangePeriod}
                                                                            />
                                                                        </LocalizationProvider>
                                                                    </div>
                                                                </Stack>
                                                            </Grid>
                                                            <Grid xs={12} md={4}>
                                                                <Stack
                                                                    direction={'row'}
                                                                    spacing={2}
                                                                    alignItems={'center'}
                                                                    justifyContent={'flex-start'}
                                                                >
                                                                    <div className="form-title">
                                                                        <div>{t('cost-center')}</div>
                                                                    </div>

                                                                    <Select
                                                                        labelId="demo-simple-select-helper-label"
                                                                        id="group-cost"
                                                                        value={valueCostCenter}
                                                                        displayEmpty
                                                                        fullWidth
                                                                        onChange={(e) => handleChangeCostCenter(e)}
                                                                        // sx={{ width: 250 }}
                                                                        size="small"
                                                                    >
                                                                        {dataCostCenter.map((data) => {
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
                                                                </Stack>
                                                            </Grid>
                                                            <Grid xs={12} md={4}>
                                                                <Stack
                                                                    direction={'row'}
                                                                    spacing={2}
                                                                    alignItems={'center'}
                                                                    justifyContent={'space-evenly'}
                                                                >
                                                                    <div>
                                                                        <LoadingButton
                                                                            startIcon={<SearchIcon />}
                                                                            variant="contained"
                                                                            color="info"
                                                                            onClick={handleViewReport}
                                                                            loadingPosition="start"
                                                                            sx={{ whiteSpace: 'nowrap' }}
                                                                        >
                                                                            {t('button-view-report')}
                                                                        </LoadingButton>
                                                                    </div>
                                                                    
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>
                                                    </Item>
                                                </Grid> */}
                                                {/* <Grid xs={12} md={12}>
                                                    <Stack spacing={0}>
                                                        <div style={{ width: '100%' }}>
                                                            <DataGrid
                                                                rows={dataList}
                                                                columns={columns}
                                                                autoHeight
                                                                showCellVerticalBorder
                                                                showColumnVerticalBorder
                                                                loading={isLoading}
                                                                getRowId={(row) => row.trans_id}
                                                                slots={{
                                                                    footer: CustomFooter,
                                                                }}
                                                            />
                                                        </div>
                                                    </Stack>
                                                </Grid> */}
                                            </Grid>
                                        </Box>
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

export default CloseAccountingPeriod;
