use elrond_wasm::{Address, BigUintApi, BoxedBytes, Vec};

derive_imports!();

mod token_type;
use token_type::TokenType;

#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
pub struct Loan<BigUint: BigUintApi> {
    pub nft_address_array: Vec<Address>,
    pub borrower: Address,
    pub lender: Address,
    pub currency: Address,
    pub nft_token_id_array: Vec<BigUint>,
    pub loan_amount: BigUint,
    pub assets_value: BigUint,
    pub loan_start: BigUint,
    pub loan_end: BigUint,
    pub nr_of_installments: u16,
    pub installment_amount: BigUint,
    pub amount_due: BigUint,
    pub paid_amount: BigUint,
    pub defaulting_limit: u8,
    pub nr_of_payments: u16,
    pub nft_token_type_array: Vec<TokenType>
}
