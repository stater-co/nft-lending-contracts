#![no_std]

imports!();

mod time_scale;
mod loan;
use time_scale::TimeScale;
use loan::Loan;

/*
 * STATER.CO - Lending smart contract Rust implementation
 * @DIIMIIM, created on 17 May 2021
 * rustc --explain E0204:
 * The `Copy` trait is implemented by default only on primitive types. If your
 * type only contains primitive types, you'll be able to implement `Copy` on it.
 * Otherwise, it won't be possible.
 */
#[elrond_wasm_derive::contract(AdderImpl)]
pub trait LendingData {
	

	/*
	 * owner
	 * @DIIMIIM: This will be set on smart contract constructor
	 */
	#[view(owner)]
	#[storage_get("owner")]
	fn get_owner(&self) -> Address;

	#[storage_set("owner")]
	fn set_owner(&self, owner: &Address);



	/*
	 * push loan
	 * @DIIMIIM: This will be set on smart contract constructor
	 */
	#[storage_set("loans")]
	fn push_loan_internal(&self, loan_id: &BigUint, loan: &Loan<BigUint>);

	#[view(loans)]
	#[storage_get("loans")]
	fn get_loans(&self, loan_id: &BigUint) -> Loan<BigUint>;


	/*
	 * discount_nft
	 * @DIIMIIM: This will be set with 50 on smart contract constructor
	 */
	#[view(discountNft)]
	#[storage_get("discount_nft")]
	fn get_discount_nft(&self) -> u8;

	#[storage_set("discount_nft")]
	fn set_discount_nft_internal(&self, discount_nft: &u8);

	/*
	 * discount nft setter
	 * @DIIMIIM: This will set the discount nft value
	 */
	#[endpoint]
	fn set_discount_nft(&self, value: &u8) -> SCResult<()> {
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
	fn set_installment_time_scale_internal(&self, installment_time_scale: &TimeScale);

	/*
	 * installment time scale setter
	 * @DIIMIIM: This will set the installment time scale value
	 */
	#[endpoint]
	fn set_installment_time_scale(&self, value: &TimeScale) -> SCResult<()> {
		self.set_installment_time_scale_internal(&value);
		Ok(())
	}



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
	 * lender_fee
	 * will be set on smart contract constructor
	 */
	#[view(lenderFee)]
	#[storage_get("lender_fee")]
	fn get_lender_fee(&self) -> u8;

	#[storage_set("lender_fee")]
	fn set_lender_fee_internal(&self, lender_fee: &u8);

	/*
	 * discount nft setter
	 * @DIIMIIM: This will set the discount nft value
	 */
	#[endpoint]
	fn set_lender_fee(&self, value: &u8) -> SCResult<()> {
		self.set_lender_fee_internal(&value);
		Ok(())
	}

	

	/*
	 * ltv
	 * will be set on smart contract constructor with 600
	 */
	#[view(ltv)]
	#[storage_get("ltv")]
	fn get_ltv(&self) -> u16;

	#[storage_set("ltv")]
	fn set_ltv_internal(&self, ltv: &u16);

	/*
	 * discount ltv setter
	 * @DIIMIIM: This will set the ltv value
	 */
	#[endpoint]
	fn set_ltv(&self, value: &u16) -> SCResult<()> {
		self.set_ltv_internal(&value);
		Ok(())
	} 



	/*
	 * installmentFrequency
	 * will be set on smart contract constructor with 1
	 */
	#[view(installmentFrequency)]
	#[storage_get("installment_frequency")]
	fn get_installment_frequency(&self) -> u16;

	#[storage_set("installment_frequency")]
	fn set_installment_frequency_internal(&self, installment_frequency: &u16);

	/*
	 * installment frequency setter
	 * @DIIMIIM: This will set the ltv value
	 */
	#[endpoint]
	fn set_installment_frequency(&self, value: &u16) -> SCResult<()> {
		self.set_installment_frequency_internal(&value);
		Ok(())
	} 



	/*
	 * interestRate
	 * will be set on smart contract constructor
	 */
	#[view(interestRate)]
	#[storage_get("interest_rate")]
	fn get_interest_rate(&self) -> u8;

	#[storage_set("interest_rate")]
	fn set_interest_rate_internal(&self, interest_rate: &u8);

	/*
	 * interest rate setter
	 * @DIIMIIM: This will set the interest rate value
	 */
	#[endpoint]
	fn set_interest_rate(&self, value: &u8) -> SCResult<()> {
		self.set_interest_rate_internal(&value);
		Ok(())
	}  



	/*
	 * interestRateToStater
	 * will be set on smart contract constructor
	 */
	#[view(interestRateToStater)]
	#[storage_get("interest_rate_to_stater")]
	fn get_interest_rate_to_stater(&self) -> u8;

	#[storage_set("interest_rate_to_stater")]
	fn set_interest_rate_to_stater_internal(&self, interest_rate_to_stater: &u8);

	/*
	 * interest rate setter
	 * @DIIMIIM: This will set the interest rate value
	 */
	#[endpoint]
	fn set_interest_rate_to_stater(&self, value: &u8) -> SCResult<()> {
		self.set_interest_rate_to_stater_internal(&value);
		Ok(())
	}  



	/*
	 * constructor
	 * will be set on smart contract constructor
	 */
	#[init]
	fn init(&self
		/*, erc20_contract_address: Address*/
	) {
		/*
		 * @DIIMIIM: Set the smart contract global parameters
		 * subject of improvement
		 */
		let discount_nft_constructor: u8 = 50;
		let lender_fee_internal: u8 = 100;
		let ltv_constructor: u16 = 600;
		let installment_frequency_constructor: u16 = 1;
		let installment_time_scale_constructor: TimeScale = TimeScale::Weeks;
		let interest_rate_constructor: u8 = 20;
		let interest_rate_to_stater_constructor: u8 = 40;
		self.set_discount_nft_internal(&discount_nft_constructor);
		self.set_lender_fee_internal(&lender_fee_internal);
		self.set_ltv_internal(&ltv_constructor);
		self.set_installment_frequency_internal(&installment_frequency_constructor);
		self.set_installment_time_scale_internal(&installment_time_scale_constructor);
		self.set_interest_rate_internal(&interest_rate_constructor);
		self.set_interest_rate_to_stater_internal(&interest_rate_to_stater_constructor);
		//self.set_erc20_contract_address(&erc20_contract_address);

		let owner = self.get_caller();

		self.set_owner(&owner);
	}

}
