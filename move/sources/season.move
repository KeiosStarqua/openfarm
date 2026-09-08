module openfarm::season;

use openfarm::farm::{Self, Farm, FarmRegistry};
use openfarm::passport::FarmerPassport;
use openfarm::story;
use std::string::String;
use sui::clock::Clock;
use sui::event;

const E_NOT_FARMER: u64 = 0;
const E_EMPTY_CROP: u64 = 1;
const E_ALREADY_HARVESTED: u64 = 2;
const E_UNKNOWN_KIND: u64 = 3;
const E_NO_SEED: u64 = 4;
const E_EMPTY_PRODUCT: u64 = 5;
const E_ZERO_QUANTITY: u64 = 6;

const KIND_SEED: u8 = 0;
const KIND_IRRIGATE: u8 = 1;
const KIND_FERTILIZE: u8 = 2;
const KIND_PEST: u8 = 3;
const KIND_WEATHER: u8 = 4;
const KIND_HARVEST: u8 = 5;
const KIND_PACKING: u8 = 6;

const STATUS_GROWING: u8 = 0;
const STATUS_HARVESTED: u8 = 1;

public struct ProductionEvent has copy, drop, store {
    kind: u8,
    recorded_at: u64,
    note: String,
    media_blob_id: String,
}

public struct Season has key {
    id: UID,
    farm_id: ID,
    farmer: address,
    farmer_name: String,
    farm_name: String,
    region: String,
    crop_name: String,
    started_at: u64,
    harvested_at: Option<u64>,
    events: vector<ProductionEvent>,
    status: u8,
}

public struct SeasonStarted has copy, drop {
    season_id: ID,
    farm_id: ID,
    farmer: address,
}

public struct EventLogged has copy, drop {
    season_id: ID,
    kind: u8,
}

public fun start(
    farm: &Farm,
    crop_name: String,
    clock: &Clock,
    ctx: &mut TxContext,
): Season {
    farm::assert_owner(farm, ctx);
    assert!(crop_name.length() > 0, E_EMPTY_CROP);
    let season = Season {
        id: object::new(ctx),
        farm_id: farm::id(farm),
        farmer: ctx.sender(),
        farmer_name: std::string::utf8(b""),
        farm_name: farm::name(farm),
        region: farm::region(farm),
        crop_name,
        started_at: clock.timestamp_ms(),
        harvested_at: option::none(),
        events: vector[],
        status: STATUS_GROWING,
    };
    event::emit(SeasonStarted {
        season_id: object::id(&season),
        farm_id: farm::id(farm),
        farmer: ctx.sender(),
    });
    season
}

/// Bind the farmer's public name onto the season so the story can be read
/// without holding the owned passport.
public fun attach_passport(season: &mut Season, passport: &FarmerPassport, ctx: &TxContext) {
    assert!(ctx.sender() == season.farmer, E_NOT_FARMER);
    season.farmer_name = openfarm::passport::name(passport);
}

entry fun start_and_share(
    farm: &Farm,
    crop_name: String,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    share(start(farm, crop_name, clock, ctx));
}

public fun share(season: Season) {
    transfer::share_object(season);
}

public fun log_event(
    season: &mut Season,
    kind: u8,
    note: String,
    media_blob_id: String,
    clock: &Clock,
    ctx: &TxContext,
) {
    assert!(ctx.sender() == season.farmer, E_NOT_FARMER);
    assert!(season.status == STATUS_GROWING, E_ALREADY_HARVESTED);
    assert!(kind <= KIND_PACKING && kind != KIND_HARVEST, E_UNKNOWN_KIND);
    season.events.push_back(ProductionEvent {
        kind,
        recorded_at: clock.timestamp_ms(),
        note,
        media_blob_id,
    });
    event::emit(EventLogged { season_id: object::id(season), kind });
}

public fun harvest(
    season: &mut Season,
    registry: &mut FarmRegistry,
    passport: &mut FarmerPassport,
    product_name: String,
    quantity: u64,
    unit: String,
    clock: &Clock,
    ctx: &mut TxContext,
): story::ProductBatch {
    assert!(ctx.sender() == season.farmer, E_NOT_FARMER);
    assert!(season.status == STATUS_GROWING, E_ALREADY_HARVESTED);
    assert!(product_name.length() > 0, E_EMPTY_PRODUCT);
    assert!(quantity > 0, E_ZERO_QUANTITY);
    assert!(has_seed(&season.events), E_NO_SEED);

    let harvested_at = clock.timestamp_ms();
    season.events.push_back(ProductionEvent {
        kind: KIND_HARVEST,
        recorded_at: harvested_at,
        note: product_name,
        media_blob_id: std::string::utf8(b""),
    });
    season.harvested_at = option::some(harvested_at);
    season.status = STATUS_HARVESTED;
    openfarm::passport::record_completed_season(passport);

    let mut snapshots = vector[];
    let mut i = 0;
    let n = season.events.length();
    while (i < n) {
        let ev = &season.events[i];
        snapshots.push_back(story::snapshot(ev.kind, ev.recorded_at, ev.note, ev.media_blob_id));
        i = i + 1;
    };
    let harvest_story = story::create(
        object::id(season),
        season.farm_id,
        season.farmer,
        season.farmer_name,
        season.farm_name,
        season.region,
        season.crop_name,
        snapshots,
        harvested_at,
        ctx,
    );
    farm::add_story(registry, story::id(&harvest_story));
    let batch = story::mint_batch(
        story::id(&harvest_story),
        product_name,
        quantity,
        unit,
        harvested_at,
        ctx,
    );
    transfer::public_share_object(harvest_story);
    batch
}

entry fun harvest_and_keep(
    season: &mut Season,
    registry: &mut FarmRegistry,
    passport: &mut FarmerPassport,
    product_name: String,
    quantity: u64,
    unit: String,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let batch = harvest(
        season,
        registry,
        passport,
        product_name,
        quantity,
        unit,
        clock,
        ctx,
    );
    transfer::public_transfer(batch, ctx.sender());
}

fun has_seed(events: &vector<ProductionEvent>): bool {
    let mut i = 0;
    let n = events.length();
    while (i < n) {
        if (events[i].kind == KIND_SEED) {
            return true
        };
        i = i + 1;
    };
    false
}

public fun kind_seed(): u8 { KIND_SEED }

public fun kind_irrigate(): u8 { KIND_IRRIGATE }

public fun kind_fertilize(): u8 { KIND_FERTILIZE }

public fun kind_pest(): u8 { KIND_PEST }

public fun kind_weather(): u8 { KIND_WEATHER }

public fun kind_harvest(): u8 { KIND_HARVEST }

public fun kind_packing(): u8 { KIND_PACKING }

public fun id(season: &Season): ID { object::id(season) }

public fun farmer(season: &Season): address { season.farmer }

public fun status(season: &Season): u8 { season.status }

public fun event_count(season: &Season): u64 { season.events.length() }

public fun events(season: &Season): &vector<ProductionEvent> { &season.events }

public fun event_kind(event: &ProductionEvent): u8 { event.kind }

public fun event_note(event: &ProductionEvent): String { event.note }
