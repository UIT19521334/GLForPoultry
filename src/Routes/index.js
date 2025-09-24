import Home from '~/Pages/Home';
import Account from '~/Pages/Setting/Account';
import AccountGroup from '~/Pages/Setting/AccountGroup';
import AccountingEntry from '~/Pages/Accountant/AccountingEntry';
import CostAllocation from '~/Pages/Accountant/CostAllocation';
import CloseAccountingPeriod from '~/Pages/Accountant/CloseAccountingPeriod';
import OpenAccountingPeriod from '~/Pages/Accountant/OpenAccountingPeriod';
import Report_COGM from '~/Pages/Report/COGM';
import Report_InOut_Ward from '~/Pages/Report/InOutWard';
import UserProfile from '~/Pages/UserProfile';
import Report_COGS from '~/Pages/Report/COGS/COGSindex';
import Report_COGS_Meat from '~/Pages/Report/COGSMeat';
import IndexRate from '~/Pages/Setting/IndexRate';
import SubAccount from '~/Pages/Setting/SubAccount';
import Expense from '~/Pages/Setting/Expense';

const otherRoutes = [
    { path: '/', component: Home, title: 'Dashboard' },
    { path: '/userprofile', component: UserProfile, title: 'menu-profile' },
];

export const settingRoutes = [
    { path: '/accountgroup', component: AccountGroup, title: 'menu-acc-group' },
    { path: '/subaccount/*', component: SubAccount, title: 'menu-sub-acc' },
    { path: '/expense/*', component: Expense, title: 'menu-expense' },
    { path: '/account/*', component: Account, title: 'menu-acc' },
    // { path: '/indexrate', component: IndexRate, title: 'Index Rate' },
];
export const accountantRoutes = [
    // { path: '/accountingentry', component: AccountingEntry, title: 'menu-entry' },
    // { path: '/costallocation', component: CostAllocation, title: 'menu-allocation' },
    // { path: '/closeaccountingperiod', component: CloseAccountingPeriod, title: 'menu-close-period' },
    // { path: '/openaccountingperiod', component: OpenAccountingPeriod, title: 'menu-open-period' },
];
export const reportRoutes = [
    // { path: '/reportcogm', component: Report_COGM, title: 'menu-report-cogm' },
    // { path: '/reportinout', component: Report_InOut_Ward, title: 'menu-report-inout-ward' },
    // { path: '/reportcogs', component: Report_COGS, title: 'menu-report-cogs' },
    // { path: '/reportcogsmeat', component: Report_COGS_Meat, title: 'menu-report-cogs-meat' },
];

export const publicRoutes = [
    ...otherRoutes,
    ...settingRoutes,
    ...accountantRoutes,
    ...reportRoutes,
];
