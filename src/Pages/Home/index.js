import React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import imgDashboard from '../../assets/images/dashboard.jpg';
import { useSelector } from 'react-redux';

export default function Dashboard({ title }) {
    const loading = useSelector((state) => state.FetchApi.isLoading);

    return (
        <div className="main">
            <div role="presentation">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/material-ui/getting-started/installation/"></Link>
                    <Typography color="text.primary">{title}</Typography>
                </Breadcrumbs>
            </div>
            <img src={imgDashboard} alt="dashboard" />
        </div>
    );
}
