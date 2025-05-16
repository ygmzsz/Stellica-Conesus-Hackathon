const StellarSdk = require('stellar-sdk');
require('dotenv').config();

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
const sourceKeypair = StellarSdk.Keypair.fromSecret(process.env.STELLAR_SECRET);

async function loadAccount() {
    return await server.loadAccount(sourceKeypair.publicKey());
}

function buildTransaction(account) {
    return new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
    });
}

module.exports = {
    StellarSdk,
    server,
    sourceKeypair,
    loadAccount,
    buildTransaction
};
