import {GeneralFields} from './generalFields';
import * as AuditData from './auditFields';
import {AuditFields, NewAuditFields} from './auditFields';
import {Options} from 'yargs';

export interface Package extends GeneralFields, AuditFields {
    items: string[], // item_ids
    tags: string[], // tag_ids
}

export interface NewPackage extends GeneralFields, NewAuditFields {
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

export const packageRequiredKeys: { [key: string]: Options; } = {
    name: {
        type: 'string'
    },
};
