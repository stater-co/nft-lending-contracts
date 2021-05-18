#![no_std]

imports!();

/// One of the simplest smart contracts possible,
/// it holds a single variable in storage, which anyone can increment.
#[elrond_wasm_derive::contract(AdderImpl)]
pub trait LendingData {

	#[view(discountNft)]
	#[storage_get("discount_nft")]
	fn get_discount_nft(&self) -> u64;

	#[storage_set("discount_nft")]
	fn set_discount_nft(&self, discount_nft: &u64);

	#[view(nftAdress)]
	#[storage_get("nft_address")]
	fn get_nft_address(&self) -> Address;

	#[storage_set("nft_address")]
	fn set_nft_address(&self, nft_address: &Address);

	#[view(promissoryNoteContractAddress)]
	#[storage_get("promissory_note_contract_address")]
	fn get_promissory_note_contract_address(&self) -> Address;

	#[storage_set("promissory_note_contract_address")]
	fn set_promissory_note_contract_address(&self, promissory_note_contract_address: &Address);

	#[view(staterNftTokenIdArray)]
	#[storage_get("stater_nft_token_id_array")]
	fn get_stater_nft_token_id_array(&self) -> Vec<u64>;

	#[storage_set("stater_nft_token_id_array")]
	fn set_stater_nft_token_id_array(&self, stater_nft_token_id_array: &Vec<u64>);

}
