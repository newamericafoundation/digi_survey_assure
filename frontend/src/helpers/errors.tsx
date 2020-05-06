export class ApiError extends Error {
    errorCode: string;
    httpCode: number;
    errorMessage: any;

    constructor(message: string, errorCode: string, httpCode: number, errorMessage: any = '') {
        super(message);

        this.name = this.constructor.name;
        this.errorCode = errorCode;
        this.httpCode = httpCode;
        this.errorMessage = errorMessage;
    }
}
