import AppBar from "../components/public/AppBar";

type AgreementAdnPolicyProps = {
  child: React.ReactNode;
};

export default function AgreementAdnPolicy({ child }: AgreementAdnPolicyProps) {
  return (
    <div id="scaffold" className="w-full h-screen mx-auto content-start">
      <AppBar
        showSearch={false}
        showMessage={false}
        showNoti={false}
        showCompmoser={false}
        showDrawer={false}
        showLogin={false}
        showProfile={false}
      />
      <div
        id="AgreementAdnPolicy"
        className="flex flex-col gap-2 px-8 pt-20 pb-10"
      >
        {child}
      </div>
    </div>
  );
}
