import {AuditFields} from "./auditFields";

export interface Checkin extends AuditFields {
    checkout_reference: string, //allocation_id
    condition_at_checkin: string,
    effective_date: string, //Full date to go into effect.
    checkin_to: string,
    checkin_expiration?: string,
}
