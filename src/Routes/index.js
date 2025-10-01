import Home from '~/Pages/Home';
import Account from '~/Pages/Master/Account';
import AccountGroup from '~/Pages/Master/AccountGroup';
import AccountingEntry from '~/Pages/Accountant/AccountingEntry';
import CostAllocation from '~/Pages/Accountant/CostAllocation';
import CloseAccountingPeriod from '~/Pages/Accountant/CloseAccountingPeriod';
import OpenAccountingPeriod from '~/Pages/Accountant/OpenAccountingPeriod';
import Report_COGM from '~/Pages/Report/COGM';
import Report_InOut_Ward from '~/Pages/Report/InOutWard';
import UserProfile from '~/Pages/UserProfile';
import SubAccount from '~/Pages/Master/SubAccount';
import Expense from '~/Pages/Master/Expense';

// Id lấy từ menu lv2 của master app
const otherRoutes = [
    { path: '/', component: Home, title: 'Dashboard' },
    { path: '/userprofile', component: UserProfile, title: 'menu-profile' },
];

export const settingRoutes = [
    { path: '/accountgroup', component: AccountGroup, title: 'menu-acc-group', menuid: 618 },
    { path: '/expense/*', component: Expense, title: 'expense-group', menuid: 620 },
    { path: '/subaccount/*', component: SubAccount, title: 'menu-sub-acc', menuid: 622 },
    { path: '/account/*', component: Account, title: 'menu-acc', menuid: 621 },
    // { path: '/indexrate', component: IndexRate, title: 'Index Rate' },
];
export const accountantRoutes = [
    { path: '/accountingentry/*', component: AccountingEntry, title: 'menu-entry', menuid: 623 },
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
