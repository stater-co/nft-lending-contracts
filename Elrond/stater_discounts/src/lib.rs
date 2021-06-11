#![no_std]

elrond_wasm::imports!();

/// One of the simplest smart contracts possible,
/// it holds a single variable in storage, which anyone can increment.
#[elrond_wasm_derive::contract]
pub trait StaterDiscounts {

}
