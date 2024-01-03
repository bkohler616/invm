import {AuditFields} from "./auditFields";

export interface Checkout extends AuditFields {
    checkout_to: string, //allocation_id
    desired_length: Date, //ex, 1 week.
    purpose: string,
    condition_at_checkout: string, //condition_id
    effective_date: Date, //Full date to go into effect.
}
