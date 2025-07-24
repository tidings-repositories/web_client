//import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./layouts/Home";
import Profile from "./layouts/Profile";
import PostComposer from "./layouts/PostComposer";
import Message from "./layouts/Message";
import Setting from "./layouts/Setting";
import Post from "./layouts/Post";
import Search from "./layouts/Search";
import Follow from "./layouts/Follow";
import "./i18n/label";
import "./index.css";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import AgreementAdnPolicy from "./layouts/AgreementAndPolicy";
import UserAgreement from "./components/setting/UserAgreement";
import PrivacyPolicy from "./components/setting/PrivacyPolicy";

dayjs.extend(utc);
dayjs.extend(timezone);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/profile/:userId",
    element: <Profile />,
  },
  {
    path: "/profile/:userId/followers",
    element: <Follow />,
  },
  {
    path: "/profile/:userId/following",
    element: <Follow />,
  },
  {
    path: "/post/:postId",
    element: <Post />,
  },
  {
    path: "/compose/post",
    element: <PostComposer />,
  },
  {
    path: "/message",
    element: <Message />,
  },
  {
    path: "/message/:directMessageId",
    element: <Message />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/setting",
    element: <Setting />,
  },
  {
    path: "/setting/user-agreement",
    element: <AgreementAdnPolicy child={<UserAgreement />} />,
  },
  {
    path: "/setting/privacy-policy",
    element: <AgreementAdnPolicy child={<PrivacyPolicy />} />,
  },
]);

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <div className="w-screen bg-white">
    <RouterProvider router={router} />
  </div>
  // </StrictMode>
);
