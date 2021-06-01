use elrond_wasm_debug::*;
use nft_generator::*;

fn main() {
	let contract = NonFungibleTokensImpl::new(TxContext::dummy());
	print!("{}", abi_json::contract_abi(&contract));
}
