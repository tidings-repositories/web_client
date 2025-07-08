import { useEffect } from "react";
import TextButton from "../button/TextButton";
import * as l10n from "i18next";

type SidboxProps = {
  title: string;
  fetchUrl: string;
};

function Sidebox({ title, fetchUrl }: SidboxProps) {
  const seeMoreEvent = () => {};

  useEffect(() => {
    //TODO: fetch data
    console.log(fetchUrl);
  });

  return (
    <div className="w-76 h-fit py-3 px-2 my-10 flex-col justify-around gap-2 rounded-lg border border-solid border-gray-300">
      <div>{title}</div>
      <TextButton
        fontSize="sm"
        color="gray-500"
        text={l10n.t("seeMore")}
        onPressed={seeMoreEvent}
      />
    </div>
  );
}

export default Sidebox;
