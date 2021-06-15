elrond_wasm::derive_imports!();

#[derive(TopEncode, TopDecode, NestedEncode, NestedDecode, TypeAbi, PartialEq, Clone, Copy)]
pub enum TimeScale {
    Minutes, 
    Hours, 
    Days, 
    Weeks
}