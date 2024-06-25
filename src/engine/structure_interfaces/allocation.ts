import * as AuditData from './auditFields';
import {GeneralFields} from './generalFields';
import {Options} from 'yargs';

export const DefaultAllocationImportance = 5;

export interface Allocation extends AuditData.AuditFields, GeneralFields {
    tags: string[], //tag ids
    importance: number, // 0-10
    sub_allocation: string, // allocation_id
    is_controlled: boolean // allocation is under control by maintainer
}

export interface NewAllocation extends AuditData.NewAuditFields, GeneralFields {
    tags?: string[],
    importance?: number,
    sub_allocation?: string,
    is_controlled: boolean,
}

export function createAllocation(request: NewAllocation): Allocation {
    const auditData = AuditData.createAuditData(request);

    return {
        ...request,
        ...auditData,
        tags: request.tags?.length ? request.tags : [],
        importance: request.importance || DefaultAllocationImportance,
        sub_allocation: request.sub_allocation || '',
        is_controlled: request.is_controlled,
    };
}

export const allocationRequiredKeys: { [key: string]: Options; } = {
    name: {
        type: 'string',
        description: 'Name of the thing to add.'
    },
    tags: {
        type: 'array',
        description: 'Array of tags'
    },
    is_controlled: {
        type: 'boolean'
    }
};
