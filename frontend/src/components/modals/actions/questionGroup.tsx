import Api from '../../../helpers/api';

export async function makeQuestionGroupPrivate(questionGroupId: number): Promise<boolean> {
    return new Api(`questionGroup/${questionGroupId}/makePrivate`, 'post')
        .secure()
        .call()
        .then((_response: any) => {
            return true;
        })
        .catch((e) => {
            return false;
        });
}
