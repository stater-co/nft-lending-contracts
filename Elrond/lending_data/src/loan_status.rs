derive_imports!();

#[derive(TopEncode, TopDecode, TypeAbi, PartialEq, Clone, Copy)]
pub enum LoanStatus {
    Uninitialized, 
    Listed, 
    Approved, 
    Defaulted,
    Liquidated,
    Cancelled,
    Withdrawn
}