export function setItem(key, value) {
    return localStorage.setItem(buildKey(key), JSON.stringify(value));
}

export function getItem(key) {
    return JSON.parse(localStorage.getItem(buildKey(key)));
}

export function deleteItem(key) {
    return localStorage.removeItem(buildKey(key));
}

export function clearItems() {
    localStorage.removeItem(buildKey('adminToken'));
    localStorage.removeItem(buildKey('activeSurvey'));
    localStorage.removeItem(buildKey('language'));
    localStorage.removeItem(buildKey('token'));

    return true;
}

function buildKey(key) {
    return `wr_${key}`;
}
