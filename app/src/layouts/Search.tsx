import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
// import Sidebox from "../components/public/Sidebox";
import AppBar from "../components/public/AppBar";
import Drawer from "../components/drawer/Drawer";
import RouterDrawerItem from "../components/drawer/RouterDrawerItem";
import TabBar from "../components/public/TabBar";
import LatestDataListView from "../components/search/LatestDataListView";
import PeopleDataListView from "../components/search/PeopleDataListView";
import SearchTabBarItem from "../components/search/SearchTabBarItem";
import { Post, UserData } from "../Types";
import { requestGETWithToken } from "../scripts/requestWithToken";
import useUserDataStore from "../store/UserDataStore";

export default function Search() {
  const userId = useUserDataStore((state) => state.user_id);
  const [searchParams] = useSearchParams();
  const [tabIdx, setState] = useState(0);
  const [peopleSearchData, setPeopleState] = useState([] as UserData[]);
  const [postSearchData, setPostState] = useState([] as Post[]);
  const query = searchParams.get("q");

  const navigator = useNavigate();

  const wideViewStandard = 1000;
  const checkWideView = () => window.innerWidth > wideViewStandard;

  // const resizeEvent = () => {
  //   const sideElement = document.getElementById("side")!;
  //   const isSideExist = sideElement.style.display === "block";

  //   if (isSideExist && !checkWideView()) {
  //     sideElement.style.display = "none";
  //   } else if (!isSideExist && checkWideView()) {
  //     sideElement.style.display = "block";
  //   }
  // };

  useEffect(() => {
    if (userId == null) {
      navigator("/");
      alert("비회원은 검색을 이용할 수 없어요");
    }
    window.scrollTo(0, 0);

    // window.addEventListener("resize", resizeEvent);
    // return () => window.removeEventListener("resize", resizeEvent);
  }, []);

  useEffect(() => {
    const OK = 200;
    const searchUser = async () => {
      let searchKeyword = query;
      if (searchKeyword?.startsWith("@"))
        searchKeyword = searchKeyword.slice(1);

      const response = await requestGETWithToken(
        `${import.meta.env.VITE_API_URL}/search/user?q=${searchKeyword}`
      ).catch((_) => _);

      if (response.status == OK) setPeopleState(response.data);
    };

    const trimQeury = query ?? "";
    if (trimQeury !== "" && trimQeury.length > 1) searchUser();
  }, [query]);

  return (
    <div id="scaffold" className="w-full h-screen mx-auto content-start">
      <AppBar searchKeyword={query ?? ""} />
      <Drawer child={<RouterDrawerItem />} />
      <div id="search" className="flex justify-center gap-10 pt-14">
        <div>
          <TabBar
            child={<SearchTabBarItem idx={tabIdx} idxDispatcher={setState} />}
          />
          {(tabIdx == 0 && (
            <LatestDataListView
              people={peopleSearchData.slice(0, 3)}
              morePeople={peopleSearchData.length > 3}
              posts={postSearchData}
              idxDispatcher={setState}
            />
          )) ||
            (tabIdx == 1 && <PeopleDataListView people={peopleSearchData} />)}
        </div>
        {/* <div
          id="side"
          className={`relative ${checkWideView() ? "block" : "hidden"}`}
        >
          <div className="sticky top-24">
            <Sidebox title={"추천 친구"} fetchUrl="https://example.com" />
          </div>
        </div> */}
      </div>
    </div>
  );
}
