module openfarm::farm;

use std::string::String;
use sui::clock::Clock;
use sui::event;

const E_EMPTY_NAME: u64 = 0;
const E_NOT_FARMER: u64 = 1;

public struct FarmRegistry has key {
    id: UID,
    farms: vector<ID>,
    stories: vector<ID>,
}

public struct Farm has key {
    id: UID,
    farmer: address,
    name: String,
    region: String,
    crop_focus: String,
    established_year: u16,
    created_at: u64,
}

public struct FarmRegistered has copy, drop {
    farm_id: ID,
    farmer: address,
}

fun init(ctx: &mut TxContext) {
    transfer::share_object(FarmRegistry {
        id: object::new(ctx),
        farms: vector[],
        stories: vector[],
    });
}

public fun register(
    registry: &mut FarmRegistry,
    name: String,
    region: String,
    crop_focus: String,
    established_year: u16,
    clock: &Clock,
    ctx: &mut TxContext,
): Farm {
    assert!(name.length() > 0, E_EMPTY_NAME);
    let farm = Farm {
        id: object::new(ctx),
        farmer: ctx.sender(),
        name,
        region,
        crop_focus,
        established_year,
        created_at: clock.timestamp_ms(),
    };
    let farm_id = object::id(&farm);
    registry.farms.push_back(farm_id);
    event::emit(FarmRegistered { farm_id, farmer: ctx.sender() });
    farm
}

entry fun register_and_share(
    registry: &mut FarmRegistry,
    name: String,
    region: String,
    crop_focus: String,
    established_year: u16,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    share(register(
        registry,
        name,
        region,
        crop_focus,
        established_year,
        clock,
        ctx,
    ));
}

public fun share(farm: Farm) {
    transfer::share_object(farm);
}

public(package) fun add_story(registry: &mut FarmRegistry, story_id: ID) {
    registry.stories.push_back(story_id);
}

public fun assert_owner(farm: &Farm, ctx: &TxContext) {
    assert!(ctx.sender() == farm.farmer, E_NOT_FARMER);
}

public fun farmer(farm: &Farm): address { farm.farmer }

public fun name(farm: &Farm): String { farm.name }

public fun region(farm: &Farm): String { farm.region }

public fun crop_focus(farm: &Farm): String { farm.crop_focus }

public fun established_year(farm: &Farm): u16 { farm.established_year }

public fun id(farm: &Farm): ID { object::id(farm) }

public fun farms(registry: &FarmRegistry): &vector<ID> { &registry.farms }

public fun stories(registry: &FarmRegistry): &vector<ID> { &registry.stories }

#[test_only]
public fun init_for_testing(ctx: &mut TxContext) {
    init(ctx);
}
