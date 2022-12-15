import React from 'react';
import { Collection } from '../endpoints';
import { getThumbnailUrl } from './MediaTile';

type Props = {
    collectionInfo: Collection;
    onClick?: () => void;
}

export default function CollectionTile({ collectionInfo, onClick }: Props) {
    const resolutionIndex = 0;

    return (
        <div onClick={onClick} style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            position: "relative",
            cursor: "pointer",
            aspectRatio: "1/1"
        }}>
            {
                collectionInfo.cover_media_list?.map((media, i) => (
                    <img key={i} style={{
                        width: "100%",
                        maxHeight: "100%",
                        aspectRatio: "1/1",
                    }} src={getThumbnailUrl(media)} crossOrigin="anonymous" decoding="auto" />
                ))
            }
            <div style={{
                position: "absolute",
                display: "flex",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                //backgroundColor: "rgba(0, 0, 0, 0.2)",
                backgroundImage: "linear-gradient( to top, rgba(38, 38, 38, .6), rgba(255, 255, 255, 0) )",
                alignItems: "flex-end",
                color: "#fff",
                paddingLeft: 8,
            }}>
                <h3>{collectionInfo.collection_name}</h3>
            </div>
        </div>
    );
}