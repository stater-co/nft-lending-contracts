elrond_wasm::imports!();

const DEBT_TOKEN_NAME: &[u8] = b"DebtBearing";
const DEBT_TOKEN_TICKER: &[u8] = b"DEBT";

#[elrond_wasm_derive::module]
pub trait DebtTokenModule {
    #[payable("EGLD")]
    #[endpoint(issueDebtToken)]
    fn issue_debt_token(
        &self,
        #[payment] issue_cost: Self::BigUint,
    ) -> SCResult<AsyncCall<Self::SendApi>> {
        only_owner!(self, "only owner can issue new tokens");
        require!(self.debt_token_id().is_empty(), "Debt token already issued");

        let token_display_name = BoxedBytes::from(DEBT_TOKEN_NAME);
        let token_ticker = BoxedBytes::from(DEBT_TOKEN_TICKER);

        Ok(ESDTSystemSmartContractProxy::new_proxy_obj(self.send())
            .issue_semi_fungible(
                issue_cost,
                &token_display_name,
                &token_ticker,
                SemiFungibleTokenProperties {
                    can_freeze: true,
                    can_wipe: true,
                    can_pause: true,
                    can_change_owner: true,
                    can_upgrade: true,
                    can_add_special_roles: true,
                },
            )
            .async_call()
            .with_callback(self.callbacks().debt_token_issue_callback()))
    }

    fn mint_debt(&self, amount: &Self::BigUint) {
        self.send().esdt_nft_create::<()>(
            &self.debt_token_id().get(),
            amount,
            &BoxedBytes::empty(),
            &Self::BigUint::zero(),
            &BoxedBytes::empty(),
            &(),
            &[BoxedBytes::empty()],
        );
    }

    fn burn_debt(&self, nonce: u64, amount: &Self::BigUint) {
        self.send()
            .esdt_nft_burn(&self.debt_token_id().get(), nonce, amount);
    }

    fn send_debt(&self, to: &Address, nonce: u64, amount: &Self::BigUint) {
        self.send()
            .direct_nft(to, &self.debt_token_id().get(), nonce, amount, &[]);
    }

    /// returns the nonce of the newly created SFTs
    fn create_and_send_debt(&self, to: &Address, amount: &Self::BigUint) -> u64 {
        self.mint_debt(amount);
        let new_nonce = self.get_debt_current_nonce();
        self.send_debt(to, new_nonce, amount);

        new_nonce
    }

    fn get_debt_current_nonce(&self) -> u64 {
        self.blockchain().get_current_esdt_nft_nonce(
            &self.blockchain().get_sc_address(),
            &self.debt_token_id().get(),
        )
    }

    fn require_debt_token_issued(&self) -> SCResult<()> {
        require!(
            !self.debt_token_id().is_empty(),
            "Debt token must be issued first"
        );
        Ok(())
    }

    fn set_debt_token_roles(&self) -> AsyncCall<Self::SendApi> {
        let own_sc_address = self.blockchain().get_sc_address();
        let token_id = self.debt_token_id().get();
        let roles = [
            EsdtLocalRole::NftCreate,
            EsdtLocalRole::NftAddQuantity,
            EsdtLocalRole::NftBurn,
        ];

        ESDTSystemSmartContractProxy::new_proxy_obj(self.send())
            .set_special_roles(&own_sc_address, &token_id, &roles)
            .async_call()
    }

    #[callback]
    fn debt_token_issue_callback(
        &self,
        #[call_result] result: AsyncCallResult<TokenIdentifier>,
    ) -> OptionalResult<AsyncCall<Self::SendApi>> {
        match result {
            AsyncCallResult::Ok(token_id) => {
                self.debt_token_id().set(&token_id);

                OptionalResult::Some(self.set_debt_token_roles())
            }
            AsyncCallResult::Err(_) => {
                let initial_caller = self.blockchain().get_owner_address();
                let egld_returned = self.call_value().egld_value();
                if egld_returned > 0 {
                    self.send()
                        .direct_egld(&initial_caller, &egld_returned, &[]);
                }

                OptionalResult::None
            }
        }
    }

    // storage

    #[view(getDebtTokenId)]
    #[storage_mapper("debtTokenId")]
    fn debt_token_id(&self) -> SingleValueMapper<Self::Storage, TokenIdentifier>;
}
