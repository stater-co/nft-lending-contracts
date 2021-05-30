#![no_std]

/*
 * @DIIMIIM: erd1deaddeaddeaddeaddeaddeaddeaddeaddeaddeaddeaddeaddeaqtv0gag [elrond] == address(0) [ethereum]
 */
elrond_wasm::imports!();

/*
mod loan_status;
use loan_status::LoanStatus;
*/


mod time_scale;
use time_scale::TimeScale;

mod loan;
use loan::Loan;


pub const BASE_PRECISION: u32 = 1_000_000_000;


mod non_fungible_token_proxy {
	elrond_wasm::imports!();

	#[elrond_wasm_derive::proxy]
	pub trait NonFungibleTokens {

		#[endpoint]
		fn transfer(&self, token_id: u64, to: Address);

		#[view(tokenOwner)]
		#[storage_get("tokenOwner")]
		fn get_token_owner(&self, token_id: u64);

	}
}


#[elrond_wasm_derive::contract]
pub trait StaterLending {


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
	 * loan_id
	 * will be set with 0 on smart contract constructor
	 */
	#[view(loanId)]
	#[storage_get("loan_id")]
	fn get_loan_id(&self) -> Self::BigUint;

	#[storage_get("loan_id")]
	fn get_loan_id_internal(&self) -> Self::BigUint;

	#[storage_set("loan_id")]
	fn set_loan_id_internal(&self, loan_id: &Self::BigUint);

	/*
	 * loan_id setter
	 * @DIIMIIM: This will set the loan id value
	 */
	#[endpoint]
	fn set_loan_id(&self, value: &Self::BigUint) -> SCResult<()> {
		self.set_loan_id_internal(&value);
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


	#[endpoint]
	fn percent(&self, numerator: u64, denominator: u64) -> u64 {
		return numerator * 10000 / denominator + 5 / 10;
	}


	/*
	 * constructor
	 * will be set on smart contract constructor
	 */
	#[init]
	fn init(&self) {
		/*
		 * @DIIMIIM: Set the smart contract global parameters
		 * subject of improvement
		 */
		let lender_fee_internal: u8 = 100;
		let ltv_constructor: u16 = 600;
		let installment_frequency_constructor: u16 = 1;
		let installment_time_scale_constructor: TimeScale = TimeScale::Weeks;
		let interest_rate_constructor: u8 = 20;
		let interest_rate_to_stater_constructor: u8 = 40;
		self.set_lender_fee_internal(&lender_fee_internal);
		self.set_ltv_internal(&ltv_constructor);
		self.set_installment_frequency_internal(&installment_frequency_constructor);
		self.set_installment_time_scale_internal(&installment_time_scale_constructor);
		self.set_interest_rate_internal(&interest_rate_constructor);
		self.set_interest_rate_to_stater_internal(&interest_rate_to_stater_constructor);

		/*
		* @DIIMIIM:
		* Here we set the smart contract owner
		*/
		let owner = self.blockchain().get_caller();
		self.set_owner(&owner);
		self.set_loan_id_internal(&Self::BigUint::from(0u32));
	}


	/*
	 * create loan
	 * @DIIMIIM: Call this to create a loan
	 */
	#[endpoint(createLoan)]
	fn create_loan(&self
		, loan_amount: u64 
		, nr_of_installments: u16 
		, currency: Address 
		, assets_value: u64 
		, nft_address_array: Vec<Address> 
		, nft_token_id_array: Vec<Self::BigUint> 
		, nft_token_type_array: Vec<u8>
	) -> elrond_wasm::types::SCResult<()> {

		require!(
			nr_of_installments > 0,
			"Loan must have at least 1 installment"
		);

		require!(
			loan_amount > 0, 
			"Loan amount must be higher than 0"
		);

		require!(
			nft_address_array.len() > 0, 
			"Loan must have atleast 1 NFT"
		);

		require!(
			nft_address_array.len() == nft_token_id_array.len() && nft_token_id_array.len() == nft_token_type_array.len(), 
			"NFT provided informations are missing or incomplete"
		);

		require!(
			self.percent(loan_amount,assets_value) <= u64::from(self.get_ltv()),
			"LTV exceeds maximum limit allowed"
		);

		let the_amount_due: u64 = ( loan_amount * ( u64::from(self.get_interest_rate()) + 100 ) ) / 100;
		let the_installment_amount: u64;
		if the_amount_due % u64::from(nr_of_installments) > 0 {
			the_installment_amount = the_amount_due / u64::from(nr_of_installments) + 1;
		} else {
			the_installment_amount = the_amount_due / u64::from(nr_of_installments);
		}
		let mut the_defaulting_limit: u8 = 1;

		// Computing the defaulting limit
		if nr_of_installments <= 3 {
			the_defaulting_limit = 1;
		} else if nr_of_installments <= 5 {
			the_defaulting_limit = 2;
		} else if nr_of_installments >= 6 {
			the_defaulting_limit = 3;
		}

		let new_loan = Loan {
			nft_token_id_array: nft_token_id_array,
			loan_amount: Self::BigUint::from(loan_amount),
			assets_value: Self::BigUint::from(assets_value),
			loan_start: 0u64,
			loan_end: 0u64,
			currency: currency,
			nr_of_installments: nr_of_installments,
			installment_amount: Self::BigUint::from(the_installment_amount),
			amount_due: Self::BigUint::from(the_amount_due),
			paid_amount: Self::BigUint::from(0u32),
			defaulting_limit: the_defaulting_limit,
			nr_of_payments: 0u16,
			nft_token_type_array: nft_token_type_array
		};

		let new_loan_id: Self::BigUint = self.get_loan_id_internal() + Self::BigUint::from(1u32);
		self.set_loan_id_internal(&new_loan_id);
		self.loan(new_loan_id).set(&new_loan);

		Ok(())
	}




	/*
	#[view(nftAddressArray)]
	#[storage_get("nft_address_array")]
	fn get_nft_address_array(&self) -> Vec<Address>;
 
	#[storage_set("nft_address_array")]
	fn set_nft_address_array_internal(&self, nft_address_array: &Vec<Address>);

	#[endpoint(setNftAddressArray)]
	fn set_nft_address_array(&self,
		nft_address_array: Vec<Address> 
	) -> SCResult<()> {
		self.set_nft_address_array_internal(&nft_address_array);
		Ok(())
	}


	#[view(nftTokenIdArray)]
	#[storage_get("nft_token_id_array")]
	fn get_nft_token_id_array(&self) -> Vec<Self::BigUint>;
 
	#[storage_set("nft_token_id_array")]
	fn set_nft_token_id_array_internal(&self, nft_token_id_array: &Vec<Self::BigUint>);

	#[endpoint(setNftTokenIdArray)]
	fn set_nft_token_id_array(&self,
		nft_token_id_array: Vec<Self::BigUint> 
	) -> SCResult<()> {
		self.set_nft_token_id_array_internal(&nft_token_id_array);
		Ok(())
	}
	*/




	#[view]
	#[storage_mapper("vec_mapper")]
	fn vec_mapper(&self) -> VecMapper<Self::Storage, u32>;

	#[endpoint]
	fn vec_mapper_push(&self, item: u32) {
		let mut vec_mapper = self.vec_mapper();
		let _ = vec_mapper.push(&item);
	}

	#[view]
	fn vec_mapper_get(&self, index: usize) -> u32 {
		self.vec_mapper().get(index)
	}

	#[view]
	fn vec_mapper_len(&self) -> usize {
		self.vec_mapper().len()
	}




	#[view]
	#[storage_mapper("biguint_mapper")]
	fn biguint_mapper(&self) -> VecMapper<Self::Storage, Self::BigUint>;

	#[endpoint]
	fn biguint_mapper_push(&self, item: Self::BigUint) {
		let mut biguint_mapper = self.biguint_mapper();
		let _ = biguint_mapper.push(&item);
	}

	#[view]
	fn biguint_mapper_get(&self, index: usize) -> Self::BigUint {
		self.biguint_mapper().get(index)
	}

	#[view]
	fn biguint_mapper_len(&self) -> usize {
		self.biguint_mapper().len()
	}




	#[storage_mapper("loans")]
    fn loan(
        &self,
        loan_id: Self::BigUint,
    ) -> SingleValueMapper<Self::Storage, Loan<Self::BigUint>>;

}