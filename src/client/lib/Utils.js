export const Config = {
  apiDomain: "http://dev-centimeter-api.tenuto.co.kr:24242"
};

export const RtToken = {

  save: async (accessToken, expiresAt, refreshToken) => {
    Cache.accessToken = accessToken;
    await AsyncStorage.setItem('@access_token', accessToken);

    Cache.expiresAt = expiresAt;
    await AsyncStorage.setItem('@expires_at', expiresAt.toString());

    Cache.refreshToken = refreshToken;
    await AsyncStorage.setItem('@refresh_token', refreshToken);
  },

  getAccessToken: async () => {

    try {
      const now = moment().unix();
      let expiresAt = Cache.expiresAt;
      if (!expiresAt) {
        const expiresAtStr = await AsyncStorage.getItem('@expires_at');
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
        accessToken = await AsyncStorage.getItem('@access_token');
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
        refreshToken = await AsyncStorage.getItem('@refresh_token');
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
    await AsyncStorage.removeItem('@expires_at');
  },

  remove: async () => {
    Cache.refreshToken = null;
    await AsyncStorage.removeItem('@refresh_token');

    Cache.expiresAt = null;
    await AsyncStorage.removeItem('@expires_at');

    Cache.accessToken = null;
    await AsyncStorage.removeItem('@access_token');
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
