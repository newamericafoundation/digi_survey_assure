import * as Koa from 'koa';
import { IResponse } from '../interface/response';

export function successReply(data: any, fromCache: boolean = false, httpCode: number = 200): IResponse {
    return {
        metadata: {
            fromCache: fromCache,
            httpCode: httpCode,
        },
        body: {
            error: false,
            code: fromCache ? 'S002' : 'S001',
            data: data,
        }
    }
}

export function errorReply(httpCode: number = 500, internalCode: string = 'E001', data: any = null): IResponse {
    return {
        metadata: {
            httpCode,
            fromCache: false,
        },
        body: {
            error: true,
            code: internalCode,
            data: data,
        }
    }
}

export function sendResponse(ctx: Koa.Context, response: IResponse) {
    ctx.status = response.metadata.httpCode;
    ctx.body = response.body;
}