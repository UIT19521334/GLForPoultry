import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import { Checkbox, Chip, CircularProgress } from '@mui/material';
import { InputNumber } from 'antd';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

import OnMultiKeyEvent from '~/components/Event/OnMultiKeyEvent';
import { ApiListAccount } from '~/components/Api/Account';
import { ApiListSupAccountByType } from '~/components/Api/SubAccount';
import {
    ApiAreaByUnit,
    ApiFarmByUnit,
    ApiFlockByUnit,
    ApiMaterialByRegion,
} from '~/components/Api/AccountingEntryApi';

export default function DialogEntryDetail2({
    isOpenEntryDetail,
    onCloseEntryDetail,
    valueUnitId,
    valueUnitRegion,
    valueEntryId,
    statusDialogDetail,
    dataAccountEntryDetails,
    setDataAccountEntryDetails,
    selectedEntryDetail,
}) {
    const { t } = useTranslation();

    const valueId = useMemo(
        () =>
            dataAccountEntryDetails.length > 0
                ? Math.max(...dataAccountEntryDetails.map((r) => r.EntryDetailId)) + 1
                : 1,
        [dataAccountEntryDetails],
    );

    const [valueAccount, setValueAccount] = useState(null);
    const [listAccount, setListAccount] = useState([]);
    const [loadingAccount, setLoadingAccount] = useState(false);
    const [loadedAccountOnce, setLoadedAccountOnce] = useState(false);

    const [valueAccountSubId, setValueAccountSubId] = useState('');
    const [valueAccountSubName, setValueAccountSubName] = useState('');
    const [listAccountSub, setListAccountSub] = useState([]);
    const [loadingAccountSub, setLoadingAccountSub] = useState(false);

    const [loadingCosting, setLoadingCosting] = useState(false);

    const [valueAccountSubTypeId, setValueAccountSubTypeId] = useState('');
    const [valueCostingMethod, setValueCostingMethod] = useState([]);
    const [valueCostingMethodFilter, setValueCostingMethodFilter] = useState("");
    const [valueNonDeductible, setValueNonDeductible] = useState(false);
    const [valueCredit, setValueCredit] = useState(0);
    const [valueDebit, setValueDebit] = useState(0);
    const [valueDescription, setValueDescription] = useState('');

    const [listFlockByUnit, setListFlockByUnit] = useState([]);
    const [listFarmByUnit, setListFarmByUnit] = useState([]);
    const [listAreaByUnit, setListAreaByUnit] = useState([]);
    const [listMaterialByRegion, setListMaterialByRegion] = useState([]);

    const fetchApiListAccount = async () => {
        if (!valueUnitId || loadedAccountOnce) return;
        try {
            setLoadingAccount(true);
            const dataListAccount = await ApiListAccount();
            setListAccount(dataListAccount || []);
            setLoadedAccountOnce(true);
        } catch (error) {
            setListAccount([]);
            toast.error(t('toast-error-connection'));
        } finally {
            setLoadingAccount(false);
        }
    };

    const fetchApiListAccountSub = async () => {
        if (!valueAccountSubTypeId) return [];
        try {
            setLoadingAccountSub(true);
            const dataListAccountSub = await ApiListSupAccountByType(valueAccountSubTypeId);
            setListAccountSub(dataListAccountSub || []);
            return dataListAccountSub || [];
        } catch (error) {
            setListAccountSub([]);
            toast.error(t('toast-error-connection'));
            return [];
        } finally {
            setLoadingAccountSub(false);
        }
    };

    const fetchApiListFlock = async () => {
        try {
            setLoadingCosting(true);
            const data = await ApiFlockByUnit(valueUnitId);
            setListFlockByUnit(data || []);
        } catch (error) {
            setListFlockByUnit([]);
            toast.error(t('toast-error-connection'));
        } finally {
            setLoadingCosting(false);
        }
    };

    const fetchApiListFarm = async () => {
        try {
            setLoadingCosting(true);
            const data = await ApiFarmByUnit(valueUnitId);
            setListFarmByUnit(data || []);
        } catch (error) {
            setListFarmByUnit([]);
            toast.error(t('toast-error-connection'));
        } finally {
            setLoadingCosting(false);
        }
    };

    const fetchApiListArea = async () => {
        try {
            setLoadingCosting(true);
            const data = await ApiAreaByUnit(valueUnitId);
            setListAreaByUnit(data || []);
        } catch (error) {
            setListAreaByUnit([]);
            toast.error(t('toast-error-connection'));
        } finally {
            setLoadingCosting(false);
        }
    };

    const fetchApiListMaterial = async () => {
        try {
            setLoadingCosting(true);
            const data = await ApiMaterialByRegion(valueUnitRegion);
            setListMaterialByRegion(data || []);
        } catch (error) {
            setListMaterialByRegion([]);
            toast.error(t('toast-error-connection'));
        } finally {
            setLoadingCosting(false);
        }
    };

    const costingConfig = useMemo(() => {
        switch (valueAccount?.MethodId) {
            case 'MT004':
                return {
                    list: listFlockByUnit,
                    disable: false,
                    fetchApi: fetchApiListFlock,
                    getLabel: (option) =>
                        option
                            ? `${option.FlockId} - ${option.FlockName} - ${option.FarmOwnerName}`
                            : valueCostingMethod,
                    getValue: (option) => option.FlockId,
                    getValueById: (id) => listFlockByUnit.find((item) => item.FlockId === id),
                };
            case 'MT005':
            case 'MT007':
                return {
                    list: listFarmByUnit,
                    disable: false,
                    fetchApi: fetchApiListFarm,
                    getLabel: (option) =>
                        option
                            ? `${option.FarmCode} - ${option.FarmName} - ${option.FarmOwner}`
                            : valueCostingMethod,
                    getValue: (option) => option.FarmCode,
                    getValueById: (id) => listFarmByUnit.find((item) => item.FarmCode === id),
                };
            case 'MT008':
                return {
                    list: listAreaByUnit,
                    disable: false,
                    fetchApi: fetchApiListArea,
                    getLabel: (option) => (option ? `${option}` : valueCostingMethod),
                    getValue: (option) => option,
                    getValueById: (id) => listAreaByUnit.find((item) => item === id),
                };
            case 'MT002':
                return {
                    list: listMaterialByRegion,
                    disable: false,
                    fetchApi: fetchApiListMaterial,
                    getLabel: (option) =>
                        option
                            ? `${option.MatId} - ${option.MatName} - ${option.QuyCach}- ${option.DVT}`
                            : valueCostingMethod,
                    getValue: (option) => option.MatId,
                    getValueById: (id) => listMaterialByRegion.find((item) => item.MatId === id),
                };
            default:
                return {
                    list: [],
                    disable: true,
                    fetchApi: () => { },
                    getLabel: () => valueCostingMethod,
                    getValue: () => valueCostingMethod,
                    getValueById: () => valueCostingMethod,
                };
        }
    }, [
        listFlockByUnit,
        listFarmByUnit,
        listAreaByUnit,
        listMaterialByRegion,
        valueCostingMethod,
        valueAccount?.MethodId,
    ]);

    useEffect(() => {
        if (!isOpenEntryDetail) {
            setLoadedAccountOnce(false);
        }
    }, [isOpenEntryDetail]);

    useEffect(() => {
        const applySelectedEntryDetail = () => {
            if (!isOpenEntryDetail || statusDialogDetail === 'ADD') {
                resetData();
                return;
            }

            if (selectedEntryDetail?.AccountId) {
                setValueAccount({
                    AccountId: selectedEntryDetail.AccountId,
                    AccountName: selectedEntryDetail.AccountName,
                    MethodId: selectedEntryDetail.MethodId,
                    MethodName: selectedEntryDetail.MethodName,
                });
            }

            setValueCredit(selectedEntryDetail?.Amount_Cr || 0);
            setValueDebit(selectedEntryDetail?.Amount_Dr || 0);
            setValueDescription(selectedEntryDetail?.Description || '');
            setValueNonDeductible(!!selectedEntryDetail?.Non_Deductible);
            setValueAccountSubId(selectedEntryDetail?.AccountSubId || '');
            setValueAccountSubName(selectedEntryDetail?.SubAccountName || '');
            setValueAccountSubTypeId(selectedEntryDetail?.SubAccountTypeId || '');
            if (selectedEntryDetail?.CostingMethod) {
                const ids = selectedEntryDetail.CostingMethod
                    .split(',')
                    .map((v) => v.trim())
                    .filter(Boolean);

                setValueCostingMethod(ids);
            }
        };

        applySelectedEntryDetail();
    }, [isOpenEntryDetail, statusDialogDetail, selectedEntryDetail]);

    const resetData = () => {
        setValueAccount(null);
        setValueDescription('');
        setListAccountSub([]);
        setValueDebit(0);
        setValueCredit(0);
        setValueAccountSubId('');
        setValueAccountSubTypeId('');
        setValueAccountSubName('');
        setValueNonDeductible(false);
        setValueCostingMethod([]);
    };

    const handleAddDetail = () => {
        const now = new Date().toISOString();
        const newCostingMethod = valueCostingMethod
            .map(item => getCostingId(item))
            .join(', ');
        const newRow = {
            AccountName: valueAccount?.AccountName ?? '',
            MethodName: valueAccount?.MethodName,
            MethodId: valueAccount?.MethodId,
            SubAccountTypeName: '',
            EntryDetailId: valueId,
            EntryHdId: valueEntryId,
            AccountId: valueAccount?.AccountId ?? '',
            Description: valueDescription,
            Amount_Cr: valueCredit,
            Amount_Dr: valueDebit,
            CreatedAt: now,
            UpdatedAt: now,
            Active: true,
            AccountSubId: valueAccountSubId,
            CostingMethod: newCostingMethod,
            Non_Deductible: valueNonDeductible,
        };

        setDataAccountEntryDetails((prev) => [...prev, newRow]);
        resetData();
        onCloseEntryDetail();
    };

    const handleUpdateDetail = () => {
        if (!selectedEntryDetail) {
            onCloseEntryDetail();
            return;
        }

        const now = new Date().toISOString();
        const newCostingMethod = valueCostingMethod
            .map(item => getCostingId(item))
            .join(', ');
        const newRow = {
            AccountName: valueAccount?.AccountName ?? '',
            MethodName: valueAccount?.MethodName,
            MethodId: valueAccount?.MethodId,
            SubAccountName: valueAccountSubName,
            EntryDetailId: selectedEntryDetail.EntryDetailId,
            EntryHdId: valueEntryId,
            AccountId: valueAccount?.AccountId ?? '',
            Description: valueDescription,
            Amount_Cr: valueCredit,
            Amount_Dr: valueDebit,
            CreatedAt: now,
            UpdatedAt: now,
            Active: true,
            AccountSubId: valueAccountSubId,
            CostingMethod: newCostingMethod,
            Non_Deductible: valueNonDeductible,
        };

        setDataAccountEntryDetails((prev) =>
            prev.map((row) =>
                row.EntryDetailId === selectedEntryDetail.EntryDetailId ? { ...row, ...newRow } : row,
            ),
        );
        resetData();
        onCloseEntryDetail();
    };

    const handleSaveDetail = () => {
        if (statusDialogDetail === 'ADD') {
            handleAddDetail();
            return;
        }

        if (statusDialogDetail === 'UPDATE') {
            handleUpdateDetail();
            return;
        }

        onCloseEntryDetail();
    };

    OnMultiKeyEvent(handleSaveDetail, 's');

    const isViewMode = statusDialogDetail === 'VIEW';

    const accountAutocompleteLabel = (option) => {
        if (option) {
            return `${option.AccountId ?? ''} - ${option.AccountName ?? ''}`;
        }

        if (valueAccount?.AccountId) {
            return `${valueAccount.AccountId ?? ''} - ${valueAccount.AccountName ?? ''}`;
        }

        return '';
    };

    const getCostingId = (item) => {
        if (!item) return '';
        if (typeof item === 'string') return item;
        return costingConfig.getValue(item) ?? '';
    };

    const selectedCostingIds = new Set(
        (valueCostingMethod || []).map((item) => getCostingId(item)).filter(Boolean),
    );

    const accountAutocompleteFilter = (options, state) => {
        const input = state.inputValue.toLowerCase().trim();
        if (!input) return options;

        return options.filter((opt) =>
            `${opt.AccountId} - ${opt.AccountName}`.toLowerCase().includes(input),
        );
    };

    const accountSubAutocompleteValue =
        listAccountSub.find((acc) => acc.AccountSubId === valueAccountSubId) ||
        (valueAccountSubId
            ? { AccountSubId: valueAccountSubId, AccountSubName: valueAccountSubName }
            : null);

    const accountSubAutocompleteLabel = (option) => {
        if (option) {
            return `${option.AccountSubId} - ${option.AccountSubName}`;
        }

        if (valueAccountSubId) {
            return `${valueAccountSubId ?? ''} - ${valueAccountSubName ?? ''}`;
        }

        return '';
    };

    return (
        <React.Fragment>
            <Dialog open={isOpenEntryDetail} onClose={onCloseEntryDetail} maxWidth="md" fullWidth>
                <DialogTitle sx={{ background: '#ffc696', marginBottom: 2 }}>
                    {t('entry-title-detail')}: {t('no')}{' '}
                    {statusDialogDetail === 'ADD' ? valueId : selectedEntryDetail?.EntryDetailId}
                </DialogTitle>

                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Stack direction="column" spacing={1}>
                                <div>{t('account-code')}</div>
                                <Autocomplete
                                    size="small"
                                    value={valueAccount}
                                    options={listAccount}
                                    key={valueAccount?.Id || 'account-autocomplete'}
                                    onOpen={listAccount.length > 0 ? null : fetchApiListAccount}
                                    loading={loadingAccount}
                                    disabled={isViewMode}
                                    onChange={(_, newValue) => {
                                        if (newValue?.AccountId) {
                                            setValueAccount(newValue);
                                            setValueCostingMethod([]);
                                            setValueAccountSubTypeId(newValue.AccountSubTypeId);
                                        } else {
                                            setValueAccount(null);
                                            setValueAccountSubTypeId('');
                                            setValueCostingMethod([]);
                                        }
                                    }}
                                    getOptionLabel={accountAutocompleteLabel}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.Id}>
                                            {option.AccountId} - {option.AccountName}
                                        </li>
                                    )}
                                    filterOptions={accountAutocompleteFilter}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            size="small"
                                            label={t('account-code')}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loadingAccount ? (
                                                            <CircularProgress color="inherit" size={20} />
                                                        ) : null}
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
                                    disabled={isViewMode}
                                    value={accountSubAutocompleteValue}
                                    options={listAccountSub || []}
                                    onOpen={fetchApiListAccountSub}
                                    onChange={(_, newValue) => {
                                        if (newValue?.AccountSubId) {
                                            setValueAccountSubId(newValue.AccountSubId);
                                            setValueAccountSubName(newValue.AccountSubName);
                                        } else {
                                            setValueAccountSubId('');
                                            setValueAccountSubName('');
                                        }
                                    }}
                                    getOptionLabel={accountSubAutocompleteLabel}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            size="small"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loadingAccountSub ? (
                                                            <CircularProgress color="inherit" size={20} />
                                                        ) : null}
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
                                    size="small"
                                    disabled
                                    value={
                                        valueAccount?.MethodId
                                            ? `${valueAccount.MethodId} - ${valueAccount.MethodName}`
                                            : ''
                                    }
                                />
                            </Stack>
                        </Grid>

                        <Grid item xs={12}>
                            <Stack direction="column" spacing={1}>
                                <div>{t('Costing')}</div>
                                <Autocomplete
                                    size="small"
                                    freeSolo
                                    multiple
                                    value={valueCostingMethod || []}
                                    inputValue={valueCostingMethodFilter}
                                    options={costingConfig.list}
                                    onOpen={costingConfig.list.length > 0 ? null : costingConfig.fetchApi}
                                    loading={loadingCosting}
                                    disableCloseOnSelect
                                    onInputChange={(e, newInputValue, reason) => {
                                        if (reason !== 'reset') {
                                            setValueCostingMethodFilter(newInputValue);
                                        }
                                    }}
                                    onChange={(_, newValue) => {
                                        const expandedValues = [];
                                        const pushItem = (item) => {
                                            try {
                                                const costingValue = costingConfig.getValueById(item);
                                                expandedValues.push(costingValue);
                                            } catch (error) {
                                                console.log(error)
                                            }
                                        };


                                        (newValue || []).forEach((item) => {
                                            if (typeof item === 'string' && item.includes(',')) {
                                                item
                                                    .split(',')
                                                    .map((v) => v.trim())
                                                    .filter(Boolean)
                                                    .forEach((v) => pushItem(v));
                                            } else {
                                                expandedValues.push(item);
                                            }
                                        });

                                        setValueCostingMethod(expandedValues);
                                    }}
                                    onBlur={() => setValueCostingMethodFilter('')}
                                    renderTags={(value, getTagProps) => {
                                        if (!value?.length) return null;
                                        return (
                                            <>
                                                {value.map((option, index) => (
                                                    <Chip
                                                        {...getTagProps({ index })}
                                                        key={index}
                                                        color="primary"
                                                        variant="outlined"
                                                        label={getCostingId(option)}
                                                        size="small"
                                                    />
                                                ))}
                                            </>
                                        );
                                    }}
                                    disabled={costingConfig.disable || isViewMode}
                                    getOptionDisabled={(option) =>
                                        selectedCostingIds.has(getCostingId(option))
                                    }
                                    getOptionLabel={(option) => {
                                        if (typeof option === 'string') return option;
                                        if (option?.tempLabel) return option.tempLabel;
                                        return costingConfig.getLabel(option);
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
                                                        {loadingCosting ? (
                                                            <CircularProgress color="inherit" size={20} />
                                                        ) : null}
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
                                    disabled={isViewMode}
                                    placeholder="0"
                                    formatter={(val) =>
                                        `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    }
                                    parser={(val) => val.replace(/\$\s?|₫\s?|,/g, '')}
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
                                    value={valueCredit}
                                    disabled={isViewMode}
                                    placeholder="0"
                                    formatter={(val) =>
                                        `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    }
                                    parser={(val) => val.replace(/\$\s?|₫\s?|,/g, '')}
                                    onChange={(val) => setValueCredit(val || 0)}
                                />
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={2}>
                            <Stack spacing={1} alignItems="center">
                                <div>{t('non-deductible')}</div>
                                <Checkbox
                                    disabled={isViewMode}
                                    checked={!!valueNonDeductible}
                                    onChange={(e) => setValueNonDeductible(e.target.checked)}
                                />
                            </Stack>
                        </Grid>

                        <Grid item xs={12}>
                            <Stack spacing={1}>
                                <div>{t('description')}</div>
                                <TextField
                                    disabled={isViewMode}
                                    rows={3}
                                    value={valueDescription}
                                    onChange={(e) => setValueDescription(e.target.value)}
                                    placeholder="..."
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
                        onClick={handleSaveDetail}
                        fullWidth
                    >
                        {t('button-save')}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
