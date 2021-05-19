use elrond_wasm_debug::*;
use stater_nft::*;

fn main() {
	let contract = NonFungibleTokensImpl::new(TxContext::dummy());
	print!("{}", abi_json::contract_abi(&contract));
}
