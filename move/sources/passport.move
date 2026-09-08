module openfarm::passport;

use std::string::String;
use sui::clock::Clock;
use sui::event;

const E_EMPTY_NAME: u64 = 0;
const TRUST_PER_SEASON: u64 = 10;

public struct FarmerPassport has key, store {
    id: UID,
    name: String,
    region: String,
    bio: String,
    trust_score: u64,
    seasons_completed: u64,
    created_at: u64,
}

public struct PassportCreated has copy, drop {
    passport_id: ID,
    owner: address,
}

public fun create(
    name: String,
    region: String,
    bio: String,
    clock: &Clock,
    ctx: &mut TxContext,
): FarmerPassport {
    assert!(name.length() > 0, E_EMPTY_NAME);
    let passport = FarmerPassport {
        id: object::new(ctx),
        name,
        region,
        bio,
        trust_score: 0,
        seasons_completed: 0,
        created_at: clock.timestamp_ms(),
    };
    event::emit(PassportCreated {
        passport_id: object::id(&passport),
        owner: ctx.sender(),
    });
    passport
}

entry fun create_and_keep(
    name: String,
    region: String,
    bio: String,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    transfer::transfer(create(name, region, bio, clock, ctx), ctx.sender());
}

public(package) fun record_completed_season(passport: &mut FarmerPassport) {
    passport.seasons_completed = passport.seasons_completed + 1;
    passport.trust_score = passport.trust_score + TRUST_PER_SEASON;
}

public fun name(passport: &FarmerPassport): String { passport.name }

public fun region(passport: &FarmerPassport): String { passport.region }

public fun bio(passport: &FarmerPassport): String { passport.bio }

public fun trust_score(passport: &FarmerPassport): u64 { passport.trust_score }

public fun seasons_completed(passport: &FarmerPassport): u64 {
    passport.seasons_completed
}

public fun created_at(passport: &FarmerPassport): u64 { passport.created_at }

public fun id(passport: &FarmerPassport): ID { object::id(passport) }
