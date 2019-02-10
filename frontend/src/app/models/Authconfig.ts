interface Authconfig {
  clientID: string;
  domain: string;
  responseType: string;
  callbackURL: string;
  scope: string;
  apiUrl: string;
}

export const AUTH0_CONFIG: Authconfig = {
  clientID: 't3sXyFtDUl0wFsHVsQsJbEa4en4bgPly',
  domain: 'total-loss-process.auth0.com',
  responseType: 'token id_token',
  callbackURL: 'http://localhost:4200/callback',
  scope:
    'openid, profile, update:user_app_metadata, create:current_user_metadata, read:current_user',
  apiUrl: 'https://total-loss-process.auth0.com/api/v2/',
};
