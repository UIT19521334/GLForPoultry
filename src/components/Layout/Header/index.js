import * as React from 'react';
import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import { settingRoutes, accountantRoutes, reportRoutes, publicRoutes } from '~/Routes';
import { Link, NavLink } from 'react-router-dom';
import { styled, alpha, useTheme } from '@mui/material/styles';
// import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import Tooltip from '@mui/material/Tooltip';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import { useLocation } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import DrawIcon from '@mui/icons-material/Draw';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ChromeReaderModeIcon from '@mui/icons-material/ChromeReaderMode';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Api from '~/DomainApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConfigProvider, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { AttachMoney, GroupAdd, LibraryAdd, ManageAccounts, SupervisedUserCircle } from '@mui/icons-material';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SavingsIcon from '@mui/icons-material/Savings';
import { Button, Stack } from '@mui/material';
import ReactNiceAvatar, { genConfig } from 'react-nice-avatar';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import PercentIcon from '@mui/icons-material/Percent';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentUnit } from '~/Redux/Reducer/Thunk';

const cx = classNames.bind(styles);

/**side PC */
const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));
const DrawerPc = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    '.Mui-selected': {
        color: '#ed6c02',
        backgroundColor: '#f5e1d0',
    },
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    }),
}));
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));
/** app bar*/
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));
// const headers = {
//     'Content-Type': 'application/json',
// };

function Header() {
    const { t } = useTranslation();
    const { instance } = useMsal();
    const dispatch = useDispatch();
    const activeAccount = instance.getActiveAccount();
    const [openReport, setOpenReport] = React.useState(false);
    const [avaConfig, setAvaConfig] = React.useState(genConfig());
    const dataUnit = useSelector((state) => state.FetchApi.userAccess.units);
    const currentUnit = useSelector((state) => state.FetchApi.currentUnit);
    const menu = useSelector((state) => state.FetchApi.menu);

    const handleClickReport = () => {
        setOpenReport(!openReport);
    };

    const userName = activeAccount.name.split('(');
    const handleChangeUnit = (event) => {
        const data = event.target.value && dataUnit.find(item => item.UnitId === event.target.value);
        dispatch(updateCurrentUnit(data))
        localStorage.setItem('Unit', data.UnitId);
    };
    const location = useLocation();
    /**side pc */
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleLogout = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
        instance.logout();
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };
    /**side Mobile */
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
        if (open) {
            handleDrawerOpen();
        }
        if (!open) {
            handleDrawerClose();
        }
    };

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
        >
            <List>
                {['Inbox'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>{index % 2 === 0 ? <HomeIcon /> : <MailIcon />}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider
                sx={{
                    backgroundColor: '#ed6c02',
                }}
            />
            <ListItem key={'menu'} disablePadding sx={{ display: 'block' }} onClick={toggleDrawer('left', false)}>
                <NavLink to={'/'} style={{ textDecoration: 'none', color: 'black' }}>
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        selected={location.pathname === '/' ? true : false}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                                color: '#ed6c02',
                            }}
                        >
                            {/* <HomeIcon /> */}
                            <AssessmentIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Dashboard'} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                </NavLink>
            </ListItem>
            <Divider
                sx={{
                    backgroundColor: '#ed6c02',
                }}
            />
            {settingRoutes.map((route, index) => {
                return (
                    <ListItem
                        key={route.title}
                        disablePadding
                        sx={{ display: menu.includes(route.menuid) ? 'block' : 'none' }}
                        onClick={toggleDrawer('left', false)}
                    >
                        <NavLink to={route.path} style={{ textDecoration: 'none', color: 'black' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                selected={location.pathname === route.path ? true : false}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                        color: '#ed6c02',
                                    }}
                                >
                                    {index === 0 ? <GroupIcon /> : index === 1 ? <PersonIcon /> : <PercentIcon />}
                                </ListItemIcon>
                                <ListItemText primary={t(route.title)} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </NavLink>
                    </ListItem>
                );
            })}
            <Divider
                sx={{
                    backgroundColor: '#ed6c02',
                }}
            />
            {accountantRoutes.map((route, index) => {
                return (
                    <ListItem
                        key={route.title}
                        disablePadding
                        sx={{ display: 'block' }}
                        onClick={toggleDrawer('left', false)}
                    >
                        <NavLink to={route.path} style={{ textDecoration: 'none', color: 'black' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                selected={location.pathname === route.path ? true : false}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                        color: '#ed6c02',
                                    }}
                                >
                                    {index === 0 ? (
                                        <DrawIcon />
                                    ) : index === 1 ? (
                                        <ManageHistoryIcon />
                                    ) : index === 2 ? (
                                        <LockIcon />
                                    ) : index === 3 ? (
                                        <LockOpenIcon />
                                    ) : (
                                        <SavingsIcon />
                                    )}
                                </ListItemIcon>
                                <ListItemText primary={t(route.title)} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </NavLink>
                    </ListItem>
                );
            })}

            <Divider
                sx={{
                    backgroundColor: '#ed6c02',
                }}
            />
            <ListItemButton onClick={handleClickReport}>
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: '#ed6c02',
                    }}
                >
                    {/* <AccountBalanceWalletIcon /> */}
                    {openReport ? <ExpandLess /> : <ExpandMore />}
                </ListItemIcon>
                <ListItemText primary={t('report')} sx={{ opacity: open ? 1 : 0, color: '#ed6c02' }} />
            </ListItemButton>
            {reportRoutes.map((route, index) => {
                return (
                    <Collapse key={route.title} in={openReport} timeout="auto" unmountOnExit>
                        <ListItem
                            key={route.title}
                            disablePadding
                            sx={{ display: 'block' }}
                            onClick={toggleDrawer('left', false)}
                        >
                            <NavLink to={route.path} style={{ textDecoration: 'none', color: 'black' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
                                    selected={location.pathname === route.path ? true : false}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                            color: '#ed6c02',
                                        }}
                                    >
                                        {index === 0 ? (
                                            <ArticleIcon />
                                        ) : index === 1 ? (
                                            <LibraryBooksIcon />
                                        ) : index === 2 ? (
                                            <ChromeReaderModeIcon />
                                        ) : (
                                            <TextSnippetIcon />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText primary={t(route.title)} sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </NavLink>
                        </ListItem>
                    </Collapse>
                );
            })}
            <Divider
                sx={{
                    backgroundColor: '#ed6c02',
                }}
            />
        </Box>
    );
    /**App bar */
    const [anchorEl, setAnchorEl] = React.useState(false);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(false);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={isMenuOpen}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                    },
                    '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <Link to={'/userprofile'} style={{ textDecoration: 'none', color: '#000000DE' }}>
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    {t('menu-profile')}
                </MenuItem>
            </Link>
            <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                    <Logout fontSize="small" />
                </ListItemIcon>
                {t('menu-logout')}
            </MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    //! handler change language
    const { i18n } = useTranslation();

    const handleLanguageChange = (e) => {
        if (e) {
            i18n.changeLanguage('en');
            localStorage.setItem('language', 'en');
        } else {
            i18n.changeLanguage('vn');
            localStorage.setItem('language', 'vn');
        }
    };
    return (
        <Box sx={{ flexGrow: 1 }}>
            <ToastContainer position='bottom-right' stacked />
            <AppBar position="fixed" color="warning">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2, display: { xs: 'block', sm: 'block' } }}
                        onClick={toggleDrawer('left', !open)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h5" component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
                        Poultry GL
                    </Typography>
                    <Stack direction={'column'}>
                        <Typography variant="h5" component="div" sx={{ display: { xs: 'block', sm: 'none' } }}>
                            GL
                        </Typography>
                        <Typography
                            variant="h8"
                            component="div"
                            sx={{ display: { xs: 'block', sm: 'block' }, marginLeft: 1 }}
                        >
                            v1.0.0
                        </Typography>
                    </Stack>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
                    </Search>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'flex', md: 'flex' } }}>
                        <Typography
                            variant="h7"
                            component="div"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Switch
                                checkedChildren="&nbsp;&nbsp;EN&nbsp;&nbsp;"
                                unCheckedChildren="VN"
                                style={{
                                    backgroundColor: i18n.language === 'en' ? 'green' : 'crimson',
                                    transform: [{ scaleX: 1 }, { scaleY: 0.8 }],
                                }}
                                onChange={handleLanguageChange}
                                checked={i18n.language === 'en' ? true : false}
                            />
                        </Typography>

                        <FormControl
                            sx={{
                                m: 1,
                                // minWidth: 100,
                                // maxWidth: 200,
                                width: '100%',
                                // height: 48,
                                paddingTop: 0.5,
                                marginRight: 2,
                            }}
                            size="small"
                        >{dataUnit.length > 0 && currentUnit && (
                            <Select
                                labelId="demo-simple-select-helper-label"
                                id="demo-simple-select-helper"
                                value={currentUnit.UnitId}
                                // label="Age"
                                displayEmpty
                                onChange={handleChangeUnit}
                                sx={{
                                    backgroundColor: 'white',
                                }}
                            >
                                {dataUnit.map((unit) => {
                                    return (
                                        <MenuItem key={unit.UnitId} value={unit.UnitId}>
                                            {unit.UnitName}
                                        </MenuItem>
                                    );
                                })}
                            </Select>)}
                        </FormControl>

                        <Typography
                            variant="h7"
                            component="div"
                            sx={{
                                display: { xs: 'none', sm: 'flex' },
                                width: '100%',
                                // textAlign: 'center',
                                alignItems: 'center',
                                whiteSpace: 'nowrap',
                                // overflow: 'hidden',
                                // textOverflow: 'ellipsis',
                            }}
                        >
                            {userName[0]}
                        </Typography>
                        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                            <Badge badgeContent={4} color="error">
                                <MailIcon />
                            </Badge>
                        </IconButton>
                        <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
                            <Badge badgeContent={17} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <Tooltip title="Open Profile">
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                                sx={{ textAlign: 'unset' }}
                            >
                                <div style={{ display: 'block' }}>
                                    <ReactNiceAvatar style={{ width: '35px', height: '35px' }} {...avaConfig} />
                                </div>
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
            <Drawer
                sx={{
                    display: { xs: 'flex', md: 'none' },
                    '.Mui-selected': {
                        color: '#ed6c02',
                        backgroundColor: '#f5e1d0',
                    },
                }}
                anchor={'left'}
                open={state['left']}
                onClose={toggleDrawer('left', false)}
            >
                {list('left')}
            </Drawer>
            <DrawerPc variant="permanent" open={open} sx={{ display: { xs: 'none', md: 'flex' } }}>
                <DrawerHeader>
                    <IconButton onClick={toggleDrawer('left', false)}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <ListItem
                        key={'menu'}
                        disablePadding
                        sx={{ display: 'block' }}
                        onClick={toggleDrawer('left', false)}
                    >
                        <NavLink to={'/'} style={{ textDecoration: 'none', color: 'black' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                selected={location.pathname === '/' ? true : false}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                        color: '#ed6c02',
                                    }}
                                >
                                    {/* <HomeIcon /> */}
                                    <AssessmentIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Dashboard'} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </NavLink>
                    </ListItem>
                    <Divider
                        sx={{
                            backgroundColor: '#ed6c02',
                        }}
                    />
                    {settingRoutes.map((route) => {
                        return (
                            <ListItem
                                key={route.title}
                                disablePadding
                                sx={{ display: menu.includes(route.menuid) ? 'block' : 'none' }}
                                onClick={toggleDrawer('left', false)}
                            >
                                <Link to={route.path} style={{ textDecoration: 'none', color: 'black' }}>
                                    <ListItemButton
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: open ? 'initial' : 'center',
                                            px: 2.5,
                                        }}
                                        selected={location.pathname === route.path ? true : false}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: open ? 3 : 'auto',
                                                justifyContent: 'center',
                                                color: '#ed6c02',
                                            }}
                                        >
                                            {route.title === 'menu-acc-group' ? (
                                                <GroupIcon />
                                            ) : route.title === 'menu-sub-acc' ? (
                                                <GroupAdd />
                                            ) : route.title === 'menu-sub-acc-type' ? (
                                                <ManageAccounts />
                                            ) : route.title === 'menu-expense' ? (
                                                <AttachMoney />
                                            ) : route.title === 'menu-acc' ? (
                                                <PersonIcon />
                                            ) : (
                                                <PercentIcon />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText primary={t(route.title)} sx={{ opacity: open ? 1 : 0 }} />
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                        );
                    })}
                    <Divider
                        sx={{
                            backgroundColor: '#ed6c02',
                        }}
                    />
                    {accountantRoutes.map((route, index) => {
                        return (
                            <ListItem
                                key={route.title}
                                disablePadding
                                sx={{ display: 'block' }}
                                onClick={toggleDrawer('left', false)}
                            >
                                <NavLink to={route.path} style={{ textDecoration: 'none', color: 'black' }}>
                                    <ListItemButton
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: open ? 'initial' : 'center',
                                            px: 2.5,
                                        }}
                                        selected={location.pathname === route.path ? true : false}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: open ? 3 : 'auto',
                                                justifyContent: 'center',
                                                color: '#ed6c02',
                                            }}
                                        >
                                            {index === 0 ? (
                                                <DrawIcon />
                                            ) : index === 1 ? (
                                                <ManageHistoryIcon />
                                            ) : index === 2 ? (
                                                <LockIcon />
                                            ) : index === 3 ? (
                                                <LockOpenIcon />
                                            ) : (
                                                <SavingsIcon />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText primary={t(route.title)} sx={{ opacity: open ? 1 : 0 }} />
                                    </ListItemButton>
                                </NavLink>
                            </ListItem>
                        );
                    })}

                    <Divider
                        sx={{
                            backgroundColor: '#ed6c02',
                        }}
                    />
                    <ListItemButton onClick={handleClickReport}>
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                                color: '#ed6c02',
                            }}
                        >
                            {/* <AssignmentIcon /> */}
                            {openReport ? <ExpandLess /> : <ExpandMore />}
                        </ListItemIcon>
                        <ListItemText primary={t('report')} sx={{ opacity: open ? 1 : 0, color: '#ed6c02' }} />
                    </ListItemButton>
                    {reportRoutes.map((route, index) => {
                        return (
                            <Collapse key={route.title} in={openReport} timeout="auto" unmountOnExit>
                                <ListItem
                                    key={route.title}
                                    disablePadding
                                    sx={{ display: 'block' }}
                                    onClick={toggleDrawer('left', false)}
                                >
                                    <NavLink to={route.path} style={{ textDecoration: 'none', color: 'black' }}>
                                        <ListItemButton
                                            sx={{
                                                minHeight: 48,
                                                justifyContent: open ? 'initial' : 'center',
                                                px: 2.5,
                                            }}
                                            selected={location.pathname === route.path ? true : false}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: 0,
                                                    mr: open ? 3 : 'auto',
                                                    justifyContent: 'center',
                                                    color: '#ed6c02',
                                                }}
                                            >
                                                {index === 0 ? (
                                                    <ArticleIcon />
                                                ) : index === 1 ? (
                                                    <LibraryBooksIcon />
                                                ) : index === 2 ? (
                                                    <ChromeReaderModeIcon />
                                                ) : (
                                                    <TextSnippetIcon />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText primary={t(route.title)} sx={{ opacity: open ? 1 : 0 }} />
                                        </ListItemButton>
                                    </NavLink>
                                </ListItem>
                            </Collapse>
                        );
                    })}
                    <Divider
                        sx={{
                            backgroundColor: '#ed6c02',
                        }}
                    />
                </List>
            </DrawerPc>
        </Box>
    );
}
export default Header;
