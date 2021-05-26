elrond_wasm::derive_imports!();

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