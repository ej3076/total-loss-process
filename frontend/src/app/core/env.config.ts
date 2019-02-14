const isDev = window.location.port.indexOf('4200') > -1;
const getHost = () => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    return `${protocol}//${host}`;
}

const apiUri = isDev ? 'http://localhost:8080' : '/prod-url-tbd';

export const ENV = {
    BASE_URI: getHost(),
    BASE_API: apiUri
};
