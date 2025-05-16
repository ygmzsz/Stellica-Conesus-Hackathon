const buy = require('../commands/buy');
const sell = require('../commands/sell');
const convert = require('../commands/convert');
const balance = require('../commands/balance');
const register = require('../commands/register');
const { checkCooldown } = require('../utils/ratelimiter');
const { isConfirmed, getAndRemove } = require('../commands/confirm');

module.exports = async function setupCommands(message) {
    const userId = message.author.id;
    const [command, ...args] = message.content.slice(1).trim().split(/ +/);

    if (!checkCooldown(userId)) {
        return message.reply("⏳ You're sending commands too fast. Please wait a moment.");
    }

    switch (command.toLowerCase()) {
        case 'register':
            register(message);
            break;
        case 'balance':
            balance(message);
            break;
        case 'buy':
        case 'sell':
        case 'convert':
            if (!isConfirmed(userId)) {
                return message.reply(`❗ This is a sensitive operation. Please confirm by typing \`!confirm\`.`);
            }
            const action = getAndRemove(userId);
            return action(message, args);
        case 'confirm':
            message.reply("✅ Action confirmed. Please resend your command.");
            break;
        default:
            message.reply('❌ Unknown command.');
    }
};
