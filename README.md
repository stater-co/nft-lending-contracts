# Stater NFT Collateralized Lending Contracts

## Requirements

### Node version

Either make sure you're running a version of node compliant with the `engines` requirement in `package.json`, or install Node Version Manager [`nvm`](https://github.com/creationix/nvm) and run `nvm use` to use the correct version of node.

## Installation

Run
```bash
yarn
```

or

Run
```bash
npm install --python=/usr/bin/python2.7
```

## Deploying

### Deploying to the Rinkeby network.

1. You'll need to sign up for [Infura](https://infura.io). and get an API key.
2. You'll need Rinkeby ether to pay for the gas to deploy your contract. Visit https://faucet.rinkeby.io/ to get some.
3. Using your API key and the mnemonic for your MetaMask wallet (make sure you're using a MetaMask seed phrase that you're comfortable using for testing purposes), run:

```
export INFURA_KEY="<infura_key>"
export MNEMONIC="<metmask_mnemonic>"
yarn truffle migrate --network rinkeby
```

### Deploying to the mainnet Ethereum network.

Make sure your wallet has at least a few dollars worth of ETH in it. Then run:

```
yarn truffle migrate --network live
```

Look for your newly deployed contract address in the logs! 🥳

### Viewing your items on OpenSea

OpenSea will automatically pick up transfers on your contract. You can visit an asset by going to `https://opensea.io/assets/CONTRACT_ADDRESS/TOKEN_ID`.

To load all your metadata on your items at once, visit [https://opensea.io/get-listed](https://opensea.io/get-listed) and enter your address to load the metadata into OpenSea! You can even do this for the Rinkeby test network if you deployed there, by going to [https://rinkeby.opensea.io/get-listed](https://rinkeby.opensea.io/get-listed).

# License

These contracts are available to the public under an MIT License.

### ERC1155 Implementation

To implement the ERC1155 standard, these contracts use the Multi Token Standard by [Horizon Games](https://horizongames.net/), available on [npm](https://www.npmjs.com/package/multi-token-standard) and [github](https://github.com/arcadeum/multi-token-standard) and also under the MIT License.
