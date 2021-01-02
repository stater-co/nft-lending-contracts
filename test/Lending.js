const LendingData = artifacts.require("LendingData");
const GameItems = artifacts.require("GameItems");

contract('LendingData', (accounts) => {
	
  // getLoansCount()
  it('Should get the loans count', async () => {
	const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
	loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    assert.typeOf(loansCount, 'number', "[BUGGED] :: Not possible to receive the total loans count.");
  });
  
  // getCurrency()
  it('Should get the loans count', async () => {
	const instance = await LendingData.deployed();
	let loansCount = await instance.getLoansCount.call();
	loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    let currency = await instance.getCurrency.call(Math.floor(Math.random() * loansCount));
    assert.typeOf(currency, 'string', "[BUGGED] :: Not possible to receive the loan currency.");
	expect(currency).to.have.lengthOf(42,"[BUGGED] :: Not a valid ethereum address");
  });
  
  
  // createLoan(uint256, uint256, address, uint256, address[] calldata, uint256[] calldata, string calldata)
  it('Should create a loan', async () => {
	const instance = await LendingData.deployed();
	const tokenInstance = await GameItems.deployed();
    let loanAmount = Math.floor(Math.random() * 100000000);
	let nrOfInstallments = Math.floor(Math.random() * 20) + 1;
	let currency = "0x0000000000000000000000000000000000000000";
	let assetsValue = Math.floor(Math.random() * ( ( loanAmount * 160 ) / 100 ) );
	let creationId = "db_index";
	let nrOfTokensToAdd = Math.floor(Math.random() * 20);
	let nftAddressArray = new Array(nrOfTokensToAdd).fill(tokenInstance.address);
	let nftTokenIdArray = [];
	for ( let i = 0 , l = nrOfTokensToAdd ; i < l ; ++i ){
		let createToken = await tokenInstance.createItem("name","description","image",{ from : accounts[0] });
		for ( let j = 0 , k = createToken.logs.length ; j < k ; ++j )
			if ( createToken.logs[j].event === "Transfer" ){
				let tokenId = Number(createToken.logs[j].args[2]);
				let approveTokenToContract = await tokenInstance.approve(tokenInstance.address,tokenId,{ from : accounts[0] });
				assert.typeOf(approveTokenToContract.receipt, 'object', "[ERROR] :: Approve token for contract failed.");
				nftTokenIdArray.push(tokenId);
			}
		assert.typeOf(createToken.receipt, 'object', "[ERROR] :: Create token failed.");
	}
	assert.lengthOf(nftTokenIdArray, nftAddressArray.length,"[ERROR] :: Some items haven't been approved.");
	console.log(loanAmount,nrOfInstallments,currency,assetsValue,nftAddressArray,nftTokenIdArray,creationId);
	let createLoan = await instance.createLoan(loanAmount,nrOfInstallments,currency,assetsValue,nftAddressArray,nftTokenIdArray,creationId);
    assert.typeOf(createLoan.receipt, 'object', "[ERROR] :: Create loan failed.");
  });
  
  /*
  // getLoansCount()
  it('Should get the loans count', async () => {
	const instance = await LendingData.deployed();
    const totalLoans = await instance.getLoansCount.call(accounts[0]);
    assert.typeOf(totalLoans, 'number', "[BUGGED] :: Not possible to receive the total loans count.");
  });

  it('should call a function that depends on a linked library', async () => {
    const metaCoinInstance = await LendingData.deployed();
    const metaCoinBalance = (await metaCoinInstance.getBalance.call(accounts[0])).toNumber();
    const metaCoinEthBalance = (await metaCoinInstance.getBalanceInEth.call(accounts[0])).toNumber();

    assert.equal(metaCoinEthBalance, 2 * metaCoinBalance, 'Library function returned unexpected function, linkage may be broken');
  });
  it('should send coin correctly', async () => {
    const metaCoinInstance = await LendingData.deployed();

    // Setup 2 accounts.
    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    // Get initial balances of first and second account.
    const accountOneStartingBalance = (await metaCoinInstance.getBalance.call(accountOne)).toNumber();
    const accountTwoStartingBalance = (await metaCoinInstance.getBalance.call(accountTwo)).toNumber();

    // Make transaction from first account to second.
    const amount = 10;
    await metaCoinInstance.sendCoin(accountTwo, amount, { from: accountOne });

    // Get balances of first and second account after the transactions.
    const accountOneEndingBalance = (await metaCoinInstance.getBalance.call(accountOne)).toNumber();
    const accountTwoEndingBalance = (await metaCoinInstance.getBalance.call(accountTwo)).toNumber();


    assert.equal(accountOneEndingBalance, accountOneStartingBalance - amount, "Amount wasn't correctly taken from the sender");
    assert.equal(accountTwoEndingBalance, accountTwoStartingBalance + amount, "Amount wasn't correctly sent to the receiver");
  });
  */
  
});
