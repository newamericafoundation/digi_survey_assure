import superagent from 'superagent';
import { ApiError } from './errors';
import { getItem } from './storage';

/**
 * Simple wrapper class for superagent which allows us
 * to process our API calls and add additional logic
 * like localization, session management, etc.. where
 * necessary.
 */
export default class Api {
    json = true;

    constructor(endpoint, type = "get") {
        const url = `${process.env.REACT_APP_API_URL}/${endpoint}`;

        switch (type) {
            case 'put':
                this.request = superagent.put(url);
                break;
            case 'post':
                this.request = superagent.post(url);
                break;
            case 'delete':
                this.request = superagent.delete(url);
                break;
            default:
                this.request = superagent.get(url);
        }
    }

    secure() {
        const adminToken = getItem('adminToken');
        const token = adminToken ? adminToken : getItem('token');
        if (token) { this.setAuthHeader(token); }

        const language = getItem('language');
        if (language) { this.setLanguageHeader(language); }

        return this;
    }

    setLanguageHeader(language) {
        this.request.set('Accept-Language', language);

        return this;
    }

    setAuthHeader(token) {
        this.request.set('Authorization', `Bearer ${token}`);

        return this;
    }

    notJson() {
        this.json = false;

        return this;
    }

    setHeader(name, value) {
        this.request.set(name, value);

        return this;
    }

    setPayload(payload) {
        this.request.send(payload);

        return this;
    }

    async call() {
        if (this.json) {
            this.request.set('Content-Type', 'application/json');
        }

        return this.request
            .then((res) => {
                return res.body.data;
            })
            .catch((error, res) => {
                if (error.status === 401) {
                    throw new ApiError('Unauthorized', 'E000', 401);
                } else {
                    if ('response' in error) {
                        throw new ApiError(error, error.response.body.code, error.status, error.response.body.data);
                    } else {
                        throw error;
                    }
                }
            });
    }
}
