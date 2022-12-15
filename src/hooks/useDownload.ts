//Chrome.downloads API Hook
import { useState, useEffect } from 'react';
import { getMediaUrls } from '../components/MediaTile';
import { Media } from '../endpoints';

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

    urls.forEach(([url, fileType]) => {
        const filename = `${media.code}.${fileType}`;
        chrome.downloads.download({
            url,
            filename,
        });
    });
}