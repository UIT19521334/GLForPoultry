import Header from '~/components/Layout/Header';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { styled, alpha, useTheme } from '@mui/material/styles';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));
function DefaultLayout({ children, title }) {
    return (
        <div>
            <Header title={title} />
            <DrawerHeader />
            <div className={'container'}>{children}</div>
        </div>
    );
}

export default DefaultLayout;
