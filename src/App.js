import { Fragment } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from '~/Routes';
import { DefaultLayout } from './components/Layout';
import { AuthenticatedTemplate, UnauthenticatedTemplate, MsalProvider, useMsal } from '@azure/msal-react';
import Login from './Pages/Login';
import '~/AppStyles.css';
import CallApiMaster from './CallApiMaster';
import './globals';
import '@boldreports/javascript-reporting-controls/Scripts/bold.report-designer.min';
import '@boldreports/javascript-reporting-controls/Scripts/bold.report-viewer.min';
import '@boldreports/javascript-reporting-controls/Content/material/bold.reports.all.min.css';
import '@boldreports/javascript-reporting-controls/Content/material/bold.reportdesigner.min.css';
//Data-Visualization
import '@boldreports/javascript-reporting-controls/Scripts/data-visualization/ej.bulletgraph.min';
import '@boldreports/javascript-reporting-controls/Scripts/data-visualization/ej.chart.min';
//Reports react base
import '@boldreports/react-reporting-components/Scripts/bold.reports.react.min';
import ApiToken from './components/Api/ApiToken';
import LoginError from './Pages/Login/loginError';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18next from 'i18next';
import './TranslationLanguage/i18n.js';
import { Spin } from 'antd';

const WrapperView = () => {
    CallApiMaster();
    const login = ApiToken();
    const darkTheme = createTheme({
        palette: {
            mode: 'light',
        },
    });
    i18next.init({
        interpolation: { escapeValue: false }, // React already does escaping
    });

    return (
        <ThemeProvider theme={darkTheme}>
            <Router>
                <div className="App">
                    <UnauthenticatedTemplate>
                        <Routes>
                            <Route exact path="/" element={<Login status={false} />} />
                        </Routes>
                    </UnauthenticatedTemplate>
                    <AuthenticatedTemplate>
                        {login.status ? (
                            <Routes>
                                {publicRoutes.map((route, index) => {
                                    let Layout = DefaultLayout;
                                    if (route.layout) {
                                        Layout = route.layout;
                                    } else if (route.layout === null) {
                                        Layout = Fragment;
                                    }

                                    const Page = route.component;
                                    return (
                                        <Route
                                            key={index}
                                            path={route.path}
                                            exact
                                            element={
                                                <Layout title={route.title}>
                                                    <Page title={route.title} />
                                                </Layout>
                                            }
                                        />
                                    );
                                })}
                            </Routes>
                        ) : login.status == false ? (
                            <Routes>
                                <Route exact path="/" element={<LoginError mess={login.token} />} />
                            </Routes>
                        ) : (
                            <Routes>
                                <Route exact path="/" element={<Login status={true} />} />
                            </Routes>
                        )}
                    </AuthenticatedTemplate>
                </div>
            </Router>
        </ThemeProvider>
    );
};
const App = ({ msalInstance }) => {
    return (
        <MsalProvider instance={msalInstance}>
            <I18nextProvider i18n={i18next}>
                <WrapperView />
            </I18nextProvider>
        </MsalProvider>
    );
};
export default App;
