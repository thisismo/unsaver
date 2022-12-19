import React from "react";
import Button from "../components/Button";
import ButtonRow from "../components/ButtonRow";
import HeaderRow from "../components/HeaderRow";
import ScreenContainer from "./ScreenContainer";

export default function LoginScreen() {
    return (
        <ScreenContainer header={
            <HeaderRow center={
                <h2>
                    Login to Instagram
                </h2>
            } />
        } footer={
            <ButtonRow center={
                <Button onClick={() => {
                    window.open("https://www.instagram.com/accounts/login/");
                }}>
                    Go to Login
                </Button>
            } />
        }
        >
            <p style={{textAlign: "center"}}>
                Please login to your account on <a target="_blank" href="https://www.instagram.com/accounts/login/">Instagram</a> to continue.
            </p>
        </ScreenContainer>
    );
}