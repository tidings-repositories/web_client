import GoogleSignButton from "./GoogleSignButton";
import * as l10n from "i18next";

function Sign() {
  return (
    <div className="flex flex-col gap-8 justify-center px-10 py-4">
      <p className="text-2xl">{l10n.t("signIn")}</p>
      <span>
        <p>
          {l10n.t("signNoti1")} <a>{l10n.t("userAgreement")}</a>{" "}
          {l10n.t("signNoti2")} <a>{l10n.t("privacyPolicy")}</a>
          {l10n.t("signNoti3")}
        </p>
      </span>
      <GoogleSignButton onClick={() => {}} disabled={true} />
    </div>
  );
}

export default Sign;
