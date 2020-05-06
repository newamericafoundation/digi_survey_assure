import * as jwt from 'jsonwebtoken';
import * as Koa from 'koa';
import { config } from '../config';
import { errorReply } from '../helper/response';
import { IPermissionGroups, IPermissionScopes } from '../interface/permissions';
import { IResponse } from '../interface/response';

export function generateJwt(payload: any, hours: number = 24): string {
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn: 60 * 60 * hours });
}

export function getJwt(context: Koa.Context): any {
    try {
        if ('authorization' in context.headers) {
            const rawToken = context.headers.authorization.split(' ')[1];

            return jwt.verify(rawToken, config.JWT_SECRET);
        } else {
            return null;
        }
    } catch (e) {
        return null;
    }
}

export function getPermissionList(jwtToken: any): number[] {
    return (jwtToken && 'questionAccess' in jwtToken) ? jwtToken.questionAccess : [];
}

export function checkPermissions(
    context: Koa.Context,
    _permissionScope: IPermissionGroups,
    _permissionType: IPermissionScopes,
    _permissionElements: number[]
): boolean {
    const jwtContent = getJwt(context);
    if (!jwtContent) {
        throw new Error('Invalid JWT token.');
    }

    if (!('adminAccess' in jwtContent)) {
        throw new Error('Permission denied.');
    }

    return true;
}

export function permissionDeniedResponse(data: any = null): IResponse {
    return errorReply(401, 'E031', data);
}
