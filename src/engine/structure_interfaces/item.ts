import * as AuditData from "./auditFields";
import {AuditFields, NewAuditFields} from "./auditFields";
import {GeneralFields} from "./generalFields";
import {DefaultAllocationImportance} from "./allocation";

export interface Item extends AuditFields, GeneralFields {
    tags: string[], //tag_ids
    current_allocation: string, // item's current allocation
    past_allocations: string[], //past allocation_ids
    quantity_in_bundle?: number, // if is a bundle of items, how many.
    importance: number, // 0-10
    related_items?: string[], // item_ids that relate to this item
    current_condition?: string, // the current condition's id
    condition_on_addition?: string, // when item was obtained / recorded, what it's condition is.
    value_at_purchase: number, // monetary, full dollar amount, value of item.
    link_to_product?: string, // https link to product
    package?: string, // package_id, if item is inside of a package
    barcode_id?: string, // not used, but if barcode scanner is used, barcode upc would go here.
}

export interface NewItem extends NewAuditFields, GeneralFields {
    tags?: string[], //tag_ids
    current_allocation: string, // item's current allocation
    quantity_in_bundle?: number, // if is a bundle of items, how many.
    importance?: number, // 0-10
    related_items?: string[], // item_ids that relate to this item
    current_condition?: string, // the current condition's id
    value_at_purchase?: number, // monetary, full dollar amount, value of item.
    link_to_product?: string, // https link to product
    package?: string, // package_id, if item is inside of a package
    barcode_id?: string, // not used, but if barcode scanner is used, barcode upc would go here.
}

export function createItem(request: NewItem): Item {
    const auditData = AuditData.createAuditData(request);

    return {
        ...request,
        ...auditData,
        tags: request.tags?.length ? request.tags : [],
        current_allocation: request.current_allocation,
        past_allocations: [],
        quantity_in_bundle: request.quantity_in_bundle || 0,
        importance: request.importance || DefaultAllocationImportance,
        related_items: request.related_items?.length ? request.related_items : [],
        current_condition: request.current_condition || '',
        condition_on_addition: request.current_condition || '',
        value_at_purchase: request.value_at_purchase || 0,
        link_to_product: request.link_to_product || '',
        package: request.package || '',
        barcode_id: request.barcode_id || '',
    }
}
