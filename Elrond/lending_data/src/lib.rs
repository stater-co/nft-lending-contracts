#![no_std]

imports!();

/// One of the simplest smart contracts possible,
/// it holds a single variable in storage, which anyone can increment.
#[elrond_wasm_derive::contract(AdderImpl)]
pub trait LendingData {

	#[view(nftAddress)]
	#[storage_get("nft_address")]
	fn get_nft_address(&self) -> u64;

	#[storage_set("nft_address")]
	fn set_nft_address(&self, nft_address: &u64);

}
