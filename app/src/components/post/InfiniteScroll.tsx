import { useEffect, useState } from "react";

let fetchState = false;

type InfiniteScrollProps<T> = {
  component: React.ComponentType<T>;
  item: T[];
  loadMore: () => Promise<boolean>;
};

function InfiniteScroll<T>({
  component: ItemComponent,
  item,
  loadMore,
}: InfiniteScrollProps<T>) {
  const [dataFetchableState, setState] = useState(true);
  const test = {};
  useEffect(() => {
    const eventHandler = () => {
      if (dataFetchableState) scrollEvent(loadMore, setState);
    };

    window.addEventListener("scroll", eventHandler);
    return () => window.removeEventListener("scroll", eventHandler);
  }, [dataFetchableState]);

  return (
    <div
      id="infinite-area"
      className="w-full max-w-173 pb-10 divide-y-2 divide-solid divide-gray-300"
    >
      {item.map((data, idx) => (
        <ItemComponent key={idx} {...data} as T />
      ))}
    </div>
  );
}

async function scrollEvent(
  loadMore: () => Promise<boolean>,
  fetchStateDispatcher: React.Dispatch<React.SetStateAction<boolean>>
) {
  const { scrollTop, offsetHeight } = document.documentElement;
  const currentOffset = window.innerHeight + scrollTop;
  const requestPosition = offsetHeight - 600;

  if (currentOffset > requestPosition && !fetchState) {
    throttle();
    const result = await loadMore();
    fetchStateDispatcher(result);
  }
}

function throttle() {
  fetchState = true;
  setTimeout(() => {
    fetchState = false;
  }, 2000);
}

export default InfiniteScroll;
