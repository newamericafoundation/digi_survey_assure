import { ISurveyCompositeGroupWithChildren } from '../interface/augmented';
import { ISurveyCompositeGroup } from '../interface/db';
import { getCompositeItemsInGroup } from '../model/surveyComposite';
import { getRootCompositeGroupsForSurvey } from '../model/surveyCompositeGroup';

export async function buildCompositeGroupTree(surveyId: number): Promise<ISurveyCompositeGroupWithChildren[]> {
    const compositeBaseGroups: ISurveyCompositeGroup[] = await getRootCompositeGroupsForSurvey(surveyId);

    const finalTree: ISurveyCompositeGroupWithChildren[] = [];
    for (const aBaseGroup of compositeBaseGroups) {
        finalTree.push({
            ...aBaseGroup,
            children: [],
            composites: await getCompositeItemsInGroup(aBaseGroup.id),
        });
    }

    for (const aBaseGroup of finalTree) {
        if (!aBaseGroup.subcategory) { continue; }

        const parentIndex = finalTree.findIndex((aCompositeGroup: any) => aCompositeGroup.id === aBaseGroup.subcategory);

        finalTree[parentIndex].children.push(aBaseGroup);
    }

    const returnTree: ISurveyCompositeGroupWithChildren[] = [];
    for (const aFinalGroup of finalTree) {
        if (!aFinalGroup.subcategory) {
            returnTree.push(aFinalGroup);
        }
    }

    return returnTree;
}
