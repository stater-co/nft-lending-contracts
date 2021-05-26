ALICE="${USERS}/alice.pem"
ADDRESS=$(erdpy data load --key=address-devnet)
DEPLOY_TRANSACTION=$(erdpy data load --key=deployTransaction-devnet)

: '
deploy() {
    erdpy --verbose contract deploy --project=${PROJECT} --recall-nonce --pem=${ALICE} --gas-limit=50000000 --send --outfile="deploy-devnet.interaction.json" || return

    TRANSACTION=$(erdpy data parse --file="deploy-devnet.interaction.json" --expression="data['emitted_tx']['hash']")
    ADDRESS=$(erdpy data parse --file="deploy-devnet.interaction.json" --expression="data['emitted_tx']['address']")

    erdpy data store --key=address-devnet --value=${ADDRESS}
    erdpy data store --key=deployTransaction-devnet --value=${TRANSACTION}

    echo ""
    echo "Smart contract address: ${ADDRESS}"
}

setDiscountNft() {
    read -p "Enter discount nft percent: " NUMBER
    erdpy --verbose contract call ${ADDRESS} --recall-nonce --pem=${ALICE} --gas-limit=5000000 --function="set_discount_nft" --arguments ${NUMBER} --send
}

discountNft() {
    erdpy --verbose contract query ${ADDRESS} --function="discountNft"
}

setLenderFee() {
    read -p "Enter lender fee: " NUMBER
    erdpy --verbose contract call ${ADDRESS} --recall-nonce --pem=${ALICE} --gas-limit=5000000 --function="set_lender_fee" --arguments ${NUMBER} --send
}

lenderFee() {
    erdpy --verbose contract query ${ADDRESS} --function="lenderFee"
}
'