import { useState } from "react";
import * as l10n from "i18next";
import OutlineButton from "../button/OutlineButton";
import axios from "axios";
import iconPack from "../public/IconPack";

function Register() {
  let debounceRef;
  const [idUsableState, setState] = useState(null as boolean | null);
  const [idUsableStatusMessage, setStatusMessage] = useState("overRangeString");

  const getColor = (state) => {
    if (state == null) return "transparent";
    else if (state) return "green";
    else return "red";
  };

  const chekcIdUsableEvent = (e) => {
    const expectId = e.target.value;

    if (debounceRef) debounceRef(expectId);
    else
      debounceRef = debounce((expectId) => {
        //자체적인 검사 후 불가능하다면 return과 함께 state false로 변경
        const selfValidate = validateId(expectId);
        if (!selfValidate.result) {
          setState(selfValidate.result);
          setStatusMessage(selfValidate.statusMessage!);
          return;
        }

        axios
          .get(`${import.meta.env.VITE_API_URL}/auth/check?id=${expectId}`, {
            withCredentials: true,
          })
          .then((response) => {
            setState(response.data.result);
            setStatusMessage(response.data.statusMessage);
          })
          .catch((e) => {
            console.log(e);
          });
      });
  };

  const requestRegister = (publicId) => {
    if (!idUsableState) return;

    //자체적인 검사 후 불가능하다면 return과 함께 state false로 변경
    const selfValidate = validateId(publicId);
    if (!selfValidate.result) {
      setState(selfValidate.result);
      setStatusMessage(selfValidate.statusMessage!);
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          publicId,
        },
        {
          withCredentials: true,
        }
      )
      .catch((_) => {
        setState(false);
        setStatusMessage("internalError");
        return _;
      })
      .then((response) => {
        if (response.data) {
          if (response.data.result != "login") return;

          if (response.data.refreshToken)
            localStorage.setItem("refreshToken", response.data.refreshToken);
          if (response.data.accessToken)
            localStorage.setItem("accessToken", response.data.accessToken);

          window.location.reload();
        }
      });
  };

  return (
    <div className="flex flex-col gap-10 justify-center px-10 py-4">
      <div className="flex flex-col gap-2">
        <p className="text-2xl">{l10n.t("createUniqueId")}</p>
        <p>
          <a>{`@${l10n.t("username")}`}</a>
          {l10n.t("registerInformation")}
        </p>
      </div>
      <div className="flex flex-col">
        <div
          id="idInputBar"
          className="flex flex-col w-full p-2 gap-1 rounded-lg bg-gray-100 justify-start transition-colors duration-100"
          style={{ border: "1px solid", borderColor: getColor(idUsableState) }}
        >
          <div>
            <a className="text-sm">{l10n.t("username")}</a>
          </div>
          {/*input and enable state area*/}
          <div className="flex w-full gap-1 items-center justify-between">
            <p className="text-lg text-indigo-500">@</p>
            <form
              id="idInput"
              className="w-full"
              onChange={chekcIdUsableEvent}
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="text"
                name="idInput"
                maxLength={15}
                className="w-full text-lg"
              />
            </form>
            {/*enable or disable icon*/}
            <svg
              aria-hidden="true"
              id="ableStateIcon"
              style={{ width: 16, height: 16, color: getColor(idUsableState) }}
            >
              {iconPack(idUsableState ? "check" : "normal-xmark")}
              <use xlinkHref={`#${idUsableState ? "check" : "normal-xmark"}`} />
            </svg>
          </div>
        </div>
        <p
          id="status-message"
          className="p-1 text-sm"
          style={{ color: getColor(idUsableState) }}
        >
          {l10n.t(idUsableStatusMessage)}
        </p>
      </div>
      <div className="w-full text-end">
        <OutlineButton
          text={l10n.t("getStarted")}
          fontSize="lg"
          radius={8}
          color="black"
          onPressed={() => {
            const target = document.getElementById(
              "idInput"
            ) as HTMLFormElement;
            const formData = new FormData(target);
            const expectId = (formData.get("idInput") as string) ?? "";
            requestRegister(expectId);
          }}
        />
      </div>
    </div>
  );
}

/*-------------------*/

type IdValidateResultType = {
  result: boolean;
  statusMessage?: string;
};

function validateId(expectId: string): IdValidateResultType {
  //조건: 1. 4자 이상 15자 이하인지, 2. 영문, 숫자, 언더스코어(_)로만 구성되어 있는지
  if (expectId.length < 4 || expectId.length > 15)
    return {
      result: false,
      statusMessage: l10n.t("overRangeString"),
    };

  const idPatternRegExp = /^[A-Za-z0-9_]+$/;
  if (!idPatternRegExp.test(expectId))
    return {
      result: false,
      statusMessage: l10n.t("noSupportCharacter"),
    };

  return {
    result: true,
  };
}

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

export default Register;
