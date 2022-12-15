//Chrome.downloads API Hook
import { useState, useEffect } from 'react';
import { getMediaUrls } from '../components/MediaTile';
import { Media } from '../networking/endpoints';

export const useDownload = (url: string, filename: string) => {
    const [downloaded, setDownloaded] = useState(false);

    useEffect(() => {
        chrome.downloads.download({
            url,
            filename,
        }, () => {
            setDownloaded(true);
        });
    }, [url, filename]);

    return downloaded;
}

export const doDownload = (media: Media, includeThumbnails = false) => {
    const urls = getMediaUrls(media, includeThumbnails);

    urls.forEach(([mediaInfo, fileType]) => {
        const filename = `${media.code}.${fileType}`;
        chrome.downloads.download({
            url: mediaInfo[0].url,
            filename,
        });
    });
}

export const useIdentity = () => {
    const [identity, setIdentity] = useState<string | undefined>("");

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
            chrome.cookies.get({ url: "https://www.instagram.com", name: "csrftoken" }, (cookie) => {
                if (cookie) {
                    setIdentity(cookie.value);
                } else {
                    setIdentity(undefined);
                }
            });
            return;
        }
        // If we aren't redirected, we are not logged in
        setIdentity(undefined);
    }

    return identity;
}