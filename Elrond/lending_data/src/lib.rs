#![no_std]
#![allow(clippy::string_lit_as_bytes)]


/*
 * @DIIMIIM: erd1deaddeaddeaddeaddeaddeaddeaddeaddeaddeaddeaddeaddeaqtv0gag [elrond] == address(0) [ethereum]
 */
elrond_wasm::imports!();

mod loan_status;
use loan_status::LoanStatus;

mod time_scale;
use time_scale::TimeScale;

mod token_type;
use token_type::TokenType;

mod loan;
use loan::Loan;



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
	fn get_loan_id(&self) -> u64;

	#[storage_get("loan_id")]
	fn get_loan_id_internal(&self) -> u64;

	#[storage_set("loan_id")]
	fn set_loan_id_internal(&self, loan_id: &u64);

	/*
	 * loan_id setter
	 * @DIIMIIM: This will set the loan id value
	 */
	#[endpoint]
	fn set_loan_id(&self, value: &u64) -> SCResult<()> {
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
	}


	/*
    fn send_debt(&self, to: &Address, nonce: u64, amount: &Self::BigUint) {
        self.send()
            .direct_nft(to, &self.debt_token_id().get(), nonce, amount, &[]);
    }
	*/



	/*
	 * create loan
	 * @DIIMIIM: Call this to create a loan
	 */
	#[payable("*")]
	#[endpoint(createLoan)]
	fn create_loan(&self
		, #[payment_token] token_id: TokenIdentifier
        , #[payment] token_quantity: Self::BigUint
		, loan_amount: u64 
		, nr_of_installments: u16 
		, assets_value: u64 
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
			( ( loan_amount * 10000u64 / assets_value ) + 5u64 ) / 10u64 <= u64::from(self.get_ltv()),
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
		
		require!(
			token_id.is_valid_esdt_identifier(),
			"Invalid token name provided!"
		);
		
		let formatted_nfts: Vec<(TokenIdentifier,Self::BigUint)> = Vec::new((token_id,token_quantity));

		let new_loan = Loan {
			loan_amount: Self::BigUint::from(loan_amount),
			assets_value: Self::BigUint::from(assets_value),
			loan_start: 0u64,
			loan_end: 0u64,
			borrower: self.blockchain().get_caller(),
			lender: Address::zero(),
			nr_of_installments: nr_of_installments,
			installment_amount: Self::BigUint::from(the_installment_amount),
			amount_due: Self::BigUint::from(the_amount_due),
			paid_amount: Self::BigUint::from(0u32),
			defaulting_limit: the_defaulting_limit,
			nr_of_payments: 0u16,
			status: LoanStatus::Listed,
			nfts: formatted_nfts
		};

		
		let loan_id: u64 = self.get_loan_id_internal();
		self.loan(loan_id).set(&new_loan);
		
		let new_loan_id: u64 = loan_id + 1u64;
		self.set_loan_id_internal(&new_loan_id);

		Ok(())

	}


	/*
	 * approve loan
	 * @DIIMIIM: Call this to approve a loan
	 */
	#[payable("EGLD")]
	#[endpoint(approveLoan)]
	fn approve_loan(&self
		, loan_id: u64
		, #[payment] payment: Self::BigUint
	) -> elrond_wasm::types::SCResult<()> {
		let loan_obj: Loan<Self::BigUint> = self.loan(loan_id).get();

		require!(
			loan_obj.lender == Address::zero(),
			"Loan must have at least 1 installment"
		);

		require!(
			loan_obj.paid_amount == 0, 
			"This loan is currently not ready for lenders"
		);

		require!(
			loan_obj.status == LoanStatus::Listed, 
			"This loan is not currently ready for lenders, check later"
		);

		/*
		 * @DIIMIIM: The discount smart contract
		 * TO DO
		 */
		let discount: u8 = 1;

		

		Ok(())
	}


	/*
	 * cancel loan
	 * @DIIMIIM: Call this to cancel a loan
	 */
	#[endpoint(cancelLoan)]
	fn cancel_loan(&self
		, loan_id: Self::BigUint
	) -> elrond_wasm::types::SCResult<()> {

		//self.send().direct(&caller, &token_name, &sc_balance, &[]);

		Ok(())
	}


	/*
	 * pay loan
	 * @DIIMIIM: Call this to pay a loan
	 */
	#[endpoint(payLoan)]
	fn pay_loan(&self
		, loan_id: Self::BigUint
	) -> elrond_wasm::types::SCResult<()> {



		Ok(())
	}

	
	/*
	 * terminate loan
	 * @DIIMIIM: Call this to terminate a loan
	 */
	#[endpoint(terminateLoan)]
	fn terminate_loan(&self
		, loan_id: Self::BigUint
	) -> elrond_wasm::types::SCResult<()> {

		//self.send().direct(&caller, &token_name, &sc_balance, &[]);

		Ok(())
	}


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



	#[endpoint]
	#[storage_set("discount_contract_address")]
	fn set_discount_contract_address(&self, address: &Address);

	#[storage_set("discount_contract_address")]
	fn set_discount_contract_address_internal(&self, address: &Address);

	#[view]
	#[storage_get("discount_contract_address")]
	fn get_discount_contract_address(&self) -> Address;


	#[endpoint]
	#[storage_set("nft_contract_address")]
	fn set_nft_contract_address(&self, address: &Address);

	#[storage_set("nft_contract_address")]
	fn set_nft_contract_address_internal(&self, address: &Address);

	#[view]
	#[storage_get("nft_contract_address")]
	fn get_nft_contract_address(&self) -> Address;


	#[storage_mapper("loans")]
    fn loan(
        &self,
        id: u64,
    ) -> SingleValueMapper<Self::Storage, Loan<Self::BigUint>>;

	/*
	 * @DIIMIIM: Loan getters
	 */

	#[view(getLoanById)]
	fn get_loan_by_id(&self, loan_id: u64) -> Loan<Self::BigUint> {
		self.loan(loan_id).get()
	}

	#[view(getLoanAmountByLoanId)]
	fn get_loan_amount_by_loan_id(&self, loan_id: u64) -> SCResult<Self::BigUint> {
		return Ok(self.loan(loan_id).get().loan_amount);
	}

	#[view(getLoanStartByLoanId)]
	fn get_loan_start_by_loan_id(&self, loan_id: u64) -> SCResult<u64> {
		return Ok(self.loan(loan_id).get().loan_start);
	}

	#[view(getLoanEndByLoanId)]
	fn get_loan_end_by_loan_id(&self, loan_id: u64) -> SCResult<u64> {
		return Ok(self.loan(loan_id).get().loan_end);
	}

	#[view(getLoanAssetsValueByLoanId)]
	fn get_loan_assets_value_by_loan_id(&self, loan_id: u64) -> SCResult<Self::BigUint> {
		return Ok(self.loan(loan_id).get().assets_value);
	}

	#[view(getLoanLenderByLoanId)]
	fn get_loan_lender_by_loan_id(&self, loan_id: u64) -> SCResult<Address> {
		return Ok(self.loan(loan_id).get().lender);
	}

	#[view(getLoanBorrowerByLoanId)]
	fn get_loan_borrower_by_loan_id(&self, loan_id: u64) -> SCResult<Address> {
		return Ok(self.loan(loan_id).get().borrower);
	}

	#[view(getLoanNrOfInstallmentsByLoanId)]
	fn get_loan_nr_of_installments_by_loan_id(&self, loan_id: u64) -> SCResult<u16> {
		return Ok(self.loan(loan_id).get().nr_of_installments);
	}

	#[view(getLoanInstallmentAmountByLoanId)]
	fn get_loan_installment_amount_by_loan_id(&self, loan_id: u64) -> SCResult<Self::BigUint> {
		return Ok(self.loan(loan_id).get().installment_amount);
	}

	#[view(getLoanAmountDueByLoanId)]
	fn get_loan_amount_due_by_loan_id(&self, loan_id: u64) -> SCResult<Self::BigUint> {
		return Ok(self.loan(loan_id).get().amount_due);
	}

	#[view(getLoanPaidAmountByLoanId)]
	fn get_loan_paid_amount_by_loan_id(&self, loan_id: u64) -> SCResult<Self::BigUint> {
		return Ok(self.loan(loan_id).get().paid_amount);
	}

	#[view(getLoanDefaultingLimitByLoanId)]
	fn get_loan_defaulting_limit_by_loan_id(&self, loan_id: u64) -> SCResult<u8> {
		return Ok(self.loan(loan_id).get().defaulting_limit);
	}

	#[view(getLoanNrOfPaymentsByLoanId)]
	fn get_loan_nr_of_payments_by_loan_id(&self, loan_id: u64) -> SCResult<u16> {
		return Ok(self.loan(loan_id).get().nr_of_payments);
	}

	#[view(getLoanStatusByLoanId)]
	fn get_loan_status_by_loan_id(&self, loan_id: u64) -> SCResult<LoanStatus> {
		return Ok(self.loan(loan_id).get().status);
	}


	
	/*
	#[event("NewLoan")]
	fn new_loan(
		&self,
		#[indexed] loan_id: u64, 
		#[indexed] owner: &Address,  
		status: LoanStatus, 
		nft_address_array: Vec<&Address>, 
		nft_token_id_array: Vec<&Self::BigUint>,
		nft_token_type_array: Vec<TokenType>
	);
	*/



	/*
	#[callback]
	fn transfer_from_callback(
		&self,
		#[call_result] result: AsyncCallResult<()>,
		cb_sender: Address,
		cb_amount: Self::BigUint,
	) -> OptionalResult<AsyncCall<Self::SendApi>> {
		match result {
			AsyncCallResult::Ok(()) => {
				// transaction started before deadline, ended after -> refund
				if self.blockchain().get_block_nonce() > self.get_deadline() {
					let erc20_address = self.get_erc20_contract_address();
					return OptionalResult::Some(
						self.erc20_proxy(erc20_address)
							.transfer(cb_sender, cb_amount)
							.async_call(),
					);
				}

				let mut deposit = self.get_deposit(&cb_sender);
				deposit += &cb_amount;
				self.set_deposit(&cb_sender, &deposit);

				let mut balance = self.get_total_balance();
				balance += &cb_amount;
				self.set_total_balance(&balance);

				OptionalResult::None
			},
			AsyncCallResult::Err(_) => OptionalResult::None,
		}
	}
	*/

}