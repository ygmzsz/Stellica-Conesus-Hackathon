const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon.stellar.org');

async function sendPayment(senderSecret, recipientPublic, amount) {
  const sourceKeypair = StellarSdk.Keypair.fromSecret(senderSecret);
  const account = await server.loadAccount(sourceKeypair.publicKey());

  const fee = await server.fetchBaseFee();
  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee,
    networkPassphrase: StellarSdk.Networks.PUBLIC
  })
    .addOperation(StellarSdk.Operation.payment({
      destination: recipientPublic,
      asset: StellarSdk.Asset.native(),
      amount: amount.toString()
    }))
    .setTimeout(30)
    .build();

  transaction.sign(sourceKeypair);
  return await server.submitTransaction(transaction);
}

module.exports = { sendPayment };
