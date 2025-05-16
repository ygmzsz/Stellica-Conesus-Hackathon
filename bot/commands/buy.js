const { StellarSdk, server, sourceKeypair, loadAccount, buildTransaction } = require('../services/stellarService');

module.exports = async (message, args) => {
    const [assetCode, amount] = args;
    const issuer = 'issuer_address_here'; // Replace with actual issuer
    const buyAsset = new StellarSdk.Asset(assetCode, issuer);

    try {
        const account = await loadAccount();
        const tx = buildTransaction(account)
            .addOperation(StellarSdk.Operation.manageBuyOffer({
                selling: StellarSdk.Asset.native(),
                buying: buyAsset,
                buyAmount: amount,
                price: '1'
            }))
            .setTimeout(30)
            .build();

        tx.sign(sourceKeypair);
        const result = await server.submitTransaction(tx);
        message.reply(`Buy offer placed! Tx: https://stellar.expert/explorer/testnet/tx/${result.hash}`);
    } catch (e) {
        console.error(e);
        message.reply('Failed to place buy offer.');
    }
};
