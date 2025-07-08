import { requestDELETEWithToken } from "../../scripts/requestWithToken";
import useUserDataStore from "../../store/UserDataStore";
import * as l10n from "i18next";
import OutlineButton from "../button/OutlineButton";
import { useState } from "react";

function DeleteAccount() {
  const [borderColor, setColor] = useState("gray");
  const userId = useUserDataStore((state) => state.user_id);
  const userStoreClear = useUserDataStore((state) => state.clear);

  const deleteReqeust = async () => {
    const OK = 200;
    const response = await requestDELETEWithToken(
      `${import.meta.env.VITE_API_URL}/auth/account`
    );

    if (response.status == OK) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      userStoreClear();
      window.location.href = "/";
    }
  };

  return (
    <div className="flex flex-col gap-10 justify-center px-10 py-4">
      <div className="flex flex-col gap-2">
        <p className="text-2xl">{"게정을 비활성화 하실건가요?"}</p>
        <p>
          <a>"delete account"</a>
          {"를 정확히 입력해주세요"}
        </p>
      </div>
      <div className="flex flex-col">
        <div
          id="idInputBar"
          className="flex flex-col w-full p-2 gap-1 rounded-lg bg-gray-100 justify-start transition-colors duration-100"
          style={{ border: "1px solid", borderColor: borderColor }}
        >
          {/*input and enable state area*/}
          <div className="flex w-full gap-1 items-center justify-between">
            <form
              id="idInput"
              className="w-full"
              onChange={(text) => {
                if (
                  (text.target as HTMLInputElement).value === "delete account"
                )
                  setColor("green");
                else setColor("gray");
              }}
            >
              <input
                type="text"
                name="idInput"
                maxLength={15}
                placeholder="delete account"
                className="w-full text-lg"
              />
            </form>
          </div>
        </div>
      </div>
      <div className="w-full text-end">
        <OutlineButton
          text={l10n.t("deleteAccount")}
          fontSize="lg"
          radius={8}
          color="black"
          onPressed={() => {
            const target = document.getElementById(
              "idInput"
            ) as HTMLFormElement;
            const formData = new FormData(target);
            const deleteAccountWord = (formData.get("idInput") as string) ?? "";
            if (deleteAccountWord !== "delete account") setColor("red");
            else deleteReqeust();
          }}
        />
      </div>
    </div>
  );
}

export default DeleteAccount;
