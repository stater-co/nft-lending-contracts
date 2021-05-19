use elrond_wasm_debug::*;
use NFT::*;

fn main() {
	let contract = NonFungibleTokensImpl::new(TxContext::dummy());
	print!("{}", abi_json::contract_abi(&contract));
}
