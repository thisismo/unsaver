import React from "react";
import Button from "../components/Button";
import ScreenContainer from "./ScreenContainer";

export default function LoginScreen() {
    return (
        <ScreenContainer header={
            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "1rem",
                textAlign: "center",
            }}>
                <h1>
                    Login to Instagram
                </h1>
                <p>
                    This app makes use of the currently logged in Instagram account to fetch your saved media.
                    Once logged in open this popup again.
                </p>
                <p>
                    By clicking the button below, you will be redirected to Instagram's login page.
                </p>
                <Button onClick={() => {
                    window.open("https://www.instagram.com/accounts/login/");
                }}>
                    Go to Instagram
                </Button>
            </div>
        } />
    );
}