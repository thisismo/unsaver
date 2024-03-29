import { getMediaUrls } from "../components/MediaTile";
import { defaultOptions, AvailableOptions } from "../options";

export type Collection = {
    collection_id: string | "ALL_MEDIA_AUTO_COLLECTION" | "AUDIO_AUTO_COLLECTION";
    collection_media_count: number;
    collection_name: string;
    collection_type: "MEDIA" | "ALL_MEDIA_AUTO_COLLECTION" | "AUDIO_AUTO_COLLECTION";
    cover_media_list?: Media[];
}

export type Image2Versions = {
    candidates: MediaInfo[];
}

export type MediaInfo = {
    height: number;
    width: number;
    url: string;
}

export type MediaEnvelope = {
    media: Media;
}

export type BaseMedia = {
    id: string;
    code?: string;
    media_type: number;
};

export type Media = BaseMedia & (ImageMedia | VideoMedia | CarouselMedia);

export type ImageMedia = {
    image_versions2: Image2Versions;
};

export type VideoMedia = {
    image_versions2: Image2Versions;
    video_versions: Video[];
};

export type Video = MediaInfo & {
    type: number;
    id: string;
};

export type CarouselMedia = {
    carousel_media: (BaseMedia & ImageMedia | BaseMedia & VideoMedia)[];
    carousel_media_count: number;
};

type CollectionResponse<T> = {
    auto_load_more_enabled: boolean;
    status: string;
    more_available: boolean;
    items: T[];
    next_max_id?: string;
    num_results?: number;
}

export const defaultRequest: RequestInit = {
    headers: {
        "accept": "*/*",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "sec-gpc": "1",
        "x-ig-app-id": "936619743392459",
        "x-asbd-id": "198387",
        "x-requested-with": "XMLHttpRequest",
        //x-instagram-ajax: 1006746180
    },
    referrer: "https://www.instagram.com/",
    credentials: 'include',
    mode: 'cors',
};

export async function getAccountInfo(): Promise<{ username: string }> {
    const response = await fetch('https://i.instagram.com/api/v1/accounts/edit/web_form_data/',
        {
            method: 'GET',
            ...defaultRequest,
        });

    console.log("getAccountInfo", response.redirected, response.status);
    if (response.redirected) {
        throw new Error("Not logged in");
    }

    return (await response.json())["form_data"];
}

export async function getCollections(maxId: string): Promise<CollectionResponse<Collection>> {
    const response = await fetch('https://i.instagram.com/api/v1/collections/list/?collection_types=["ALL_MEDIA_AUTO_COLLECTION","MEDIA","AUDIO_AUTO_COLLECTION"]' +
        "&include_public_only=0" +
        "&get_cover_media_lists=true" +
        `&max_id=${maxId}`,
        {
            method: 'GET',
            ...defaultRequest,
            redirect: 'error'
        });

    if (response.status !== 200) throw new Error(`Failed to get collections. Status: ${response.status} ${response.statusText}`);

    return await response.json();
}

export async function getCollectionMedia(collectionId: string, maxId: string): Promise<CollectionResponse<Media>> {
    const response = await fetch(`https://i.instagram.com/api/v1/feed/collection/${collectionId}/posts/?max_id=${maxId}`,
        {
            method: 'GET',
            ...defaultRequest,
        });
    let json = await response.json();
    json["items"] = json.items.map((item: MediaEnvelope) => item.media);
    return json;
}

export async function getAllSavedMedia(maxId: string = ""): Promise<CollectionResponse<Media>> {
    const response = await fetch(`https://i.instagram.com/api/v1/feed/saved/posts/?max_id=${maxId}`,
        {
            method: 'GET',
            ...defaultRequest,
        });
    let json = await response.json();
    json["items"] = json.items.map((item: MediaEnvelope) => item.media);
    return json;
}

export async function unsaveMedia(mediaId: string, csrftoken: string): Promise<void> {
    const response = await fetch(`https://www.instagram.com/api/v1/web/save/${mediaId}/unsave/`,
        {
            method: 'POST',
            ...defaultRequest,
            headers: {
                "x-csrftoken": csrftoken
            }
        });
    if (response.status !== 200) throw new Error(`Failed to unsave media. Status: ${response.status} ${response.statusText}`);
}

export async function* collectionIterator<T>(getItems: (maxId: string, ...args: any[]) => Promise<CollectionResponse<T>>) {
    let maxId = "";
    while (true) {
        console.log("Getting items with maxId: " + maxId);
        const response = await getItems(maxId);
        yield response.items;
        if (response.more_available == false) return;
        maxId = response.next_max_id!;
    }
}

const downloadSingleAsync = (url: string, fileName: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        chrome.downloads.download({
            url: url,
            filename: fileName,
        }, (downloadId) => {
            if (downloadId) {
                resolve(downloadId);
            } else {
                reject();
            }
        });
    });
}

export const getCsrfToken = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        chrome.cookies.get({ url: "https://www.instagram.com", name: "csrftoken" }, (cookie) => {
            if (cookie) {
                resolve(cookie.value);
            } else {
                reject();
            }
        });
    });
}

export const doDownload = async (media: Media, includeThumbnails = false) => {
    const urls = getMediaUrls(media, includeThumbnails);

    for (const [mediaInfo, fileType] of urls) {
        const filename = `${media.code}.${fileType}`;
        await downloadSingleAsync(mediaInfo[0].url, filename);
    }
}

let options: AvailableOptions = defaultOptions;

chrome.storage.sync.get(defaultOptions, (result) => {
    Object.assign(options, result);
});

export async function* unsaveSelectedMedia(selectedMedia: Media[], csrftoken: string, collectionId?: string) {
    if (options.downloadMedia) chrome.downloads.setShelfEnabled(false);

    let unsavedMedia: Media[] = [];

    if (collectionId) {
        for await (const media of collectionIterator(collectionId === "ALL_MEDIA_AUTO_COLLECTION" ?
            getAllSavedMedia : getCollectionMedia.bind(null, collectionId))) {
            for await (const mediaItem of media) {
                if (selectedMedia.some(m => m.id === mediaItem.id)) continue;

                if (options.downloadMedia) await doDownload(mediaItem, options.includeThumbnails);

                await unsaveMedia(mediaItem.id, csrftoken).then(() => {
                    unsavedMedia.push(mediaItem);
                })

                yield mediaItem;
                await waitForMe(options.waitTime);
            }
        }

        if (options.downloadMedia) chrome.downloads.setShelfEnabled(true);
        return unsavedMedia;
    }

    for await (const mediaItem of selectedMedia) {
        if (options.downloadMedia) await doDownload(mediaItem, options.includeThumbnails);

        await unsaveMedia(mediaItem.id, csrftoken).then(() => {
            unsavedMedia.push(mediaItem);
        });
        yield mediaItem;
        await waitForMe(options.waitTime);
    }
    if (options.downloadMedia) chrome.downloads.setShelfEnabled(true);
    return unsavedMedia;
}

function waitForMe(ms: number) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, ms);
    })
}