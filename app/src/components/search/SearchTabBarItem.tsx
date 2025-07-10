import * as l10n from "i18next";

type SearchTabBarItemProps = {
  idx: number;
  idxDispatcher: React.Dispatch<React.SetStateAction<number>>;
};

function SearchTabBarItem({ idx, idxDispatcher }: SearchTabBarItemProps) {
  return (
    <div className="flex w-full divide-x-1 divide-solid divide-gray-300">
      <button
        onClick={() => idxDispatcher(0)}
        className={`!flex-1 !text-center !rounded-none ${
          idx == 0 ? "!bg-gray-100" : ""
        }`}
      >
        {l10n.t("latest")}
      </button>
      <div></div>
      <button
        onClick={() => idxDispatcher(1)}
        className={`!flex-1 !text-center !rounded-none ${
          idx == 1 ? "!bg-gray-100" : ""
        }`}
      >
        {l10n.t("people")}
      </button>
    </div>
  );
}

export default SearchTabBarItem;
