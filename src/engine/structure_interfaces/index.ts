import {allocationRequiredKeys, NewAllocation} from './allocation';
import {itemRequiredKeys, NewItem} from './item';
import {NewPackage, packageRequiredKeys} from './package';
import {NewTag, tagRequiredKeys} from './tag';
import {conditionRequiredKeys, NewCondition} from './condition';

export * from './allocation';
export * from './auditFields';
export * from './checkin';
export * from './checkout';
export * from './condition';
export * from './generalFields';
export * from './item';
export * from './package';
export * from './tag';
export * from './interface_requirements';

export const requiredKeys = {
    ...allocationRequiredKeys,
    ...itemRequiredKeys,
    ...packageRequiredKeys,
    ...tagRequiredKeys,
    ...conditionRequiredKeys,
};

export interface allKeysData extends NewAllocation, NewItem, NewTag, NewCondition, NewPackage {

}
