import GoogleSignButton from "./GoogleSignButton";
import * as l10n from "i18next";
import ReactDOM from "react-dom/client";
import Register from "./Register";

function Sign() {
  return (
    <div id="sign-box">
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
                  registerProcess();
                }
              },
              { once: true }
            );
          }}
        />
      </div>
    </div>
  );
}

/*--------------------*/

function registerProcess() {
  const box = document.getElementById("sign-box")!;
  box.innerHTML = "";

  const registerComponentFrame = document.createElement("div");
  box.appendChild(registerComponentFrame);

  const root = ReactDOM.createRoot(registerComponentFrame);
  root.render(<Register />);
}

export default Sign;
