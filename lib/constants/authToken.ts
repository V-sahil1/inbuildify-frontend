export const getKeyPrefix = () => localStorage.getItem("keyPrefix");

export function getCurrentUser() {
  return localStorage.getItem(`${getKeyPrefix()}.LastAuthUser`);
}

function getKeyAccessToken() {
  return `${getKeyPrefix()}.${getCurrentUser()}.accessToken`;
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setKeyPrefix = (keyPrefix: any) =>
  localStorage.setItem("keyPrefix", keyPrefix);

export const getStoredAuthToken = (): string | undefined => {
  try {
    const accessToken = (localStorage.getItem("accessToken") || "") as string;
    return accessToken;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const storeAuthToken = (token: any) =>
  localStorage.setItem("accessToken", token);

export const storeRefreshToken = (token: any) =>
  localStorage.setItem("refreshToken", token);

export const removeStoredAuthToken = () =>
  localStorage.removeItem(getKeyAccessToken());

export const removeRefreshToken = () => {
  localStorage.removeItem("refreshToken");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};
