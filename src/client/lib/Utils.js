import moment from "moment";

export const Config = {
  apiDomain: "http://dev-centimeter-api.tenuto.co.kr:24242",
  gameServerDomain: "http://localhost:4000", //TODO: 로컬에서만 동작. dev에선 http://dev-town-game.tenuto.co.kr
  myUserId: undefined,
};

export const Cache = {
  accessToken: null,
  expiresAt: null,
  refreshToken: null,
}

export const RtToken = {

  save: async (accessToken, expiresAt, refreshToken) => {
    Cache.accessToken = accessToken;
    await localStorage.setItem('@access_token', accessToken);

    Cache.expiresAt = expiresAt;
    await localStorage.setItem('@expires_at', expiresAt.toString());

    Cache.refreshToken = refreshToken;
    await localStorage.setItem('@refresh_token', refreshToken);
  },

  getAccessToken: async () => {

    try {
      const now = moment().unix();
      let expiresAt = Cache.expiresAt;
      if (!expiresAt) {
        const expiresAtStr = await localStorage.getItem('@expires_at');
        if (expiresAtStr) {
          expiresAt = parseInt(expiresAtStr);
          Cache.expiresAt = expiresAt;
        }
      }

      if (!expiresAt || now >= expiresAt) {
        return null;
      }

      let accessToken = Cache.accessToken;
      if (!accessToken) {
        accessToken = await localStorage.getItem('@access_token');
        Cache.accessToken = accessToken;
      }
      return accessToken;
    } catch (err) {
      console.log(err);
      return null;
    }
  },

  getRefreshToken: async () => {
    try {
      let refreshToken = Cache.refreshToken;
      if (!refreshToken) {
        refreshToken = await localStorage.getItem('@refresh_token');
        Cache.refreshToken = refreshToken;
      }
      return refreshToken;
    } catch (err) {
      console.log(err);
      return null;
    }
  },

  test: async () => {
    Cache.expiresAt = null;
    await localStorage.removeItem('@expires_at');
  },

  remove: async () => {
    Cache.refreshToken = null;
    await localStorage.removeItem('@refresh_token');

    Cache.expiresAt = null;
    await localStorage.removeItem('@expires_at');

    Cache.accessToken = null;
    await localStorage.removeItem('@access_token');
  },

  refreshToken: async () => {

    const refreshToken = await RtToken.getRefreshToken();
    if (!refreshToken) {
      return;
    }

    const config = {
      method: 'POST',
      url: `${Config.apiDomain}/v1/user/access_token/refresh`,
      headers: {'Content-Type': 'application/json'},
      data: {refresh_token: refreshToken}
    };

    const response = await axios(config);
    if (response.data.result.is_success) {
      await RtToken.save(response.data.access_token, response.data.expires_at, response.data.refresh_token);
    } else {
      await RtToken.remove();
    }
  }
}
