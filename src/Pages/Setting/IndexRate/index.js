import { Button, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import * as React from 'react';
import { useEffect, useState } from 'react';
// import Select from '@mui/material/Select';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CreateIcon from '@mui/icons-material/Create';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import LoadingButton from '@mui/lab/LoadingButton';
import Autocomplete from '@mui/material/Autocomplete';
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { InputNumber, Spin } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import * as xlsx from 'xlsx';
import AlertDialog from '~/components/AlertDialog';
import { OnKeyEvent } from '~/components/Event/OnKeyEvent';
import OnMultiKeyEvent from '~/components/Event/OnMultiKeyEvent';
import { store } from '~/Redux/store';
import {
    Create_IndexRate,
    Create_IndexRateDetail,
    Delete_IndexRateDetail,
    fetchListIndexRate,
    Update_IndexRateDetail,
} from './apiIndexRate';

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

function IndexRate({ title }) {
    const [isLoading, setIsLoading] = React.useState(false);
    const { t } = useTranslation();
    const unitcode = localStorage.getItem('Unit');
    const userName = localStorage.getItem('UserName');

    const dataProduct = store.getState().FetchApi.listData_Product;
    const [searchValue, setSearchValue] = useState('');

    const [valueReadonly, setValueReadonly] = React.useState(true);
    const [valueDetail_id, setValueDetail_id] = useState('');
    const [valueProduct_id, setValueProduct_id] = useState('');
    const [valueSearch, setValueSearch] = React.useState('');

    const dataPeriod_From_Redux = useSelector((state) => state.FetchApi.listData_Period.acc_date);
    const dataCostCenter = useSelector((state) =>
        state.FetchApi.listData_CostCenter.filter((data) => data.kind_of_location !== null),
    );
    const [valueDateAccountPeriod, setValueDateAccountPeriod] = React.useState(dayjs(dataPeriod_From_Redux));
    const [valueCostCenter, setValueCostCenter] = React.useState('BS095');

    const handleChangePeriod = (event) => {
        setValueDateAccountPeriod(event);
    };
    const handleChangeCostCenter = (event) => {
        setValueCostCenter(event.target.value);
        const kind_costcenter = dataCostCenter.filter((data) => data.code == event.target.value);
        // setValueKindLocation(kind_costcenter[0].kind_of_location);
    };
    const [valueHet, setValueHet] = React.useState('');
    const handleOnChangeValueHet = (event) => {
        setValueHet(event);
    };

    const [valueIndexRate, setValueIndexRate] = React.useState('');
    const handleOnChangeValueIndexRate = (event) => {
        setValueIndexRate(event);
    };

    const columns = [
        { field: 'PRODUCT_ID', headerName: t('product-id'), width: 150, headerClassName: 'super-app-theme--header' },
        {
            field: 'PRODUCT_NAME',
            headerName: t('product-name'),
            width: 300,
            flex: 1,
            headerClassName: 'super-app-theme--header',
        },
        { field: 'HET', headerName: 'HET', type: 'number', width: 200, headerClassName: 'super-app-theme--header' },
        {
            field: 'INDEX_RATE',
            headerName: 'INDEX RATE',
            type: 'number',
            width: 200,
            headerClassName: 'super-app-theme--header',
        },
    ];

    //! call api lấy danh sách index rate
    const [callApiHeader, setcallApiHeader] = useState(false);
    const [indexRateList, setIndexRateList] = useState([]);
    const [indexRateDetailList, setIndexRateDetailList] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchListIndexRate({
                unitcode: unitcode,
                costcenter: valueCostCenter,
                acc_period_month: valueDateAccountPeriod.month() + 1,
                acc_period_year: valueDateAccountPeriod.year(),
                search: valueSearch,
            });
            if (data) {
                setIndexRateList(data);
                setIndexRateDetailList(data.DETAIL.sort((a, b) => a.PRODUCT_NAME.localeCompare(b.PRODUCT_NAME)));
                if (!data.EFFECT_TO_DATE) {
                    setValueDisableCreateButton(false);
                } else {
                    setValueDisableCreateButton(true);
                }
            }
        };
        fetchData();
    }, [callApiHeader]);

    //! handle click create
    const [valueDisableCreateButton, setValueDisableCreateButton] = React.useState(true);
    const handleClickCreate = (event) => {
        setDialogIsOpenNew(true);
    };
    const [dialogIsOpenNew, setDialogIsOpenNew] = React.useState(false);

    const agreeDialogNew = () => {
        setDialogIsOpenNew(false);
        setCallApiNew(true);
    };
    const closeDialogNew = () => {
        setDialogIsOpenNew(false);
        toast.warning(t('toast-cancel-new'));
    };

    //! call api Tạo mới index rate
    const [callApiNew, setCallApiNew] = React.useState(false);
    useEffect(() => {
        const fetchData = async () => {
            if (callApiNew) {
                const data = await Create_IndexRate({
                    unitcode: unitcode,
                    costcenter: valueCostCenter,
                    acc_period_month: valueDateAccountPeriod.month() + 1,
                    acc_period_year: valueDateAccountPeriod.year(),
                    user: userName,
                });
                if (data) {
                    toast.success(t('toast-success'));
                    setIndexRateList(data);
                    setIndexRateDetailList([]);
                }
            }
        };
        fetchData();
        setCallApiNew(false);
    }, [callApiNew]);

    //! handler click import file
    const handleClickImportFile = (event) => {
        const fileExcel = event.target.files;
        const fileType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];

        if (fileExcel.length === 0) {
            toast.warn(t('toast-nofile'));
            return;
        }

        if (fileExcel && fileType.includes(fileExcel[0].type)) {
            let reader = new FileReader();
            reader.readAsArrayBuffer(fileExcel[0]);

            reader.onload = async (e) => {
                try {
                    const data = e.target.result;
                    const workbook = xlsx.read(data, { type: 'buffer' });
                    const worksheetname = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[worksheetname];
                    const dataExcel = xlsx.utils.sheet_to_json(worksheet, { raw: false });

                    const dataExcelTransfer = dataExcel.map((data) => ({
                        PRODUCT_ID: String(data.PRODUCT_ID),
                        PRODUCT_NAME: data.PRODUCT_NAME || '',
                        HET: Number(data.HET),
                        INDEX_RATE: Number(data.INDEX_RATE),
                    }));

                    // ✅ Gọi API sau khi xử lý xong file
                    const response = await Create_IndexRateDetail({
                        doc_code: indexRateList.DOC_CODE,
                        unitcode: unitcode,
                        user: userName,
                        details: dataExcelTransfer,
                    });

                    if (response) {
                        toast.success(t('toast-success'));
                        // setIndexRateDetailList(response);
                        setcallApiHeader(!callApiHeader);
                    } else {
                        toast.error('Import thất bại!');
                    }
                } catch (err) {
                    console.error('Lỗi đọc file:', err);
                    toast.error('Đọc file Excel thất bại!');
                }
            };
        } else {
            toast.warn(t('toast-fileexcel'));
        }
    };

    const columnsExport = [
        {
            title: 'PRODUCT_ID',
            dataIndex: 'PRODUCT_ID',
            key: 'PRODUCT_ID',
        },
        {
            title: 'PRODUCT_NAME',
            dataIndex: 'PRODUCT_NAME',
            key: 'PRODUCT_NAME',
        },
        {
            title: 'HET',
            // width: 300,
            dataIndex: 'HET',
            key: 'HET',
        },
        {
            title: 'INDEX_RATE',
            // width: 300,
            dataIndex: 'INDEX_RATE',
            key: 'INDEX_RATE',
        },
    ];
    //! export excel
    const handleExportTemplate = () => {
        const data = [...indexRateDetailList];

        const excel = new Excel();
        excel
            .addSheet('Index Rate')
            .addColumns(columnsExport)
            .addDataSource(
                data.sort(function (a, b) {
                    return b.PRODUCT_NAME.localeCompare(a.PRODUCT_NAME);
                }),

                {
                    str2Percent: true,
                },
            )
            .saveAs(`IndexRate_detail_Template.xlsx`);
    };

    //! select row in datagrid
    const onRowsSelectionHandler = (ids) => {
        const selectedRowsData = ids.map((id) => indexRateDetailList.find((row) => row.DETAIL_IDS === id));
        if (selectedRowsData) {
            {
                selectedRowsData.map((key) => {
                    setValueProduct_id(key.PRODUCT_ID);
                    setSearchValue(key.PRODUCT_NAME);
                    setValueHet(key.HET);
                    setValueIndexRate(key.INDEX_RATE);
                    setValueDetail_id(key.DETAIL_IDS);
                });
                setValueReadonly(true);
                setValueDisableSaveButton(true);
                setValueNewButton(false);
                setValueUpdateButton(false);
            }
        }
    };

    /* #region  button new */

    const [valueNewButton, setValueNewButton] = React.useState(false);
    const handleOnClickNew = () => {
        setValueNewButton(true);
        setValueUpdateButton(false);

        setValueProduct_id('');
        setSearchValue('');
        setValueHet(0);
        setValueIndexRate(0);

        setValueReadonly(false);
        setValueDisableSaveButton(false);
    };
    /* #endregion */

    /* #region  button update */
    const [valueUpdateButton, setValueUpdateButton] = React.useState(false);
    const handleOnClickUpdate = () => {
        setValueNewButton(false);
        setValueUpdateButton(true);
        setValueReadonly(false);
        setValueDisableSaveButton(false);
    };
    /* #endregion */

    /* #region  button Delete */
    const handleOnClickDeleteDetail = () => {
        if (!valueProduct_id) {
            toast.warning(t('toast-error'));
            return;
        }
        setDialogIsOpenDeleteDetail(true);
    };
    /* #endregion */

    //! handle click save
    const [valueDisableSaveButton, setValueDisableSaveButton] = React.useState(true);
    const handleClickSave = (event) => {
        if (valueProduct_id) {
            if (valueNewButton) {
                setDialogIsOpenNewDetail(true);
            }
            if (valueUpdateButton) {
                setDialogIsOpenUpdateDetail(true);
            }
        } else {
            toast.error(t('toast-error'));
        }
    };

    //! handle click create detail
    const [dialogIsOpenNewDetail, setDialogIsOpenNewDetail] = React.useState(false);
    const [dialogIsOpenUpdateDetail, setDialogIsOpenUpdateDetail] = React.useState(false);
    const [callApiNewDetail, setCallApiNewDetail] = React.useState(false);
    const [callApiUpdateDetail, setCallApiUpdateDetail] = React.useState(false);

    const agreeDialogNewDetail = () => {
        setDialogIsOpenNewDetail(false);
        setCallApiNewDetail(true);
    };
    const closeDialogNewDetail = () => {
        setDialogIsOpenNewDetail(false);
        toast.warning(t('toast-cancel-new'));
    };
    useEffect(() => {
        setIsLoading(true);

        const fetchData = async () => {
            if (callApiNewDetail) {
                const data = await Create_IndexRateDetail({
                    doc_code: indexRateList.DOC_CODE,
                    unitcode: unitcode,
                    user: userName,
                    details: [
                        {
                            PRODUCT_ID: valueProduct_id,
                            HET: valueHet,
                            INDEX_RATE: valueIndexRate,
                        },
                    ],
                });
                if (data) {
                    toast.success(`${t('toast-new')} ${t('toast-success')}`);
                }
            }
        };
        fetchData();
        setCallApiNewDetail(false);

        setcallApiHeader(!callApiHeader);
        setIsLoading(false);
    }, [callApiNewDetail]);

    //! handle update detaik
    const agreeDialogUpdateDetail = () => {
        setDialogIsOpenUpdateDetail(false);
        setCallApiUpdateDetail(true);
    };
    const closeDialogUpdateDetail = () => {
        setDialogIsOpenUpdateDetail(false);
        toast.warning(t('toast-cancel-update'));
    };
    useEffect(() => {
        setIsLoading(true);

        const fetchData = async () => {
            if (callApiUpdateDetail) {
                const data = await Update_IndexRateDetail({
                    doc_code: indexRateList.DOC_CODE,
                    unitcode: unitcode,
                    user: userName,
                    details: {
                        DETAIL_IDS: valueDetail_id,
                        PRODUCT_ID: valueProduct_id,
                        HET: valueHet,
                        INDEX_RATE: valueIndexRate,
                    },
                });
                if (data) {
                    toast.success(`${t('toast-update')} ${t('toast-success')}`);
                    setValueUpdateButton(false);
                    setValueDisableSaveButton(true);
                    setValueReadonly(true);
                }
            }
        };
        fetchData();
        setCallApiUpdateDetail(false);

        setcallApiHeader(!callApiHeader);
        setIsLoading(false);
    }, [callApiUpdateDetail]);

    //todo: call api delete Detail
    /* #region  call api delete */
    const [dialogIsOpenDeleteDetail, setDialogIsOpenDeleteDetail] = React.useState(false);
    const [callApiDeleteDetail, setCallApiDeleteDetail] = React.useState(false);
    const agreeDialogDeleteDetail = async () => {
        setDialogIsOpenDeleteDetail(false);
        setCallApiDeleteDetail(true);
    };
    const closeDialogDeleteDetail = () => {
        setDialogIsOpenDeleteDetail(false);
        toast.warning(t('toast-cancel-delete'));
    };
    useEffect(() => {
        setIsLoading(true);

        const fetchData = async () => {
            if (callApiDeleteDetail && valueDetail_id) {
                const data = await Delete_IndexRateDetail({
                    doc_code: indexRateList.DOC_CODE,
                    unitcode: unitcode,
                    user: userName,
                    detail_id: valueDetail_id,
                });
                if (data) {
                    toast.success(`${t('toast-delete')} ${t('toast-success')}`);
                    setValueProduct_id('');
                    setSearchValue('');
                    setValueHet(0);
                    setValueIndexRate(0);
                    setValueDetail_id('');
                }
            }
        };
        fetchData();
        setCallApiDeleteDetail(false);

        setcallApiHeader(!callApiHeader);
        setIsLoading(false);
    }, [callApiDeleteDetail]);
    /* #endregion */

    //! on key event
    OnKeyEvent(() => setcallApiHeader(!callApiHeader), 'Enter');
    // OnMultiKeyEvent(() => handleReopenPeriod(), 'r');
    OnMultiKeyEvent(handleOnClickNew, valueNewButton ? '' : 'n');
    OnMultiKeyEvent(handleOnClickUpdate, valueUpdateButton ? '' : 'u');
    OnMultiKeyEvent(handleClickSave, valueDisableSaveButton ? '' : 's');
    OnMultiKeyEvent(handleOnClickDeleteDetail, 'd');
    return (
        <Spin size="large" tip={t('loading')} spinning={isLoading}>
            <ToastContainer position='bottom-right' stacked />
            <div className="main">
                {dialogIsOpenNew && (
                    <AlertDialog
                        title={t('indexrate-toast-new')}
                        content={''}
                        onOpen={dialogIsOpenNew}
                        onClose={closeDialogNew}
                        onAgree={agreeDialogNew}
                    />
                )}
                {dialogIsOpenNewDetail && (
                    <AlertDialog
                        title={`${t('toast-new')} - Index Rate Detail`}
                        content={
                            <>
                                {t('product-id')}: {valueProduct_id}
                                <br /> {t('product-name')}: {searchValue}
                                <br /> HET: {valueHet}
                                <br /> Index Rate: {valueIndexRate}
                            </>
                        }
                        onOpen={dialogIsOpenNewDetail}
                        onClose={closeDialogNewDetail}
                        onAgree={agreeDialogNewDetail}
                    />
                )}
                {dialogIsOpenUpdateDetail && (
                    <AlertDialog
                        title={`${t('toast-update')} - Index Rate Detail`}
                        content={
                            <>
                                {t('product-id')}: {valueProduct_id}
                                <br /> {t('product-name')}: {searchValue}
                                <br /> HET: {valueHet}
                                <br /> Index Rate: {valueIndexRate}
                            </>
                        }
                        onOpen={dialogIsOpenUpdateDetail}
                        onClose={closeDialogUpdateDetail}
                        onAgree={agreeDialogUpdateDetail}
                    />
                )}
                {dialogIsOpenDeleteDetail && (
                    <AlertDialog
                        title={`${t('toast-delete')} - Index Rate Detail`}
                        content={
                            <>
                                {t('product-id')}: {valueProduct_id}
                                <br /> {t('product-name')}: {searchValue}
                                <br /> HET: {valueHet}
                                <br /> Index Rate: {valueIndexRate}
                            </>
                        }
                        onOpen={dialogIsOpenDeleteDetail}
                        onClose={closeDialogDeleteDetail}
                        onAgree={agreeDialogDeleteDetail}
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
                        <Grid xs={12} md={12}>
                            <Item>
                                <Grid container spacing={2}>
                                    <Grid xs={12} md={6}>
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
                                                    onClick={() => setcallApiHeader(!callApiHeader)}
                                                >
                                                    {t('button-search')}
                                                </LoadingButton>
                                            </div>
                                        </Stack>
                                    </Grid>
                                    <Grid xs={12} md={3}>
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
                                    <Grid xs={12} md={3}>
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
                                </Grid>
                            </Item>
                        </Grid>
                        <Grid xs={12} md={12}>
                            <Item>
                                <Stack direction="column" spacing={1}>
                                    {/* Hàng đầu tiên: DOC_CODE + ngày + IconButton */}
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        alignItems="center"
                                        justifyContent="space-between"
                                    >
                                        {/* Bên trái */}
                                        <Stack direction="row" spacing={5} alignItems="center">
                                            <Typography variant="h6">{indexRateList.DOC_CODE}</Typography>
                                            <Typography variant="h6">{indexRateList.KIND_OF_LOCATION}</Typography>

                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Typography variant="h6">
                                                    {t('effect-from')}{' '}
                                                    {dayjs(indexRateList.EFFECT_FROM_DATE).format('DD/MM/YYYY')}
                                                </Typography>
                                                <Typography variant="h6">
                                                    {t('to-date')}{' '}
                                                    {indexRateList.EFFECT_TO_DATE
                                                        ? dayjs(indexRateList.EFFECT_TO_DATE).format('DD/MM/YYYY')
                                                        : 'chưa kết thúc'}
                                                </Typography>
                                            </Stack>
                                        </Stack>

                                        {/* Bên phải - nút đóng */}
                                        <Stack direction="row" spacing={1}>
                                            <Button
                                                startIcon={<FileDownloadIcon />}
                                                variant="contained"
                                                color="success"
                                                onClick={handleExportTemplate}
                                            >
                                                {t('button-export')}
                                            </Button>
                                            <LoadingButton
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
                                                Import Detail
                                                <VisuallyHiddenInput type="file" onChange={handleClickImportFile} />
                                            </LoadingButton>
                                            <Button
                                                startIcon={<CreateIcon />}
                                                variant="contained"
                                                color="success"
                                                onClick={handleClickCreate}
                                                disabled={valueDisableCreateButton}
                                            >
                                                {t('button-create-index')}
                                            </Button>
                                        </Stack>
                                    </Stack>

                                    {/* DataGrid phía dưới */}
                                    <DataGrid
                                        rows={indexRateDetailList}
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
                                        getRowId={(row) => row.DETAIL_IDS}
                                        loading={isLoading}
                                        onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
                                    />
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
                                                <LoadingButton
                                                    startIcon={<DeleteOutlineIcon />}
                                                    variant="contained"
                                                    color="error"
                                                    onClick={handleOnClickDeleteDetail}
                                                >
                                                    {t('button-delete')}
                                                </LoadingButton>
                                            </Stack>
                                        </Stack>
                                    </Grid>

                                    <Grid container xs={12} md={12} spacing={2}>
                                        <Grid xs={12} md={12}>
                                            <Stack direction={'row'} spacing={2}>
                                                <div className="form-title">
                                                    <div>{t('product-id')}</div>
                                                </div>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    size="small"
                                                    placeholder="Product ID"
                                                    disabled
                                                    value={valueProduct_id}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid xs={12} md={12}>
                                            <Stack direction={'row'} spacing={2}>
                                                <div className="form-title">
                                                    <div>{t('product-name')}</div>
                                                </div>

                                                <Autocomplete
                                                    style={{ width: '100%' }}
                                                    disabled={valueReadonly}
                                                    options={
                                                        dataProduct?.filter((item) =>
                                                            item.PRODUCT_NAME.toLowerCase().includes(
                                                                searchValue.toLowerCase(),
                                                            ),
                                                        ) ?? []
                                                    }
                                                    value={
                                                        dataProduct?.find(
                                                            (item) => item.PRODUCT_NAME === searchValue,
                                                        ) || null
                                                    } // 👈 THÊM DÒNG NÀY
                                                    onChange={(event, selectedOption) => {
                                                        setValueProduct_id(selectedOption?.PRODUCT_ID);
                                                    }}
                                                    getOptionLabel={(option) => option.PRODUCT_NAME}
                                                    inputValue={searchValue}
                                                    onInputChange={(event, newInputValue) => {
                                                        setSearchValue(newInputValue);
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Chọn sản phẩm"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                    disableClearable
                                                    ListboxProps={{
                                                        style: {
                                                            maxHeight: 300, // 👈 giới hạn chiều cao danh sách
                                                            overflowY: 'auto',
                                                        },
                                                    }}
                                                />
                                            </Stack>
                                        </Grid>

                                        <Grid xs={12} md={12}>
                                            <Stack direction={'row'} spacing={2}>
                                                <div className="form-title">
                                                    <div>HET</div>
                                                </div>

                                                <InputNumber
                                                    style={{ width: '100%' }}
                                                    status={valueHet ? '' : 'error'}
                                                    size="large"
                                                    formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    parser={(value) => value.replace(/\$-+₫\s?|(,*)/g, '')}
                                                    value={valueHet}
                                                    onChange={(event) => handleOnChangeValueHet(event)}
                                                    disabled={valueReadonly}
                                                    placeholder="0"
                                                />
                                            </Stack>
                                        </Grid>

                                        <Grid xs={12} md={12}>
                                            <Stack direction={'row'} spacing={2}>
                                                <div className="form-title">
                                                    <div>Index Rate</div>
                                                </div>

                                                <InputNumber
                                                    style={{ width: '100%' }}
                                                    status={valueIndexRate ? '' : 'error'}
                                                    size="large"
                                                    formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    parser={(value) => value.replace(/\$-+₫\s?|(,*)/g, '')}
                                                    value={valueIndexRate}
                                                    onChange={(event) => handleOnChangeValueIndexRate(event)}
                                                    disabled={valueReadonly}
                                                    placeholder="0"
                                                />
                                            </Stack>
                                        </Grid>
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

export default IndexRate;
