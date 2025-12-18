
module voting::dashboard;

use std::string::String;
// Key is ablility

public struct Proposal has key {
    id: UID,
    title: String,
    description: String,
    voted_yes_cound: u64,
    voted_no_count: u64,
    expiration: u64,
    creator: address,
    voter_list: vector<address>,
}

public fun create_proposal(
    title: String,
    description: String,
    expiration: u64,
    ctx: &mut TxContext,
) {
    let proposal = Proposal {
        id: object::new(ctx),
        title,
        description,
        voted_yes_cound: 0,
        voted_no_count: 0,
        expiration,
        creator: ctx.sender(),
        voter_list: vector[]   
    };
    transfer::share_object(proposal);
}


// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions

