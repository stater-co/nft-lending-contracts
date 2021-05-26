#![no_std]


elrond_wasm::imports!();
elrond_wasm::derive_imports!();


/*
 * @DIIMIIM: erd1deaddeaddeaddeaddeaddeaddeaddeaddeaddeaddeaddeaddeaqtv0gag [elrond] == address(0) [ethereum]
 */


#[derive(TopEncode, TopDecode, NestedEncode, NestedDecode, TypeAbi, PartialEq, Clone, Copy)]
pub enum TimeScale {
    Minutes, 
    Hours, 
    Days, 
    Weeks
}


#[derive(TopEncode, TopDecode, NestedEncode, NestedDecode, TypeAbi, PartialEq, Clone, Copy)]
pub enum LoanStatus {
	Uninitialized,
	Listed,
	Approved,
	Defaulted,
	Liquidated,
	Cancelled,
	Withdrawn
}


#[derive(TopEncode, TopDecode, NestedEncode, NestedDecode, TypeAbi)]
pub struct Loan<BigUint: BigUintApi> {
    pub nft_address_array: Vec<Address>,
    pub borrower: Address,
    pub lender: Address,
    pub currency: Address,
	pub status: LoanStatus,
    pub nft_token_id_array: Vec<u64>,
    pub loan_amount: BigUint,
    pub assets_value: BigUint,
    pub loan_start: u64,
    pub loan_end: u64,
    pub nr_of_installments: u16,
    pub installment_amount: u64,
    pub amount_due: BigUint,
    pub paid_amount: BigUint,
    pub defaulting_limit: u8,
    pub nr_of_payments: u16,
    pub nft_token_type_array: Vec<u8>
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
		let owner = self.get_caller();
		self.set_owner(&owner);
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
		, nft_token_id_array: Vec<u64>
		, nft_token_type_array: Vec<u8>
	) -> SCResult<()> {

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

		/*
		self.loan_handler().set(&Loan {
			nft_address_array,
			borrower: self.get_caller(),
			lender: self.get_caller(),
			currency,
			status: 0u8,
			nft_token_id_array,
			loan_amount,
			assets_value,
			loan_start: 0u64,
			loan_end: 0u64,
			nr_of_installments,
			installment_amount: the_installment_amount,
			amount_due: the_amount_due,
			paid_amount: 0u64,
			defaulting_limit: the_defaulting_limit,
			nr_of_payments: 0u16,
			nft_token_type_array
		});
		*/

		Ok(())
	}

}