import styles from '~/Pages/Login/Login.module.scss';
import classNames from 'classnames/bind';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
//import Button from 'react-bootstrap/Button';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { AuthenticatedTemplate, useMsal } from '@azure/msal-react';
import { loginRequest } from '~/Config';
import { MicrosoftLoginButton } from 'react-social-login-buttons';
import { Input } from 'antd';

const cx = classNames.bind(styles);

function LoginError({ mess }) {
    const [userName, setUserName] = useState('');
    const [passWord, setPassWord] = useState('');
    const { instance } = useMsal();

    const activeAccount = instance.getActiveAccount();
    // console.log(activeAccount);
    if (activeAccount) {
        const userName = activeAccount.username.split('@');
        localStorage.setItem('UserName', userName[0]);
    }

    const handleRedirect = () => {
        instance.loginRedirect({ ...loginRequest, prompt: 'create' }).catch((error) => console.log(error));
    };

    const handleLogout = () => {
        instance.logout();
    };

    return (
        <div className={cx('login-background')}>
            <div className={cx('login-container')}>
                <div className={cx('login-content')}>
                    {/* <div className={cx('login-title')}>Login Page</div> */}
                    <Form>
                        <div className="col-12 text-center mt-4">
                            <span className={cx('login-with')} style={{ color: 'red' }}>
                                {mess}
                            </span>
                        </div>
                        <div style={{ marginTop: 50 }}>
                            <MicrosoftLoginButton text="Log out" onClick={handleLogout} />
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default LoginError;
