import React, { useContext, useEffect } from "react";
import { SpinnerCircular } from "spinners-react";
import Button from "../components/Button";
import ButtonRow from "../components/ButtonRow";
import HeaderRow from "../components/HeaderRow";
import { Collection, Media, unsaveSelectedMedia } from "../networking/endpoints";
import { UserContext } from "../popup";
import ScreenContainer from "./ScreenContainer";
import { SelectionType } from "./SelectionScreen";

type Props = {
    collection: Collection;
    selectedMedia: Media[];
    unsaveAll: boolean;
    onBack?: (unsavedMedia: Media[]) => void;
    onExit?: () => void;
}

export default function UnsavingScreen({ collection, selectedMedia, unsaveAll, onBack, onExit }: Props) {
    const [unsavedMedia, setUnsavedMedia] = React.useState<Media[]>([]);
    const [unsavedCount, setUnsavedCount] = React.useState(0);
    const [done, setDone] = React.useState(false);

    const total = unsaveAll ? collection.collection_media_count - selectedMedia.length : selectedMedia.length;

    const userInfo = useContext(UserContext);

    const [generator, _] = React.useState(unsaveSelectedMedia(selectedMedia, userInfo!.csrfToken, unsaveAll ? collection.collection_id : undefined));

    useEffect(() => {
        const unsave = async () => {
            let res = await generator.next();
            while(!res.done && !done) {
                setUnsavedMedia(res.value);
                setUnsavedCount(res.value.length);
                res = await generator.next();
            }
    
            setDone(true);
            setUnsavedMedia(res.value);
            setUnsavedCount(res.value.length);
        };

        unsave();
    }, []);

    return (
        <ScreenContainer
            header={
                <HeaderRow center={
                    done ? <h2>Unsaved {unsavedCount} of {total} posts.</h2> : <h2>Unsaving {unsavedCount} of {total}...</h2>
                }/>
            }
            footer={
                <ButtonRow center={
                    !done &&
                        <Button onClick={() => {
                            setDone(true);
                        }}>
                            Cancel
                        </Button>
                }>
                    {
                        done &&
                        <>
                            <p style={{ cursor: "pointer" }} onClick={() => {
                                onBack && onBack(unsavedMedia);
                            }}>
                                Back
                            </p>
                            <Button onClick={() => {
                                window.open("https://www.paypal.com/donate/?hosted_button_id=AMC5PSSJFX9CS", "_blank");
                            }}>
                                Support Me ❥
                            </Button>
                            <p style={{ cursor: "pointer" }} onClick={onExit}>
                                All collections
                            </p>
                        </>
                    }
                </ButtonRow>
            }
        >
            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "1rem",
                textAlign: "center",
            }}>
                {
                    !done && <>
                        <SpinnerCircular color="#4065dd" style={{ padding: "2rem" }} />
                        <p>Do not close this popup until the process is complete.<br />It may take a few minutes.</p>
                    </>
                }
                {
                    done && <>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M21.05 33.1 35.2 18.95l-2.3-2.25-11.85 11.85-6-6-2.25 2.25ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24q0-4.15 1.575-7.8 1.575-3.65 4.3-6.35 2.725-2.7 6.375-4.275Q19.9 4 24 4q4.15 0 7.8 1.575 3.65 1.575 6.35 4.275 2.7 2.7 4.275 6.35Q44 19.85 44 24q0 4.1-1.575 7.75-1.575 3.65-4.275 6.375t-6.35 4.3Q28.15 44 24 44Zm0-3q7.1 0 12.05-4.975Q41 31.05 41 24q0-7.1-4.95-12.05Q31.1 7 24 7q-7.05 0-12.025 4.95Q7 16.9 7 24q0 7.05 4.975 12.025Q16.95 41 24 41Zm0-17Z" /></svg>
                        </div>
                        <p style={{ marginBottom: "2rem" }}>Thank you for using my app.<br/><br/>
                            If you like it, please consider supporting a young student and his future projects. :]</p>
                    </>
                }
            </div>
        </ScreenContainer>
    );
}