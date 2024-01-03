import {GeneralFields} from "./generalFields";
import {AuditFields, NewAuditFields} from "./auditFields";
import * as AuditData from "./auditFields";

export let DefaultTagColor = '#be3228';
export let DefaultTagImportance = 5;
export interface Tag extends GeneralFields, AuditFields {
    color: string, // hex rgb
    importance: number // 0-10
}

export interface NewTag extends GeneralFields, NewAuditFields {
    color?: string, // hex rgb
    importance?: number // 0-10
}

export function createTag(request: NewTag): Tag {
    const auditData = AuditData.createAuditData(request);

    return {
        ...request,
        ...auditData,
        color: request.color || DefaultTagColor,
        importance: request.importance || DefaultTagImportance,
    };
}
