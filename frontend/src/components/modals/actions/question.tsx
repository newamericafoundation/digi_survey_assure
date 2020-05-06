import Api from '../../../helpers/api';

export async function makeQuestionPrivate(questionId: number): Promise<boolean> {
    return new Api(`question/${questionId}/makePrivate`, 'post')
        .secure()
        .call()
        .then((_response: any) => {
            return true;
        })
        .catch((e) => {
            return false;
        });
}

export async function makeQuestionSpanEntireRow(questionId: number): Promise<boolean> {
    return new Api(`question/${questionId}/spanEntireRow`, 'post')
        .secure()
        .call()
        .then((_response: any) => {
            return true;
        })
        .catch((e) => {
            return false;
        });
}
