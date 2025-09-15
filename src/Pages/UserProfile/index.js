import React from 'react';
import dayjs from 'dayjs';
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
import { ApiOpenPeriod, ApiReopenPeriod } from '~/components/Api/OpenAccountingPeriod';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import Autocomplete from '@mui/material/Autocomplete';
import { Spin } from 'antd';
import { fetchPeriod } from '~/Redux/FetchApi/fetchApiMaster';
import { useTranslation } from 'react-i18next';
import { OnKeyEvent } from '~/components/Event/OnKeyEvent';
import OnMultiKeyEvent from '~/components/Event/OnMultiKeyEvent';
import { DownOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import ReactNiceAvatar, { genConfig } from 'react-nice-avatar';
import { Divider } from '@mui/material';
import { useMsal } from '@azure/msal-react';

const ItemAva = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    // textAlign: 'center',
    direction: 'row',
    color: theme.palette.text.secondary,
}));
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    direction: 'row',
    color: theme.palette.text.secondary,
}));

function UserProfile({ title }) {
    const [isLoading, setIsLoading] = React.useState(false);
    var dispatch = useDispatch();
    const { t } = useTranslation();
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();

    const userName = activeAccount.name.split('(');

    const avaConfig = genConfig();

    //! get data from redux
    const access_token = useSelector((state) => state.FetchApi.token);
    const dataPeriod_From_Redux = useSelector((state) => state.FetchApi.listData_Period.acc_date);
    const unitcode = useSelector((state) => state.Actions.unitcode);
    const listUser = useSelector((state) => state.FetchApi.listData_User);
    const [valueUser, setValueUser] = React.useState([]);
    const [dateReopenPeriod, setDateReopenPeriod] = React.useState(null);

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
        setDialogIsOpenReopen(false);
        setCallApiOpenReopen(true);
    };
    const closeDialogReopen = () => {
        setDialogIsOpenReopen(false);
        toast.warning(t('reopen-toast-cancel'));
    };

    //todo: call api reopen period
    useEffect(() => {
        const fetchApiReopen = async () => {
            if (callApiOpenReopen) {
                setIsLoading(true);
                const statusCode = await ApiReopenPeriod(access_token, dateReopenPeriod, valueUser);
                if (statusCode) {
                    dispatch(fetchPeriod(unitcode));
                    setDateReopenPeriod(null);
                }
                setIsLoading(false);
            }
            setCallApiOpenReopen(false);
        };
        fetchApiReopen();
    }, [callApiOpenReopen]);

    //! on key event
    OnMultiKeyEvent(() => handleReopenPeriod(), 'r');
    return (
        <Spin size="large" tip={'Loading'} spinning={isLoading}>
            <div className="main">
                <ToastContainer position='bottom-right' stacked />

                {dialogIsOpenReopen && (
                    <AlertDialog
                        title={t('reopen-toast-new')}
                        content={
                            <>
                                {t('reopen-toast-new')}: {dayjs(dateReopenPeriod).utc(true).format('MM - YYYY')}
                                <br /> {t('reopen-user')}: {valueUser}
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

                <Box sx={{ width: '100%' }}>
                    <ItemAva>
                        <ReactNiceAvatar style={{ width: '10rem', height: '10rem' }} {...avaConfig} />
                    </ItemAva>
                    <Item>
                        <Grid container spacing={0.1}>
                            <Grid xs={12} md={12}>
                                <Divider variant="middle" flexItem>
                                    <h6>Name</h6>
                                </Divider>
                            </Grid>
                            <Grid xs={12} md={12} marginBottom={2}>
                                <h5>{userName[0]}</h5>
                            </Grid>

                            <Grid xs={12} md={12}>
                                <Divider variant="middle" flexItem>
                                    <h6>Title</h6>
                                </Divider>
                            </Grid>
                            <Grid xs={12} md={12} marginBottom={2}>
                                <h5>{`(${userName[1]}`}</h5>
                            </Grid>

                            <Grid xs={12} md={12}>
                                <Divider variant="middle" flexItem>
                                    <h6>Email</h6>
                                </Divider>
                            </Grid>
                            <Grid xs={12} md={12} marginBottom={2}>
                                <h5>{activeAccount.username}</h5>
                            </Grid>

                            <Grid xs={12} md={12}>
                                <Divider variant="middle" flexItem>
                                    <h6>Role</h6>
                                </Divider>
                            </Grid>
                            <Grid xs={12} md={12} marginBottom={2}>
                                <h5>{activeAccount.username}</h5>
                            </Grid>
                        </Grid>
                    </Item>
                </Box>
            </div>
        </Spin>
    );
}

export default UserProfile;
