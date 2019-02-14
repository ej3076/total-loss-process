import { ENV } from 'src/app/core/env.config';

interface AuthConfig {
    CLIENT_ID: string;
    CLIENT_DOMAIN: string;
    AUDIENCE: string;
    REDIRECT: string;
    SCOPE: string;
};

export const AUTH_CONFIG: AuthConfig = {
    CLIENT_ID: 't3sXyFtDUl0wFsHVsQsJbEa4en4bgPly',
    CLIENT_DOMAIN: 'total-loss-process.auth0.com',
    AUDIENCE: 'https://total-loss-process.auth0.com/api/v2/',
    REDIRECT: `${ENV.BASE_URI}/callback`,
    SCOPE: 'openid profile create:user_app_metadata update:user_app_metadata read:users'
};
