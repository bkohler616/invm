import {GeneralFields} from "./generalFields";
import * as AuditData from "./auditFields";
import {AuditFields, NewAuditFields} from "./auditFields";

export let DefaultCostModifier = 100;
export let DefaultImportanceModifier = 5;
export let DefaultColor = '#6fa8dc';

export interface Condition extends GeneralFields, AuditFields {
    tags: string[], // tag ids
    color: string, // hex rgb
    importance: number, // 0-10
    cost_modifier: number // percentage of item value modifier
}

export interface NewCondition extends GeneralFields, NewAuditFields {
    tags?: string[],
    color?: string,
    importance?: number,
    cost_modifier?: number,
}

export function createCondition(request: NewCondition): Condition {
    const auditData = AuditData.createAuditData(request);

    return {
        ...request,
        ...auditData,
        tags: request.tags?.length ? request.tags : [],
        color: request.color || DefaultColor,
        importance: request.importance || DefaultImportanceModifier,
        cost_modifier: request.cost_modifier || DefaultCostModifier
    }
}
