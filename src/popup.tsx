import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { SpinnerCircular } from "spinners-react";
import { useIdentity } from "./hooks/hooks";
import { Collection, collectionIterator, getCollections } from "./networking/endpoints";
import CollectionsScreen from "./screens/CollectionsScreen";
import LoginScreen from "./screens/LoginScreen";
import SelectionScreen from "./screens/SelectionScreen";
import UnsavingScreen from "./screens/UnsavingScreen";

export type UserInfo = {
  csrfToken: string;
  userName: string;
}

export const UserContext = React.createContext<null | UserInfo>(null);

const Popup = () => {
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [unsaveGenerator, setUnsaveGenerator] = useState<AsyncGenerator<number, number, unknown> | null>(null);
  const [total, setTotal] = useState(0);

  const [userInfo, isLoading] = useIdentity();

  if (isLoading) {
    return (
      <div style={{
        minWidth: "400px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <SpinnerCircular color="#4065dd" style={{ padding: "4rem" }} />
      </div>
    )
  }

  if (!userInfo) return (
    <LoginScreen />
  )

  return (
    <UserContext.Provider value={userInfo}>
      {
        selectedCollection === null && <CollectionsScreen onCollectionSelected={(collection: Collection) => {
          setSelectedCollection(collection);
        }} />
      }
      {
        unsaveGenerator === null && selectedCollection !== null && <SelectionScreen collection={selectedCollection} onBack={() => {
          setSelectedCollection(null);
        }} onUnsave={(generator: AsyncGenerator<number, number, unknown>, total: number) => {
          setUnsaveGenerator(generator);
          setTotal(total);
        }} />
      }
      {
        unsaveGenerator !== null && <UnsavingScreen generator={unsaveGenerator} total={total} onExit={() => {
          setUnsaveGenerator(null);
          setSelectedCollection(null);
          setTotal(0);
        }} />
      }
    </UserContext.Provider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
