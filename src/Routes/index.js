import Home from '~/Pages/Home';
import Account from '~/Pages/Setting/Account';
import AccountGroup from '~/Pages/Setting/AccountGroup';
import AccountingEntry from '~/Pages/Accountant/AccountingEntry';
import CostAllocation from '~/Pages/Accountant/CostAllocation';
import CloseAccountingPeriod from '~/Pages/Accountant/CloseAccountingPeriod';
import OpenAccountingPeriod from '~/Pages/Accountant/OpenAccountingPeriod';
import { HeaderLayoutOnly } from '~/components/Layout';
import Report_COGM from '~/Pages/Report/COGM';
import Report_InOut_Ward from '~/Pages/Report/InOutWard';
import { useTranslation } from 'react-i18next';
import LivePig from '~/Pages/Accountant/LivePig';
import UserProfile from '~/Pages/UserProfile';
import Report_COGS from '~/Pages/Report/COGS/COGSindex';
import Report_COGS_Meat from '~/Pages/Report/COGSMeat';
import IndexRate from '~/Pages/Setting/IndexRate';
import SubAccount from '~/Pages/Setting/SubAccount';

export const publicRoutes = [
    { path: '/', component: Home, title: 'Dashboard' },
    { path: '/accountgroup', component: AccountGroup, title: 'menu-acc-group' },
    { path: '/subaccount', component: SubAccount, title: 'menu-sub-acc' },
    { path: '/account', component: Account, title: 'menu-acc' },
    { path: '/indexrate', component: IndexRate, title: 'Index Rate' },

    { path: '/accountingentry', component: AccountingEntry, title: 'menu-entry' },
    { path: '/costallocation', component: CostAllocation, title: 'menu-allocation' },
    { path: '/closeaccountingperiod', component: CloseAccountingPeriod, title: 'menu-close-period' },
    { path: '/openaccountingperiod', component: OpenAccountingPeriod, title: 'menu-open-period' },
    { path: '/reportcogm', component: Report_COGM, title: 'menu-report-cogm' },
    { path: '/reportinout', component: Report_InOut_Ward, title: 'menu-report-inout-ward' },
    { path: '/userprofile', component: UserProfile, title: 'menu-profile' },
    { path: '/reportcogs', component: Report_COGS, title: 'menu-report-cogs' },
    { path: '/reportcogsmeat', component: Report_COGS_Meat, title: 'menu-report-cogs-meat' },

    // { path: '/livepig', component: LivePig, title: 'live-pig' },
    // { path: '/reportcogm', component: Report_COGM, title: 'menu-report-cogm' },
    // { path: '/following', component: Following, layout: HeaderLayoutOnly },
    // { path: '/login', component: Login, layout: null },
];

export const settingRoutes = [
    { path: '/accountgroup', component: AccountGroup, title: 'menu-acc-group' },
    { path: '/subaccount', component: SubAccount, title: 'menu-sub-acc' },
    { path: '/account', component: Account, title: 'menu-acc' },
    { path: '/indexrate', component: IndexRate, title: 'Index Rate' },
];
export const accountantRoutes = [
    { path: '/accountingentry', component: AccountingEntry, title: 'menu-entry' },
    { path: '/costallocation', component: CostAllocation, title: 'menu-allocation' },
    { path: '/closeaccountingperiod', component: CloseAccountingPeriod, title: 'menu-close-period' },
    { path: '/openaccountingperiod', component: OpenAccountingPeriod, title: 'menu-open-period' },
    // { path: '/livepig', component: LivePig, title: 'live-pig' },
];
export const reportRoutes = [
    { path: '/reportcogm', component: Report_COGM, title: 'menu-report-cogm' },
    { path: '/reportinout', component: Report_InOut_Ward, title: 'menu-report-inout-ward' },
    { path: '/reportcogs', component: Report_COGS, title: 'menu-report-cogs' },
    { path: '/reportcogsmeat', component: Report_COGS_Meat, title: 'menu-report-cogs-meat' },
];
