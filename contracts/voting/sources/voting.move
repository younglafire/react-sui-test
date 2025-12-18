/// Module: dashboard
/// A decentralized voting system for creating and voting on proposals
/// This module allows users to:
/// - Create proposals with titles, descriptions, and expiration times
/// - Vote yes or no on proposals
/// - Query proposal details
/// - Prevent double voting
module voting::dashboard;

use std::string::String;
use sui::clock::{Self, Clock};
use sui::event;

// ====== Errors ======
/// Error when trying to vote twice on the same proposal
const EVoterAlreadyVoted: u64 = 0;
/// Error when trying to vote on an expired proposal
const EProposalExpired: u64 = 1;

// ====== Structs ======
/// Represents a proposal that can be voted on
/// The `key` ability means this object can be owned/shared
public struct Proposal has key {
    id: UID,
    title: String,
    description: String,
    voted_yes_count: u64,  // Fixed typo from voted_yes_cound
    voted_no_count: u64,
    expiration: u64,  // Unix timestamp in milliseconds
    creator: address,
    voter_list: vector<address>,  // Track who has voted
}

// ====== Events ======
/// Event emitted when a new proposal is created
public struct ProposalCreated has copy, drop {
    proposal_id: ID,
    title: String,
    creator: address,
    expiration: u64,
}

/// Event emitted when someone votes on a proposal
public struct VoteCast has copy, drop {
    proposal_id: ID,
    voter: address,
    vote_yes: bool,
}

// ====== Public Functions ======

/// Creates a new proposal
/// @param title: The title of the proposal
/// @param description: Detailed description of what the proposal is about
/// @param expiration: Unix timestamp in milliseconds when voting ends
/// @param ctx: Transaction context
public fun create_proposal(
    title: String,
    description: String,
    expiration: u64,
    ctx: &mut TxContext,
) {
    let proposal_id = object::new(ctx);
    let proposal_id_copy = proposal_id.to_inner();
    
    let proposal = Proposal {
        id: proposal_id,
        title: title,
        description,
        voted_yes_count: 0,
        voted_no_count: 0,
        expiration,
        creator: ctx.sender(),
        voter_list: vector[]   
    };
    
    // Emit event
    event::emit(ProposalCreated {
        proposal_id: proposal_id_copy,
        title: proposal.title,
        creator: proposal.creator,
        expiration: proposal.expiration,
    });
    
    // Share the object so anyone can vote on it
    transfer::share_object(proposal);
}

/// Vote yes on a proposal
/// @param proposal: Mutable reference to the proposal
/// @param clock: Clock object to check current time
/// @param ctx: Transaction context
public fun vote_yes(
    proposal: &mut Proposal,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let voter = ctx.sender();
    
    // Check if proposal has expired
    let current_time = clock::timestamp_ms(clock);
    assert!(current_time < proposal.expiration, EProposalExpired);
    
    // Check if voter has already voted
    assert!(!proposal.voter_list.contains(&voter), EVoterAlreadyVoted);
    
    // Record the vote
    proposal.voted_yes_count = proposal.voted_yes_count + 1;
    proposal.voter_list.push_back(voter);
    
    // Emit event
    event::emit(VoteCast {
        proposal_id: object::id(proposal),
        voter,
        vote_yes: true,
    });
}

/// Vote no on a proposal
/// @param proposal: Mutable reference to the proposal
/// @param clock: Clock object to check current time
/// @param ctx: Transaction context
public fun vote_no(
    proposal: &mut Proposal,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let voter = ctx.sender();
    
    // Check if proposal has expired
    let current_time = clock::timestamp_ms(clock);
    assert!(current_time < proposal.expiration, EProposalExpired);
    
    // Check if voter has already voted
    assert!(!proposal.voter_list.contains(&voter), EVoterAlreadyVoted);
    
    // Record the vote
    proposal.voted_no_count = proposal.voted_no_count + 1;
    proposal.voter_list.push_back(voter);
    
    // Emit event
    event::emit(VoteCast {
        proposal_id: object::id(proposal),
        voter,
        vote_yes: false,
    });
}

// ====== View Functions ======
// These functions allow reading proposal data

/// Get the title of a proposal
public fun get_title(proposal: &Proposal): String {
    proposal.title
}

/// Get the description of a proposal
public fun get_description(proposal: &Proposal): String {
    proposal.description
}

/// Get the yes vote count
public fun get_yes_votes(proposal: &Proposal): u64 {
    proposal.voted_yes_count
}

/// Get the no vote count
public fun get_no_votes(proposal: &Proposal): u64 {
    proposal.voted_no_count
}

/// Get the expiration timestamp
public fun get_expiration(proposal: &Proposal): u64 {
    proposal.expiration
}

/// Get the creator address
public fun get_creator(proposal: &Proposal): address {
    proposal.creator
}

/// Check if an address has voted
public fun has_voted(proposal: &Proposal, voter: address): bool {
    proposal.voter_list.contains(&voter)
}

/// Check if proposal is expired
public fun is_expired(proposal: &Proposal, clock: &Clock): bool {
    let current_time = clock::timestamp_ms(clock);
    current_time >= proposal.expiration
}

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions
