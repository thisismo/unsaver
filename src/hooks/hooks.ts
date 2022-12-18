//Chrome.downloads API Hook
import { useState, useEffect } from 'react';

export const useIdentity = () => {
    const [loggedIn, setLoggedIn] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        checkLogin();
    }, []);

    const checkLogin = async () => {
        const response = await fetch("https://www.instagram.com/accounts/login/", {
            method: 'GET',
            credentials: 'include'
        });

        // If we dont get redirected to instagram.com/ then we are logged in
        if (response.redirected) {
            setLoggedIn(true);
            return;
        }
        // If we aren't redirected, we are not logged in
        setLoggedIn(false);
    }

    return loggedIn;
}

export const useCsrfToken = () => {
    const [csrfToken, setCsrfToken] = useState<string | undefined>("");

    useEffect(() => {
        checkCsrfToken();
    }, []);

    const checkCsrfToken = async () => {
        chrome.cookies.get({ url: "https://www.instagram.com", name: "csrftoken" }, (cookie) => {
            if (cookie) {
                setCsrfToken(cookie.value);
            } else {
                setCsrfToken(undefined);
            }
        });
    }

    return csrfToken;
}