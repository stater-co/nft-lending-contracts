ALICE="${USERS}/alice.pem"
ADDRESS=$(erdpy data load --key=address-testnet)
DEPLOY_TRANSACTION=$(erdpy data load --key=deployTransaction-testnet)
PROXY=https://testnet-api.elrond.com

deploy() {
    erdpy --verbose contract deploy --project=${PROJECT} --recall-nonce --pem=${ALICE} --gas-limit=50000000 --send --outfile="deploy-testnet.interaction.json" --proxy=${PROXY} --chain=T || return

    TRANSACTION=$(erdpy data parse --file="deploy-testnet.interaction.json" --expression="data['emitted_tx']['hash']")
    ADDRESS=$(erdpy data parse --file="deploy-testnet.interaction.json" --expression="data['emitted_tx']['address']")

    erdpy data store --key=address-testnet --value=${ADDRESS}
    erdpy data store --key=deployTransaction-testnet --value=${TRANSACTION}

    echo ""
    echo "Smart contract address: ${ADDRESS}"
}

setLenderFee() {
    read -p "Enter lender fee: " NUMBER
    erdpy --verbose contract call ${ADDRESS} --recall-nonce --pem=${ALICE} --gas-limit=5000000 --function="set_lender_fee" --arguments ${NUMBER} --send --proxy=${PROXY} --chain=T
}

lenderFee() {
    erdpy --verbose contract query ${ADDRESS} --function="lenderFee" --proxy=${PROXY}
}

ltv() {
    erdpy --verbose contract query ${ADDRESS} --function="ltv" --proxy=${PROXY}
}

installmentFrequency() {
    erdpy --verbose contract query ${ADDRESS} --function="installmentFrequency" --proxy=${PROXY}
}

installmentTimeScale() {
    erdpy --verbose contract query ${ADDRESS} --function="installmentTimeScale" --proxy=${PROXY}
}

setInstallmentTimeScale() {
    read -p "Enter time scale index: " NUMBER
    erdpy --verbose contract call ${ADDRESS} --recall-nonce --pem=${ALICE} --gas-limit=5000000 --function="set_installment_time_scale" --arguments ${NUMBER} --send --proxy=${PROXY} --chain=T
}

interestRate() {
    erdpy --verbose contract query ${ADDRESS} --function="interestRate" --proxy=${PROXY}
}

interestRateToStater() {
    erdpy --verbose contract query ${ADDRESS} --function="interestRateToStater" --proxy=${PROXY}
}

createLoan() {
    # LOAN_ARGUMENTS : 6000000 5 erd1qqqqqqqqqqqqqpgqn7kmy58sfnx2x5h7gxvlc20jnskcmy62d8ss9vk98j 10000000 [] [] []
    read -p "Enter the loan amount: " LOAN_AMOUNT
    read -p "Enter the number of installments: " NR_OF_INSTALLMENTS
    read -p "Enter the currency: " CURRENCY
    read -p "Enter the assets value: " ASSETS_VALUE
    read -p "Enter the NFT address array: " NFT_ADDRESS_ARRAY
    read -p "Enter the NFT token ID array: " NFT_TOKEN_ID_ARRAY
    read -p "Enter the NFT token type array: " NFT_TOKEN_TYPE_ARRAY
    CURRENCY="0x$(erdpy wallet bech32 --decode ${CURRENCY})"
    NFT_ADDRESS_ARRAY="0x$(erdpy wallet bech32 --decode ${NFT_ADDRESS_ARRAY})"
    NFT_TOKEN_ID_ARRAY="0x$(erdpy wallet bech32 --decode ${NFT_TOKEN_ID_ARRAY})"
    NFT_TOKEN_TYPE_ARRAY="0x$(erdpy wallet bech32 --decode ${NFT_TOKEN_TYPE_ARRAY})"
    erdpy --verbose contract call ${ADDRESS} --recall-nonce --pem=${ALICE} --gas-limit=5000000 --function="createLoan" --arguments ${LOAN_AMOUNT} ${NR_OF_INSTALLMENTS} ${CURRENCY} ${ASSETS_VALUE} ${NFT_ADDRESS_ARRAY} ${NFT_TOKEN_ID_ARRAY} ${NFT_TOKEN_TYPE_ARRAY} --send --proxy=${PROXY} --chain=T
}

loans() {
    read -p "Enter the loan ID: " LOAN_ID
    erdpy --verbose contract query ${ADDRESS} --function="loans" --arguments ${LOAN_ID} --proxy=${PROXY}
}

id() {
    erdpy --verbose contract query ${ADDRESS} --function="loanID" --proxy=${PROXY}
}
