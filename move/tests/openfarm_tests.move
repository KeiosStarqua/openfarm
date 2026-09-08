#[test_only]
module openfarm::openfarm_tests;

use openfarm::farm::{Self, Farm, FarmRegistry};
use openfarm::passport::{Self, FarmerPassport};
use openfarm::season::{Self, Season};
use openfarm::story::ProductBatch;
use std::string;
use sui::clock;
use sui::test_scenario as ts;

const FARMER: address = @0xA;
const STRANGER: address = @0xB;

fun setup(scenario: &mut ts::Scenario): clock::Clock {
    farm::init_for_testing(scenario.ctx());
    clock::create_for_testing(scenario.ctx())
}

#[test]
fun farmer_records_season_and_harvests_story() {
    let mut scenario = ts::begin(FARMER);
    let mut clock = setup(&mut scenario);
    clock.set_for_testing(1_700_000_000_000);

    scenario.next_tx(FARMER);
    {
        let passport = passport::create(
            string::utf8(b"Ba Bay"),
            string::utf8(b"An Giang"),
            string::utf8(b"Ruong lua 3 vu"),
            &clock,
            scenario.ctx(),
        );
        transfer::public_transfer(passport, FARMER);
    };

    scenario.next_tx(FARMER);
    {
        let mut registry = scenario.take_shared<FarmRegistry>();
        let farm = farm::register(
            &mut registry,
            string::utf8(b"Ruong nha Bay"),
            string::utf8(b"An Giang"),
            string::utf8(b"Lua ST25"),
            1998,
            &clock,
            scenario.ctx(),
        );
        farm::share(farm);
        ts::return_shared(registry);
    };

    scenario.next_tx(FARMER);
    {
        let farm = scenario.take_shared<Farm>();
        let mut season = season::start(
            &farm,
            string::utf8(b"Lua ST25"),
            &clock,
            scenario.ctx(),
        );
        let passport = scenario.take_from_sender<FarmerPassport>();
        season::attach_passport(&mut season, &passport, scenario.ctx());
        season::share(season);
        ts::return_to_sender(&scenario, passport);
        ts::return_shared(farm);
    };

    scenario.next_tx(FARMER);
    {
        let mut season = scenario.take_shared<Season>();
        season::log_event(
            &mut season,
            season::kind_seed(),
            string::utf8(b"Cay giong ST25"),
            string::utf8(b""),
            &clock,
            scenario.ctx(),
        );
        clock.increment_for_testing(86_400_000);
        season::log_event(
            &mut season,
            season::kind_irrigate(),
            string::utf8(b"Giu muc nuoc 5cm"),
            string::utf8(b"walrus-blob-water"),
            &clock,
            scenario.ctx(),
        );
        ts::return_shared(season);
    };

    scenario.next_tx(FARMER);
    {
        let mut season = scenario.take_shared<Season>();
        let mut registry = scenario.take_shared<FarmRegistry>();
        let mut passport = scenario.take_from_sender<FarmerPassport>();
        let batch = season::harvest(
            &mut season,
            &mut registry,
            &mut passport,
            string::utf8(b"Gao ST25"),
            1200,
            string::utf8(b"kg"),
            &clock,
            scenario.ctx(),
        );
        assert!(passport::seasons_completed(&passport) == 1);
        assert!(passport::trust_score(&passport) == 10);
        assert!(farm::stories(&registry).length() == 1);
        transfer::public_transfer(batch, FARMER);
        ts::return_to_sender(&scenario, passport);
        ts::return_shared(season);
        ts::return_shared(registry);
    };

    scenario.next_tx(FARMER);
    {
        let batch = scenario.take_from_sender<ProductBatch>();
        assert!(openfarm::story::quantity(&batch) == 1200);
        ts::return_to_sender(&scenario, batch);
    };

    clock.destroy_for_testing();
    scenario.end();
}

#[test, expected_failure(abort_code = 4, location = openfarm::season)]
fun cannot_harvest_without_seed() {
    let mut scenario = ts::begin(FARMER);
    let clock = setup(&mut scenario);

    scenario.next_tx(FARMER);
    {
        let passport = passport::create(
            string::utf8(b"Ba Bay"),
            string::utf8(b"An Giang"),
            string::utf8(b"Ruong"),
            &clock,
            scenario.ctx(),
        );
        transfer::public_transfer(passport, FARMER);
    };

    scenario.next_tx(FARMER);
    {
        let mut registry = scenario.take_shared<FarmRegistry>();
        let farm = farm::register(
            &mut registry,
            string::utf8(b"Ruong"),
            string::utf8(b"An Giang"),
            string::utf8(b"Lua"),
            2000,
            &clock,
            scenario.ctx(),
        );
        farm::share(farm);
        ts::return_shared(registry);
    };

    scenario.next_tx(FARMER);
    {
        let farm = scenario.take_shared<Farm>();
        let season = season::start(&farm, string::utf8(b"Lua"), &clock, scenario.ctx());
        season::share(season);
        ts::return_shared(farm);
    };

    scenario.next_tx(FARMER);
    {
        let mut season = scenario.take_shared<Season>();
        let mut registry = scenario.take_shared<FarmRegistry>();
        let mut passport = scenario.take_from_sender<FarmerPassport>();
        let batch = season::harvest(
            &mut season,
            &mut registry,
            &mut passport,
            string::utf8(b"Gao"),
            1,
            string::utf8(b"kg"),
            &clock,
            scenario.ctx(),
        );
        transfer::public_transfer(batch, FARMER);
        ts::return_to_sender(&scenario, passport);
        ts::return_shared(season);
        ts::return_shared(registry);
    };

    clock.destroy_for_testing();
    scenario.end();
}

#[test, expected_failure(abort_code = 0, location = openfarm::season)]
fun stranger_cannot_log_event() {
    let mut scenario = ts::begin(FARMER);
    let clock = setup(&mut scenario);

    scenario.next_tx(FARMER);
    {
        let mut registry = scenario.take_shared<FarmRegistry>();
        let farm = farm::register(
            &mut registry,
            string::utf8(b"Ruong"),
            string::utf8(b"An Giang"),
            string::utf8(b"Lua"),
            2000,
            &clock,
            scenario.ctx(),
        );
        farm::share(farm);
        ts::return_shared(registry);
    };

    scenario.next_tx(FARMER);
    {
        let farm = scenario.take_shared<Farm>();
        let season = season::start(&farm, string::utf8(b"Lua"), &clock, scenario.ctx());
        season::share(season);
        ts::return_shared(farm);
    };

    scenario.next_tx(STRANGER);
    {
        let mut season = scenario.take_shared<Season>();
        season::log_event(
            &mut season,
            season::kind_seed(),
            string::utf8(b"No"),
            string::utf8(b""),
            &clock,
            scenario.ctx(),
        );
        ts::return_shared(season);
    };

    clock.destroy_for_testing();
    scenario.end();
}
