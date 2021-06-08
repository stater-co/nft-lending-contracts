ALICE="${USERS}/alice.pem"
ADDRESS=$(erdpy data load --key=address-devnet)
DEPLOY_TRANSACTION=$(erdpy data load --key=deployTransaction-devnet)

deploy() {
    erdpy --verbose contract deploy --project=${PROJECT} --recall-nonce --pem=${ALICE} --gas-limit=50000000 --send --outfile="deploy-devnet.interaction.json" || return

    TRANSACTION=$(erdpy data parse --file="deploy-devnet.interaction.json" --expression="data['emitted_tx']['hash']")
    ADDRESS=$(erdpy data parse --file="deploy-devnet.interaction.json" --expression="data['emitted_tx']['address']")

    erdpy data store --key=address-devnet --value=${ADDRESS}
    erdpy data store --key=deployTransaction-devnet --value=${TRANSACTION}

    echo ""
    echo "Smart contract address: ${ADDRESS}"
}

setLenderFee() {
    read -p "Enter lender fee: " NUMBER
    erdpy --verbose contract call ${ADDRESS} --recall-nonce --pem=${ALICE} --gas-limit=5000000 --function="set_lender_fee" --arguments ${NUMBER} --send 
}

lenderFee() {
    erdpy --verbose contract query ${ADDRESS} --function="lenderFee" 
}

ltv() {
    erdpy --verbose contract query ${ADDRESS} --function="ltv" 
}

installmentFrequency() {
    erdpy --verbose contract query ${ADDRESS} --function="installmentFrequency" 
}

installmentTimeScale() {
    erdpy --verbose contract query ${ADDRESS} --function="installmentTimeScale" 
}

setInstallmentTimeScale() {
    read -p "Enter time scale index: " NUMBER
    erdpy --verbose contract call ${ADDRESS} --recall-nonce --pem=${ALICE} --gas-limit=5000000 --function="set_installment_time_scale" --arguments ${NUMBER} --send 
}

interestRate() {
    erdpy --verbose contract query ${ADDRESS} --function="interestRate" 
}

interestRateToStater() {
    erdpy --verbose contract query ${ADDRESS} --function="interestRateToStater" 
}

numberToElrondHex() {
    nr=$1;
    x=$( printf "%x" $nr );
    stringified="$(printf "%q " "${x}")";
    thelength=${#stringified};
    if [[ $((($thelength-1) % 2)) -eq 0 ]];
    then 
        formattedLength="$((($thelength-1)/2))";
    else
        formattedLength="$(((($thelength-1)/2)+1))";
    fi 
    finalFormatedHex=$formattedLength$x;
}


createTheLoan() {
    # LOAN_ARGUMENTS : 6000000 5 erd1qqqqqqqqqqqqqpgqn7kmy58sfnx2x5h7gxvlc20jnskcmy62d8ss9vk98j 10000000 [] [] []
    read -p "Enter the loan amount: " LOAN_AMOUNT
    read -p "Enter the number of installments: " NR_OF_INSTALLMENTS
    read -p "Enter the currency: " CURRENCY
    read -p "Enter the assets value: " ASSETS_VALUE
    
    
    # Example : erd1qqqqqqqqqqqqqpgqn7kmy58sfnx2x5h7gxvlc20jnskcmy62d8ss9vk98j erd1qqqqqqqqqqqqqpgqn7kmy58sfnx2x5h7gxvlc20jnskcmy62d8ss9vk98j
    echo "Enter the NFT address array: "
    read -a NFT_ADDRESS_ARRAY
    

    # Example : 0 1    
    echo "Enter the NFT token ID array: "
    read -a NFT_TOKEN_ID_ARRAY
    
    
    # Example : 1 1
    echo "Enter the NFT token type array: "
    read -a NFT_TOKEN_TYPE_ARRAY
    
    
    CURRENCY="0x$(erdpy wallet bech32 --decode ${CURRENCY})"
    FORMATTED_NFT_ADDRESS_ARRAY="0x"
    FORMATTED_NFT_TOKEN_ID_ARRAY="0x"
    FORMATTED_NFT_TOKEN_TYPE_ARRAY="0x"
    
    for i in ${NFT_ADDRESS_ARRAY[@]};
    do
        FORMATTED_NFT_ADDRESS_ARRAY+="$(erdpy wallet bech32 --decode $i)";
    done

    
    for i in ${NFT_TOKEN_ID_ARRAY[@]};
    do
        numberToElrondHex $i
        FORMATTED_NFT_TOKEN_ID_ARRAY+=$finalFormatedHex;
    done


    for i in ${NFT_TOKEN_TYPE_ARRAY[@]};
    do
        numberToElrondHex $i
        FORMATTED_NFT_TOKEN_TYPE_ARRAY+=$finalFormatedHex;
    done


    erdpy \
    --verbose contract call ${ADDRESS} \
    --recall-nonce \
    --pem=${ALICE} \
    --gas-limit=5000000 \
    --function="createLoan" \
    --arguments ${LOAN_AMOUNT} ${NR_OF_INSTALLMENTS} ${CURRENCY} ${ASSETS_VALUE} ${FORMATTED_NFT_ADDRESS_ARRAY} ${FORMATTED_NFT_TOKEN_ID_ARRAY} ${FORMATTED_NFT_TOKEN_TYPE_ARRAY} \
    --send
}

loans() {
    read -p "Enter the loan ID: " LOAN_ID
    erdpy --verbose contract query ${ADDRESS} --function="loans" --arguments ${LOAN_ID} 
}

setLoanId() {
    read -p "Enter the loan ID: " LOAN_ID
    erdpy --verbose contract call ${ADDRESS} --recall-nonce --pem=${ALICE} --gas-limit=5000000 --function="set_loan_id" --arguments ${LOAN_ID} --send 
}

id() {
    erdpy --verbose contract query ${ADDRESS} --function="loanId" 
}
