import InfiniteScroll from "../post/InfiniteScroll";
import UserSlot from "../public/UserSlot";
import Content from "../post/Content";
import TextButton from "../button/TextButton";
import { Post, UserData } from "../../Types";
import * as l10n from "i18next";

type LatestDataListViewProps = {
  people: UserData[];
  morePeople: boolean;
  posts: Post[];
  idxDispatcher: React.Dispatch<React.SetStateAction<number>>;
};

function LatestDataListView({
  people,
  morePeople,
  posts,
  idxDispatcher,
}: LatestDataListViewProps) {
  return (
    <div className="flex flex-col divide-y-2 divide-solid divide-gray-300 py-4">
      {/*Search people area*/}
      <div className="flex flex-col items-center">
        {/*소제목*/}
        <p className="text-xl pb-4 pl-4 font-semibold self-start">
          {l10n.t("lookingForSomeone")}
        </p>
        {people.map((person, idx) => (
          <UserSlot key={idx} {...person} />
        ))}
        {people.length == 0 && (
          <div className="py-10 text-2xl text-gray-500 text-center">
            {l10n.t("notFoundPeople")}
          </div>
        )}
        {/*더보기*/}
        <div className="w-full px-4 pb-2 text-end">
          {morePeople && (
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
          )}
        </div>
      </div>
      {/*Search post area*/}
      <InfiniteScroll
        component={Content}
        item={posts}
        loadMore={async () => false}
      />
    </div>
  );
}

export default LatestDataListView;
