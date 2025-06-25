import { useEffect } from "react";
import useUserDataStore from "../../store/UserDataStore";
import { requestGETWithToken } from "../../scripts/requestWithToken";
import { AxiosResponse } from "axios";

type AppBarProps = {
  child: React.ReactNode;
};

function AppBar({ child }: AppBarProps) {
  const MY_USERDTA_REQUEST_URL = `${import.meta.env.VITE_API_URL}/profile`;
  const userId = useUserDataStore((state) => state.user_id);
  const dataInjection = useUserDataStore((state) => state.dataInjection);

  useEffect(() => {
    const fetchMyUserData = async () => {
      const OK = 200;
      const response = await requestGETWithToken(MY_USERDTA_REQUEST_URL);
      if (response.status == OK)
        dataInjection((response as AxiosResponse).data);
    };

    if (userId == null) fetchMyUserData();
  }, []);

  return (
    <div
      id="appbar"
      className="fixed top-0 left-0 w-full h-14 px-4 bg-white border-solid border-b-2 border-gray-100 z-50 content-center"
    >
      {child}
    </div>
  );
}

export default AppBar;
