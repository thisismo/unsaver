import React, { useEffect } from "react";
import { SpinnerCircular } from "spinners-react";
import Button from "../components/Button";
import ScreenContainer from "./ScreenContainer";

type Props = {
    generator: AsyncGenerator<number, number, unknown>;
    total: number;
    onExit?: () => void;
}

export default function UnsavingScreen({ generator, total, onExit }: Props) {
    const [unsaved, setUnsaved] = React.useState(0);
    const [done, setDone] = React.useState(false);

    useEffect(() => {
        const unsave = async () => {
            const unsavedCount = await generator.next();
            if (!unsavedCount.done) {
                setUnsaved(unsavedCount.value);
                unsave();
            } else {
                setUnsaved(unsavedCount.value)
                setDone(true);
            }
        };
        unsave();
    }, []);

    return (
        <ScreenContainer>
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
                    <h2>Unsaving {unsaved} of {total}...</h2>
                        <SpinnerCircular color="#4065dd" style={{ padding: "2rem" }} />
                        <p>Do not close this popup until the process is complete.<br/>It may take a few minutes.</p>
                        <Button onClick={() => {
                            setDone(true);
                        }}>
                            Cancel
                        </Button>
                    </>
                }
                {
                    done && <>
                        <h1>Done</h1>
                        <h2>Unsaved {unsaved} of {total} posts.</h2>
                        <div>
                        <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M21.05 33.1 35.2 18.95l-2.3-2.25-11.85 11.85-6-6-2.25 2.25ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24q0-4.15 1.575-7.8 1.575-3.65 4.3-6.35 2.725-2.7 6.375-4.275Q19.9 4 24 4q4.15 0 7.8 1.575 3.65 1.575 6.35 4.275 2.7 2.7 4.275 6.35Q44 19.85 44 24q0 4.1-1.575 7.75-1.575 3.65-4.275 6.375t-6.35 4.3Q28.15 44 24 44Zm0-3q7.1 0 12.05-4.975Q41 31.05 41 24q0-7.1-4.95-12.05Q31.1 7 24 7q-7.05 0-12.025 4.95Q7 16.9 7 24q0 7.05 4.975 12.025Q16.95 41 24 41Zm0-17Z"/></svg>
                        </div>
                        <p style={{marginBottom: "2rem"}}>Thank you for using my app.<br/>
                        If you like it, please consider supporting a young student and his future projects. :]</p>
                        <Button onClick={() => {
                            window.open("https://www.paypal.com/donate/?hosted_button_id=AMC5PSSJFX9CS", "_blank");
                        }}>
                            ❥ Support Me ❥
                        </Button>
                        <p style={{cursor: "pointer"}} onClick={onExit}>
                            Show collections
                        </p>
                    </>
                }
            </div>
        </ScreenContainer>
    );
}