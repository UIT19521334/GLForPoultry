import * as React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import 'react-toastify/dist/ReactToastify.css';
import { Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { Tab, Tabs } from '@mui/material';
import { Outlet, Route, Routes, useNavigate, useLocation, Navigate } from 'react-router-dom';
import SubAccountDetails from './SubAccount';
import SubAccountType from './SubAccountType';


function ExpenseLayout({ title }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    // Get current tab from URL path
    const currentTab = location.pathname.includes('subaccount-details') ? 'subaccount-details' : 'subaccount-type';

    const handleChangeTab = (event, newValue) => {
        navigate(newValue);
    };

    return (
        <Spin size="large" tip={t('loading')} spinning={false}>
            <div className="main">
                <div role="presentation">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            underline="hover"
                            color="inherit"
                            href="/material-ui/getting-started/installation/"
                        ></Link>
                        <Typography color="text.primary">{t(title)}</Typography>
                    </Breadcrumbs>
                </div>
                <Box
                    sx={{
                        flexGrow: 1,
                        '& .super-app-theme--header': {
                            backgroundColor: '#ffc696',
                        },
                    }}
                >
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={currentTab}
                            onChange={handleChangeTab}
                            TabIndicatorProps={{
                                style: {
                                    backgroundColor: '#ed6c02',
                                },
                            }}
                            textColor="inherit"
                            sx={{
                                '.Mui-selected': {
                                    color: '#ed6c02',
                                    backgroundColor: '#f5e1d0',
                                },
                            }}
                            variant="fullWidth"
                        >
                            <Tab label={t('menu-sub-acc')} value="subaccount-details" />
                            <Tab label={t('menu-sub-acc-type')} value="subaccount-type" />
                        </Tabs>
                        <Box
                            sx={{
                                flexGrow: 1,
                            }}
                        >
                            <Outlet />
                        </Box>
                    </Box>
                </Box>
            </div>
        </Spin>
    );
}

function Expense({ title }) {
    return (
        <Routes>
            <Route element={<ExpenseLayout title={title} />}>
                <Route path="subaccount-details" element={<SubAccountDetails />} />
                <Route path="subaccount-type" element={<SubAccountType />} />
                <Route index element={<Navigate to="subaccount-details" replace />} />
            </Route>
        </Routes>
    );
}

export default Expense;
