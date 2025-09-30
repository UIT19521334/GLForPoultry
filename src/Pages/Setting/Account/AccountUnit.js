import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
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
import { ApiCreateAccount, ApiCreateListAccount, ApiDeleteAccount, ApiListAccount, ApiListAccountByUnit, ApiUpdateAccount } from '~/components/Api/Account';
import SaveIcon from '@mui/icons-material/Save';
import '../../../Container.css';
import TextField from '@mui/material/TextField';
import { OnMultiKeyEvent } from '~/components/Event/OnMultiKeyEvent';
import { Input, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import _, { update } from 'lodash';
import { Autocomplete, Breadcrumbs, Chip, IconButton, InputAdornment, Link, MenuItem, Select, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApiListAccount, fetchApiListExpense, fetchApiListExpenseGroup, fetchApiListMethod, fetchApiListSubAccountType } from '~/Redux/FetchApi/fetchApiMaster';
import { ClearIcon } from '@mui/x-date-pickers';
import { DomainPoultry } from '~/DomainApi';
import { setGlobalLoading, updateDialogError, updateListExpense } from '~/Redux/Reducer/Thunk';

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	direction: 'row',
	color: theme.palette.text.secondary,
}));

function AccountUnit() {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = React.useState(false);
	const [reloadListAccount, setReloadListAccount] = React.useState(false);
	const [dataList, setDataList] = useState([]);
	const [displayData, setDisplayData] = useState([]);
	const listExpenseGroup = useSelector((state) => state.FetchApi.listData_ExpenseGroup);
	const listSubAccountType = useSelector((state) => state.FetchApi.listData_SubAccountType);
	const listAccount = useSelector((state) => state.FetchApi.listData_Account);
	const listMethod = useSelector((state) => state.FetchApi.listData_Method);
	const listExpense = useSelector((state) => state.FetchApi.listData_Expense);
	const listUnit = useSelector((state) => state.FetchApi.userAccess.units);
	const token = useSelector((state) => state.FetchApi.token);
	const username = useSelector((state) => state.FetchApi.userInfo?.userID_old);
	const loadingGlobal = useSelector((state) => state.FetchApi.isLoading);
	const currentRegionId = useSelector((state) => state.FetchApi.currentUnit.RegionId ?? "01");


	//! columns header
	const columns = [
		{
			field: 'AccountId',
			headerName: t('account-code'),
			minWidth: 150,
			headerClassName: 'super-app-theme--header',
		},
		{
			field: 'AccountName',
			headerName: t('account-name'),
			minWidth: 200,
			flex: 1,
			headerClassName: 'super-app-theme--header',
		},
		{
			field: 'UnitName',
			headerName: t('unit'),
			minWidth: 50,
			headerClassName: 'super-app-theme--header',
		},
		{
			field: 'ExpenseGroupName',
			headerName: t('expense-group'),
			minWidth: 150,
			headerClassName: 'super-app-theme--header',
		},
		{
			field: 'ExpenseName',
			headerName: t('expense'),
			minWidth: 200,
			headerClassName: 'super-app-theme--header',
		},
		{
			field: 'MethodName',
			headerName: t('method'),
			minWidth: 100,
			headerClassName: 'super-app-theme--header',
		},
		{
			field: 'AccountSubTypeName',
			headerName: t('menu-sub-acc-type'),
			minWidth: 200,
			flex: 1,
			headerClassName: 'super-app-theme--header',
		}
	];

	const [valueId, setValueId] = React.useState('');
	const [valueAccountId, setValueAccountId] = React.useState('');
	const [valueAccountName, setValueAccountName] = React.useState('');
	const [valueUnitId, setValueUnitId] = React.useState([]);
	const [valueUnitName, setValueUnitName] = React.useState([]);
	const [valueExpenseGroupName, setValueExpenseGroupName] = React.useState('');
	const [valueExpenseGroupId, setValueExpenseGroupId] = React.useState('');
	const [valueExpenseId, setValueExpenseId] = React.useState('');
	const [valueExpenseName, setValueExpenseName] = React.useState('');
	const [valueMethodId, setValueMethodId] = React.useState('');
	const [valueMethodName, setValueMethodName] = React.useState('');
	const [valueSubAccountTypeId, setValueSubAccountTypeId] = React.useState('');
	const [valueSubAccountTypeName, setValueSubAccountTypeName] = React.useState('');
	const [valueDescription, setValueDescription] = React.useState('');
	const inputAccountIdRef = useRef(null);

	// TODO call api get data account group
	useEffect(() => {
		const fetchApiGetDataAccount = async () => {
			setIsLoading(true);
			const unitIds = listUnit.map(u => u.UnitId);
			const body = {
				IncludeUnit: true,
				Units: unitIds
			}
			const result = await ApiListAccountByUnit(body);
			setDataList(result);
			setDisplayData(result);
			setIsLoading(false);
		};
		fetchApiGetDataAccount();
	}, [reloadListAccount, listUnit]);

	useEffect(() => {
		const fetchApiSupport = async () => {
			dispatch(fetchApiListExpenseGroup(token));
			dispatch(fetchApiListMethod(token));
			dispatch(fetchApiListSubAccountType(token));
			dispatch(fetchApiListAccount(token));
		};
		fetchApiSupport();
	}, []);

	useEffect(() => {
		const fetchApiSupport = async () => {
			if (valueExpenseGroupId) {
				try {
					dispatch(setGlobalLoading(true));
					const result = await DomainPoultry.get(`master/expense-bygroup?groupid=${valueExpenseGroupId}&regionid=${currentRegionId}`, { headers: { Authorization: token } });
					dispatch(updateListExpense(result.data?.Response ?? []));
					dispatch(setGlobalLoading(false));
				} catch (error) {
					dispatch(setGlobalLoading(false));
					dispatch(updateDialogError({ open: true, title: t('error'), content: error.message ?? "Can't get expense list" }));
				}
			} else {
				dispatch(fetchApiListExpense(token));
			}
		};
		fetchApiSupport();
	}, [valueExpenseGroupId]);

	// Handle search
	const [valueSearch, setValueSearch] = React.useState('');
	const handleSearch = () => {
		let filteredData = dataList;
		if (valueSearch && valueSearch.trim() !== "") {
			const fieldsToSearch = ["AccountName", "AccountId", "UnitName", "ExpenseGroupName", "ExpenseName", "MethodName", "AccountSubTypeName"];
			filteredData = _.filter(dataList, (item) => {
				const search = _.toLower(valueSearch);
				return _.some(fieldsToSearch, (field) => _.includes(_.toLower(item[field]), search));
			});
		}
		setDisplayData(filteredData);
	}

	//! select row in datagrid
	const onRowsSelectionHandler = (ids) => {
		const selectedRowsData = ids.map((id) => displayData.find((row) => row.Id === id));
		if (selectedRowsData) {
			{
				selectedRowsData.map((key) => {
					setValueAccountId(key.AccountId ?? "XXXX");
					setValueAccountName(key.AccountName ?? '');

					setValueUnitId([key.UnitId] ?? []);
					setValueUnitName([key.UnitName] ?? []);

					setValueExpenseGroupId(key.ExpenseGroupId ?? '');
					setValueExpenseGroupName(key.ExpenseGroupName ?? '');

					setValueExpenseId(key.ExpenseId ?? '');
					setValueExpenseName(key.ExpenseName ?? '');

					setValueMethodId(key.MethodId ?? '');
					setValueMethodName(key.MethodName ?? '');

					setValueSubAccountTypeId(key.AccountSubTypeId ?? '');
					setValueSubAccountTypeName(key.AccountSubTypeName ?? '');
					setValueId(key.Id ?? '');
					setValueDescription(key.Description ?? '');
				});
				setValueReadonly(true);
				setValueReadonlyCode(true);
				setValueReadonlyUnit(true);
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
		const body = valueUnitId.map((unitId, index) => ({
			UnitId: unitId,
			UnitName: valueUnitName[index],
			ExpenseName: valueExpenseName,
			ExpenseGroupName: valueExpenseGroupName,
			ExpenseGroupId: valueExpenseGroupId,
			MethodName: valueMethodName,
			AccountSubTypeName: valueSubAccountTypeName,
			Id: "",
			AccountId: valueAccountId,
			AccountName: valueAccountName,
			Description: valueDescription,
			Active: true,
			Username: username,
			CreatedAt: new Date().toISOString(),
			UpdatedAt: new Date().toISOString(),
			ExpenseId: valueExpenseId,
			MethodId: valueMethodId,
			AccountSubTypeId: valueSubAccountTypeId,
		}));

		console.log(body)

		const statusCode = await ApiCreateListAccount(body);
		if (statusCode) {
			setValueAccountId('');
			setValueAccountName('');
			setValueUnitId([]);
			setValueUnitName([]);
			setValueExpenseGroupId('');
			setValueExpenseGroupName('');
			setValueExpenseId('');
			setValueExpenseName('');
			setValueMethodId('');
			setValueMethodName('');
			setValueSubAccountTypeId('');
			setValueSubAccountTypeName('');
			setValueDescription('');
			setValueNewButton(false);
			setValueDisableSaveButton(true);
			setValueDisableDeleteButton(true);
			setValueReadonly(true);
			setValueReadonlyCode(true);
			setValueReadonlyUnit(true);
		}
		setIsLoading(false);
		setReloadListAccount(!reloadListAccount);
	};
	/* #endregion */

	const handleChangeValueName = (event) => {
		setValueAccountName(event.target.value);
	};

	const handleChangeValueDescription = (event) => {
		setValueDescription(event.target.value);
	};

	const handleChangeValueExpenseGroupID = (e) => {
		const data = e.target.value && listExpenseGroup.find(item => item.GroupId === e.target.value);
		setValueExpenseGroupId(data.GroupId);
		setValueExpenseGroupName(data.GroupName_EN);
	};

	const handleChangeValueExpenseID = (e) => {
		const data = e.target.value && listExpense.find(item => item.ExpenseId === e.target.value);
		setValueExpenseId(data.ExpenseId);
		setValueExpenseName(data.ExpenseName);
	};
	const handleChangeValueMethod = (e) => {
		const data = e.target.value && listMethod.find(item => item.MethodId === e.target.value);
		setValueMethodId(data.MethodId);
		setValueMethodName(data.MethodName);
	};
	const handleChangeValueSubAccountType = (e) => {
		const data = e.target.value && listSubAccountType.find(item => item.SubTypeId === e.target.value);
		setValueSubAccountTypeId(data.SubTypeId);
		setValueSubAccountTypeName(data.SubTypeName);
	};

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
		const body = {
			UnitName: valueUnitName[0],
			ExpenseName: valueExpenseName,
			ExpenseGroupName: valueExpenseGroupName,
			ExpenseGroupId: valueExpenseGroupId,
			MethodName: valueMethodName,
			AccountSubTypeName: valueSubAccountTypeName,
			Id: valueId,
			AccountId: valueAccountId,
			AccountName: valueAccountName,
			Description: valueDescription,
			Active: true,
			Username: username,
			CreatedAt: new Date().toISOString(),
			UpdatedAt: new Date().toISOString(),
			UnitId: valueUnitId[0],
			ExpenseId: valueExpenseId,
			MethodId: valueMethodId,
			AccountSubTypeId: valueSubAccountTypeId,
		}
		const statusCode = await ApiUpdateAccount(body);
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
		const statusCode = await ApiDeleteAccount(valueId);
		if (statusCode) {
			setValueAccountId('');
			setValueAccountName('');
			setValueUnitId([]);
			setValueUnitName([]);
			setValueExpenseGroupId('');
			setValueExpenseGroupName('');
			setValueExpenseId('');
			setValueExpenseName('');
			setValueMethodId('');
			setValueMethodName('');
			setValueSubAccountTypeId('');
			setValueSubAccountTypeName('');
			setValueDescription('');
			setValueReadonly(true);
			setValueDisableSaveButton(true);
			setValueDisableDeleteButton(true);
		}
		setIsLoading(false);
		setReloadListAccount(!reloadListAccount);
	};

	/* #endregion */

	const [valueReadonly, setValueReadonly] = React.useState(true);
	const [valueReadonlyCode, setValueReadonlyCode] = React.useState(true);
	const [valueReadonlyUnit, setValueReadonlyUnit] = React.useState(true);

	/* #region  button new */

	const [valueNewButton, setValueNewButton] = React.useState(false);
	const handleClickNew = () => {
		setValueNewButton(true);
		setValueUpdateButton(false);
		setValueReadonlyCode(true);
		setValueReadonlyUnit(false);
		setValueReadonly(false);
		setValueDisableSaveButton(false);
		setValueDisableDeleteButton(true);
		setValueDisableUpdateButton(true);
		setValueUnitId([]);
		setValueUnitName([]);
		setValueExpenseGroupId('');
		setValueExpenseGroupName('');
		setValueExpenseId('');
		setValueExpenseName('');
		setValueMethodId('');
		setValueMethodName('');
		setValueSubAccountTypeId('');
		setValueSubAccountTypeName('');
		setValueDescription('');
		if (inputAccountIdRef.current) {
			setTimeout(() => {
				inputAccountIdRef.current.focus();
			}, 0);
		}
	};
	/* #endregion */

	/* #region  button update */
	const [valueUpdateButton, setValueUpdateButton] = React.useState(false);
	const [valueDisableUpdateButton, setValueDisableUpdateButton] = React.useState(true);
	const handleClickUpdate = () => {
		setValueNewButton(false);
		setValueUpdateButton(true);
		setValueReadonlyUnit(true);
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
		if (valueAccountId.length == 9 && valueAccountName) {
			if (valueNewButton) {
				setDialogIsOpenNew(true);
			}
			if (valueUpdateButton) {
				setDialogIsOpenUpdate(true);
			}
		} else {
			toast.error(t('account-toast-error'));
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
		<Spin size="large" tip={t('loading')} spinning={loadingGlobal}>
			<div className="main">
				<ToastContainer position='bottom-right' stacked />
				{dialogIsOpenNew && (
					<AlertDialog
						title={t('account-toast-new')}
						content={
							<>
								{t('account-code')}: {valueAccountId}
								<br /> {t('account-name')}: {valueAccountName}
								<br /> {t('unit')}:{`[${valueUnitId}] - ${valueUnitName}`}
								<br /> {t('expense-group')}:{`[${valueExpenseGroupId}] - ${valueExpenseGroupName}`}
								<br /> {t('expense')}:{`[${valueExpenseId}] - ${valueExpenseName}`}
								<br /> {t('method')}:{`${valueMethodId}`}
								<br /> {t('menu-sub-acc-type')}:{`[${valueSubAccountTypeId}] - ${valueSubAccountTypeName}`}
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
								{t('account-code')}: {valueAccountId}
								<br /> {t('account-name')}: {valueAccountName}
								<br /> {t('unit')}:{`[${valueUnitId}] - ${valueUnitName}`}
								<br /> {t('expense-group')}:{`[${valueExpenseGroupId}] - ${valueExpenseGroupName}`}
								<br /> {t('expense')}:{`[${valueExpenseId}] - ${valueExpenseName}`}
								<br /> {t('method')}:{`[${valueMethodId}] - ${valueMethodName}`}
								<br /> {t('menu-sub-acc-type')}:{`[${valueSubAccountTypeId}] - ${valueSubAccountTypeName}`}
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
								{t('account-code')}: {valueAccountId}
								<br /> {t('account-name')}: {valueAccountName}
								<br /> {t('unit')}:{`[${valueUnitId}] - ${valueUnitName}`}
								<br /> {t('expense-group')}:{`[${valueExpenseGroupId}] - ${valueExpenseGroupName}`}
								<br /> {t('expense')}:{`[${valueExpenseId}] - ${valueExpenseName}`}
								<br /> {t('method')}:{`[${valueMethodId}] - ${valueMethodName}`}
								<br /> {t('menu-sub-acc-type')}:{`[${valueSubAccountTypeId}] - ${valueSubAccountTypeName}`}
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
										onKeyDown={(event) => {
											if (event.key === 'Enter') {
												handleSearch();
											}
										}}
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
										{t('account-title-list')}
									</h5>
									<div style={{ width: '100%' }}>
										<DataGrid
											rows={displayData}
											columns={columns}
											getRowId={(row) => row.Id}
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
											sx={{
												"& .MuiDataGrid-columnHeaderTitle": {
													fontWeight: "bold",
												}
											}}
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
											{t('account-title-infor')}
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
													<div>{t('account-code')}</div>
												</div>
												<Autocomplete
													fullWidth
													size="small"
													autoHighlight
													options={Array.isArray(listAccount) ? listAccount : []}
													getOptionLabel={(option) =>
														option ? `[${option.AccountId}] - ${option.AccountName}` : ""
													}
													value={
														listAccount.find((acc) => acc.AccountId === valueAccountId) || null
													}
													onChange={(event, newValue) => {
														if (newValue) {
															setValueAccountId(newValue.AccountId);
															setValueAccountName(newValue.AccountName);
														} else {
															setValueAccountId("");
															setValueAccountName("");
														}
													}}
													disabled={valueReadonlyUnit}
													renderInput={(params) => (
														<TextField
															{...params}
															autoFocus
															label={t('account-code')}
															InputProps={{
																...params.InputProps,
															}}
														/>
													)}
												/>
											</Stack>
											<Stack direction={'row'} spacing={2}>
												<div className="form-title">
													<div>{t('account-name')}</div>
												</div>
												<Input
													variant="outlined"
													size="large"
													status={!valueAccountName ? 'error' : ''}
													value={valueAccountName}
													onChange={(event) => handleChangeValueName(event)}
													placeholder="name..."
													disabled={valueReadonlyCode}
													style={{ color: '#000' }}
												/>
											</Stack>
											<Stack direction={'row'} spacing={2}>
												<div className="form-title">
													<div>{t('unit')}</div>
												</div>
												<Select
													multiple
													autoFocus
													size="small"
													fullWidth
													style={{ textAlign: "left" }}
													value={valueUnitId} // array UnitId
													onChange={(e) => {
														const newValue = e.target.value;
														setValueUnitId(newValue);
														setValueUnitName(
															listUnit
																.filter((u) => newValue.includes(u.UnitId))
																.map((u) => u.UnitName)
														);
													}}
													disabled={valueReadonlyUnit}
													renderValue={(selected) => (
														<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
															{selected.map((unitId) => {
																const unit = listUnit.find((u) => u.UnitId === unitId);
																return (
																	<Chip
																		key={unitId}
																		label={unit ? unit.UnitName : unitId}
																		size="small"
																	/>
																);
															})}
														</Box>
													)}
													endAdornment={
														valueUnitId.length > 0 && !valueReadonlyUnit ? (
															<InputAdornment position="start">
																<IconButton
																	tabIndex={-1}
																	size="small"
																	onClick={(e) => {
																		e.stopPropagation();
																		setValueUnitId([]);
																		setValueUnitName([]);
																	}}
																>
																	<ClearIcon fontSize="small" />
																</IconButton>
															</InputAdornment>
														) : null
													}
												>
													{Array.isArray(listUnit) &&
														listUnit.map((data) => (
															<MenuItem
																key={data.UnitId}
																value={data.UnitId}
																style={{ textAlign: "left" }}
															>
																{`[${data.UnitId}] - ${data.UnitName}`}
															</MenuItem>
														))}
												</Select>
											</Stack>
											<Stack direction={'row'} spacing={2}>
												<div className="form-title">
													<div>{t('expense-group')}</div>
												</div>
												<Select
													autoFocus
													size="small"
													fullWidth
													style={{ textAlign: 'left' }}
													value={valueExpenseGroupId}
													onChange={handleChangeValueExpenseGroupID}
													disabled={valueReadonly}
													endAdornment={
														(valueExpenseGroupId && !valueReadonly) ? (
															<InputAdornment position="start">
																<IconButton
																	tabIndex={-1}
																	size="small"
																	onClick={(e) => {
																		e.stopPropagation(); // chặn mở dropdown
																		setValueExpenseGroupId("");
																		setValueExpenseGroupName("");
																	}}
																>
																	<ClearIcon fontSize="small" />
																</IconButton>
															</InputAdornment>
														) : null
													}
												>
													{_.isArray(listExpenseGroup) &&
														listExpenseGroup.map((data) => {
															return (
																<MenuItem style={{ textAlign: 'left' }} key={data.GroupId} value={data.GroupId}>
																	{`[${data.GroupId}] - ${data.GroupName_EN}`}
																</MenuItem>
															);
														})}
													{/* Nếu value không rỗng và không có trong list thì render mặc định */}
													{valueExpenseGroupId &&
														!listExpenseGroup.some((d) => d.GroupId === valueExpenseGroupId) && (
															<MenuItem style={{ textAlign: 'left' }} value={valueExpenseGroupId}>
																{`[${valueExpenseGroupId}] - ${valueExpenseGroupName}`}
															</MenuItem>
														)}
												</Select>
											</Stack>

											<Stack direction={'row'} spacing={2}>
												<div className="form-title">
													<div>{t('expense')}</div>
												</div>
												<Select
													autoFocus
													size="small"
													fullWidth
													style={{ textAlign: 'left' }}
													value={valueExpenseId}
													onChange={handleChangeValueExpenseID}
													disabled={valueReadonly}
													endAdornment={
														(valueExpenseId && !valueReadonly) ? (
															<InputAdornment position="start">
																<IconButton
																	tabIndex={-1}
																	size="small"
																	onClick={(e) => {
																		e.stopPropagation(); // chặn mở dropdown
																		setValueExpenseId("");
																		setValueExpenseName("");
																	}}
																>
																	<ClearIcon fontSize="small" />
																</IconButton>
															</InputAdornment>
														) : null
													}
												>
													{_.isArray(listExpense) &&
														listExpense.map((data) => {
															return (
																<MenuItem style={{ textAlign: 'left' }} key={data.ExpenseId} value={data.ExpenseId}>
																	{`[${data.ExpenseId}] - ${data.ExpenseName}`}
																</MenuItem>
															);
														})}
													{/* Nếu valueExpenseId không rỗng và không có trong listExpense thì render mặc định */}
													{valueExpenseId &&
														!listExpense.some((d) => d.ExpenseId === valueExpenseId) && (
															<MenuItem style={{ textAlign: 'left' }} value={valueExpenseId}>
																{`[${valueExpenseId}] - ${valueExpenseName}`}
															</MenuItem>
														)}
												</Select>
											</Stack>

											<Stack direction={'row'} spacing={2}>
												<div className="form-title">
													<div>{t('method')}</div>
												</div>
												<Select
													autoFocus
													size="small"
													fullWidth
													style={{ textAlign: 'left' }}
													value={valueMethodId}
													onChange={handleChangeValueMethod}
													disabled={valueReadonly}
													endAdornment={
														(valueMethodId && !valueReadonly) ? (
															<InputAdornment position="start">
																<IconButton
																	tabIndex={-1}
																	size="small"
																	onClick={(e) => {
																		e.stopPropagation(); // chặn mở dropdown
																		setValueMethodId("");
																		setValueMethodName("");
																	}}
																>
																	<ClearIcon fontSize="small" />
																</IconButton>
															</InputAdornment>
														) : null
													}
												>
													{_.isArray(listMethod) &&
														listMethod.map((data) => {
															return (
																<MenuItem style={{ textAlign: 'left' }} key={data.MethodId} value={data.MethodId}>
																	{`[${data.MethodId}] - ${data.MethodName}`}
																</MenuItem>
															);
														})}
													{/* Nếu value không rỗng và không có trong list thì render mặc định */}
													{valueMethodId &&
														!listMethod.some((d) => d.MethodId === valueMethodId) && (
															<MenuItem style={{ textAlign: 'left' }} value={valueMethodId}>
																{`[${valueMethodId}] - ${valueMethodName}`}
															</MenuItem>
														)}
												</Select>
											</Stack>


											<Stack direction={'row'} spacing={2}>
												<div className="form-title">
													<div>{t('menu-sub-acc-type')}</div>
												</div>
												<Select
													autoFocus
													size="small"
													fullWidth
													style={{ textAlign: 'left' }}
													value={valueSubAccountTypeId}
													onChange={handleChangeValueSubAccountType}
													disabled={valueReadonly}
													endAdornment={
														(valueSubAccountTypeId && !valueReadonly) ? (
															<InputAdornment position="start">
																<IconButton
																	tabIndex={-1}
																	size="small"
																	onClick={(e) => {
																		e.stopPropagation(); // chặn mở dropdown
																		setValueSubAccountTypeId("");
																		setValueSubAccountTypeName("");
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
													{/* Nếu value không rỗng và không có trong list thì render mặc định */}
													{valueSubAccountTypeId &&
														!listSubAccountType.some((d) => d.SubTypeId === valueSubAccountTypeId) && (
															<MenuItem style={{ textAlign: 'left' }} value={valueSubAccountTypeId}>
																{`[${valueSubAccountTypeId}] - ${valueSubAccountTypeName}`}
															</MenuItem>
														)}
												</Select>
											</Stack>

											<Stack direction={'row'} spacing={2}>
												<div className="form-title">
													<div>{t('description')}</div>
												</div>
												<Input.TextArea
													size="large"
													maxLength={250}
													value={valueDescription}
													onChange={(event) => handleChangeValueDescription(event)}
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

export default AccountUnit;
