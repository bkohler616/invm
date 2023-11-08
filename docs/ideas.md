# Main DB JS
## Main goals
### Main DB
- Allow for easy JSON schema adjustments.
- On first run, generate some basic setup files.
- Allow for dynamic JSON schemas on pre-built schemas
- Allow for adding on "custom" items / references.
    - Like, adding a new table or identifier for items... idk man, world's your oyster here.
- Add reporting.
    - Reporting based on items with specific...
        - Tag
        - Allocation
        - Condition
        - Currently checked-out
        - Overdue checkouts
        - Currently checked-in
        - Items that are about to expire in checkin
- Add easy searching of items, packages, tags, allocations, condition, 
    - Allocations...
        - are either a location or person that has the current posession.
        - may have a sub-allocation (recursive, possibly loop-able)
            - Doubly linked list for traversal?
        - may be something like "Bill", who may have multiple items checked out.
            - A sub allocation may be that "Bill" told you that he would have the item/package in "Bill's office".
        - may also be like "3rd floor"
            - A sub allocation may be "Guest Bedroom"
                - A sub-sub allocation may be "Closet"
        - purpose is to define the _where_ of something. Allocations may be either _controlled_ or not, meaning that the user is the only one with access, or should be the one responsible for said item.

    - Packages...
        - are a grouping of items.
        - ss not an allocation - imagine it is a box that contains multiple items
        - are a moveable item, so when a package is put to an allocation, all items contained in said package will be moved as well.
    
    - Tags...
        - simple tags to denote what something is easily.
        - should be color coded.

    - Items...
        - The thing you want to inventory for.
    
    - Condition...
        - denotes how damaged / not damaged the item is.
        - will be used in cost-calculations for loss control.
        - may include descriptors for defining protection.
- Export an "engine" that will contain all of the searching, customizing, creating, so the CLI / web will be the same output for each instance.


### CLI
- Utilizes the Main DB engine - but doesn't overwrite it.
- Allow for both export and import of .zip or .json
- On import, ask if we should overwrite conflicts, clear all previous entries (start fresh), or prompt for overwrite per record with comparison.
- First run will be dictated by the prefix stated in the user's PATH.

### Electron
- Same as [[#CLI]]
- First run will be dictated by a prompt asking where the files should be stored, or store to default location.
- More form-based input system.

### Capacitor
- Same as [[#Electron]]
- Possible camera scanner for barcode scanning?


## JSON examples

### Generic Fields
```json
{
	"name": "String",
	"description": "String",
}
```

### Generic audit fields
```json
{
	"id": "GUID",
	"date_added": "Date",
	"date_modified": ["Last", "5", "modified", "Dates"],
	"added_by": "CLI | Electron | Capacitor",
	"is_removed": false,
	"date_removed": "Date",
}
```

### Item
```json
{
	...[[#Generic audit fields]],
	...[[#Generic Fields]],
	"tags": ["tag IDs"],
	"item_allocation": "allocation_id",
	"past_allocations": ["last", "5", "allocation", "ids"],
	"quantity_in_bundle": 1,
	"importance": 0-10,
	"related_items": ["item_ids"],
	"condition": "condition_id",
	"value_at_purchase": 100,
	"link_to_product": "http url",
	"package": "package_id",
    "barcode_id": "ID",
}
```

### Package
```json
{
	...[[#Generic audit fields]],
	...[[#Generic Fields]],
	"items": ["item_ids"],
	"tags": ["tag_ids"],
	""
}
```

### Tag
```json
{
	...[[#Generic audit fields]],
	...[[#Generic Fields]],
	"color": "#hex",
	"importance": 0-10,
}
```

### Condition
```json
{
	...[[#Generic audit fields]],
	...[[#Generic Fields]],
	"tags": ["list_of_tags"],
	"color": "#hex",
	"importance": 0-10,
	"cost_modifier": 0-100,
}
```

### Allocation
```json
{
	...[[#Generic audit fields]],
	...[[#Generic Fields]],
	"description": "string",
	"tags": ["list_of_tags"],
	"importance": 0-10,
    "sub-allocation": "allocation_id",
	"isControlled": true,
}
```

### Check-out details
```json
{
	...[[#Generic audit fields]],
	"checkout_to": "allocation_id",
	"desired_length": "amount of time - 0 for indefinite",
	"purpose": "description",
	"condition_at_checkout": "condition_id",
	"effective_date": "Date",
}
```

### Check-in details
```json
{
	...[[#Generic audit fields]],
	"checkout_reference": "checkout_id",
	"condition_at_checkin": "condition_id",
	"effective_date": "Date",
	"checkin_to": "allocation_id",
    "checkin_expiration": "Date",
}
```

## Functions for Engine
### [type].makeRecord()
Records a doc to that record type, persists to the system. Returns an object for that record.
### [record].save()
Force save the record.

# CLI
## Technology stack
- Node.js
- JSON files export
- Adhear to a INVM prefix for a folder.
- Create a "quick" cli for ease-of-entry. (probably add -i, --no-interactive)
- Create an "interactive" cli that will ask a series of questions for said action.


## Ideas
Node.js command line - maybe use oclif?

Follow https://github.com/lirantal/nodejs-cli-apps-best-practices#11-respect-posix-args

# Electron / Capacitor
Save storage to localstorage.





Electron / website - Angular - 