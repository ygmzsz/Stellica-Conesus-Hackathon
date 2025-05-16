const { Keypair } = require('stellar-sdk');
const fs = require('fs');
const path = require('path');
const { encrypt } = require('../utils/security');

const encryptionKey = crypto.randomBytes(32).toString('hex'); // ideally save this elsewhere

module.exports = async (message) => {
    const userId = message.author.id;
    const pair = Keypair.random();
    const publicKey = pair.publicKey();
    const secret = pair.secret();

    const encrypted = encrypt(secret, encryptionKey);
    const userDataPath = path.join(__dirname, '..', '..', 'users');
    if (!fs.existsSync(userDataPath)) fs.mkdirSync(userDataPath);

    fs.writeFileSync(path.join(userDataPath, `${userId}.json`), JSON.stringify({ publicKey, secret: encrypted }));

    message.reply(`Wallet created! Your public key is: \`${publicKey}\``);
};
