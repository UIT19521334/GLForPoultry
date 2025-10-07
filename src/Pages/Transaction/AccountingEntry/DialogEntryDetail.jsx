import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import { InputNumber } from 'antd';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import OnMultiKeyEvent from '~/components/Event/OnMultiKeyEvent';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useState } from 'react';
import { ApiListAccount, ApiListAccountByUnit } from '~/components/Api/Account';
import { Checkbox, CircularProgress } from '@mui/material';
import { ApiListSupAccountByType } from '~/components/Api/SubAccount';
import { ApiAreaByUnit, ApiFarmByUnit, ApiFlockByUnit, ApiMaterialByRegion } from '~/components/Api/AccountingEntryApi';
import { useMemo } from 'react';

export default function DialogEntryDetail({
    isOpenEntryDetail,
    onCloseEntryDetail,
    valueUnitId,
    valueUnitRegion,
    valueEntryId,
    statusDialogDetail,
    dataAccountEntryDetails,
    setDataAccountEntryDetails,
    selectedEntryDetail
}) {
    const { t } = useTranslation();
    const valueId = dataAccountEntryDetails.length > 0 ? Math.max(...dataAccountEntryDetails.map((r) => r.EntryDetailId)) + 1 : 1;
    const [valueAccount, setValueAccount] = useState(null);
    const [listAccount, setListAccount] = useState([]);
    const [loadingAccount, setLoadingAccount] = useState(false);
    const [loadedAccountOnce, setLoadedAccountOnce] = useState(false); // Flag để chỉ load 1 lần

    const [valueAccountSubId, setValueAccountSubId] = useState("");
    const [valueAccountSubName, setValueAccountSubName] = useState("");
    const [listAccountSub, setListAccountSub] = useState([]);
    const [loadingAccountSub, setLoadingAccountSub] = useState(false);
    const [loadingCosting, setLoadingCosting] = useState(false);

    const [valueAccountSubTypeId, setValueAccountSubTypeId] = useState("");
    const [valueCostingMethod, setValueCostingMethod] = useState("");
    const [valueNonDeductible, setValueNonDeductible] = useState(false);
    const [valueCredit, setValueCredit] = useState(0);
    const [valueDebit, setValueDebit] = useState(0);
    const [valueDescription, setValueDescription] = useState("");
    const [listFlockByUnit, setListFlockByUnit] = useState([])
    const [listFarmByUnit, setListFarmByUnit] = useState([])
    const [listAreaByUnit, setListAreaByUnit] = useState([])
    const [listMaterialByRegion, setListMaterialByRegion] = useState([])

    const fetchApiListAccount = async () => {
        if (valueUnitId && !loadedAccountOnce) {
            try {
                setLoadingAccount(true);
                const data_listAccount = await ApiListAccount();
                setListAccount(data_listAccount);
                setLoadedAccountOnce(true);
                setLoadingAccount(false);
            } catch (error) {
                setListAccount([]);
                toast.error(t('toast-error-connection'));
                setLoadingAccount(false);
            }
        }
    };

    const fetchApiListAccountSub = async () => {
        if (valueAccountSubTypeId) {
            try {
                setLoadingAccountSub(true);
                const data_listAccountSub = await ApiListSupAccountByType(valueAccountSubTypeId);
                setListAccountSub(data_listAccountSub);
                setLoadingAccountSub(false);
                return data_listAccountSub
            } catch (error) {
                setListAccount([]);
                toast.error(t('toast-error-connection'));
                setLoadingAccountSub(false);
                return ([])
            }
        } else {
            return ([]);
        }
    };

    const fetchApiListFlock = async () => {
        try {
            setLoadingCosting(true);
            const data = await ApiFlockByUnit(valueUnitId);
            setListFlockByUnit(data);
            setLoadingCosting(false);
        } catch (error) {
            setListFlockByUnit([]);
            toast.error(t('toast-error-connection'));
            setLoadingCosting(false);
        }
    };

    const fetchApiListFarm = async () => {
        try {
            setLoadingCosting(true);
            const data = await ApiFarmByUnit(valueUnitId);
            setListFarmByUnit(data);
            setLoadingCosting(false);
        } catch (error) {
            setListFarmByUnit([]);
            toast.error(t('toast-error-connection'));
            setLoadingCosting(false);
        }
    };

    const fetchApiListArea = async () => {
        try {
            setLoadingCosting(true);
            const data = await ApiAreaByUnit(valueUnitId);
            setListAreaByUnit(data);
            setLoadingCosting(false);
        } catch (error) {
            setListAreaByUnit([]);
            toast.error(t('toast-error-connection'));
            setLoadingCosting(false);
        }
    };

    const fetchApiListMaterial = async () => {
        try {
            setLoadingCosting(true);
            const data = await ApiMaterialByRegion(valueUnitRegion);
            setListMaterialByRegion(data);
            setLoadingCosting(false);
        } catch (error) {
            setListMaterialByRegion([]);
            toast.error(t('toast-error-connection'));
            setLoadingCosting(false);
        }
    };

    const config = useMemo(() => {
        switch (valueAccount?.MethodId) {
            case 'MT004':
                return {
                    list: listFlockByUnit,
                    disable: false,
                    fetchApi: fetchApiListFlock,
                    getValue: (item) => item.FlockId,
                    findValue: (list) =>
                        list.find((item) => item.FlockId === valueCostingMethod) || null,
                    getLabel: (option) =>
                        option ? `${option.FlockId} - ${option.FlockName} - ${option.FarmOwnerName}` : valueCostingMethod
                };
            case 'MT005':
            case 'MT007':
                return {
                    list: listFarmByUnit,
                    disable: false,
                    fetchApi: fetchApiListFarm,
                    getValue: (item) => item.FarmCode,
                    findValue: (list) =>
                        list.find((item) => item.FarmCode === valueCostingMethod) || null,
                    getLabel: (option) =>
                        option ? `${option.FarmCode} - ${option.FarmName} - ${option.FarmOwner}` : valueCostingMethod
                };
            case 'MT008':
                return {
                    list: listAreaByUnit,
                    fetchApi: fetchApiListArea,
                    getValue: item,
                    findValue: (list) =>
                        list.find((item) => item === valueCostingMethod) || null,
                    getLabel: (option) =>
                        option ? `${option}` : valueCostingMethod
                };
            case 'MT002':
                return {
                    list: listMaterialByRegion,
                    fetchApi: fetchApiListMaterial,
                    getValue: (item) => item.MatId,
                    findValue: (list) =>
                        list.find((item) => item.MatId === valueCostingMethod) || null,
                    getLabel: (option) =>
                        option ? `${option.MatId} - ${option.MatName} - ${option.QuyCach}- ${option.DVT}` : valueCostingMethod
                };
            default:
                return {
                    list: [],
                    disable: true,
                    fetchApi: () => { },
                    getValue: () => '',
                    findValue: () => null,
                    getLabel: () => valueCostingMethod
                };
        }
    }, [
        listFlockByUnit,
        listFarmByUnit,
        listAreaByUnit,
        listMaterialByRegion,
        valueCostingMethod,
        valueAccount?.MethodId
    ]);

    useEffect(() => {
        if (!isOpenEntryDetail) {
            setLoadedAccountOnce(false)
        }
    }, [valueUnitId])

    useEffect(() => {
        const fetchDataUpdate = async () => {
            if (isOpenEntryDetail && statusDialogDetail === 'UPDATE') {
                console.log("selectedEntryDetail>>>>>>>>>>", selectedEntryDetail)
                setValueAccount({
                    AccountId: selectedEntryDetail.AccountId,
                    AccountName: selectedEntryDetail.AccountName,
                    MethodId: selectedEntryDetail.MethodId,
                    MethodName: selectedEntryDetail.MethodName,
                })
                setValueCredit(selectedEntryDetail.Amount_Cr)
                setValueDebit(selectedEntryDetail.Amount_Dr)
                setValueDescription(selectedEntryDetail.Description)
                setValueNonDeductible(selectedEntryDetail?.Non_Deductible)
                setValueAccountSubId(selectedEntryDetail?.AccountSubId)
                setValueAccountSubName(selectedEntryDetail?.SubAccountName)
                setValueAccountSubTypeId(selectedEntryDetail?.SubAccountTypeId)
                setValueCostingMethod(selectedEntryDetail?.CostingMethod)
            }
        }
        fetchDataUpdate();
    }, [isOpenEntryDetail])


    const handleAddDetail = () => {
        const newRow = {
            AccountName: valueAccount?.AccountName ?? "",
            MethodName: valueAccount?.MethodName,
            SubAccountTypeName: "",
            EntryDetailId: valueId,
            EntryHdId: valueEntryId,
            AccountId: valueAccount?.AccountId ?? "",
            Description: valueDescription,
            Amount_Cr: valueCredit,
            Amount_Dr: valueDebit,
            CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString(),
            Active: true,
            AccountSubId: valueAccountSubId,
            CostingMethod: valueCostingMethod,
            Non_Deductible: valueNonDeductible,
        };
        setDataAccountEntryDetails((prev) => [...prev, newRow]);
        resetData();
        onCloseEntryDetail();
    };

    const resetData = () => {
        setValueAccount(null);
        setValueDescription('');
        setValueDebit(0);
        setValueCredit(0);
        setValueAccountSubId('');
        setValueAccountSubName('');
        setValueNonDeductible(false);
    }

    const handleUpdateDetail = async () => {

        const oldRow = selectedEntryDetail;

        const newRow = {
            AccountName: valueAccount?.AccountName ?? "",
            MethodName: valueAccount?.MethodName,
            SubAccountName: valueAccountSubName,
            EntryDetailId: selectedEntryDetail.EntryDetailId,
            EntryHdId: valueEntryId,
            AccountId: valueAccount?.AccountId ?? "",
            Description: valueDescription,
            Amount_Cr: valueCredit,
            Amount_Dr: valueDebit,
            CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString(),
            Active: true,
            AccountSubId: valueAccountSubId,
            CostingMethod: valueCostingMethod,
            Non_Deductible: valueNonDeductible,
        };

        setDataAccountEntryDetails((prev) =>
            prev.map((row) => (row.EntryDetailId === oldRow?.EntryDetailId ? { ...row, ...newRow } : row))
        );
        resetData();
        onCloseEntryDetail();
    };

    OnMultiKeyEvent(statusDialogDetail == 'ADD' ? handleAddDetail : handleUpdateDetail, 's');

    return (
        <React.Fragment>
            <Dialog open={isOpenEntryDetail} onClose={onCloseEntryDetail} maxWidth="md" fullWidth>
                <DialogTitle sx={{ background: '#ffc696', marginBottom: 2 }}>
                    {t('entry-title-detail')}: {t('no')} {statusDialogDetail === 'ADD' ? valueId : selectedEntryDetail?.EntryDetailId}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Stack direction={'column'} spacing={1}>
                                <div>{t('account-code')}</div>
                                <Autocomplete
                                    size="small"
                                    value={valueAccount}
                                    options={listAccount || []}
                                    onOpen={fetchApiListAccount}
                                    loading={loadingAccount}
                                    onChange={(event, newValue) => {
                                        if (newValue?.AccountId) {
                                            setValueAccount(newValue);
                                            setValueAccountSubTypeId(newValue.AccountSubTypeId)
                                        } else {
                                            setValueAccount(null);
                                            setValueAccountSubTypeId("");
                                        }
                                    }}
                                    getOptionLabel={(option) =>
                                        option
                                            ? `${option.AccountId ?? ''} - ${option.AccountName ?? ''}`
                                            : valueAccount?.AccountId
                                                ? `${valueAccount?.AccountId ?? ''} - ${valueAccount?.AccountName ?? ''}`
                                                : ''
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            size="small"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loadingAccount ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                                <div>{t('account-subcode')}</div>
                                <Autocomplete
                                    fullWidth
                                    size="small"
                                    loading={loadingAccountSub}
                                    value={
                                        listAccountSub.find((acc) => acc.AccountSubId === valueAccountSubId) ||
                                        (valueAccountSubId
                                            ? { AccountSubId: valueAccountSubId, AccountSubName: valueAccountSubName }
                                            : null
                                        )
                                    }
                                    options={listAccountSub || []}
                                    onOpen={fetchApiListAccountSub}
                                    onChange={(event, newValue) => {
                                        if (newValue?.AccountSubId) {
                                            setValueAccountSubId(newValue?.AccountSubId)
                                            setValueAccountSubName(newValue?.AccountSubName)
                                        } else {
                                            setValueAccountSubId("");
                                            setValueAccountSubName("");
                                        }
                                    }}
                                    getOptionLabel={(option) =>
                                        option ? `${option.AccountSubId} - ${option.AccountSubName}`
                                            : valueAccountSubId
                                                ? `${valueAccountSubId ?? ''} - ${valueAccountSubName ?? ''}`
                                                : ''
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            size="small"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loadingAccountSub ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                                <div>{t('Method')}</div>
                                <TextField
                                    size='small'
                                    disabled
                                    value={`${valueAccount?.MethodId} - ${valueAccount?.MethodName}`}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction={'column'} spacing={1}>
                                <div>{t('Costing')}</div>
                                <Autocomplete
                                    size="small"
                                    value={
                                        config.findValue(config.list) ||
                                        (valueCostingMethod
                                            ? { tempValue: valueCostingMethod, tempLabel: valueCostingMethod }
                                            : null)
                                    }
                                    options={config.list}
                                    onOpen={config.fetchApi}
                                    loading={loadingCosting}
                                    onChange={(event, newValue) => {
                                        if (newValue) {
                                            setValueCostingMethod(config.getValue(newValue));
                                        } else {
                                            setValueCostingMethod('');
                                        }
                                    }}
                                    disabled={config.disable}
                                    getOptionLabel={(option) => {
                                        if (option?.tempLabel) return option.tempLabel;
                                        return config.getLabel(option)
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            size="small"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loadingCosting ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Stack spacing={1}>
                                <div>{t('debit')}</div>
                                <InputNumber
                                    style={{ width: '100%' }}
                                    size="large"
                                    value={valueDebit}
                                    placeholder="0"
                                    // type='number'
                                    formatter={(val) =>
                                        `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    }
                                    parser={(val) =>
                                        val.replace(/\$\s?|₫\s?|,/g, '')
                                    }
                                    onChange={(val) => setValueDebit(val || 0)}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Stack spacing={1}>
                                <div>{t('credit')}</div>

                                <InputNumber
                                    style={{ width: '100%' }}
                                    size="large"
                                    // type='number'
                                    value={valueCredit}
                                    placeholder="0"
                                    formatter={(val) =>
                                        `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    }
                                    parser={(val) =>
                                        val.replace(/\$\s?|₫\s?|,/g, '')
                                    }
                                    onChange={(val) => setValueCredit(val || 0)}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Stack spacing={1} alignItems={'center'}>
                                <div>{t('non-deductible')}</div>
                                <Checkbox checked={!!valueNonDeductible} onChange={(e) => setValueNonDeductible(e.target.checked)} />
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack spacing={1}>
                                <div>{t('description')}</div>
                                <TextField
                                    showCount
                                    maxLength={500}
                                    rows={3}
                                    value={valueDescription}
                                    onChange={(e) => setValueDescription(e.target.value)}
                                    placeholder='...'
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-around' }}>
                    <Button
                        startIcon={<SaveAltIcon />}
                        variant="contained"
                        type="submit"
                        onClick={statusDialogDetail == 'ADD' ? handleAddDetail : handleUpdateDetail}
                        fullWidth
                    >
                        {t('button-save')}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment >
    );
}