import { useState } from "react";
import GoogleSignButton from "./GoogleSignButton";
import * as l10n from "i18next";
import Register from "./Register";

function Sign() {
  const [view, setView] = useState<"sign" | "register">("sign");

  if (view === "register") return <Register />;

  return (
    <div className="flex flex-col gap-8 justify-center px-10 py-4">
      <p className="text-2xl">{l10n.t("signIn")}</p>
      <span>
        <p>
          {l10n.t("signNoti1")}{" "}
          <a
            href="/setting/user-agreement"
            target="_blank"
            rel="noopener noreferrer"
          >
            {l10n.t("userAgreement")}
          </a>{" "}
          {l10n.t("signNoti2")}{" "}
          <a
            href="/setting/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            {l10n.t("privacyPolicy")}
          </a>
          {l10n.t("signNoti3")}
        </p>
      </span>
      <GoogleSignButton
        onClick={() => {
          window.open(
            `${import.meta.env.VITE_API_URL}/oauth2/authorization/google`,
            "googleSignIn",
            "width=600,height=700"
          );

          window.addEventListener(
            "message",
            (message) => {
              const response = message.data;

              if (response.result === "login") {
                if (response.refreshToken)
                  localStorage.setItem("refreshToken", response.refreshToken);
                if (response.accessToken)
                  localStorage.setItem("accessToken", response.accessToken);
                window.location.reload();
              } else if (response.result === "register") {
                setView("register");
              }
            },
            { once: true }
          );
        }}
      />
    </div>
  );
}

export default Sign;
