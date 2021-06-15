DIIMIIM="${USERS}/diimiim.pem"
DIIMIIM_ADDRESS="erd1am7qzznuq0f8she67ash0k39j359u9mtdc74wumyjn0y8htj2prqah522h"
ADDRESS=$(erdpy data load --key=address-testnet)
DEPLOY_TRANSACTION=$(erdpy data load --key=deployTransaction-testnet)
PROXY=https://testnet-api.elrond.com

deploy() {
    erdpy --verbose contract deploy --project=${PROJECT} --recall-nonce --pem=${DIIMIIM} --gas-limit=99000000 --send --outfile="deploy-testnet.interaction.json" --proxy=${PROXY} --chain=T || return

    TRANSACTION=$(erdpy data parse --file="deploy-testnet.interaction.json" --expression="data['emitted_tx']['hash']")
    ADDRESS=$(erdpy data parse --file="deploy-testnet.interaction.json" --expression="data['emitted_tx']['address']")

    erdpy data store --key=address-testnet --value=${ADDRESS}
    erdpy data store --key=deployTransaction-testnet --value=${TRANSACTION}

    echo ""
    echo "Smart contract address: ${ADDRESS}"
}

setLenderFee() {
    read -p "Enter lender fee: " NUMBER
    erdpy --verbose contract call ${ADDRESS} --recall-nonce --pem=${DIIMIIM} --gas-limit=5000000 --function="set_lender_fee" --arguments ${NUMBER} --send --proxy=${PROXY} --chain=T
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
    erdpy --verbose contract call ${ADDRESS} --recall-nonce --pem=${DIIMIIM} --gas-limit=5000000 --function="set_installment_time_scale" --arguments ${NUMBER} --send --proxy=${PROXY} --chain=T
}

interestRate() {
    erdpy --verbose contract query ${ADDRESS} --function="interestRate" --proxy=${PROXY}
}

interestRateToStater() {
    erdpy --verbose contract query ${ADDRESS} --function="interestRateToStater" --proxy=${PROXY}
}

numberToElrondNestedHex() {
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
        finalFormatedHex+=$x;
    else
        finalFormatedHex+="0"$x;
    fi
}

numberToElrondHex() {
    nr=$1;
    x=$( printf "%x" $nr );
    LEN=$(echo ${#x});
    finalFormatedHex="";
    if [[ $((($LEN) % 2)) -eq 0 ]];
    then
        finalFormatedHex+=$x;
    else
        finalFormatedHex+="0"$x;
    fi
}

stringToElrondNestedHex() {
    str=$1;
    x=$(echo -n "$str" | od -A n -t x1);
    x=$(echo $x | tr -d ' ');
    stringified=$x;
    thelength=${#stringified};
    if [[ $((($thelength-1) % 2)) -eq 0 ]];
    then 
        formattedLength="$((($thelength-1)/2))";
    else
        formattedLength="$(((($thelength-1)/2)+1))";
    fi
    finalFormatedHex="";
    LEN=$(echo ${#x});
    if [[ $((($LEN) % 2)) -eq 0 ]];
    then
        finalFormatedHex+=$x;
    else
        finalFormatedHex+="0"$x;
    fi
}


issueWrappedEgld() {
    local TOKEN_DISPLAY_NAME=0x53746174657254657374546f6b656e73  # "StaterTestTokens"
    local TOKEN_TICKER=0x535454  # "STT"
    local INITIAL_SUPPLY=0xff # 255
    local NR_DECIMALS=0x01 # 1
    local CAN_ADD_SPECIAL_ROLES=0x63616e4164645370656369616c526f6c6573 # "canAddSpecialRoles"
    local TRUE=0x74727565 # "true"
    local ESDT_SYSTEM_SC_ADDRESS=erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u

    erdpy --verbose contract call ${ESDT_SYSTEM_SC_ADDRESS} --recall-nonce --pem=${DIIMIIM} \
    --gas-limit=60000000 --value=50000000000000000 --function="issue" \
    --arguments ${TOKEN_DISPLAY_NAME} ${TOKEN_TICKER} ${INITIAL_SUPPLY} ${NR_DECIMALS} ${CAN_ADD_SPECIAL_ROLES} ${TRUE} \
    --send --proxy=${PROXY} --chain=T
}


createTheLoan() {

    read -p "Enter the loan amount: " LOAN_AMOUNT
    read -p "Enter the number of installments: " NR_OF_INSTALLMENTS
    read -p "Enter the assets value: " ASSETS_VALUE
    read -p "Token ID: " RAW_LOAN_ASSETS_TOKEN_ID
    read -p "Token quantity: " RAW_LOAN_ASSETS_TOKEN_QUANTITY

    stringToElrondNestedHex $RAW_LOAN_ASSETS_TOKEN_ID;
    TOKEN_ID="0x"$finalFormatedHex;

    numberToElrondHex $RAW_LOAN_ASSETS_TOKEN_QUANTITY;
    TOKEN_QUANTITY="0x"$finalFormatedHex;

    stringToElrondNestedHex "createLoan";
    ENCODED_METHOD_NAME="0x"$finalFormatedHex;

    echo "Smart contract address: "$ADDRESS", Encoded method name: "$ENCODED_METHOD_NAME", Loan amount: "$LOAN_AMOUNT", Nr of installments: "$NR_OF_INSTALLMENTS", Assets value: "$ASSETS_VALUE", Loan assets: "$LOAN_ASSETS;

    erdpy \
    --verbose contract call ${ADDRESS} \
    --recall-nonce \
    --pem=${DIIMIIM} \
    --gas-limit=999000000 \
    --function="ESDTTransfer" \
    --arguments ${TOKEN_ID} ${TOKEN_QUANTITY} ${ENCODED_METHOD_NAME} ${LOAN_AMOUNT} ${NR_OF_INSTALLMENTS} ${ASSETS_VALUE} \
    --send \
    --proxy=${PROXY} \
    --chain=T

}

id() {
    erdpy --verbose contract query ${ADDRESS} --function="loanId" --proxy=${PROXY}
}


setNftAddressArray() {
    read -p "Enter the NFT address array : " NFT_ADDRESS_ARRAY
    FORMATTED_NFT_ADDRESS_ARRAY="0x"
    
    for i in ${NFT_ADDRESS_ARRAY[@]};
    do
        FORMATTED_NFT_ADDRESS_ARRAY+="$(erdpy wallet bech32 --decode $i)";
    done

    echo "ARRAY OF ADDRESS TO SET : "$FORMATTED_NFT_ADDRESS_ARRAY
    erdpy --verbose contract call ${ADDRESS} --recall-nonce --pem=${DIIMIIM} --gas-limit=50000000 --function="setNftAddressArray" --arguments ${FORMATTED_NFT_ADDRESS_ARRAY} --send --proxy=${PROXY} --chain=T
}

nftAddressArray() {
    erdpy --verbose contract query ${ADDRESS} --function="nftAddressArray" --proxy=${PROXY}
}

getNftAddressArrayLength() {
    erdpy --verbose contract query ${ADDRESS} --function="getNftAddressArrayLength" --proxy=${PROXY}
}

setNftTokenIdArray() {
    read -p "Enter the NFT token id array : " NFT_TOKEN_ID_ARRAY
    FORMATTED_NFT_TOKEN_ID_ARRAY="0x"
    
    for i in ${NFT_TOKEN_ID_ARRAY[@]};
    do
        numberToElrondNestedHex $i;
        FORMATTED_NFT_TOKEN_ID_ARRAY+=$finalFormatedHex;
    done

    echo "ARRAY OF TOKEN IT ARRAY TO SET : "$FORMATTED_NFT_TOKEN_ID_ARRAY
    erdpy --verbose contract call ${ADDRESS} --recall-nonce --pem=${DIIMIIM} --gas-limit=50000000 --function="setNftTokenIdArray" --arguments ${FORMATTED_NFT_TOKEN_ID_ARRAY} --send --proxy=${PROXY} --chain=T
}

nftTokenIdArray() {
    erdpy --verbose contract query ${ADDRESS} --function="nftTokenIdArray" --proxy=${PROXY}
}


getLoanById() {
    read -p "Enter the loan ID: " LOAN_ID
    erdpy --verbose contract query ${ADDRESS} --function="getLoanById" --arguments ${LOAN_ID} --proxy=${PROXY}
}

getLoanAmountByLoanId() {
    read -p "Enter the loan ID: " LOAN_ID
    erdpy --verbose contract query ${ADDRESS} --function="getLoanAmountByLoanId" --arguments ${LOAN_ID} --proxy=${PROXY}
}

getLoanAssetsValueByLoanId() {
    read -p "Enter the loan ID: " LOAN_ID
    erdpy --verbose contract query ${ADDRESS} --function="getLoanAssetsValueByLoanId" --arguments ${LOAN_ID} --proxy=${PROXY}
}

getLoanNftTokenIdArrayByLoanId() {
    read -p "Enter the loan ID: " LOAN_ID;
    #FORMATTED_NFT_TOKEN_ID_ARRAY=[];
    erdpy --verbose contract query ${ADDRESS} --function="getLoanNftTokenIdArrayByLoanId" --arguments ${LOAN_ID} --proxy=${PROXY}
    #declare -A SMART_CONTRACT_RESPONSE=$( erdpy --verbose contract query ${ADDRESS} --function="getLoanNftTokenIdArrayByLoanId" --arguments ${LOAN_ID} --proxy=${PROXY} );
    #for i in ${SMART_CONTRACT_RESPONSE[@]};
    #do
    #    echo ">>> "$i;
    #done
    #if $SMART_CONTRACT_RESPONSE
    #echo "The smart contract response >> "$SMART_CONTRACT_RESPONSE;
    #CURRENCY="0x$(erdpy wallet bech32 --decode ${CURRENCY})"
}