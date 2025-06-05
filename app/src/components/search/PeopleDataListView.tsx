import InfiniteScroll from "../post/InfiniteScroll";
import UserSlot from "../public/UserSlot";
import { UserData } from "../../Types";

type PeopleDataListViewProps = {
  people: UserData[];
};

function PeopleDataListView({ people }: PeopleDataListViewProps) {
  return (
    <div>
      {/*Search post area*/}
      <InfiniteScroll component={UserSlot} item={people} loadMore={() => {}} />
    </div>
  );
}

export default PeopleDataListView;
