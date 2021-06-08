elrond_wasm::derive_imports!();

#[derive(TopEncode, TopDecode, NestedEncode, NestedDecode, TypeAbi, PartialEq, Clone, Copy)]
pub enum TokenType {
	Egld,
	Esdt,
	Erc20,
	NonFungibleToken
}