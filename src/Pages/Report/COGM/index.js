import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import { LoadingButton } from '@mui/lab';
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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Spin } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { Api_PDF_Report_COGM, Api_PDF_Report_COGS, Api_Report_COGM, Api_Report_COGS } from '~/components/Api/Report';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    direction: 'row',
    color: theme.palette.text.secondary,
}));

export default function Report_COGM({ title }) {
    const access_token = useSelector((s) => s.FetchApi.token);
    const [isLoading, setIsLoading] = React.useState(false);
    const { t } = useTranslation();
    const dataPeriod_From_Redux = useSelector((state) => state.FetchApi.listData_Period.acc_date);
    const dataCostCenter = useSelector((state) =>
        state.FetchApi.listData_CostCenter.filter((data) => data.kind_of_location !== null),
    );
    const [valueDateAccountPeriod, setValueDateAccountPeriod] = React.useState(dayjs(dataPeriod_From_Redux));
    const [valueCostCenter, setValueCostCenter] = React.useState('BS048');
    const [valueKindLocation, setValueKindLocation] = React.useState('SH');
    const [valueUrlBase64, setValueUrlBase64] = React.useState('');

    //todo: call api export file
    /* #region  call api export list */
    const [dataListExport, setDataListExport] = useState([]);
    const [buttonExport, setButtonExport] = useState(true);
    const [callApi, setCallApi] = useState(false);

    useEffect(() => {
        if (callApi && valueCostCenter) {
            if (valueKindLocation == 'SH') {
                const process = async () => {
                    setIsLoading(true);
                    setButtonExport(true);
                    const status_code = await Api_PDF_Report_COGS({
                        COSTCENTER: valueCostCenter,
                        PERIOD_MONTH: valueDateAccountPeriod.month() + 1,
                        PERIOD_YEAR: valueDateAccountPeriod.year(),
                        setDataUrlBase64: setValueUrlBase64,
                    });
                    if (!status_code) {
                        toast.warning(t('toast-nodata'));
                    }

                    const status_code_excel = await Api_Report_COGS({
                        COSTCENTER: valueCostCenter,
                        PERIOD_MONTH: valueDateAccountPeriod.month() + 1,
                        PERIOD_YEAR: valueDateAccountPeriod.year(),
                        setDataExport: setDataListExport,
                    });

                    if (status_code_excel) {
                        setButtonExport(false);
                    }
                    setIsLoading(false);
                };
                process();
            }
            if (valueKindLocation == 'CH') {
                const process = async () => {
                    setIsLoading(true);
                    const status_code = await Api_PDF_Report_COGM({
                        COSTCENTER: valueCostCenter,
                        PERIOD_MONTH: valueDateAccountPeriod.month() + 1,
                        PERIOD_YEAR: valueDateAccountPeriod.year(),
                        setDataUrlBase64: setValueUrlBase64,
                    });
                    if (!status_code) {
                        toast.warning(t('toast-nodata'));
                    }

                    setButtonExport(true);
                    const status_code_excel = await Api_Report_COGM({
                        COSTCENTER: valueCostCenter,
                        PERIOD_MONTH: valueDateAccountPeriod.month() + 1,
                        PERIOD_YEAR: valueDateAccountPeriod.year(),
                        setDataExport: setDataListExport,
                    });
                    if (status_code_excel) {
                        setButtonExport(false);
                    }
                    setIsLoading(false);
                };
                process();
            }
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
        const kind_costcenter = dataCostCenter.filter((data) => data.code == event.target.value);
        setValueKindLocation(kind_costcenter[0].kind_of_location);
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
        if (valueKindLocation == 'SH') {
            // const excel = new Excel();
            // excel
            //     .addSheet('COGS')
            //     .addColumns(columnsExport)
            //     .addDataSource(
            //         dataListExport.sort(function (a, b) {
            //             return b.product_id.localeCompare(a.product_id);
            //         }),

            //         {
            //             str2Percent: true,
            //         },
            //     )
            //     .saveAs(`COGS_${valueDateAccountPeriod.format('YYYYMM')}_${dayjs().format('YYYYMMDD')}.xlsx`);
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
                `COGS_${valueDateAccountPeriod.format('YYYYMM')}_${dayjs().format('YYYYMMDD')}.xls`,
                dataListExport,
            );
        }
        if (valueKindLocation == 'CH') {
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
                `COGM_${valueDateAccountPeriod.format('YYYYMM')}_${dayjs().format('YYYYMMDD')}.xls`,
                dataListExport,
            );
        }
    };
    /* #endregion */

    return (
        <Spin size="large" tip={t('loading')} spinning={isLoading}>
            <div className="main">
                <ToastContainer />
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
                                    <Grid item xs={12} md={4}>
                                        <Stack
                                            direction={{ xs: 'column', sm: 'row' }}
                                            spacing={2}
                                            alignItems="center"
                                            justifyContent="space-evenly"
                                            flexWrap="wrap"
                                        >
                                            <LoadingButton
                                                startIcon={<SearchIcon />}
                                                variant="contained"
                                                color="info"
                                                onClick={handleViewReport}
                                                loadingPosition="start"
                                                sx={{ whiteSpace: 'nowrap', width: { xs: '100%', sm: 'auto' } }}
                                            >
                                                {t('button-view-report')}
                                            </LoadingButton>

                                            <LoadingButton
                                                startIcon={<FileDownloadIcon />}
                                                variant="contained"
                                                color="success"
                                                onClick={handleClickExport}
                                                loading={buttonExport}
                                                loadingPosition="start"
                                                sx={{ whiteSpace: 'nowrap', width: { xs: '100%', sm: 'auto' } }}
                                            >
                                                {t('button-export')}
                                            </LoadingButton>
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
