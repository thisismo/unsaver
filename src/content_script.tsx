//Entry point content script

import Endpoints from "./endpoints";

type Command = {
  command: "unsave-all" | "unsave-collection" | "unsave-posts" | "get-collection" | "get-posts-from-collection";
}

type UnsaveAllMessage = Command & {
  command: "unsave-all";
}

type UnsaveCollectionMessage = Command & {
  command: "unsave-collection";
  collectionId: string;
}

type UnsavePostsMessage = Command & {
  command: "unsave-posts";
  postIds: string[];
}

type Message = UnsaveAllMessage | UnsaveCollectionMessage | UnsavePostsMessage;

chrome.runtime.onMessage.addListener(function (msg: Message, sender, sendResponse) {
  sendResponse("Hello from the background");
});

//Read document cookies
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

const endpoints = new Endpoints(/*{
  headers: {
  //"x-ig-www-claim": "hmac.AR1vs31Tdjvhs7Xjp2-oJJUvCqyrbJwBukBeaAqC0Jz_E02Y",
  "x-ig-app-id": "936619743392459",
  //"x-asbd-id": "198387"
}}*/);

//Function running when the content script is loaded
(async () => {
  console.log("[Unsaver]", window.location);
  setTimeout(async () => {
     console.log("[Unsaver]", await endpoints.getCollections());
  }, 2000);
})();