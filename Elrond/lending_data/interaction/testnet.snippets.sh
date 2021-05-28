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
    finalFormatedHex=$(printf "%.8d\n" $formattedLength);
    LEN=$(echo ${#x});
    if [[ $((($LEN) % 2)) -eq 0 ]];
    then
        echo "x length % 2 == 0 , "$LEN" , "$x;
        finalFormatedHex+=$x;
    else
        echo "x length % 2 != 0 , "$LEN" , "$x;
        finalFormatedHex+="0"$x;
    fi
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
        numberToElrondHex $i;
        FORMATTED_NFT_TOKEN_ID_ARRAY+=$finalFormatedHex;
    done


    for i in ${NFT_TOKEN_TYPE_ARRAY[@]};
    do
        numberToElrondHex $i;
        FORMATTED_NFT_TOKEN_TYPE_ARRAY+=$finalFormatedHex;
    done

    echo ${LOAN_AMOUNT} ${NR_OF_INSTALLMENTS} ${CURRENCY} ${ASSETS_VALUE} ${FORMATTED_NFT_ADDRESS_ARRAY} ${FORMATTED_NFT_TOKEN_ID_ARRAY} ${FORMATTED_NFT_TOKEN_TYPE_ARRAY};
    erdpy \
    --verbose contract call ${ADDRESS} \
    --recall-nonce \
    --pem=${ALICE} \
    --gas-limit=5000000 \
    --function="createLoan" \
    --arguments ${LOAN_AMOUNT} ${NR_OF_INSTALLMENTS} ${CURRENCY} ${ASSETS_VALUE} ${FORMATTED_NFT_ADDRESS_ARRAY} ${FORMATTED_NFT_TOKEN_ID_ARRAY} ${FORMATTED_NFT_TOKEN_TYPE_ARRAY} \
    --send \
    --proxy=${PROXY} \
    --chain=T
}

loans() {
    read -p "Enter the loan ID: " LOAN_ID
    erdpy --verbose contract query ${ADDRESS} --function="loans" --arguments ${LOAN_ID} --proxy=${PROXY}
}

setLoanId() {
    read -p "Enter the loan ID: " LOAN_ID
    erdpy --verbose contract call ${ADDRESS} --recall-nonce --pem=${ALICE} --gas-limit=5000000 --function="set_loan_id" --arguments ${LOAN_ID} --send --proxy=${PROXY} --chain=T
}

id() {
    erdpy --verbose contract query ${ADDRESS} --function="loanId" --proxy=${PROXY}
}
