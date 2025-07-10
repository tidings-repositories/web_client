import * as l10n from "i18next";
import { useNavigate, useLocation } from "react-router-dom";

type FollowTabBarItemProps = {
  idx: number;
  idxDispatcher: React.Dispatch<React.SetStateAction<number>>;
};

function FollowTabBarItem({ idx, idxDispatcher }: FollowTabBarItemProps) {
  const navigator = useNavigate();
  const location = useLocation();
  const pathList = location.pathname.split("/");

  return (
    <div className="flex w-full divide-x-1 divide-solid divide-gray-300">
      <button
        onClick={() => {
          idxDispatcher(0);
          pathList[pathList.length - 1] = "following";
          navigator(pathList.join("/"), { replace: true });
        }}
        className={`!flex-1 !text-center !rounded-none ${
          idx == 0 ? "!bg-gray-100" : ""
        }`}
      >
        {l10n.t("following")}
      </button>
      <div></div>
      <button
        onClick={() => {
          idxDispatcher(1);
          pathList[pathList.length - 1] = "followers";
          navigator(pathList.join("/"), { replace: true });
        }}
        className={`!flex-1 !text-center !rounded-none ${
          idx == 1 ? "!bg-gray-100" : ""
        }`}
      >
        {l10n.t("follower")}
      </button>
    </div>
  );
}

export default FollowTabBarItem;
