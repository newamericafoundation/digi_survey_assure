export interface IResponse {
    metadata: {
        httpCode: number;
        fromCache: boolean;
    }
    body: IResponseContent;
}

interface IResponseContent {
    error: boolean;
    code: string;
    data: any;
}
