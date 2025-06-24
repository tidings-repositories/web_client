import axios, { AxiosResponse } from "axios";

export async function requestGETWithToken(url) {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return { status: 401 };

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status == 401) {
    const isSuccessRefresh = await tryRefreshToken();
    if (isSuccessRefresh) {
      const newAccessToken = localStorage.getItem("accessToken");
      return axios.get(url, {
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
    }
  } else saveToken(response);

  return response;
}

export async function requestPOSTWithToken(url, data: { [key: string]: any }) {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return { status: 401 };

  const response = await axios.post(
    url,
    { ...data },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (response.status == 401) {
    const isSuccessRefresh = await tryRefreshToken();
    if (isSuccessRefresh) {
      const newAccessToken = localStorage.getItem("accessToken");
      return axios.post(
        url,
        { ...data },
        {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        }
      );
    }
  } else saveToken(response);

  return response;
}

function saveToken(response: AxiosResponse<any, any>) {
  if (response.data.refreshToken)
    localStorage.setItem("refreshToken", response.data.refreshToken);
  if (response.data.accessToken)
    localStorage.setItem("accessToken", response.data.accessToken);
}

async function tryRefreshToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return false;

  const tokenRefreshResponse = await axios.get(
    `${import.meta.env.VITE_API_URL}/auth/refresh`,
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );

  if (tokenRefreshResponse.status == 200) {
    saveToken(tokenRefreshResponse);
    return true;
  } else return false;
}
