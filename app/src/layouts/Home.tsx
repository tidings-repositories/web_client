import { useEffect } from "react";
import InfiniteScroll from "../components/post/InfiniteScroll";
import Sidebox from "../components/home/Sidebox";
import AppBar from "../components/public/AppBar";
import HomeAppBarItem from "../components/home/HomeAppBarItem";
import Drawer from "../components/home/Drawer";
import QuickPostComposer from "../components/composer/QuickPostComposer";
import Content from "../components/post/Content";
import * as l10n from "i18next";

import { createMockPost } from "../../dev/mockdata"; //TODO: remove

export default function Home() {
  const wideViewStandard = 1000;
  const checkWideView = () => window.innerWidth > wideViewStandard;

  const resizeEvent = () => {
    const sideElement = document.getElementById("side")!;
    const isSideExist = sideElement.style.display === "block";

    if (isSideExist && !checkWideView()) {
      sideElement.style.display = "none";
    } else if (!isSideExist && checkWideView()) {
      sideElement.style.display = "block";
    }
  };

  useEffect(() => {
    window.addEventListener("resize", resizeEvent);
    return () => window.removeEventListener("resize", resizeEvent);
  }, []);

  return (
    <div id="scaffold" className="w-[98vw] h-screen mx-auto content-start">
      <AppBar child={<HomeAppBarItem />} />
      <Drawer />
      <div id="home" className="flex justify-center gap-10 pt-16">
        <div>
          <QuickPostComposer />
          <InfiniteScroll
            component={Content}
            item={Array.from({ length: 10 }).map(() => createMockPost())}
            loadMore={() => {}}
          />
        </div>
        <div
          id="side"
          className={`relative ${checkWideView() ? "block" : "hidden"}`}
        >
          <div className="sticky top-24">
            <Sidebox
              title={l10n.t("dailyPopular")}
              fetchUrl="https://example.com"
            />
            <Sidebox
              title={l10n.t("weeklyPopular")}
              fetchUrl="https://example.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
