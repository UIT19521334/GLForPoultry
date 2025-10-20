import Home from '~/Pages/Home';
import Account from '~/Pages/Master/Account';
import AccountGroup from '~/Pages/Master/AccountGroup';
import AccountingEntry from '~/Pages/Transaction/AccountingEntry';
import CostAllocation from '~/Pages/Transaction/CostAllocation';
import CloseAccountingPeriod from '~/Pages/Transaction/CloseAccountingPeriod';
import OpenAccountingPeriod from '~/Pages/Transaction/OpenAccountingPeriod';
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

const MENU_MASTER = 121
const MENU_TRANSACTION = 122

export const masterRoutes = [
    { path: '/accountgroup', component: AccountGroup, title: 'menu-acc-group', menuid: 618, groupid: MENU_MASTER },
    { path: '/expense/*', component: Expense, title: 'menu-expense', menuid: 620, groupid: MENU_MASTER },
    { path: '/subaccount/*', component: SubAccount, title: 'menu-sub-acc', menuid: 622, groupid: MENU_MASTER },
    { path: '/account/*', component: Account, title: 'menu-acc', menuid: 621, groupid: MENU_MASTER },
];
export const transactionRoutes = [
    { path: '/accountingentry/*', component: AccountingEntry, title: 'menu-entry', menuid: 623, groupid: MENU_TRANSACTION },
    { path: '/costallocation', component: CostAllocation, title: 'menu-allocation', menuid: 704, groupid: MENU_TRANSACTION },
    { path: '/closeaccountingperiod', component: CloseAccountingPeriod, title: 'menu-close-period', menuid: 702, groupid: MENU_TRANSACTION },
    { path: '/openaccountingperiod', component: OpenAccountingPeriod, title: 'menu-open-period', menuid: 703, groupid: MENU_TRANSACTION },
];
export const reportRoutes = [
    // { path: '/reportcogm', component: Report_COGM, title: 'menu-report-cogm' },
    // { path: '/reportinout', component: Report_InOut_Ward, title: 'menu-report-inout-ward' },
    // { path: '/reportcogs', component: Report_COGS, title: 'menu-report-cogs' },
    // { path: '/reportcogsmeat', component: Report_COGS_Meat, title: 'menu-report-cogs-meat' },
];

export const publicRoutes = [
    ...otherRoutes,
    ...masterRoutes,
    ...transactionRoutes,
    ...reportRoutes,
];
