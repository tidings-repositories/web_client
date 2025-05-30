import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home from "./layouts/Home";
import Profile from "./layouts/Profile";
import PostComposer from "./layouts/PostComposer";
import Message from "./layouts/Message";
import Setting from "./layouts/Setting";
import "./i18n/label";
import "./index.css";
import "./layouts/layouts.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/compose/post" element={<PostComposer />} />
        <Route path="/message" element={<Message />} />
        <Route path="/setting" element={<Setting />} />
      </Routes>
    </Router>
  </StrictMode>
);
