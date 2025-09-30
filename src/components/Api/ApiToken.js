import React from 'react';
import { useMsal } from '@azure/msal-react';
import { useDispatch } from 'react-redux';
import { updateCurrentUnit, updateToken, updateUserAccess, updateUserInfo, updateUserMenuFromMasterApp } from '~/Redux/Reducer/Thunk';
import DomainApi, { DomainMasterApp, DomainPoultry } from '~/DomainApi';
import { fetchApiAuthInfo } from '~/Redux/FetchApi/fetchApiMaster';
import { toast } from 'react-toastify';

export default function ApiToken() {
    const { instance } = useMsal();
    const dispatch = useDispatch();
    const activeAccount = instance.getActiveAccount();
    const [valueAccessToken, setValueAccessToken] = React.useState({ token: '', status: null });
    const [callApiToken, setCallApiToken] = React.useState(false);
    const fetchCallApiToken = () => {
        if (activeAccount && !callApiToken) {
            setCallApiToken(true);
        }
    };
    fetchCallApiToken();

    function getAllIdNums(data) {
        const ids = [];
        function traverse(items) {
            items.forEach(item => {
                const common = item.common;
                if (common?.status === "Y" && common?.idNum !== undefined && common?.idNum !== null) {
                    ids.push(common.idNum);
                }

                // Nếu có menulv2, menulv3... thì duyệt tiếp
                if (item.menulv2) traverse(item.menulv2);
                if (item.menulv3) traverse(item.menulv3);
                if (item.menulv4) traverse(item.menulv4);
            });
        }

        traverse(data);
        return ids;
    }

    React.useEffect(() => {
        async function fetchData() {
            if (activeAccount) {
                try {
                    const model = {
                        email: activeAccount.username,
                        username: activeAccount.username.split('@')[0],
                        appID: 30,
                        clientID: 'l1sdjwq234er573023rwe1475177',
                        loginLog: true,
                    };
                    // Login master app
                    const response = await DomainMasterApp.post(`Apps/login?userID=${model.username}&appID=${model.appID}&email=${model.email}&clientID=${model.clientID}&loginLog=${model.loginLog}`);
                    const userInfo = response.data;
                    dispatch(updateToken(userInfo.accessToken));
                    dispatch(updateUserInfo(userInfo));
                    // Menu from master app 
                    const header = {
                        Authorization: `Bearer ${userInfo?.accessToken}`,
                        "Content-Type": "application/json",
                    };
                    const response_menu = await DomainMasterApp.get(`Apps/menus?userID=${userInfo?.userID}&appID=${model.appID}`, { headers: header });
                    const menu = response_menu.data;
                    const ids = getAllIdNums(menu);
                    dispatch(updateUserMenuFromMasterApp(ids));
                    const body = {
                        email: activeAccount.username,
                    };
                    const response_user_access = await DomainPoultry.post(`auth/info`, body, { headers: header });
                    const userAccess = response_user_access.data?.Response;
                    dispatch(updateUserAccess(userAccess));
                    const listUnit = userAccess.units;
                    const prevUnitId = localStorage.getItem('Unit')
                    const exists = listUnit.find(unit => unit.UnitId === prevUnitId);
                    if (exists) {
                        dispatch(updateCurrentUnit(exists))
                    } else {
                        dispatch(updateCurrentUnit(listUnit[0]))
                        localStorage.setItem('Unit', listUnit[0].UnitId);
                    }
                    setValueAccessToken({ token: userInfo.accessToken, status: true });
                } catch (error) {
                    toast.error(error.response ? error.response.data : error);
                    setValueAccessToken({ token: error.response ? error.response.data : error, status: false });
                }
            }
        }
        fetchData();
    }, [callApiToken]);

    return valueAccessToken;
}
