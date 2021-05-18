derive_imports!();

#[derive(TopEncode, TopDecode, TypeAbi, PartialEq, Clone, Copy)]
pub enum TimeScale {
    Minutes, 
    Hours, 
    Days, 
    Weeks
}