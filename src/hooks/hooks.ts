//Chrome.downloads API Hook
import { useState, useEffect } from 'react';
import { defaultRequest, getAccountInfo, getCsrfToken } from '../networking/endpoints';
import { UserInfo } from '../popup';

export const useIdentity = (): [UserInfo | null, boolean] => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserInfo().finally(() => setLoading(false));
    }, []);

    const fetchUserInfo = async () => {
        const [accountInfo, csrfToken] = await Promise.all([getAccountInfo(), getCsrfToken()]);
        setUserInfo({
            userName: accountInfo.username,
            csrfToken: csrfToken
        })
    };

    return [userInfo, loading];
}