elrond_wasm::derive_imports!();

use elrond_wasm::{Vec, api::BigUintApi};


#[derive(TopEncode, TopDecode, NestedEncode, NestedDecode, TypeAbi, PartialEq, Clone)]
pub struct Loan<BigUint: BigUintApi> {
    pub nft_token_id_array: Vec<u64>,
    pub loan_amount: BigUint,
    pub assets_value: BigUint,
    pub loan_start: u64,
    pub loan_end: u64,
    pub nr_of_installments: u16,
    pub installment_amount: BigUint,
    pub amount_due: BigUint,
    pub paid_amount: BigUint,
    pub defaulting_limit: u8,
    pub nr_of_payments: u16,
    pub nft_token_type_array: Vec<u8>
}