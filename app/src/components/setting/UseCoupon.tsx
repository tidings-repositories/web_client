import { useState } from "react";
import OutlineButton from "../button/OutlineButton";
import * as l10n from "i18next";
import { requestPOSTWithToken } from "../../scripts/requestWithToken";

function UseCoupon() {
  const [couponUsableState, setState] = useState(null as boolean | null);
  const [couponStatusMessage, setStatusMessage] = useState("");

  const getColor = (state) => {
    if (state == null) return "transparent";
    else if (state) return "green";
    else return "red";
  };

  const requestUseCoupon = async (couponNumber) => {
    const OK = 200;
    const FORBIDDEN = 403;
    const NOT_FOUND = 404;

    const response = await requestPOSTWithToken(
      `${import.meta.env.VITE_API_URL}/coupon`,
      {
        coupon: couponNumber,
      }
    ).catch((_) => _);

    if (response.status == OK) {
      setState(true);
      setStatusMessage("successfulUsedCoupon");
      setTimeout(() => {
        const closeEvent = new MouseEvent("click", { bubbles: true });
        document.getElementById("dialog-background")?.dispatchEvent(closeEvent);
      }, 1000);
    } else if (response.status == FORBIDDEN) {
      setState(false);
      setStatusMessage("alreadyUsedCoupon");
    } else if (response.status == NOT_FOUND) {
      setState(false);
      setStatusMessage("noExistCoupon");
    } else {
      setState(false);
      setStatusMessage("internalError");
    }
  };

  return (
    <div className="flex flex-col gap-10 justify-center px-10 py-4">
      <div className="flex flex-col gap-2">
        <p className="text-2xl">{l10n.t("enterCouponSentence")}</p>
      </div>
      <div className="flex flex-col">
        <div
          id="couponInputBar"
          className="flex flex-col w-full p-2 gap-1 rounded-lg bg-gray-100 justify-start transition-colors duration-100"
          style={{
            border: "1px solid",
            borderColor: getColor(couponUsableState),
          }}
        >
          <div>
            <a className="text-sm">{l10n.t("enterCouponWord")}</a>
          </div>
          {/*input and enable state area*/}
          <form
            id="couponInput"
            className="w-full"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              name="couponInput"
              maxLength={15}
              className="w-full text-lg"
            />
          </form>
        </div>
        <p
          id="status-message"
          className="p-1 text-sm"
          style={{ color: getColor(couponUsableState) }}
        >
          {l10n.t(couponStatusMessage)}
        </p>
      </div>
      <div className="w-full text-end">
        <OutlineButton
          text={l10n.t("use")}
          fontSize="lg"
          radius={8}
          color="black"
          onPressed={() => {
            const target = document.getElementById(
              "couponInput"
            ) as HTMLFormElement;
            const formData = new FormData(target);
            const inputCoupon = (formData.get("couponInput") as string) ?? "";
            requestUseCoupon(inputCoupon);
          }}
        />
      </div>
    </div>
  );
}

export default UseCoupon;
