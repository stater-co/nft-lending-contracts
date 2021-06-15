ALICE="${USERS}/diimiim.pem"
ADDRESS=$(erdpy data load --key=address-testnet)
DEPLOY_TRANSACTION=$(erdpy data load --key=deployTransaction-testnet)
PROXY=https://testnet-api.elrond.com

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

deploy() {
    erdpy --verbose contract deploy --project=${PROJECT} --recall-nonce --pem=${ALICE} --gas-limit=990000000 --send --outfile="deploy-testnet.interaction.json" --proxy=${PROXY} --chain=T || return

    TRANSACTION=$(erdpy data parse --file="deploy-testnet.interaction.json" --expression="data['emitted_tx']['hash']")
    ADDRESS=$(erdpy data parse --file="deploy-testnet.interaction.json" --expression="data['emitted_tx']['address']")

    erdpy data store --key=address-testnet --value=${ADDRESS}
    erdpy data store --key=deployTransaction-testnet --value=${TRANSACTION}

    echo ""
    echo "Smart contract address: ${ADDRESS}"
}

add() {
    read -p "Enter number: " NUMBER
    erdpy --verbose contract call ${ADDRESS} --recall-nonce --pem=${ALICE} --gas-limit=5000000 --function="add" --arguments ${NUMBER} --send --proxy=${PROXY} --chain=T
}

getSum() {
    erdpy --verbose contract query ${ADDRESS} --function="getSum" --proxy=${PROXY}
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

    echo "Smart contract address: "$ADDRESS", Encoded method name: "$ENCODED_METHOD_NAME", Loan amount: "$LOAN_AMOUNT", Nr of installments: "$NR_OF_INSTALLMENTS", Assets value: "$ASSETS_VALUE", Token ID: "$TOKEN_ID", Token quantity: "$TOKEN_QUANTITY;

    erdpy \
    --verbose contract call ${ADDRESS} \
    --recall-nonce \
    --pem=${ALICE} \
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