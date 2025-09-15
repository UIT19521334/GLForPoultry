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
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ReportViewer from '~/Pages/Report/report-viewer';
import { useTranslation } from 'react-i18next';
import { LoadingButton } from '@mui/lab';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Excel } from 'antd-table-saveas-excel';
import {
    Api_Export_COGS_Meat,
    Api_PDF_Report_COGM,
    Api_PDF_Report_COGS,
    Api_PDF_Report_COGS_Meat,
    Api_Report_COGM,
    Api_Report_COGS,
} from '~/components/Api/Report';
import { useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import { toast, ToastContainer } from 'react-toastify';
import { Spin } from 'antd';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    direction: 'row',
    color: theme.palette.text.secondary,
}));

export default function Report_COGS_Meat({ title }) {
    const access_token = useSelector((s) => s.FetchApi.token);
    const [isLoading, setIsLoading] = React.useState(false);
    const { t } = useTranslation();
    const dataPeriod_From_Redux = useSelector((state) => state.FetchApi.listData_Period.acc_date);
    const dataCostCenter = useSelector((state) =>
        state.FetchApi.listData_CostCenter.filter((data) => data.kind_of_location === 'CH'),
    );
    const [valueDateAccountPeriod, setValueDateAccountPeriod] = React.useState(dayjs(dataPeriod_From_Redux));
    const [valueCostCenter, setValueCostCenter] = React.useState('BS009');
    const [valueUrlBase64, setValueUrlBase64] = React.useState('');

    //todo: call api export file
    /* #region  call api export list */
    const [dataListExport, setDataListExport] = useState([]);
    const [buttonExport, setButtonExport] = useState(true);
    const [callApi, setCallApi] = useState(false);
    useEffect(() => {
        if (callApi && valueCostCenter) {
            const process = async () => {
                setIsLoading(true);
                setButtonExport(true);
                const status_code = await Api_Export_COGS_Meat({
                    COSTCENTER: valueCostCenter,
                    PERIOD_MONTH: valueDateAccountPeriod.month() + 1,
                    PERIOD_YEAR: valueDateAccountPeriod.year(),
                    setDataExport: setDataListExport,
                });
                if (status_code) {
                    setButtonExport(false);
                }
                setIsLoading(false);
            };
            process();
            setCallApi(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callApi]);
    useEffect(() => {
        if (callApi && valueCostCenter) {
            const process = async () => {
                setIsLoading(true);
                const status_code = await Api_PDF_Report_COGS_Meat({
                    COSTCENTER: valueCostCenter,
                    PERIOD_MONTH: valueDateAccountPeriod.month() + 1,
                    PERIOD_YEAR: valueDateAccountPeriod.year(),
                    setDataUrlBase64: setValueUrlBase64,
                });
                if (!status_code) {
                    toast.warning(t('toast-nodata'));
                }
                setIsLoading(false);
            };
            process();
        }
        setCallApi(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callApi]);
    const handleViewReport = (event) => {
        setCallApi(true);
    };

    const handleChangePeriod = (event) => {
        setValueDateAccountPeriod(event);
    };
    const handleChangeCostCenter = (event) => {
        setValueCostCenter(event.target.value);
    };

    const columnsExport = [
        {
            title: 'Results',
            dataIndex: 'product_name',
            key: 'product_name',
        },
        {
            title: 'Kg',
            dataIndex: 'weight_after_prcessing',
            key: 'weight_after_prcessing',
        },
        {
            title: 'Yield',
            // width: 300,
            dataIndex: 'yield_display',
            key: 'yield_display',
        },
        {
            title: 'HET',
            dataIndex: 'HET',
            key: 'HET',
        },
        {
            title: 'Basic Count',
            dataIndex: 'basic_count',
            key: 'basic_count',
        },
        {
            title: 'Material',
            dataIndex: 'material_val',
            key: 'material_val',
        },
        {
            title: 'Direct Labor',
            dataIndex: 'direct_labor',
            key: 'direct_labor',
        },
        {
            title: 'Processing Fee',
            dataIndex: 'processing_fee',
            key: 'processing_fee',
        },
        {
            title: 'Transportation',
            // width: 300,
            dataIndex: 'transportation',
            key: 'transportation',
        },
        {
            title: 'Insurance',
            dataIndex: 'insurance',
            key: 'insurance',
        },
        {
            title: 'FOH',
            dataIndex: 'FOH',
            key: 'FOH',
        },
        {
            title: 'Total Cost',
            dataIndex: 'total_cost',
            key: 'total_cost',
        },
        {
            title: 'VND/KG',
            dataIndex: 'cogs_value',
            key: 'cogs_value',
        },
    ];

    //! handler click export file
    const handleClickExport = () => {
        function download(filename, data) {
            var link = document.createElement('a');
            link.href =
                'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' +
                encodeURIComponent(data);
            link.setAttribute('download', filename);

            link.style.display = 'none';
            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
        }
        download(
            `COGS_Meat_${valueDateAccountPeriod.format('YYYYMM')}_${dayjs().format('YYYYMMDD')}.xls`,
            dataListExport,
        );
    };
    /* #endregion */

    return (
        <Spin size="large" tip={t('loading')} spinning={isLoading}>
            <div className="main">
                <ToastContainer position='bottom-right' stacked />
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
                                                        <MenuItem key={data.code} value={data.code}>
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
                                            <div>
                                                <LoadingButton
                                                    startIcon={<FileDownloadIcon />}
                                                    variant="contained"
                                                    color="success"
                                                    onClick={handleClickExport}
                                                    loading={buttonExport}
                                                    loadingPosition="start"
                                                    sx={{ whiteSpace: 'nowrap' }}
                                                >
                                                    {t('button-export')}
                                                </LoadingButton>
                                            </div>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Item>
                        </Grid>
                        <Grid xs={12} md={12}>
                            {valueUrlBase64 && (
                                <embed
                                    src={'data:application/pdf;base64,' + valueUrlBase64}
                                    style={{
                                        border: '1px solid rgba(0, 0, 0, 0.3)',
                                        width: '100%',
                                        height: '80vh',
                                    }}
                                />
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </Spin>
    );
}
