const { server, sourceKeypair } = require('../services/stellarService');

module.exports = async (message) => {
    try {
        const account = await server.loadAccount(sourceKeypair.publicKey());
        const balances = account.balances.map(b => \`\${b.asset_type === 'native' ? 'XLM' : b.asset_code}: \${b.balance}\`).join('\n');
        message.reply(\`Wallet Balances:\n\${balances}\`);
    } catch (e) {
        console.error(e);
        message.reply('Failed to fetch balances.');
    }
};
