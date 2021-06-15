elrond_wasm::derive_imports!();

#[derive(TopEncode, TopDecode, NestedEncode, NestedDecode, TypeAbi, PartialEq, Clone, Copy)]
pub enum LoanStatus {
	Listed,
	Approved,
	Defaulted,
	Liquidated,
	Cancelled,
	Withdrawn
}