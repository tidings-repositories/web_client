import InfiniteScroll from "../post/InfiniteScroll";
import UserSlot from "../public/UserSlot";
import Content from "../post/Content";
import TextButton from "../button/TextButton";
import { Post, UserData } from "../../Types";
import * as l10n from "i18next";

type LatestDataListViewProps = {
  people: UserData[];
  posts: Post[];
  idxDispatcher: React.Dispatch<React.SetStateAction<number>>;
};

function LatestDataListView({
  people,
  posts,
  idxDispatcher,
}: LatestDataListViewProps) {
  return (
    <div className="flex flex-col divide-y-2 divide-solid divide-gray-300 py-4">
      {/*Search people area*/}
      <div className="flex flex-col">
        {/*소제목*/}
        <p className="text-xl pb-4 font-semibold">
          {l10n.t("lookingForSomeone")}
        </p>
        {people.map((person, idx) => (
          <UserSlot key={idx} {...person} />
        ))}
        {/*더보기*/}
        <div className="w-full px-4 pb-2 text-end">
          <TextButton
            text={l10n.t("seeMore")}
            fontSize="base"
            color="gray-500"
            onPressed={() => {
              idxDispatcher(() => {
                const PeopleTabIdx = 1;
                return PeopleTabIdx;
              });
            }}
          />
        </div>
      </div>
      {/*Search post area*/}
      <InfiniteScroll component={Content} item={posts} loadMore={() => {}} />
    </div>
  );
}

export default LatestDataListView;
