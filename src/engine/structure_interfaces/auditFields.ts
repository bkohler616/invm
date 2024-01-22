import type {UUID} from "crypto";
import {randomUUID} from "crypto";
import {addedBy} from "../enums/addedBy";

export interface AuditFields {
    id: UUID, // unique ID for matching / adding.
    date_added: string, // Date when added (toISOString)
    date_modified: string[], // list of dates this was modified (toISOString)
    added_by: addedBy, // system this was added by
    last_modified_by?: addedBy, //system this was last modified by
    is_removed: boolean, // is the item removed / should not be shown in basic queries
    date_removed?: string, // date this item was removed (toISOString)
    removed_reason?: string // reason for removal
}

export interface NewAuditFields {
    added_by: addedBy, // system this was added by
}

export function createAuditData(request: NewAuditFields): AuditFields {
    const newDate = new Date().toISOString();

    return {
        id: randomUUID(),
        date_added: newDate,
        date_modified: [newDate],
        added_by: request.added_by || addedBy.Unknown,
        last_modified_by: request.added_by || addedBy.Unknown,
        is_removed: false,
    }
}
