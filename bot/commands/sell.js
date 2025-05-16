const { StellarSdk, server, sourceKeypair, loadAccount, buildTransaction } = require('../services/stellarService');

module.exports = async (message, args) => {
    const [assetCode, amount] = args;
    const issuer = 'issuer_address_here'; // Replace with actual issuer
    const sellAsset = new StellarSdk.Asset(assetCode, issuer);

    try {
        const account = await loadAccount();
        const tx = buildTransaction(account)
            .addOperation(StellarSdk.Operation.manageSellOffer({
                selling: sellAsset,
                buying: StellarSdk.Asset.native(),
                amount: amount,
                price: '1'
            }))
            .setTimeout(30)
            .build();

        tx.sign(sourceKeypair);
        const result = await server.submitTransaction(tx);
        message.reply(`Sell offer placed! Tx: https://stellar.expert/explorer/testnet/tx/${result.hash}`);
    } catch (e) {
        console.error(e);
        message.reply('Failed to place sell offer.');
    }
};
