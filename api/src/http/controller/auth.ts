import { comparePasswords } from '../../helper/hashing'
import { errorReply, successReply } from '../../helper/response';
import { generateJwt } from '../../helper/session';
import { IAuthenticationPayload } from '../../interface/payload';
import { IResponse } from '../../interface/response';
import { getUserByUsername } from '../../model/user';

export async function authenticateAdmin(body: IAuthenticationPayload): Promise<IResponse> {
    if (!('username' in body) || !('password' in body)) {
        return errorReply(401, 'E034');
    }

    const user = await getUserByUsername(body.username);
    if (!user) {
        return errorReply(401, 'E034');
    }

    const passwordsMatch = comparePasswords(user.password, body.password);
    if (!passwordsMatch) {
        return errorReply(401, 'E034');
    }

    return successReply(generateJwt({
        adminAccess: true,
        userId: user.id,
        userGroupId: user.user_group_id
    }));
}
