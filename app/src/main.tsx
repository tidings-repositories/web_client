import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router";
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

createRoot(document.getElementById("root")!).render(
  <div className="w-screen bg-white">
    <StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/profile/:userId/followers" element={<Follow />} />
          <Route path="/profile/:userId/following" element={<Follow />} />
          <Route path="/post/:postId" element={<Post />} />
          <Route path="/compose/post" element={<PostComposer />} />
          <Route path="/message" element={<Message />} />
          <Route path="/message/:directMessageId" element={<Message />} />
          <Route path="/search" element={<Search />} />
          <Route path="/setting" element={<Setting />} />
          <Route
            path="/setting/user-agreement"
            element={<AgreementAdnPolicy child={<UserAgreement />} />}
          />
          <Route
            path="/setting/privacy-policy"
            element={<AgreementAdnPolicy child={<PrivacyPolicy />} />}
          />
        </Routes>
      </Router>
    </StrictMode>
  </div>
);
