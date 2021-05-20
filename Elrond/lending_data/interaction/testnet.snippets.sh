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

setDiscountNft() {
    read -p "Enter number: " NUMBER
    erdpy --verbose contract call ${ADDRESS} --recall-nonce --pem=${ALICE} --gas-limit=5000000 --function="set_discount_nft" --arguments ${NUMBER} --send --proxy=${PROXY} --chain=T
}

discountNft() {
    erdpy --verbose contract query ${ADDRESS} --function="discountNft" --proxy=${PROXY}
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
    read -p "Enter the loan amount: " LOAN_ARGUMENTS
    erdpy --verbose contract call ${ADDRESS} --recall-nonce --pem=${ALICE} --gas-limit=5000000 --function="tessting" --arguments ${LOAN_ARGUMENTS} --send --proxy=${PROXY} --chain=T
}

loans() {
    erdpy --verbose contract query ${ADDRESS} --function="loans" --proxy=${PROXY}
}