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

# License

These contracts are available to the public under an MIT License.
