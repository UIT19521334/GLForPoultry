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
import { Input, Spin } from 'antd';
import { InteractionRequiredAuthError } from '@azure/msal-browser';

const cx = classNames.bind(styles);

function Login({ mess, status }) {
    const [userName, setUserName] = useState('');
    const [passWord, setPassWord] = useState('');
    const { instance } = useMsal();

    const activeAccount = instance.getActiveAccount();
    // console.log(activeAccount);
    if (activeAccount) {
        const userName = activeAccount.username.split('@');
        localStorage.setItem('UserName', userName[0]);

        var request = {
            scopes: ['User.Read'],
        };

        instance
            .acquireTokenSilent(request)
            .then((tokenResponse) => {
                console.log('token', tokenResponse.accessToken);
            })
            .catch((error) => {
                if (error instanceof InteractionRequiredAuthError) {
                    // fallback to interaction when silent call fails
                    return instance.acquireTokenRedirect(request);
                }

                // handle other errors
            });
    }

    const handleRedirect = () => {
        instance.loginRedirect({ ...loginRequest, prompt: 'create' }).catch((error) => console.log(error));
    };

    const handleOnChangeLogin = (name, pass) => {
        if (name != null) {
            setUserName(name);
        }
        if (pass != null) {
            setPassWord(pass);
        }
    };
    const handleOnClickLogin = () => {
        console.log({ userName, passWord });
    };

    return (
        <Spin size="large" tip={'Loading'} spinning={status}>
            <div className={cx('login-background')}>
                <div className={cx('login-container')}>
                    <div className={cx('login-content')}>
                        {/* <div className={cx('login-title')}>Login Page</div> */}
                        <Form>
                            <Form.Group className="mb-3" controlId="formGroupEmail">
                                <Form.Label>User Name</Form.Label>
                                <Input
                                    size="large"
                                    type="email"
                                    placeholder="Enter User Name"
                                    value={userName}
                                    onChange={(event) => handleOnChangeLogin(event.target.value, null)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formGroupPassword">
                                <Form.Label>Password</Form.Label>
                                <Input.Password
                                    size="large"
                                    type="password"
                                    placeholder="Enter Password"
                                    value={passWord}
                                    onChange={(event) => handleOnChangeLogin(null, event.target.value)}
                                />
                            </Form.Group>
                            <Button
                                className={cx('login-button')}
                                variant="contained"
                                endIcon={<LoginIcon />}
                                onClick={(event) => handleOnClickLogin(event)}
                            ></Button>
                            <div style={{ marginTop: 15 }}>
                                <MicrosoftLoginButton onClick={handleRedirect} />
                            </div>
                            <div className="col-12 text-center mt-4">
                                <span className={cx('login-with')} style={{ color: 'red' }}>
                                    {mess}
                                </span>
                            </div>
                        </Form>

                        {/* <button className={cx('social-login')} onClick={handleRedirect}>
                        <FontAwesomeIcon icon="fa-brands fa-google-plus" />
                    </button> */}
                    </div>
                </div>
            </div>
        </Spin>
    );
}

export default Login;
