import {Allocation} from "./structure_interfaces/allocation";
import {Condition} from "./structure_interfaces/condition";
import {Item} from "./structure_interfaces/item";
import {Package} from "./structure_interfaces/package";
import {Tag} from "./structure_interfaces/tag";
import {Checkout} from "./structure_interfaces/checkout";
import {Checkin} from "./structure_interfaces/checkin";

export class InventoryStateManager {
    private invmState: InventoryState = {
        allocations: [],
        conditions: [],
        items: [],
        packages: [],
        tags: [],
        checkouts: [],
        checkins: [],
    }
    constructor(initialState?: InventoryState) {
        if (initialState) {
            this.invmState = initialState;
        }
    }

    

}

export interface InventoryState {
    allocations: Allocation[],
    conditions: Condition[],
    items: Item[],
    packages: Package[],
    tags: Tag[],
    checkouts: Checkout[],
    checkins: Checkin[],
}
