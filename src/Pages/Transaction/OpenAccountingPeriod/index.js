import React from 'react';
import dayjs from '~/utils/dayjs'
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
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
import { ApiOpenPeriod, ApiReopenPeriod, ApiUsersForOpenPeriod } from '~/components/Api/OpenAccountingPeriod';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import Autocomplete from '@mui/material/Autocomplete';
import { Spin } from 'antd';
import { fetchPeriod } from '~/Redux/FetchApi/fetchApiMaster';
import { useTranslation } from 'react-i18next';
import { OnKeyEvent } from '~/components/Event/OnKeyEvent';
import OnMultiKeyEvent from '~/components/Event/OnMultiKeyEvent';
import { DownOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { ApiProcessPeriod } from '~/components/Api/CloseAccountingPeriod';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    direction: 'row',
    color: theme.palette.text.secondary,
}));
const suffix = (
    <>
        <DownOutlined />
    </>
);
function OpenAccountingPeriod({ title }) {
    const [isLoading, setIsLoading] = React.useState(false);
    const { t } = useTranslation();
    const currentUnit = useSelector((state) => state.FetchApi.currentUnit);
    const userInfo = useSelector(state => state.FetchApi.userInfo);
    const [valueUser, setValueUser] = React.useState([]);
    const [valueListUser, setValueListUser] = React.useState([]);
    const [dateReopenPeriod, setDateReopenPeriod] = React.useState(null);
    const [valueClosedPeriod, setValueClosedPeriod] = React.useState();
    const [confirmText, setConfirmText] = React.useState("");
    const [errorConfirmText, setErrorConfirmText] = React.useState("");

    const handleChangeReopenPeriod = (e) => {
        setDateReopenPeriod(e);
    };

    const handleReopenPeriod = () => {
        if (dateReopenPeriod && valueUser) {
            setDialogIsOpenReopen(true);
        } else {
            toast.warning(t('reopen-toast-warn'));
        }
    };
    const [dialogIsOpenReopen, setDialogIsOpenReopen] = React.useState(false);
    const [callApiOpenReopen, setCallApiOpenReopen] = React.useState(false);
    const agreeDialogReopen = () => {

        if (confirmText !== 'Thiên An bắt nhập') {
            setErrorConfirmText('Nhập sai mã, không thể đóng kỳ !!!')
            return
        }
        setConfirmText('');
        setErrorConfirmText('');
        setDialogIsOpenReopen(false);
        openPeriod();

    };
    const closeDialogReopen = () => {
        setConfirmText('');
        setErrorConfirmText('');
        setDialogIsOpenReopen(false);
        toast.warning(t('reopen-toast-cancel'));
    };

    useEffect(() => {
        initData();
    }, []);

    const initData = async () => {
        setIsLoading(true)
        // getPeriodForUnit
        const result = await ApiProcessPeriod(currentUnit.UnitId)
        const resultListUser = await ApiUsersForOpenPeriod(currentUnit.UnitId)
        setIsLoading(false)
        if (result) {
            setValueClosedPeriod(dayjs(result.period_locked, "MMYYYY"))
        }
        if (resultListUser) {
            setValueListUser(resultListUser)
        }
    }

    const openPeriod = async () => {
        setIsLoading(true)
        const body = {
            Month: dateReopenPeriod.format("M"),
            Year: dateReopenPeriod.format("YYYY"),
            UserName: userInfo?.userID_old,
            Currency: "VND",
            UserPermission: valueUser
        }
        const result = await ApiOpenPeriod(currentUnit.UnitId, body)
        setIsLoading(false)
        if (result) {
            toast.success('Mở kỳ thành công');
        }
    }

    OnMultiKeyEvent(() => handleReopenPeriod(), 'r');
    return (
        <Spin size="large" tip={'Loading'} spinning={isLoading}>
            <div className="main">
                <ToastContainer position='bottom-right' stacked />

                {dialogIsOpenReopen && (
                    <AlertDialog
                        title={`${t('reopen-toast-new')}: ${dayjs(dateReopenPeriod).utc(true).format('MM - YYYY')} ?`}
                        content={
                            <>

                                {t('reopen-user')}: {valueUser.map((item) => item).join(', ')}

                                <Box mb={2} mt={2}>
                                    {t('reopen-period-confirm')}
                                </Box>
                                <TextField fullWidth
                                    value={confirmText}
                                    error={errorConfirmText}
                                    helperText={errorConfirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                />



                            </>
                        }
                        onOpen={dialogIsOpenReopen}
                        onClose={closeDialogReopen}
                        onAgree={agreeDialogReopen}
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
                <Box sx={{ width: '100%', typography: 'body' }}>
                    <Grid container spacing={1}>
                        <Grid xs={12} md={12}>
                            <Item>
                                <Grid container spacing={2}>
                                    <Grid xs={5} md={6}>
                                        <Stack
                                            sx={{ height: '100%' }}
                                            alignItems={'flex-end'}
                                            justifyContent={'center'}
                                        >
                                            <h6>{t('close-period')}</h6>
                                        </Stack>
                                    </Grid>
                                    <Grid xs={7} md={6}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ width: '100%' }}>
                                            <DemoContainer components={['DatePicker']} sx={{ paddingTop: 0 }}>
                                                <DatePicker
                                                    views={['month', 'year']}
                                                    value={valueClosedPeriod}
                                                    slotProps={{
                                                        textField: { size: 'small' },
                                                    }}
                                                    formatDensity="spacious"
                                                    format="MM - YYYY"
                                                    disabled
                                                />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid xs={5} md={6}>
                                        <Stack
                                            sx={{ height: '100%' }}
                                            alignItems={'flex-end'}
                                            justifyContent={'center'}
                                        >
                                            <h6>{t('reopen-period')}</h6>
                                        </Stack>
                                    </Grid>
                                    <Grid xs={7} md={6}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ width: '100%' }}>
                                            <DemoContainer components={['DatePicker']} sx={{ paddingTop: 0 }}>
                                                <DatePicker
                                                    // label={'"month" and "year"'}
                                                    views={['month', 'year']}
                                                    value={dateReopenPeriod}
                                                    maxDate={valueClosedPeriod}
                                                    // sx={{ width: 300 }}
                                                    slotProps={{
                                                        textField: { size: 'small' },
                                                    }}
                                                    formatDensity="spacious"
                                                    format="MM/YYYY"
                                                    onChange={(e) => handleChangeReopenPeriod(e)}
                                                />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid xs={5} md={6}>
                                        <Stack
                                            sx={{ height: '100%' }}
                                            alignItems={'flex-end'}
                                            justifyContent={'center'}
                                        >
                                            <h6>{t('reopen-user')}</h6>
                                        </Stack>
                                    </Grid>
                                    <Grid xs={7} md={6}>
                                        <Box
                                            sx={{
                                                width: {
                                                    xs: '100%',
                                                    lg: 263,
                                                    // lg: 400,
                                                },
                                            }}
                                        >
                                            <Select
                                                size="large"
                                                mode="multiple"
                                                // maxCount={3}
                                                value={valueUser}
                                                style={{ width: '100%' }}
                                                onChange={setValueUser}
                                                suffixIcon={suffix}
                                                placeholder="Please select"
                                                options={valueListUser.map((data) => {
                                                    return { value: data, label: data };
                                                })}
                                            />
                                        </Box>

                                    </Grid>

                                    <Grid xs={12} md={12}>
                                        <Stack
                                            direction={'row'}
                                            spacing={2}
                                            justifyContent={'center'}
                                            alignItems={'center'}
                                        >
                                            <LoadingButton
                                                // loading={isLoading}
                                                loadingPosition="start"
                                                variant="contained"
                                                color="info"
                                                startIcon={<LockOpenIcon />}
                                                onClick={handleReopenPeriod}
                                            >
                                                {t('button-reopen')}
                                            </LoadingButton>
                                        </Stack>
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

export default OpenAccountingPeriod;
