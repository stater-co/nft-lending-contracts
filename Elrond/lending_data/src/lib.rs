#![no_std]

imports!();

mod time_scale;
use time_scale::TimeScale;

/*
 * STATER.CO - Lending smart contract Rust implementation
 * @DIIMIIM, created on 17 May 2021
 */

#[elrond_wasm_derive::contract(AdderImpl)]
pub trait LendingData {


	/*
	 * discount_nft
	 * @DIIMIIM: This will be set with 50 on smart contract constructor
	 */
	#[view(getDiscountNft)]
	#[storage_get("discount_nft")]
	fn get_discount_nft(&self) -> BigInt;

	#[internal(set_discount_nft_internal)]
	#[storage_set("discount_nft")]
	fn set_discount_nft_internal(&self, discount_nft: &BigInt);

	/*
	 * discount nft setter
	 * @DIIMIIM: This will set the discount nft value
	 */
	#[public(setDiscountNft)]
	#[endpoint]
	fn set_discount_nft(&self, value: &BigInt) -> SCResult<()> {
		self.set_discount_nft_internal(&value);
		Ok(())
	}


	/*
	 * installmentTimeScale
	 * will be set with 50 on smart contract constructor
	 */
	#[view(installmentTimeScale)]
	#[storage_get("installment_time_scale")]
	fn get_installment_time_scale(&self) -> TimeScale;

	#[storage_set("installment_time_scale")]
	fn set_installment_time_scale(&self, installment_time_scale: &TimeScale);


	/*
	 * loanID
	 * The loan ID
	 */
	#[view(loanID)]
	#[storage_get("loan_id")]
	fn get_loan_id(&self) -> BigInt;

	#[storage_set("loan_id")]
	fn set_loan_id(&self, loan_id: &BigInt);



	/*
	 * nftAddress
	 * will be set on smart contract constructor
	 */
	#[view(nftAdress)]
	#[storage_get("nft_address")]
	fn get_nft_address(&self) -> Address;

	#[storage_set("nft_address")]
	fn set_nft_address(&self, nft_address: &Address);



	/*
	 * promissoryNoteContractAddress
	 * will be set on smart contract constructor
	 */
	#[view(promissoryNoteContractAddress)]
	#[storage_get("promissory_note_contract_address")]
	fn get_promissory_note_contract_address(&self) -> Address;

	#[storage_set("promissory_note_contract_address")]
	fn set_promissory_note_contract_address(&self, promissory_note_contract_address: &Address);



	/*
	 * staterNftTokenIdArray
	 * will be set on smart contract constructor
	 */
	#[view(staterNftTokenIdArray)]
	#[storage_get("stater_nft_token_id_array")]
	fn get_stater_nft_token_id_array(&self) -> Vec<BigInt>;

	#[storage_set("stater_nft_token_id_array")]
	fn set_stater_nft_token_id_array(&self, stater_nft_token_id_array: &Vec<BigInt>);



	/*
	 * lenderFee
	 * will be set on smart contract constructor
	 */
	#[view(lenderFee)]
	#[storage_get("lender_fee")]
	fn get_lender_fee(&self) -> u8;

	#[storage_set("lender_fee")]
	fn set_lender_fee(&self, lender_fee: &u8);



	/*
	 * ltv
	 * will be set on smart contract constructor with 600
	 */
	#[view(ltv)]
	#[storage_get("ltv")]
	fn get_ltv(&self) -> u16;

	#[storage_set("ltv")]
	fn set_ltv(&self, ltv: &u16);



	/*
	 * installmentFrequency
	 * will be set on smart contract constructor with 1
	 */
	#[view(installmentFrequency)]
	#[storage_get("installment_frequency")]
	fn get_installment_frequency(&self) -> u16;

	#[storage_set("installment_frequency")]
	fn set_installment_frequency(&self, installment_frequency: &u16);



	/*
	 * interestRate
	 * will be set on smart contract constructor
	 */
	#[view(interestRate)]
	#[storage_get("interest_rate")]
	fn get_interest_rate(&self) -> u8;

	#[storage_set("interest_rate")]
	fn set_interest_rate(&self, interest_rate: &u8);



	/*
	 * interestRateToStater
	 * will be set on smart contract constructor
	 */
	#[view(interestRateToStater)]
	#[storage_get("interest_rate_to_stater")]
	fn get_interest_rate_to_stater(&self) -> u8;

	#[storage_set("interest_rate_to_stater")]
	fn set_interest_rate_to_stater(&self, interest_rate_to_stater: &u8);



	/*
	 * constructor
	 * will be set on smart contract constructor
	 */

	/*
	#[init]
	fn init(&self, erc20_contract_address: Address) {
		//self.set_erc20_contract_address(&erc20_contract_address);
	}
	*/


	#[view(getSum)]
	#[storage_get("sum")]
	fn get_sum(&self) -> BigInt;

	#[storage_set("sum")]
	fn set_sum(&self, sum: &BigInt);

	#[init]
	fn init(&self, initial_value: &BigInt) {
		self.set_sum(initial_value);
	}

	/// Add desired amount to the storage variable.
	#[endpoint]
	fn add(&self, value: &BigInt) -> SCResult<()> {
		let mut sum = self.get_sum();
		sum += value;
		self.set_sum(&sum);

		Ok(())
	}

}
