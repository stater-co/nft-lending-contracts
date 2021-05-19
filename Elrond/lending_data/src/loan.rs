use elrond_wasm::{Address, BigUintApi, Vec};

derive_imports!();

#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
pub struct Loan<BigUint: BigUintApi> {
	pub loan_id: BigUint,
    pub nft_address_array: Vec<Address>,
    pub borrower: Address,
    pub lender: Address,
    pub currency: Address,
	pub status: u8,
    pub nft_token_id_array: Vec<u64>,
    pub loan_amount: u64,
    pub assets_value: u64,
    pub loan_start: u64,
    pub loan_end: u64,
    pub nr_of_installments: u16,
    pub installment_amount: u64,
    pub amount_due: u64,
    pub paid_amount: u64,
    pub defaulting_limit: u8,
    pub nr_of_payments: u16,
    pub nft_token_type_array: Vec<u8>,
}