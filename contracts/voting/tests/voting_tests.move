#[test_only]
module voting::voting_tests;

use voting::dashboard::{Self, Proposal};
use std::string;
use sui::test_scenario::{Self as ts, Scenario};
use sui::clock::{Self, Clock};

// Test addresses
const CREATOR: address = @0xA;
const VOTER1: address = @0xB;
const VOTER2: address = @0xC;

// Helper function to create a test clock
fun create_test_clock(scenario: &mut Scenario): Clock {
    clock::create_for_testing(scenario.ctx())
}

#[test]
/// Test creating a proposal
fun test_create_proposal() {
    let mut scenario = ts::begin(CREATOR);
    
    // Create a proposal
    {
        let title = string::utf8(b"Test Proposal");
        let description = string::utf8(b"This is a test proposal");
        let expiration = 1000000u64; // Far in the future
        
        dashboard::create_proposal(
            title,
            description,
            expiration,
            scenario.ctx(),
        );
    };
    
    // Verify the proposal was created and shared
    scenario.next_tx(CREATOR);
    {
        let proposal = scenario.take_shared<Proposal>();
        
        assert!(dashboard::get_title(&proposal) == string::utf8(b"Test Proposal"), 0);
        assert!(dashboard::get_description(&proposal) == string::utf8(b"This is a test proposal"), 1);
        assert!(dashboard::get_yes_votes(&proposal) == 0, 2);
        assert!(dashboard::get_no_votes(&proposal) == 0, 3);
        assert!(dashboard::get_creator(&proposal) == CREATOR, 4);
        assert!(dashboard::get_expiration(&proposal) == 1000000u64, 5);
        
        ts::return_shared(proposal);
    };
    
    scenario.end();
}

#[test]
/// Test voting yes on a proposal
fun test_vote_yes() {
    let mut scenario = ts::begin(CREATOR);
    
    // Create a proposal
    {
        let title = string::utf8(b"Test Proposal");
        let description = string::utf8(b"This is a test proposal");
        let expiration = 1000000000u64; // Far in the future
        
        dashboard::create_proposal(
            title,
            description,
            expiration,
            scenario.ctx(),
        );
    };
    
    // Vote yes as VOTER1
    scenario.next_tx(VOTER1);
    {
        let mut proposal = scenario.take_shared<Proposal>();
        let clock = create_test_clock(&mut scenario);
        
        dashboard::vote_yes(&mut proposal, &clock, scenario.ctx());
        
        assert!(dashboard::get_yes_votes(&proposal) == 1, 0);
        assert!(dashboard::get_no_votes(&proposal) == 0, 1);
        assert!(dashboard::has_voted(&proposal, VOTER1), 2);
        
        clock.destroy_for_testing();
        ts::return_shared(proposal);
    };
    
    scenario.end();
}

#[test]
/// Test voting no on a proposal
fun test_vote_no() {
    let mut scenario = ts::begin(CREATOR);
    
    // Create a proposal
    {
        let title = string::utf8(b"Test Proposal");
        let description = string::utf8(b"This is a test proposal");
        let expiration = 1000000000u64;
        
        dashboard::create_proposal(
            title,
            description,
            expiration,
            scenario.ctx(),
        );
    };
    
    // Vote no as VOTER1
    scenario.next_tx(VOTER1);
    {
        let mut proposal = scenario.take_shared<Proposal>();
        let clock = create_test_clock(&mut scenario);
        
        dashboard::vote_no(&mut proposal, &clock, scenario.ctx());
        
        assert!(dashboard::get_yes_votes(&proposal) == 0, 0);
        assert!(dashboard::get_no_votes(&proposal) == 1, 1);
        assert!(dashboard::has_voted(&proposal, VOTER1), 2);
        
        clock.destroy_for_testing();
        ts::return_shared(proposal);
    };
    
    scenario.end();
}

#[test]
/// Test multiple voters
fun test_multiple_voters() {
    let mut scenario = ts::begin(CREATOR);
    
    // Create a proposal
    {
        let title = string::utf8(b"Test Proposal");
        let description = string::utf8(b"This is a test proposal");
        let expiration = 1000000000u64;
        
        dashboard::create_proposal(
            title,
            description,
            expiration,
            scenario.ctx(),
        );
    };
    
    // VOTER1 votes yes
    scenario.next_tx(VOTER1);
    {
        let mut proposal = scenario.take_shared<Proposal>();
        let clock = create_test_clock(&mut scenario);
        
        dashboard::vote_yes(&mut proposal, &clock, scenario.ctx());
        
        clock.destroy_for_testing();
        ts::return_shared(proposal);
    };
    
    // VOTER2 votes no
    scenario.next_tx(VOTER2);
    {
        let mut proposal = scenario.take_shared<Proposal>();
        let clock = create_test_clock(&mut scenario);
        
        dashboard::vote_no(&mut proposal, &clock, scenario.ctx());
        
        assert!(dashboard::get_yes_votes(&proposal) == 1, 0);
        assert!(dashboard::get_no_votes(&proposal) == 1, 1);
        assert!(dashboard::has_voted(&proposal, VOTER1), 2);
        assert!(dashboard::has_voted(&proposal, VOTER2), 3);
        
        clock.destroy_for_testing();
        ts::return_shared(proposal);
    };
    
    scenario.end();
}

#[test]
#[expected_failure(abort_code = dashboard::EVoterAlreadyVoted)]
/// Test that a voter cannot vote twice
fun test_double_voting_fails() {
    let mut scenario = ts::begin(CREATOR);
    
    // Create a proposal
    {
        let title = string::utf8(b"Test Proposal");
        let description = string::utf8(b"This is a test proposal");
        let expiration = 1000000000u64;
        
        dashboard::create_proposal(
            title,
            description,
            expiration,
            scenario.ctx(),
        );
    };
    
    // VOTER1 votes yes
    scenario.next_tx(VOTER1);
    {
        let mut proposal = scenario.take_shared<Proposal>();
        let clock = create_test_clock(&mut scenario);
        
        dashboard::vote_yes(&mut proposal, &clock, scenario.ctx());
        
        clock.destroy_for_testing();
        ts::return_shared(proposal);
    };
    
    // VOTER1 tries to vote again - should fail
    scenario.next_tx(VOTER1);
    {
        let mut proposal = scenario.take_shared<Proposal>();
        let clock = create_test_clock(&mut scenario);
        
        dashboard::vote_no(&mut proposal, &clock, scenario.ctx()); // This should abort
        
        clock.destroy_for_testing();
        ts::return_shared(proposal);
    };
    
    scenario.end();
}

#[test]
#[expected_failure(abort_code = dashboard::EProposalExpired)]
/// Test that voting on expired proposal fails
fun test_expired_proposal_fails() {
    let mut scenario = ts::begin(CREATOR);
    
    // Create a proposal with expiration in the past
    {
        let title = string::utf8(b"Test Proposal");
        let description = string::utf8(b"This is a test proposal");
        let expiration = 100u64; // Very early timestamp
        
        dashboard::create_proposal(
            title,
            description,
            expiration,
            scenario.ctx(),
        );
    };
    
    // VOTER1 tries to vote on expired proposal
    scenario.next_tx(VOTER1);
    {
        let mut proposal = scenario.take_shared<Proposal>();
        let mut clock = create_test_clock(&mut scenario);
        
        // Set clock to a time after expiration
        clock.increment_for_testing(1000);
        
        dashboard::vote_yes(&mut proposal, &clock, scenario.ctx()); // This should abort
        
        clock.destroy_for_testing();
        ts::return_shared(proposal);
    };
    
    scenario.end();
}

#[test]
/// Test is_expired function
fun test_is_expired() {
    let mut scenario = ts::begin(CREATOR);
    
    // Create a proposal
    {
        let title = string::utf8(b"Test Proposal");
        let description = string::utf8(b"This is a test proposal");
        let expiration = 1000u64;
        
        dashboard::create_proposal(
            title,
            description,
            expiration,
            scenario.ctx(),
        );
    };
    
    scenario.next_tx(CREATOR);
    {
        let proposal = scenario.take_shared<Proposal>();
        let mut clock = create_test_clock(&mut scenario);
        
        // Should not be expired initially
        assert!(!dashboard::is_expired(&proposal, &clock), 0);
        
        // Advance clock past expiration
        clock.increment_for_testing(2000);
        assert!(dashboard::is_expired(&proposal, &clock), 1);
        
        clock.destroy_for_testing();
        ts::return_shared(proposal);
    };
    
    scenario.end();
}
