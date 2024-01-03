import {GeneralFields} from "./generalFields";
import {AuditFields, NewAuditFields} from "./auditFields";
import * as AuditData from "./auditFields";

export interface Package extends GeneralFields, AuditFields{
    items: string[], // item_ids
    tags: string[], // tag_ids
}

export interface NewPackage extends GeneralFields, NewAuditFields{
    items?: string[], // item_ids
    tags?: string[], // tag_ids
}

export function createPackage(request: NewPackage): Package {
    const auditData = AuditData.createAuditData(request);

    return {
        ...request,
        ...auditData,
        items: request.items?.length ? request.items : [],
        tags: request.tags?.length ? request.tags : []
    };
}
