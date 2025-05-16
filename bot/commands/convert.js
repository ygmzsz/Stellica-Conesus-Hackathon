const { StellarSdk, server, sourceKeypair, loadAccount, buildTransaction } = require('../services/stellarService');

module.exports = async (message, args) => {
    const [sendAssetCode, sendAmount, destAssetCode] = args;
    const issuer = 'issuer_address_here'; // Replace with actual issuer
    const sendAsset = new StellarSdk.Asset(sendAssetCode, issuer);
    const destAsset = new StellarSdk.Asset(destAssetCode, issuer);

    try {
        const account = await loadAccount();
        const tx = buildTransaction(account)
            .addOperation(StellarSdk.Operation.pathPaymentStrictSend({
                sendAsset: sendAsset,
                sendAmount: sendAmount,
                destination: sourceKeypair.publicKey(), // Change to another user's pub key
                destAsset: destAsset,
                destMin: "1",
                path: []
            }))
            .setTimeout(30)
            .build();

        tx.sign(sourceKeypair);
        const result = await server.submitTransaction(tx);
        message.reply(`Conversion successful! Tx: https://stellar.expert/explorer/testnet/tx/${result.hash}`);
    } catch (e) {
        console.error(e);
        message.reply('Failed to convert assets.');
    }
};
