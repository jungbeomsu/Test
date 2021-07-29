import Cookies from 'js-cookie';

const CentiToken = {

  save: (accessToken, expiresAt, refreshToken) => {

    let accessExpires = (expiresAt - 10) * 1000;
    let refreshExpires = (expiresAt + 100 + 100 * 24 * 3600) * 1000;

    Cookies.set('access_token', accessToken, {expires: new Date(accessExpires)});
    Cookies.set('refresh_token', refreshToken, {expires: new Date(refreshExpires)});
  },

  getAccessToken: () => {

    return Cookies.get('access_token');
  },

  getRefreshToken: () => {

    return Cookies.get('refresh_token');
  },

  remove: () => {

    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
  }
}

export default CentiToken;
