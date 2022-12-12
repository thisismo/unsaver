export type Collection = {
    collection_id: number | "ALL_MEDIA_AUTO_COLLECTION";
    collection_media_count: number;
    collection_name: string;
    collection_type: "MEDIA" | "ALL_MEDIA_AUTO_COLLECTION";
    cover_media_list: {
        image_versions2: {
            candidates: {
                height: number;
                width: number;
                url: string;
            }[]
        }
    }[];
}

type CollectionResponse = {
    status: string;
    more_available: boolean;
    items:  Collection[];
}

export default class Endpoints {
    private defaultOptions: RequestInit;

    constructor() {
        this.defaultOptions = {
            headers: {
                "accept": "*/*",
                "sec-ch-ua-mobile": "?0",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "sec-gpc": "1",
                "x-ig-app-id": "936619743392459"
            },
            referrer: "https://www.instagram.com/",
            credentials: 'include',
            mode: 'cors',
        };
    }

    public async getCollections(): Promise<CollectionResponse> {
        const response = await fetch('https://i.instagram.com/api/v1/collections/list/?collection_types=["ALL_MEDIA_AUTO_COLLECTION","MEDIA","AUDIO_AUTO_COLLECTION"]&include_public_only=0&get_cover_media_lists=true&max_id=',
        {
            method: 'GET',
            ...this.defaultOptions,
        });
        return await response.json();
    }

    public async getCollectionMedia(collectionId: number | "ALL_MEDIA_AUTO_COLLECTION", maxId: string = ""): Promise<CollectionResponse> {
        const response = await fetch(`https://i.instagram.com/api/v1/collections/${collectionId}/media/?max_id=${maxId}`,
        {
            method: 'GET',
            ...this.defaultOptions,
        });
        return await response.json();
    }
}