import * as React from 'react';
import { useState, useEffect } from 'react';
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
import { ApiCreateExpense, ApiDeleteExpense, ApiListExpense, ApiListExpenseByRegion, ApiUpdateExpense } from '~/components/Api/Expense';
import SaveIcon from '@mui/icons-material/Save';
import '../../../Container.css';
import TextField from '@mui/material/TextField';
import { OnKeyEvent } from '~/components/Event/OnKeyEvent';
import { OnMultiKeyEvent } from '~/components/Event/OnMultiKeyEvent';
import { Input, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { IconButton, InputAdornment, MenuItem, Select } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApiListExpenseGroup } from '~/Redux/FetchApi/fetchApiMaster';
import { ClearIcon } from '@mui/x-date-pickers';

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	direction: 'row',
	color: theme.palette.text.secondary,
}));

function ExpenseDetails() {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = React.useState(false);
	const [reloadListExpense, setReloadListExpense] = React.useState(false);
	const [dataList, setDataList] = useState([]);
	const [dataDisplay, setDataDisplay] = useState([]);
	const listExpenseGroup = useSelector((state) => state.FetchApi.listData_ExpenseGroup);
	const token = useSelector((state) => state.FetchApi.token);
	const currentRegionId = useSelector((state) => state.FetchApi.currentUnit?.RegionId);

	//! columns header
	const columns = [
		{
			field: 'ExpenseId',
			headerName: t('expense-code'),
			minWidth: 150,
			headerClassName: 'super-app-theme--header',
		},
		{
			field: 'ExpenseName',
			headerName: t('expense-name'),
			minWidth: 200,
			headerClassName: 'super-app-theme--header',
		},
		{
			field: 'GroupId',
			headerName: t('expense-group-code'),

			minWidth: 200,
			headerClassName: 'super-app-theme--header',
		},
		{
			field: 'GroupName_VN',
			headerName: t('expense-group-name'),
			minWidth: 200,
			flex: 1,
			headerClassName: 'super-app-theme--header',
		}
	];

	// TODO call api get data account group
	useEffect(() => {
		const fetchApiGetDataExpense = async () => {
			setIsLoading(true);
			const res = await ApiListExpenseByRegion(currentRegionId);
			setDataList(res);
			setDataDisplay(res);
			dispatch(fetchApiListExpenseGroup({ token, currentRegionId }));
			setIsLoading(false);
		};
		fetchApiGetDataExpense();
	}, [reloadListExpense, currentRegionId]);

	const inputRef = React.useRef(null);

	// Handle search
	const [valueSearch, setValueSearch] = React.useState('');
	const handleSearch = () => {
		let filteredData = dataList;
		if (valueSearch && valueSearch.trim() !== "") {
			const fieldsToSearch = ["ExpenseName", "ExpenseId", "GroupId", "GroupName_VN"];

			filteredData = _.filter(dataList, (item) => {
				const search = _.toLower(valueSearch);
				return _.some(fieldsToSearch, (field) => _.includes(_.toLower(item[field]), search));
			});
		}
		setDataDisplay(filteredData);
	}

	const [valueCode, setValueCode] = React.useState('');
	const [valueName, setValueName] = React.useState('');
	const [valueGroupID, setValueGroupID] = React.useState('');
	const [valueGroupName, setValueGroupName] = React.useState('');
	const [valueDescription, setValueDescription] = React.useState('');

	//! select row in datagrid
	const onRowsSelectionHandler = (ids) => {
		const selectedRowsData = ids.map((id) => dataDisplay.find((row) => row.ExpenseId === id));
		if (selectedRowsData) {
			{
				selectedRowsData.map((key) => {
					setValueCode(key.ExpenseId ?? "XXXX");
					setValueName(key.ExpenseName ?? '');
					setValueDescription(key.Description ?? '');
					setValueGroupID(key.GroupId ?? '');
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
		asyncApiCreateExpense();
	};
	const closeDialogNew = () => {
		setDialogIsOpenNew(false);
		toast.warning(t('toast-cancel-new'));
	};

	const asyncApiCreateExpense = async () => {
		setIsLoading(true);
		const statusCode = await ApiCreateExpense(valueCode, valueName, valueGroupID, valueGroupName, valueDescription);
		if (statusCode) {
			setValueCode('');
			setValueName('');
			setValueDescription('');
			setValueGroupID('');
			setValueGroupName('');
			setValueNewButton(false);
			setValueDisableSaveButton(true);
			setValueDisableDeleteButton(true);
			setValueReadonly(true);
			setValueReadonlyCode(true);
		}
		setIsLoading(false);
		setReloadListExpense(!reloadListExpense);
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
	const handleOnChangeValueGroupID = (e) => {
		const data = e.target.value && listExpenseGroup.find(item => item.GroupId === e.target.value);
		setValueGroupID(data.GroupId);
		setValueGroupName(data.GroupName_EN);
	};

	// TODO call api update
	/* #region  call api update */
	const agreeDialogUpdate = () => {
		setDialogIsOpenUpdate(false);
		asyncApiUpdateExpense();
	};
	const closeDialogUpdate = () => {
		setDialogIsOpenUpdate(false);
		toast.warning(t('toast-cancel-update'));
	};

	const asyncApiUpdateExpense = async () => {
		setIsLoading(true);
		const statusCode = await ApiUpdateExpense(valueCode, valueName, valueGroupID, valueGroupName, valueDescription);
		if (statusCode) {
			setValueReadonly(true);
			setValueUpdateButton(false);
			setValueDisableSaveButton(true);
			setValueDisableDeleteButton(true);
		}
		setIsLoading(false);
		setReloadListExpense(!reloadListExpense);
	};

	/* #endregion */

	// TODO call api delete
	/* #region  call api delete */
	const agreeDialogDelete = () => {
		setDialogIsOpenDelete(false);
		asyncApiDeleteExpense();
	};
	const closeDialogDelete = () => {
		setDialogIsOpenDelete(false);
		toast.warning(t('toast-cancel-delete'));
	};

	const asyncApiDeleteExpense = async () => {
		setIsLoading(true);
		const statusCode = await ApiDeleteExpense(valueCode);
		if (statusCode) {
			setValueCode('');
			setValueName('');
			setValueDescription('');
			setValueGroupID('');
			setValueGroupName('');
			setValueReadonly(true);
			setValueDisableSaveButton(true);
			setValueDisableDeleteButton(true);
		}
		setIsLoading(false);
		setReloadListExpense(!reloadListExpense);
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
		setValueGroupID('');
		setValueGroupName('');
		setValueReadonly(false);
		setValueReadonlyCode(false);
		setValueDisableSaveButton(false);
		setValueDisableDeleteButton(true);
		setValueDisableUpdateButton(true);
		if (inputRef.current) {
			setTimeout(() => {
				inputRef.current.focus();
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
		setValueReadonlyCode(true);
		setValueReadonly(false);
		setValueDisableSaveButton(false);
		setValueDisableDeleteButton(true);
	};
	/* #endregion */

	/* #region  button save */
	const [valueDisableSaveButton, setValueDisableSaveButton] = React.useState(true);
	const handleClickSave = () => {
		if (!valueName) {
			toast.error(t('toast-valid-empty'));
			return
		}
		if (valueNewButton) {
			setDialogIsOpenNew(true);
			return
		}
		if (valueUpdateButton) {
			setDialogIsOpenUpdate(true);
			return
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
		<Spin size="large" tip={t('loading')} spinning={isLoading}>
			<div className="main">
				<ToastContainer position='bottom-right' stacked />
				{dialogIsOpenNew && (
					<AlertDialog
						title={t('expense-toast-new')}
						content={
							<>
								{t('expense-code')}: {valueCode}
								<br /> {t('expense-name')}: {valueName}
								<br /> {t('expense-group-code')}:{`[${valueGroupID}] - ${valueGroupName}`}
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
						title={t('expense-toast-update')}
						content={
							<>
								{t('expense-code')}: {valueCode}
								<br /> {t('expense-name')}: {valueName}
								<br /> {t('expense-group-code')}:{`[${valueGroupID}] - ${valueGroupName}`}
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
						title={t('expense-toast-delete')}
						content={
							<>
								{t('expense-code')}: {valueCode}
								<br /> {t('expense-name')}: {valueName}
								<br /> {t('expense-group-code')}:{`[${valueGroupID}] - ${valueGroupName}`}
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
										{t('expense-title-list')}
									</h5>
									<div style={{ width: '100%' }}>
										<DataGrid
											rows={dataDisplay}
											columns={columns}
											getRowId={(row) => row.ExpenseId}
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
											{t('expense-title-infor')}
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
													<div>{t('expense-code')}</div>
												</div>
												<Input
													variant="outlined"
													type="text"
													size="large"
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
													disabled
													style={{ color: '#000' }}
												/>
											</Stack>
											<Stack direction={'row'} spacing={2}>
												<div className="form-title">
													<div>{t('expense-name')}</div>
												</div>
												<Input
													variant="outlined"
													size="large"
													status={!valueName ? 'error' : ''}
													value={valueName}
													ref={inputRef}
													onChange={(event) => handleOnChangeValueName(event)}
													placeholder="name..."
													disabled={valueReadonly}
													style={{ color: '#000' }}
												/>
											</Stack>
											<Stack direction={'row'} spacing={2}>
												<div className="form-title">
													<div>{t('expense-group-code')}</div>
												</div>
												<Select
													autoFocus
													size="small"
													fullWidth
													style={{ textAlign: 'left' }}
													value={valueGroupID}
													onChange={handleOnChangeValueGroupID}
													disabled={valueReadonly}
													endAdornment={
														valueGroupID ? (
															<InputAdornment position="start">
																<IconButton
																	tabIndex={-1}
																	size="small"
																	onClick={(e) => {
																		e.stopPropagation(); // chặn mở dropdown
																		setValueGroupID("");
																		setValueGroupName("");
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

export default ExpenseDetails;
