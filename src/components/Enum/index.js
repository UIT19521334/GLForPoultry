import { useTranslation } from 'react-i18next';

export function Enum_Status_CostAllocation() {
    const { t } = useTranslation();
    const status = [
        { code: '', name: t('enum-status-all') },
        // { code: '0', name: 'DELETED' },
        { code: '1', name: t('enum-status-new') },
        { code: '2', name: t('enum-status-processing') },
        { code: '3', name: t('enum-status-pause') },
        { code: '4', name: t('enum-status-finish') },
    ];
    return status;
}
