module openfarm::story;

use std::string::String;
use sui::event;

public struct ProductionSnapshot has copy, drop, store {
    kind: u8,
    recorded_at: u64,
    note: String,
    media_blob_id: String,
}

public struct HarvestStory has key, store {
    id: UID,
    season_id: ID,
    farm_id: ID,
    farmer: address,
    farmer_name: String,
    farm_name: String,
    region: String,
    crop_name: String,
    events: vector<ProductionSnapshot>,
    harvested_at: u64,
}

public struct ProductBatch has key, store {
    id: UID,
    story_id: ID,
    product_name: String,
    quantity: u64,
    unit: String,
    harvested_at: u64,
}

public struct StoryPublished has copy, drop {
    story_id: ID,
    farm_id: ID,
    farmer: address,
}

public(package) fun snapshot(
    kind: u8,
    recorded_at: u64,
    note: String,
    media_blob_id: String,
): ProductionSnapshot {
    ProductionSnapshot { kind, recorded_at, note, media_blob_id }
}

public(package) fun create(
    season_id: ID,
    farm_id: ID,
    farmer: address,
    farmer_name: String,
    farm_name: String,
    region: String,
    crop_name: String,
    events: vector<ProductionSnapshot>,
    harvested_at: u64,
    ctx: &mut TxContext,
): HarvestStory {
    let harvest_story = HarvestStory {
        id: object::new(ctx),
        season_id,
        farm_id,
        farmer,
        farmer_name,
        farm_name,
        region,
        crop_name,
        events,
        harvested_at,
    };
    event::emit(StoryPublished {
        story_id: object::id(&harvest_story),
        farm_id,
        farmer,
    });
    harvest_story
}

public(package) fun mint_batch(
    story_id: ID,
    product_name: String,
    quantity: u64,
    unit: String,
    harvested_at: u64,
    ctx: &mut TxContext,
): ProductBatch {
    ProductBatch {
        id: object::new(ctx),
        story_id,
        product_name,
        quantity,
        unit,
        harvested_at,
    }
}

public fun id(story: &HarvestStory): ID { object::id(story) }

public fun season_id(story: &HarvestStory): ID { story.season_id }

public fun farm_id(story: &HarvestStory): ID { story.farm_id }

public fun farmer(story: &HarvestStory): address { story.farmer }

public fun farmer_name(story: &HarvestStory): String { story.farmer_name }

public fun farm_name(story: &HarvestStory): String { story.farm_name }

public fun crop_name(story: &HarvestStory): String { story.crop_name }

public fun event_count(story: &HarvestStory): u64 { story.events.length() }

public fun product_story_id(batch: &ProductBatch): ID { batch.story_id }

public fun product_name(batch: &ProductBatch): String { batch.product_name }

public fun quantity(batch: &ProductBatch): u64 { batch.quantity }
