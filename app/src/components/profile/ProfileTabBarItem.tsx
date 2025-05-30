import * as l10n from "i18next";

type ProfileAppBarItemProps = {
  idx: number;
  idxDispatcher: React.Dispatch<React.SetStateAction<number>>;
};

function ProfileTabBarItem({ idx, idxDispatcher }: ProfileAppBarItemProps) {
  return (
    <div className="flex w-full divide-x-1 divide-solid divide-gray-300">
      <button
        onClick={() => idxDispatcher(0)}
        className={`!flex-1 !text-center !rounded-none ${
          idx == 0 ? "!bg-gray-100" : ""
        }`}
      >
        {l10n.t("posts")}
      </button>
      <div></div>
      <button
        onClick={() => idxDispatcher(1)}
        className={`!flex-1 !text-center !rounded-none ${
          idx == 1 ? "!bg-gray-100" : ""
        }`}
      >
        {l10n.t("comments")}
      </button>
      <div></div>
      <button
        onClick={() => idxDispatcher(2)}
        className={`!flex-1 !text-center !rounded-none ${
          idx == 2 ? "!bg-gray-100" : ""
        }`}
      >
        {l10n.t("likes")}
      </button>
    </div>
  );
}

export default ProfileTabBarItem;
