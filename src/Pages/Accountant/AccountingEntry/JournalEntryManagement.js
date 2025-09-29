import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import { DataGrid, GridActionsCellItem, GridDeleteIcon } from '@mui/x-data-grid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AlertDialog from '~/components/AlertDialog';
import LoadingButton from '@mui/lab/LoadingButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SearchIcon from '@mui/icons-material/Search';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { ApiCreateAccount, ApiDeleteAccount, ApiListAccountByUnit, ApiUpdateAccount } from '~/components/Api/Account';
import SaveIcon from '@mui/icons-material/Save';
import '../../../Container.css';
import TextField from '@mui/material/TextField';
import { OnMultiKeyEvent } from '~/components/Event/OnMultiKeyEvent';
import { Input, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Button, FormControl, FormLabel, MenuItem, Select } from '@mui/material';
import { CloudUpload, Delete, PostAdd } from '@mui/icons-material';
import { fetchApiListAccountGroup } from '~/Redux/FetchApi/fetchApiMaster';

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

function JournalEntryManagement() {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = React.useState(false);
	const [reloadListAccount, setReloadListAccount] = React.useState(false);
	const [dataList, setDataList] = useState([]);
	const [displayData, setDisplayData] = useState([]);
	const username = useSelector((state) => state.FetchApi.userInfo?.userID_old);
	const dataListAccountGroup = useSelector((state) => state.FetchApi.listData_AccountGroup);
	const dataListAccount = useSelector((state) => state.FetchApi.listData_Account);
	const dataListCostCenter = useSelector((s) => s.FetchApi.listData_CostCenter);
	const dataListCurrency = useSelector((state) => state.FetchApi.listData_Currency);
	const token = useSelector((state) => state.FetchApi.token);

	//! columns header
	const columns = [
		{
			field: 'AccountId',
			headerName: t('entry-code'),
			minWidth: 150,
			headerClassName: 'super-app-theme--header',
		},
		{
			field: 'CreatedAt',
			headerName: t('entry-posting-date'),
			minWidth: 150,
			headerClassName: 'super-app-theme--header',
		},
		{
			field: 'AccountId',
			headerName: t('account-group'),
			minWidth: 150,
			headerClassName: 'super-app-theme--header',
		},
		{
			field: 'Description',
			headerName: t('description'),
			minWidth: 300,
			flex: 1,
			headerClassName: 'super-app-theme--header',
		},
		{
			field: 'AccountId',
			headerName: t('entry-import-code'),
			minWidth: 150,
			headerClassName: 'super-app-theme--header',
		}
	];

	// columns details
	const columnsDataDetail = [
		{
			field: 'actions',
			type: 'actions',
			headerName: t('actions'),
			width: 80,
			cellClassName: 'actions',
			headerClassName: 'super-app-theme--header',
			getActions: ({ id }) => {
				return [
					<GridActionsCellItem
						key={id}
						icon={<Delete />}
						label="Delete"
						onClick={handleDeleteClickDetail(id)}
						color="inherit"
					/>,
				];
			},
		},
		{
			field: 'id',
			headerName: t('no'),
			width: 50,
			headerClassName: 'super-app-theme--header',
		},

		{
			field: 'cost_center',
			headerName: t('cost-center'),
			width: 150,
			// editable: valueEditGrid,
			type: 'singleSelect',
			getOptionValue: (value) => value.code,
			getOptionLabel: (value) => value.name,
			valueOptions: dataListCostCenter,
			headerAlign: 'center',
			headerClassName: 'super-app-theme--header',
		},
		{
			field: 'acc_code',
			headerName: t('account-code'),
			width: 200,
			// editable: valueEditGrid,
			type: 'singleSelect',
			getOptionValue: (value) => value.account_code,
			getOptionLabel: (value) => `${value.account_code_display} - ${value.account_name}`,
			valueOptions: dataListAccount,
			PaperProps: {
				sx: { maxHeight: 200 },
			},
			headerClassName: 'super-app-theme--header',
		},

		{
			field: 'debit_amount',
			headerName: t('debit'),
			width: 150,
			// editable: valueEditGrid,
			type: 'number',
			headerAlign: 'center',
			headerClassName: 'super-app-theme--header',
			// valueFormatter: (params) => dayjs(params.value).format('DD/ MM/ YYYY'),
		},
		{
			field: 'credit_amount',
			headerName: t('credit'),
			width: 150,
			// editable: valueEditGrid,
			type: 'number',
			headerAlign: 'center',
			headerClassName: 'super-app-theme--header',
			// valueFormatter: (params) => dayjs(params.value).format('DD/ MM/ YYYY'),
		},
		{
			field: 'description',
			headerName: t('description'),
			minWidth: 400,
			// editable: valueEditGrid,
			flex: 1,
			headerClassName: 'super-app-theme--header',
		},
	];

	const [valueDateAccountPeriod, setValueDateAccountPeriod] = React.useState(dayjs());
	const [buttonSelectMode, setButtonSelectMode] = React.useState(false);
	const inputAccountIdRef = useRef(null);

	/* #region  handle value */
	const [valueCode, setValueCode] = useState('');
	const [valueUser, setValueUser] = useState('');
	const [valueDescription, setValueDescription] = useState('');
	const [valueDocsDate, setValueDocsDate] = useState(dayjs());
	const [valueDate, setValueDate] = useState(dayjs());
	const [valueTotalDebit, setValueTotalDebit] = useState(0);
	const [valueTotalCredit, setValueTotalCredit] = useState(0);
	const [valueAccountGroupId, setValueAccountGroupId] = useState();
	const [valueCurrencyId, setValueCurrencyId] = useState();
	const [dataListAccountEntryDetail, setDataListAccountEntryDetail] = useState([]);
	const handleChangeValueCode = (event) => {
		setValueCode(event.target.value);
	};
	const handleChangeValueUser = (event) => {
		setValueUser(event.target.value);
	};
	const handleChangeValueDescription = (event) => {
		setValueDescription(event.target.value);
	};
	const handleChangeValueDocsDate = (event) => {
		setValueDocsDate(event);
	};
	const handleChangeValueDate = (event) => {
		setValueDate(event);
	};
	const handleChangeCurrency = (event) => {
		setValueCurrencyId(event.target.value);
	};
	const handleChangeAccountGroup = (event) => {
		setValueAccountGroupId(event.target.value);
	};

	/* #endregion */

	// TODO call api get data account group
	useEffect(() => {
		const fetchApiGetDataAccount = async () => {
			setIsLoading(true);
			const body = {
				IncludeUnit: false,
				Units: []
			}
			const result = await ApiListAccountByUnit(body);
			dispatch(fetchApiListAccountGroup(token))
			setDataList(result);
			setDisplayData(result);
			setIsLoading(false);
		};
		fetchApiGetDataAccount();
	}, [reloadListAccount]);

	const handleChangeDateAccountPeriod = (event) => {
		setValueDateAccountPeriod(event);
	};

	const handleReloadListAccount = () => {
		setReloadListAccount(!reloadListAccount)
	}

	// Handle search
	const [valueSearch, setValueSearch] = React.useState('');
	const handleSearch = () => {
		let filteredData = dataList;
		if (valueSearch && valueSearch.trim() !== "") {
			const fieldsToSearch = ["AccountName", "AccountId"];
			filteredData = _.filter(dataList, (item) => {
				const search = _.toLower(valueSearch);
				return _.some(fieldsToSearch, (field) => _.includes(_.toLower(item[field]), search));
			});
		}
		setDisplayData(filteredData);
	}

	//! handle click import file
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

	useEffect(() => {
		const apiImportFile = async () => {
			// await ApiImportAccountEntry(fileExcel);
			setFileExcell('');
			handleReloadListAccount();
		};
		apiImportFile();
	}, [callApiImportFile]);

	const handleClickImportFile = () => {
		let fileType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
		if (fileExcel.length === 0) {
			toast.warning(t('toast-nofile'));
		} else {
			if (fileExcel && fileType.includes(fileExcel[0].type)) {
				setDialogIsOpenImportFile(true);
			} else {
				setFileExcell([]);
				toast.warning(t('toast-fileexcel'));
			}
		}
	};


	//! select row in datagrid
	const onRowsSelectionHandler = (ids) => {
		const selectedRowsData = ids.map((id) => displayData.find((row) => row.AccountId === id));
		if (selectedRowsData) {
			{
				selectedRowsData.map((key) => {
					setValueCode(key.AccountId ?? "XXXX");
					setValueDocsDate(dayjs(key.CreatedAt));
					setValueDescription(key.Description ?? '');
					setValueDate(dayjs(key.UpdateAt));
					setValueUser(key.Username ?? 'IT TEST');
					setValueAccountGroupId(key.ExpenseId ?? '');
					setValueCurrencyId(key.MethodId ?? '');
					setValueTotalDebit(23984);
					setValueTotalCredit(10000);
					setValueNewButton(false);
					setValueUpdateButton(false);
					setValueDisableSaveButton(true);
					setValueReadonly(true);
					setValueReadonlyPostingDate(true);
					setValueEditGrid(false);
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
		asyncApiCreateAccount();
	};
	const closeDialogNew = () => {
		setDialogIsOpenNew(false);
		toast.warning(t('toast-cancel-new'));
	};

	const asyncApiCreateAccount = async () => {
		setIsLoading(true);
		const body = {}
		// const statusCode = await ApiCreateAccount(body);
		const statusCode = true;
		if (statusCode) {
			setValueCode('');
			setValueDocsDate(dayjs());
			setValueDate(dayjs());
			setValueUser(username);
			setValueDescription('');
			setValueAccountGroupId('');
			setValueTotalDebit(0);
			setValueTotalCredit(0);
			setValueNewButton(false);
			setValueDisableSaveButton(true);
			setDataListAccountEntryDetail([]);
			setValueReadonly(true);
			setValueReadonlyPostingDate(true);
			setValueEditGrid(false);
		}
		setIsLoading(false);
		setReloadListAccount(!reloadListAccount);
	};
	/* #endregion */

	// TODO call api update
	/* #region  call api update */
	const agreeDialogUpdate = () => {
		setDialogIsOpenUpdate(false);
		asyncApiUpdateAccount();
	};
	const closeDialogUpdate = () => {
		setDialogIsOpenUpdate(false);
		toast.warning(t('toast-cancel-update'));
	};

	const asyncApiUpdateAccount = async () => {
		setIsLoading(true);
		const body = {}
		// const statusCode = await ApiUpdateAccount(body);
		const statusCode = true;

		if (statusCode) {
			setValueReadonly(true);
			setValueUpdateButton(false);
			setValueDisableSaveButton(true);
			setValueDisableDeleteButton(true);
		}
		setIsLoading(false);
		setReloadListAccount(!reloadListAccount);
	};

	/* #endregion */

	// TODO call api delete
	/* #region  call api delete */
	const agreeDialogDelete = () => {
		setDialogIsOpenDelete(false);
		asyncApiDeleteAccount();
	};
	const closeDialogDelete = () => {
		setDialogIsOpenDelete(false);
		toast.warning(t('toast-cancel-delete'));
	};

	const asyncApiDeleteAccount = async () => {
		setIsLoading(true);
		// const statusCode = await ApiDeleteAccount(valueId);
		const statusCode = true;
		if (statusCode) {
			setValueCode('');
			setValueDocsDate(dayjs());
			setValueDate(dayjs());
			setValueUser(username);
			setValueDescription('');
			setValueAccountGroupId('');
			setValueTotalDebit(0);
			setValueTotalCredit(0);
			setValueNewButton(false);
			setValueDisableSaveButton(true);
			setDataListAccountEntryDetail([]);
			setValueReadonly(true);
			setValueReadonlyPostingDate(true);
			setValueEditGrid(false);
		}
		setIsLoading(false);
		setReloadListAccount(!reloadListAccount);
	};

	/* #endregion */

	const [valueReadonly, setValueReadonly] = React.useState(true);
	const [valueReadonlyPostingDate, setValueReadonlyPostingDate] = React.useState(true);
	const [valueReadonlyCode, setValueReadonlyCode] = React.useState(true);
	const [valueEditGrid, setValueEditGrid] = React.useState(false);

	//! visibility column in datagrid
	const columnVisibilityModel = React.useMemo(() => {
		if (valueEditGrid) {
			return {
				actions: true,
			};
		}
		return {
			actions: false,
		};
	}, [valueEditGrid]);

	/* #region  button new */

	const [valueNewButton, setValueNewButton] = React.useState(false);
	const handleClickNew = () => {
		setValueCode('');
		setValueDocsDate(dayjs());
		setValueDate(dayjs());
		setValueUser(username);
		setValueDescription('');
		setValueAccountGroupId('');
		setValueTotalDebit(0);
		setValueTotalCredit(0);
		setValueNewButton(false);
		setValueDisableSaveButton(true);
		setDataListAccountEntryDetail([]);
		setValueReadonly(false);
		setValueReadonlyPostingDate(true);
		setValueEditGrid(false);
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
		if (inputAccountIdRef.current) {
			setTimeout(() => {
				inputAccountIdRef.current.focus();
			}, 0);
		}
	};
	/* #endregion */

	/* #region  button save */
	const [valueDisableSaveButton, setValueDisableSaveButton] = React.useState(true);
	const handleClickSave = () => {
		if (!valueCode) {
			toast.error(t('account-valid-empty'));
			return;
		}
		if (valueCode.length != 9) {
			toast.error(t('account-valid-length'));
			return;
		}
		if (valueNewButton) {
			setDialogIsOpenNew(true);
		}
		if (valueUpdateButton) {
			setDialogIsOpenUpdate(true);
		}
	};
	/* #endregion */

	/* #region  button delete */
	const [valueDisableDeleteButton, setValueDisableDeleteButton] = React.useState(true);
	const handleClickDelete = async () => {
		setDialogIsOpenDelete(true);
	};
	/* #endregion */

	//! handle click delete detail
	const handleDeleteClickDetail = (id) => () => {
		const item = dataListAccountEntryDetail.find((row) => row.detail_ids === id);

		if (!item) return; // Không tìm thấy item

		if (item.is_new_item) {
			// Nếu là item mới chưa lưu -> xóa khỏi danh sách
			setDataListAccountEntryDetail(dataListAccountEntryDetail.filter((row) => row.detail_ids !== id));
		} else {
			// Nếu là item đã lưu -> gắn cờ is_delete_item
			const updatedRow = { ...item, is_delete_item: true };
			setDataListAccountEntryDetail(
				dataListAccountEntryDetail.map((row) => (row.detail_ids === id ? updatedRow : row)),
			);
		}
	};

	const [isNew, setIsNew] = React.useState(false);
	const [dataUpdate, setDataUpdate] = React.useState([]);
	const [openDialogDetail, setOpenDialogDetail] = React.useState(false);
	const handleClickOpenDialogDetail = (isnew) => {
		setOpenDialogDetail(true);
		setIsNew(isnew);
		setValueDisableSaveButton(true);
	};

	const handleCloseDialogDetail = () => {
		setOpenDialogDetail(false);
		setValueDisableSaveButton(false);
	};

	//! on key event
	// OnKeyEvent(() => setReloadListAccount(!reloadListAccount), 'Enter');
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
			justifygroupid={'space-between'}
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
				{dialogIsOpenImportFile && (
					<AlertDialog
						title={t('entry-toast-upload')}
						content={<> Name: {fileExcel ? fileExcel[0].name : ''}</>}
						onOpen={dialogIsOpenImportFile}
						onClose={closeDialogImportFile}
						onAgree={agreeDialogImportFile}
					/>
				)}
				{dialogIsOpenNew && (
					<AlertDialog
						title={t('entry-toast-new')}
						content={
							<>
								{t('entry-code')}: {valueCode}
								<br /> {t('description')}: {valueDescription}
								<br /> {t('currency')}: {valueCurrencyId}
								<br /> {t('account-group')}: {valueAccountGroupId}
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
								{t('entry-code')}: {valueCode}
								<br /> {t('description')}: {valueDescription}
								<br /> {t('currency')}: {valueCurrencyId}
								<br /> {t('account-group')}: {valueAccountGroupId}
							</>
						}
						onOpen={dialogIsOpenUpdate}
						onClose={closeDialogUpdate}
						onAgree={agreeDialogUpdate}
					/>
				)}
				{dialogIsOpenDelete && (
					<AlertDialog
						title={t('account-toast-delete')}
						content={
							<>
								{t('entry-code')}: {valueCode}
								<br /> {t('description')}: {valueDescription}
								<br /> {t('currency')}: {valueCurrencyId}
								<br /> {t('account-group')}: {valueAccountGroupId}
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
											<FormLabel sx={{ whiteSpace: 'nowrap', mr: 1 }}>
												{t('entry-period')}
											</FormLabel>

											<LocalizationProvider dateAdapter={AdapterDayjs}>
												<DatePicker
													views={['month', 'year']}
													sx={{ width: '100%', flex: 3 }}
													value={valueDateAccountPeriod}
													slotProps={{
														textField: {
															size: 'small',
														},

													}}
													formatDensity="spacious"
													format="MM-YYYY"
													onChange={(e) =>
														handleChangeDateAccountPeriod(e)
													}
												/>
											</LocalizationProvider>

										</Stack>
									</Grid>

									<Grid xs={12} md={8}>
										<Stack
											direction={'row'}
											spacing={2}
											alignItems={'center'}
											justifyContent={'flex-start'}
										>
											<TextField
												variant="outlined"
												fullWidth
												label={t('button-search')}
												size="small"
												value={valueSearch}
												onChange={(event) => setValueSearch(event.target.value)}
												onKeyDown={(event) => {
													if (event.key === 'Enter') {
														handleSearch();
													}
												}}
											/>

											<LoadingButton
												startIcon={<SearchIcon />}
												variant="contained"
												color="warning"
												onClick={() =>
													setReloadListAccount(
														!reloadListAccount,
													)
												}
												sx={{ whiteSpace: 'nowrap' }}
											>
												{t('button-search')}
											</LoadingButton>

										</Stack>
									</Grid>
								</Grid>
							</Item>
						</Grid>

						<Grid xs={12} md={12}>
							<Item>
								<Stack spacing={0}>
									<Grid xs={12} md={12}>
										<Stack
											width={'100%'}
											direction={'row'}
											spacing={2}
											alignItems={'center'}
											justifyContent={'flex-start'}
											height={50}
										>
											<>
												<h5
													style={{
														fontWeight: 'bold',
													}}
												>
													{t('entry-title-list')}
												</h5>
											</>

											<Button
												size="small"
												component="label"
												role={undefined}
												variant="outlined"
												onClick={() => setButtonSelectMode(!buttonSelectMode)}
											>
												{t('button-select-mode')}
											</Button>
											<Stack
												direction={'row'}
												spacing={1}
												sx={{ display: { xs: 'none', md: 'flex' } }}
											>
												<Button
													component="label"
													role={undefined}
													variant="outlined"
													tabIndex={-1}
													startIcon={<PostAdd />}
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
													<VisuallyHiddenInput
														type="file"
														onChange={handleClickChoseFile}
													/>
												</Button>
												<Button
													component="label"
													role={undefined}
													variant="contained"
													tabIndex={-1}
													startIcon={<CloudUpload />}
													onClick={handleClickImportFile}
												>
													{t('button-upload')}
												</Button>
											</Stack>
										</Stack>
									</Grid>
									<div style={{ width: '100%' }}>
										<DataGrid
											rows={displayData}
											columns={columns}
											getRowId={(row) => row.AccountId}
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
										justifygroupid={'flex-end'}
										height={50}
									>
										<h5
											style={{
												fontWeight: 'bold',
												textAlign: 'left',
												width: '100%',
											}}
										>
											{t('entry-title-infor')}
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
								<Grid xs={12} md={12} sx={{ width: '100%' }}>
									<Item>
										<Grid container xs={12} md={12} spacing={1}>
											<Grid xs={12} md={6}>
												<Stack
													direction={'row'}
													spacing={2}
													alignItems={'center'}
													justifyContent={'flex-start'}
												>
													<h6 style={{ width: '40%' }}>
														{t('entry-code')}
													</h6>
													<Input
														variant="outlined"
														fullWidth
														size="large"
														placeholder="xxxxxxxxx"
														value={valueCode}
														onChange={handleChangeValueCode}
														disabled
													/>
												</Stack>
											</Grid>

											<Grid xs={12} md={6}>
												<Stack
													direction={'row'}
													spacing={2}
													alignItems={'center'}
													justifyContent={'flex-start'}
												>
													<h6 style={{ width: '40%' }}>
														{t('entry-posting-date')}
													</h6>
													<div style={{ width: '100%' }}>
														<LocalizationProvider
															dateAdapter={AdapterDayjs}
														>
															<DatePicker
																value={valueDocsDate}
																sx={{ width: '100%' }}
																slotProps={{
																	textField: { size: 'small' },
																}}
																formatDensity="spacious"
																format="DD-MM-YYYY"
																onChange={(e) =>
																	handleChangeValueDocsDate(e)
																}
																disabled={valueReadonly}
															/>
														</LocalizationProvider>
													</div>
												</Stack>
											</Grid>

											<Grid xs={12} md={6}>
												<Stack
													direction={'row'}
													spacing={2}
													alignItems={'center'}
													justifyContent={'flex-start'}
												>
													<h6 style={{ width: '40%' }}>
														{t('entry-user')}
													</h6>
													<Input
														variant="outlined"
														fullWidth
														size="large"
														placeholder="name..."
														value={valueUser}
														onChange={handleChangeValueUser}
														disabled
													/>
												</Stack>
											</Grid>

											<Grid xs={12} md={6}>
												<Stack
													direction={'row'}
													spacing={2}
													alignItems={'center'}
													justifyContent={'flex-start'}
												>
													<h6 style={{ width: '40%' }}>
														{t('entry-date')}
													</h6>
													<div style={{ width: '100%' }}>
														<LocalizationProvider
															dateAdapter={AdapterDayjs}
														>
															<DatePicker
																// label={'"month" and "year"'}
																// views={['month', 'year']}
																value={valueDate}
																sx={{ width: '100%' }}
																slotProps={{
																	textField: { size: 'small' },
																}}
																formatDensity="spacious"
																format="DD-MM-YYYY"
																onChange={(e) =>
																	handleChangeValueDate(e)
																}
																disabled
															/>
														</LocalizationProvider>
													</div>
												</Stack>
											</Grid>
											<Grid xs={12} md={6}>
												<Stack
													direction={'row'}
													spacing={2}
													alignItems={'center'}
													justifyContent={'flex-start'}
												>
													<h6 style={{ width: '40%' }}>
														{t('description')}
													</h6>
													<Input.TextArea
														size="large"
														maxLength={250}
														rows={3}
														placeholder="..."
														value={valueDescription}
														onChange={handleChangeValueDescription}
														disabled={valueReadonly}
													/>
												</Stack>
											</Grid>
											<Grid xs={12} md={6}>
												<Stack spacing={1}>
													<Stack
														direction={'row'}
														spacing={2}
														alignItems={'center'}
														justifyContent={'flex-start'}
													>
														<h6 style={{ width: '40%' }}>
															{t('account-group')}
														</h6>
														<FormControl
															sx={{
																m: 1,
																width: '100%',
																// minWidth: 100,
																// maxWidth: 200,
															}}
															size="small"
														>
															<Select
																value={valueAccountGroupId}
																displayEmpty
																onChange={handleChangeAccountGroup}
																disabled={valueReadonly}
															>
																{dataListAccountGroup.map(
																	(data) => {
																		return (
																			<MenuItem
																				key={
																					data.GroupId
																				}
																				value={
																					data.GroupId
																				}
																			>
																				{data.GroupId} -{' '}
																				{data.GroupName}
																			</MenuItem>
																		);
																	},
																)}
															</Select>
														</FormControl>
													</Stack>
													<Stack
														direction={'row'}
														spacing={2}
														alignItems={'center'}
														justifyContent={'flex-start'}
													>
														<h6 style={{ width: '40%' }}>
															{t('currency')}
														</h6>
														<FormControl
															sx={{
																m: 1,
																width: '100%',
															}}
															size="small"
														>
															<Select
																value={valueCurrencyId}
																displayEmpty
																onChange={handleChangeCurrency}
																disabled={valueReadonly}
															>
																{dataListCurrency.map((data) => {
																	return (
																		<MenuItem
																			key={data.CurrencyId}
																			value={data.CurrencyName}
																		>
																			{data.CurrencyName}
																		</MenuItem>
																	);
																})}
															</Select>
														</FormControl>
													</Stack>
												</Stack>
											</Grid>
											<Grid xs={12} md={6}>
												<Stack spacing={1}>
													<Stack
														direction={'row'}
														spacing={2}
														alignItems={'center'}
														justifyContent={'flex-start'}
													>
														<h6 style={{ width: '40%' }}>
															{t('total-debit')}
														</h6>
														<h6
															style={{
																width: '100%',
																textAlign: 'left',
																color: 'red',
																fontWeight: 'bold',
															}}
														>
															{valueTotalDebit.toLocaleString(
																undefined,
																{
																	maximumFractionDigits: 2,
																},
															)}
														</h6>
													</Stack>
													<Stack
														direction={'row'}
														spacing={2}
														alignItems={'center'}
														justifyContent={'flex-start'}
													>
														<h6 style={{ width: '40%' }}>
															{t('total-credit')}
														</h6>
														<h6
															style={{
																width: '100%',
																textAlign: 'left',
																color: 'green',
																fontWeight: 'bold',
															}}
														>
															{valueTotalCredit.toLocaleString(
																undefined,
																{
																	maximumFractionDigits: 2,
																},
															)}
														</h6>
													</Stack>
												</Stack>
											</Grid>
										</Grid>
									</Item>
								</Grid>
								{mobileResponsive}
							</Item>
						</Grid>

						<Grid xs={12} md={12}>
							<Item>
								<Grid>
									<Grid xs={12} md={12}>
										<Stack
											width={'100%'}
											direction={'row'}
											spacing={2}
											alignItems={'center'}
											justifyContent={'flex-end'}
											height={50}
										>
											<>
												<h5
													style={{
														fontWeight: 'bold',
														textAlign: 'left',
														width: '100%',
													}}
												>
													{t('entry-title-detail')}
												</h5>
											</>

											<Stack direction={'row'} spacing={1}>
												<LoadingButton
													startIcon={<AddBoxIcon />}
													variant="contained"
													color="success"
													onClick={() => handleClickOpenDialogDetail(true)}
													sx={{ alignItems: 'left', whiteSpace: 'nowrap' }}
													disabled={!valueEditGrid}
												>
													{t('button-detail')}
												</LoadingButton>
											</Stack>
										</Stack>
									</Grid>
									<Grid xs={12} md={12} sx={{ width: '100%' }}>
										<Item>
											<Stack spacing={0}>
												<div style={{ width: '100%', minHeight: 500 }}>
													<DataGrid
														columnVisibilityModel={columnVisibilityModel}
														rows={dataListAccountEntryDetail.filter(
															(data) =>
																data.isactive === true &&
																data.is_delete_item !== true,
														)}
														columns={columnsDataDetail}
														autoHeight
														showCellVerticalBorder
														showColumnVerticalBorder
														getRowId={(id) => id.detail_ids}
														loading={isLoading}
														onRowDoubleClick={(params) => {
															valueEditGrid &&
																handleClickOpenDialogDetail(false);
															setDataUpdate(params.row);
														}}
														slotProps={{
															baseSelect: {
																MenuProps: {
																	PaperProps: {
																		sx: {
																			maxHeight: 250,
																		},
																	},
																},
															},
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
								</Grid>
							</Item>
						</Grid>
					</Grid>
				</Box>
			</div>
		</Spin>
	);
}

export default JournalEntryManagement;
